const User = require("../models/User");
const router = require("express").Router();

//CRUD
//ユーザー情報の更新
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        //全てのパラメーター
        $set: req.body,
      });
      return res.status(200).json("ユーザー情報が更新されました");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res
      .status(403)
      .json("あなたは自分のアカウントの時だけ情報を更新できます");
  }
});
//ユーザー情報の削除
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("ユーザー情報が削除されました");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res
      .status(403)
      .json("あなたは自分のアカウントの時だけ情報を削除できます");
  }
});

//全てのユーザー情報の取得
router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//クエリでユーザー情報を取得
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    //パスワードと更新日は取得することを避ける。表示しない。
    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//ユーザーのフォロー
router.put("/:id/follow", async (req, res) => {
  if (!req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("フォローに成功しました");
      } else {
        return res
          .status(403)
          .json("あなたはすでにこのユーザーをフォローしています");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(500).json("自分自身をフォローできません");
  }
});
//ユーザーのアンフォロー
router.put("/:id/unfollow", async (req, res) => {
  if (!req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("フォローを解除しました");
      } else {
        return res
          .status(403)
          .json("あなたはすでにこのユーザーをフォロー解除しています");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(500).json("自分自身をフォロー解除できません");
  }
});

module.exports = router;
