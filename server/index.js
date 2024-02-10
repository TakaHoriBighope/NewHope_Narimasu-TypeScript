const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./src/v1/routes/users");
const authRoute = require("./src/v1/routes/auth");
const postRoute = require("./src/v1/routes/posts");
const uploadRoute = require("./src/v1/routes/upload");
const informRoute = require("./src/v1/routes/inform");
const path = require("path");

const PORT = 5000;
require("dotenv").config();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

//クライアントから送信されたデータを、req.body経由で会得、操作できます。
//pathは/api/v1をbaseURLとし、require内のディレクトリ配下に格納された/routes/(auth.js)をrouteとして見に行きます。

//ミドルウエア
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/inform", informRoute);

//DB接続index
try {
  const mongooseDB = async () => {
    await mongoose.connect(process.env.MONGODB_URL);
  };
  mongooseDB();
  console.log("DBと接続中...");
} catch (error) {
  console.log(error);
}

app.listen(PORT, () => {
  console.log("サーバー起動中...");
});
/**
 mongoose(
   .connect(process.env.MONGODB_URL)
   .then(()=>{
    console.log("DBと接続中...");
   }).catch((err)=>{
    console.log(error);
   });

 */
