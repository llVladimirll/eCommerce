import { configDotenv } from "dotenv";
import express from "express";
import {
  deleteProduct,
  getProducts,
  postOrder,
  postProduct,
  updateProduct,
} from "./controller/product";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";

const swaggerDocument = YAML.load("./swagger.yaml");
configDotenv();
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// POST /products route to create a new product
app.post("/products", postProduct);
// GET /products route to fetch all products
app.get("/products", getProducts);
// POST /orders route to create a new order
app.post("/orders", postOrder);
// PUT /products/:id route to update a product
app.put("/products/:id", updateProduct);
// DELETE /products/:id route to delete a product
app.delete("/products/:id", deleteProduct);
// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
