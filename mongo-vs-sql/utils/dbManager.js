const createColumn = (name, type = "VARCHAR(50)") => {
  return { name, type };
};

async function createDatabase(dbName) {
  const query = `CREATE DATABASE IF NOT EXISTS ${dbName}`;
  await conn.query(query);
  // await conn.end();
}
async function createTable(tableName, columns) {
  const cols = columns
    .map((col) => `${col.name} ${col.type.toUpperCase()}`)
    .join(", ");
  const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${cols});`;
  await conn.query(query);
  // await conn.end();
}

async function insertInto(conn, tableName, columns, valuesArray) {
  const cols = columns.join(", ");
  const placeholders = valuesArray
    .map((row) => `(${row.map(() => "?").join(", ")})`)
    .join(", ");
  const flatValues = valuesArray.flat();
  const query = `INSERT INTO ${tableName} (${cols}) VALUES ${placeholders}`;
  await conn.query(query, flatValues);
  // await conn.end();
}
async function dropTable(tableName) {
  const query = `DROP TABLE ${tableName}`;
  await conn.query(query);
  // await conn.end();
}

async function select(tableName, conditions) {
  let query = `SELECT * FROM ${tableName}`;
  if (conditions) {
    query += ` WHERE ${conditions}`;
  }
  const [rows] = await conn.query(query);
  // await conn.end();
  return rows;
}

async function del(tableName, conditions) {
  let query = `DELETE FROM ${tableName}`;
  if (conditions) {
    query += ` WHERE ${conditions}`;
  }
  await conn.query(query);
  // await conn.end();
}

// async function alterTable() {}

export default {
  createDatabase,
  createColumn,
  createTable,
  insertInto,
  dropTable,
  select,
  del,
  //alterTable,
};
