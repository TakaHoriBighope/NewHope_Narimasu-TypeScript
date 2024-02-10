const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
// require("dotenv").config();

//ユーザー新規作成関数
/* ユーザー新規登録APIです。
入力されたpasswordをCrypto.jsを用いてencode（暗号化）し、
User.createでユーザーを作成します。
今回の暗号化方式は共通暗号鍵方式になるので、encodeとdecodeには同じenvの鍵を指定しています。
ここまで成功であれば、status 200と共に、userとtokenをjson形式で返却します。
try catchで記述しているので、処理が落ちればserver errorの500とerrorオブジェクトが返却されます。*/
exports.actionRegist = async (req, res) => {
  //パスワードの受け取り
  const password = req.body.password;
  try {
    //パスワードの暗号化
    req.body.password = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY);
    //ユーザーの新規作成
    const user = await User.create(req.body);
    //JWTの発行
    const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h",
    });
    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).json(error);
  }
};
//ユーザーログイン用関数
/*
req.bodyをusernameとpasswordに分割代入し、findOneでusernameを一つ検索します。
存在しなければclient error（認証系）の401とerror messageを返却します。
usernameが存在すれば、passwordの検索に移ります。
Cryotp.jsで暗号化されたpasswordをdecodeし、toStringでキャストする事でpasswordを復号します。
復号されたpasswordと入力値のpasswordが一致すれば、jwt tokenの発行に移ります。
エラー時はusernameと同様です。
最後に、JWT.signでjwt tokenを生成します。
payloadに入るデータには暗号化されたidを利用します。tokenの有効期限は24時間です。
全て成功すれば、userとtokenをjson形式で201と共に返却します。
処理が落ちればcatchでエラーハンドリングが走ります。
*/
exports.actionLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    //DBからユーザーが存在するか探してくる
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({
        errors: [
          {
            param: "username",
            msg: "ユーザーー名が無効です",
          },
        ],
      });
    }
    //パスワードの照合
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
    if (decryptedPassword !== password) {
      return res.status(401).json({
        errors: [
          {
            param: "password",
            msg: "パスワードが無効です",
          },
        ],
      });
    }
    //JWTの発行
    const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h",
    });
    return res.status(201).json({ user, token });
  } catch (error) {
    return res.status(500).json(error);
  }
};
