import { Request, RequestHandler, Response } from "express";
import { db } from "../db/db";
import { products, orders } from "../db/schema"; // Ensure this matches your schema's export
import { eq } from "drizzle-orm";

// Function to handle POST requests for creating a new product
const postProduct = async (
  req: Request & { body: { name: string; price: number; description: string } },
  res: Response
) => {
  try {
    const { name, price, description } = req.body;

    const newProduct = await db
      .insert(products)
      .values({
        name,
        description,
        price: price.toString(),
      })
      .returning();

    res.status(201).json(newProduct[0]);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

// Function to handle GET requests for fetching all products
const getProducts = async (req: Request, res: Response) => {
  try {
    const allProducts = await db.select().from(products);

    res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Function to handle POST requests for creating a new order
const postOrder: RequestHandler = async (
  req: Request & { body: { product_id: number; quantity: number } },
  res: Response
): Promise<void> => {
  const { product_id, quantity } = req.body;

  try {
    // Fetch product price from DB
    const product = await db
      .select({ price: products.price })
      .from(products)
      .where(eq(products.id, product_id));

    if (product.length === 0) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const unitPrice = parseFloat(product[0].price.toString());
    const total_price = unitPrice * quantity;

    const newOrder = await db
      .insert(orders)
      .values({
        product_id: product_id.toString(),
        quantity,
        total_price: total_price.toString(),
      })
      .returning();

    res.status(201).json(newOrder[0]);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
};

// Function to handle PUT requests for updating a product
const updateProduct: RequestHandler<
  { id: string },
  {},
  { name: string; description: string; price: number }
> = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    const updated = await db
      .update(products)
      .set({
        name,
        description,
        price: price.toString(),
      })
      .where(eq(products.id, Number(id)))
      .returning();

    if (!updated.length) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json(updated[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// Function to handle DELETE requests for deleting a product
const deleteProduct: RequestHandler<{ id: string }> = async (req, res) => {
  const { id } = req.params;

  try {
    const productId = Number(id);

    await db.delete(orders).where(eq(orders.product_id, productId));

    const deleted = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning();

    if (!deleted.length) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

export { postProduct, getProducts, postOrder, updateProduct, deleteProduct };
