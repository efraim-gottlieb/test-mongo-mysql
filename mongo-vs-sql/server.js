import express from "express";
import orderdsRoutes from "./routes/orders.js";
import productsRoutes from "./routes/products.js";

import { initSqlDb, getMysqlConnection } from "./utils/mysql.js";
import { initMongoDb, getMongoDbConnection } from "./utils/mongodb.js";

await initMongoDb();
await initSqlDb();

const app = express();
const PORT = 8000;

app.use(express.json());

app.use('/api', async (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  req.mongoDbConn = await getMongoDbConnection();
  req.mysqlDbConn = await getMysqlConnection();
  next();
});

app.use("/api/orders", orderdsRoutes);
app.use("/api/products", productsRoutes);

app.listen(PORT, async () => {
  console.log(`server run on ${PORT}...`);
});
