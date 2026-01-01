// import { ObjectId } from "bson";

export async function createUser(req, res) {
  if (!(req.body.username && req.body.password)) {
    res.json({ error: "body error" });
    return;
  }
  const { username, password } = req.body;
  const conn = req.mongoDbConn;
  const collection = await conn.collection("users");
  try {
    const newUser = await collection.insertOne({
      username,
      password,
      encryptedMessagesCount: 0,
      createdAt: new Date
    });
    res.status(201).json({ id: newUser.insertedId, username: username });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: "User with this name already exists",
      });
    }
  }
}

// export async function getProducts(req, res) {
//   const conn = req.mongoDbConn;
//   const collection = await conn.collection("products");
//   const products = await collection.find().toArray();
//   res.json({ message: products });
// }

// export async function getProductById(req, res) {
//   const id = req.params.id;
//   const conn = req.mongoDbConn;
//   const collection = await conn.collection("products");
//   try {
//     const products = await collection.findOne({ _id: new ObjectId(id) });
//     res.json({ message: products });
//   } catch (error) {
//     res.status(404).json({ error: "not found" });
//   }
// }
