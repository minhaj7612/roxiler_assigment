import { model, Schema } from "mongoose";

const productSchema = new Schema({
 title: String,
  description: String,
  price: Number,
  dateOfSale: Date,
  category: String,
  quantity: Number,
  status: { type: String, enum: ['sold', 'not sold'], default: 'not sold' },

  });

const Product = model("Product",productSchema)

export default Product;