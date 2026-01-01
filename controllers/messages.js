import { reverse, atbash, randomShuffle } from "../utils/encryptions.js";

export async function encrypt(req, res) {
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
  let encryptedText;
  if (cipherType == "reverse") {
    encryptedText = reverse(message);
  } else if (cipherType == "atbash") {
    encryptedText = atbash(message);
  } else if (message[0].cipher_type == "random_shuffle") {
    encryptedText = randomShuffle(message);
  }
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
  );
  res.json({
    items,
  });
}

export async function decrypt(req, res) {
  if (!req.body.messageId) {
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
  const [message] = await conn.query(
    `
    SELECT * FROM messages
    WHERE username = ?
    AND
    id = ?
    `,
    [username, req.body.messageId]
  );
  try {
    let decryptedText;
    if (message[0].cipher_type == "reverse") {
      decryptedText = reverse(message[0].encrypted_text);
    } else if (message[0].cipher_type == "atbash") {
      decryptedText = atbash(message[0].encrypted_text);
    } else if (message[0].cipher_type == "random_shuffle") {
      res.json({
        id: req.body.messageId,
        decryptedText: null,
        error: "can't to be decrypted",
      });
      return;
    }
    res.json({ id: req.body.messageId, decryptedText });
  } catch {
    res.status(404).json({ error: "message not found for this user" });
  }
}
