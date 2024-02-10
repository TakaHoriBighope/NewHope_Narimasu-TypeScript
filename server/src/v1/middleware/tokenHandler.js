const JWT = require("jsonwebtoken");
const User = require("../models/User");
// require("dotenv").config();
/*
jwt tokenの検証用メソッドを実装します。
verifyTokenの実行で、先ずはtokenのdecodeを行います。
tokenDecodeメソッドをreqオブジェクトを引数に実行します。
request headerのauthorizationにtokenが含まれていることを前提に、
tokenを取り出してbearerHeaderに格納します。
格納できた場合、splitメソッドを用いてbearerとtoken部分を切り分けて一つの配列に格納し、
index1の指定でtokenのみをbearerに格納します。
成功すれば、JWT.verifyでtokenの有効性を検証し、
有効であればdecodeしてdecodedTokenに格納し、返却します。
verifyTokenに処理が戻り、tokenDecodedが存在すれば、
findByIdでdecode済みのtokenから取得したidと、Userモデル内レコードのidを比較し、
存在すればreq.userで返却。しなければ401と共に「権限がありません」を返却します。
*/

//クライアントから渡されたJWTが正常か検証
const tokenDecode = (req) => {
  //リクエストヘッダからauthorizationフィールドを指定してベアラトークンを取得する。
  const bearerHeader = req.headers["authorization"];
  //HeaderにAuthorizationが定義されているか
  if (bearerHeader !== undefined) {
    if (bearerHeader.split(" ")[0] === "Bearer") {
      try {
        const decodedToken = JWT.verify(
          bearerHeader.split(" ")[1],
          process.env.TOKEN_SECRET_KEY
        );
        //tokenの内容に問題はないか？
        //ここでは、usernameのマッチと有効期限をチェックしているが必要に応じて発行元、その他の確認を追加
        //有効期限はverify()がやってくれるみたいだがいちおう・・・
        return decodedToken;
      } catch {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};

//JWT認証するためのミドルウエア
exports.verifyToken = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);
  if (tokenDecoded) {
    //そのJWTと一致するユーザーを探してくる
    const user = await User.findById(tokenDecoded.id);
    if (!user) {
      return res.status(401).json("1権限がありません");
    }
    req.user = user; //ユーザーの更新
    next();
  } else {
    return res.status(401).json("2権限がありません");
  }
};
