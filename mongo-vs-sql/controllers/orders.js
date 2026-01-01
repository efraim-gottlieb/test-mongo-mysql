import { ObjectId } from "mongodb";

export async function createOrder(req, res) {
  const conn = req.mysqlDbConn;
  const { productId, quantity, customerName } = req.body;
  
  // Validate ObjectId format
  if (!ObjectId.isValid(productId)) {
    res.status(400).json({ error: "Invalid productId format" });
    return;
  }
  
  const mongoConn = req.mongoDbConn;
  const collection = await mongoConn.collection("products");
  const products = await collection.find({ _id: new ObjectId(productId) }).toArray();
  if (!products.length) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const product = products[0];
  if (product.stock < quantity) {
    res.status(400).json({ error: "Insufficient stock" });
    return;
  }
  product.stock -= quantity;
  await collection.updateOne(
    { _id: new ObjectId(productId) },
    { $set: { stock: product.stock } }
  );
  const totalPrice = quantity * product.price;
  const order = {
    productId: productId,
    quantity: quantity,
    customerName: customerName,
    totalPrice: totalPrice,
    orderDate: new Date()
  };
  await mongoConn.collection("orders").insertOne(order);
  res.json({ message: products });
  console.log(products);
  await conn.query(
    `
    INSERT INTO orders (productId, quantity, customerName, totalPrice)
    VALUES (?, ?, ?, ?)
    `,
    [productId, quantity, customerName, totalPrice]
  );
}
export async function getOrders(req, res) {
  const conn = req.mysqlDbConn;
  const [orders] = await conn.query("SELECT * FROM orders;");
  res.json({ orders: orders });
}

export async function getOrderById(req, res) {
  const id = req.params.id;
  const conn = req.mysqlDbConn;
  const [result] = await conn.query(
    `
    SELECT * FROM orders
    WHERE id = ?
    `,
    [id]
  );
  if (!result.length) {
    res.status(404).json({ error: "not found" });
    return;
  }
  res.status(201).json({ order: result });
}
