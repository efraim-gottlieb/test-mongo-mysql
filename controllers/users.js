export async function getMessagesCount(req, res) {
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
  res.json({username, encryptedMessagesCount: users[0].encryptedMessagesCount})
}
