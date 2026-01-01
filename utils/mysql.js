import mysql from "mysql2/promise";

const connectionConfig = {
  host: "localhost",
  user: "root",
  password: "root",
};

export async function initSqlDb() {
  const conn = await mysql.createConnection(connectionConfig);
  await conn.query(`CREATE DATABASE IF NOT EXISTS messages;`);
  await conn.query(`USE messages;`);
  await conn.query(`
  CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(25) NOT NULL,
    cipher_type VARCHAR(25) NOT NULL,
    encrypted_text VARCHAR(150) NOT NULL,
    inserted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);
  conn.close();
}

export async function getMysqlConnection() {
  const conn = await mysql.createConnection(connectionConfig);
  conn.query("USE messages;")
  return conn
}
