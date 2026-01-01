import { reverse } from "../utils/encryptions.js";

export async function createMessage(req, res) {
  if (!(req.body.message && req.body.cipherType)) {
    res.status(400).json({ error: "body error" });
    return;
  }
  const conn = req.mysqlDbConn;
  const mongoConn = req.mongoDbConn;
  const collection = await mongoConn.collection("users");
  const username = req.headers["username"];
  const password = req.headers["password"];
  const users = await collection
    .find({ username: username, password: password })
    .toArray();
  if (!users.length) {
    res.status(404).json({ error: "User not found or password incorrect" });
    return;
  }
  await collection.updateOne(
    { username: username },
    { $set: { encryptedMessagesCount: users[0].encryptedMessagesCount + 1 } }
  );

  const { message, cipherType } = req.body;
  const encryptedText = reverse(message);
  const newMessage = await conn.query(
    `
    INSERT INTO messages (username, cipher_type, encrypted_text)
    VALUES (?, ?, ?)
    `,
    [username, cipherType, encryptedText]
  );
  res
    .status(201)
    .json({ id: newMessage[0]["insertId"], cipherType, encryptedText });
}

export async function getAllMessages(req, res) {
  const mongoConn = req.mongoDbConn;
  const collection = await mongoConn.collection("users");
  const username = req.headers["username"];
  const password = req.headers["password"];
  const users = await collection
    .find({ username: username, password: password })
    .toArray();
  if (!users.length) {
    res.status(404).json({ error: "User not found or password incorrect" });
    return;
  }
  const mysqlDbConn = req.mysqlDbConn;

  const [items] = await mysqlDbConn.query(
    `
    SELECT * FROM messages
    WHERE username = ?
    `,
    [username]
  )
  res.json({
    items,
  });
}
