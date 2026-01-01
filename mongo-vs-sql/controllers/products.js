import { ObjectId } from "bson";

export async function createProduct(req, res) {
  const { name, description, price, category, stock } = req.body;
  const conn = req.mongoDbConn;
  const collection = await conn.collection("products");
  try {
    const newProduct = await collection.insertOne({
      name,
      description,
      price,
      category,
      stock,
    });
    res.status(201).json({ sucsess: newProduct });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: "Product with this name already exists",
      });
    }
  }
}

export async function getProducts(req, res) {
  const conn = req.mongoDbConn;
  const collection = await conn.collection("products");
  const products = await collection.find().toArray();
  res.json({ message: products });
}

export async function getProductById(req, res) {
  const id = req.params.id;
  const conn = req.mongoDbConn;
  const collection = await conn.collection("products");
  try {
    const products = await collection.findOne({ _id: new ObjectId(id) });
    res.json({ message: products });
  } catch (error) {
    res.status(404).json({ error: "not found" });
  }
}
