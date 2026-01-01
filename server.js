import express from "express";
import messagesRoutes from "./routes/messages.js";
import usersRoutes from "./routes/users.js";

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

app.use("/api/messages", messagesRoutes);
app.use("/api/auth", usersRoutes);

app.listen(PORT, async () => {
  console.log(`server run on ${PORT}...`);
});
