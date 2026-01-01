import mysql from "mysql2/promise";

const connectionConfig = {
  host: "localhost",
  user: "root",
  password: "root",
};

export async function initSqlDb() {
  const conn = await mysql.createConnection(connectionConfig);
  await conn.query(`CREATE DATABASE IF NOT EXISTS ecommerce;`);
  await conn.query(`USE ecommerce;`);
  await conn.query(`
  CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    productId VARCHAR(24) NOT NULL,
    quantity INT NOT NULL,
    customerName VARCHAR(255) NOT NULL,
    totalPrice DECIMAL(10,2) NOT NULL,
    orderDate DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
  conn.close();
}

export async function getMysqlConnection() {
  const conn = await mysql.createConnection(connectionConfig);
  conn.query("USE ecommerce;")
  return conn
}
