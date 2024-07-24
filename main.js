import express from "express";
import dotenv from "dotenv";

dotenv.config("./.env"); //./.env.prod
const app = express();
console.log(process.env.PORT);
app.listen(process.env.PORT || 8000, (err) => {
  if (err) console.log(err);
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
