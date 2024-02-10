/* エラーハンドリングは共通処理とし、errors.isEmpty()が論理否定で記述され、
errorsオブジェクトが空でなければ400の処理とerrorsのjsonが返却されます。*/

const { validationResult } = require("express-validator");

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
