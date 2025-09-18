import express from "express";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
app.use(express.json());

// shard configurations
const shardA = new Pool({
  host: process.env.SHARD_A_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME ,
  port: 5432
});

const shardB = new Pool({
  host: process.env.SHARD_B_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432
});

// Simple sharding logic based on even/odd id
function shardSelect(id) {
  return id % 2 === 0 ? { pool: shardB, name: "B" } : { pool: shardA, name: "A" };
}

// Endpoints
app.post("/query", async (req, res) => {
  const { entity, id, operation } = req.body;

  if (!entity || !id || !operation) {
    return res.status(400).json({ error: "JSON inválido. Envie { entity, id, operation }" });
  }

  const { pool, name } = shardSelect(id);

  try {
    let result;
    if (operation === "select") {
      result = await pool.query(`SELECT * FROM ${entity} WHERE id = $1`, [id]);
    } else {
      return res.status(400).json({ error: "Operação não suportada" });
    }

    res.json({
      result: result.rows[0] || null,
      metadata: {
        shard: name,
        rows: result.rowCount
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao consultar shard", details: err.message });
  }
});

app.listen(3000, () => {
  console.log("Middleware rodando na porta 3000");
});
