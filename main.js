import express from "express";
import { config } from "dotenv";
import AppSource from "./config/data-source.js";
import route from "./routes/api/v1/index.js";

config({ path: "./.env" }); //.env.prod

const app = express();

// Increase the limit of request body size
app.use(express.json({ limit: "50mb" }));

AppSource.initialize() //req to db to connect
  .then(() => {
    console.log(
      "data source has been initialized, App is connected to database"
    );
    app.listen(process.env.PORT || 3000, (err) => {
      if (err) console.log(err);
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) =>
    console.log(
      "data source has not been initialized, Error while connected to databse \n",
      err
    )
  );

//routes
// Mount API routes
app.use("/api/v1", route);

// Middleware to handle all other routes
app.all("*", (req, res) => {
  res.status(404).json({
    message: "No such API endpoint exists",
  });
});
