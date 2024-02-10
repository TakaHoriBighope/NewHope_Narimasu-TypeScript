const router = require("express").Router();
const User = require("../models/User");
const { body } = require("express-validator");
const validation = require("../middleware/validation");
const userController = require("../controllers/user");
const tokenHandler = require("../middleware/tokenHandler");

//http://localhost:5000/api/v1/auth/register
/* routerオブジェクトでエンドポイントを指定し、バリデーション検証、
バリデーション失敗時にエラーハンドリング、成功時のメソッド実行を呼び出しています。
verifyTokenメソッドに関しては、middlewareでtoken検証用メソッドを実行し、通ればresponseとしてstatus code 200と、json形式のuserを返却させています。*/

//ユーザー新規登録用API
//本来ならば、"index.js"にAPIを書くのですが長文のためリファクタリングをしている
//　app.post("/register", ...........)と書くが
// endpoint "/register"を呼び出せるようにindex.jsで宣言文を付加する
//　　app.use("/api/v1", require("./src/v1/routes"));
router.post(
  "/register",
  body("username")
    .isLength({ min: 4 })
    .withMessage("ユーザー名は4文字以上である必要があります。"),
  body("email").custom((value) => {
    return User.findOne({ email: value }).then((user) => {
      if (user) {
        return Promise.reject("このメールアドレスはすでに使われています");
      }
    });
  }),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードはは8文字以上である必要があります。"),
  body("confirmPassword")
    .isLength({ min: 8 })
    .withMessage("確認用パスワードはは8文字以上である必要があります。"),
  body("username").custom((value) => {
    return User.findOne({ username: value }).then((user) => {
      if (user) {
        return Promise.reject("このユーザ名はすでに使われています");
      }
    });
  }),
  validation.validate,
  userController.actionRegist
);
//ログイン用API
router.post(
  "/login",
  body("username")
    .isLength({ min: 4 })
    .withMessage("ユーザー名は4文字以上である必要があります。"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードはは8文字以上である必要があります。"),
  validation.validate,
  userController.actionLogin
);

//JWT認証API
router.post("/verify-token", tokenHandler.verifyToken, (req, res) => {
  return res.status(200).json({ user: req.user });
});

module.exports = router;
