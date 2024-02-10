const router = require("express").Router();
const Info = require("../models/Info");
const User = require("../models/User");

//Informを投稿します。
router.post("/", async (req, res) => {
  const newInfo = new Info(req.body);
  try {
    const saveInfo = await newInfo.save();
    return res.status(200).json(saveInfo);
  } catch (error) {
    return res.status(500).json(error);
  }
});
//Informa投稿を更新します。
router.put("/:id", async (req, res) => {
  try {
    const info = await Info.findById(req.params.id);
    if (info.userId === req.body.userId) {
      await info.updateOne({
        $set: req.body,
      });
      return res.status(200).json("投稿編集に成功しました");
    } else {
      return res.status(403).json("あなたは他の人の投稿を編集できません");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

//Inform投稿を削除します。
router.delete("/:id", async (req, res) => {
  try {
    const info = await Info.findById(req.params.id);
    // if (info.userId === req.body.userId) {
    await info.deleteOne();
    return res.status(200).json("投稿情報が削除されました");
    // } else {
    //   return res.status(403).json("あなたは他の人の投稿を削除できません");
    // }
  } catch (error) {
    return res.status(500).json(error);
  }
});

//全てのInformを取得する。
router.get("/", async (req, res) => {
  try {
    const infos = await Info.find();
    return res.status(200).json(infos);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//自分自身のInformを取得する。
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    //自分が投稿したものを全て取得
    const infos = await Info.find({ userId: user._id });
    // const infos = await Info.findById(req.params.id);
    return res.status(200).json(infos);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//特定の投稿Informに「既読」を押す
router.put("/:id/like", async (req, res) => {
  try {
    const info = await Info.findById(req.params.id);
    //まだ投稿に「既読」が押されていなかったら
    if (!info.likes.includes(req.body.userId)) {
      await info.updateOne({
        $push: {
          likes: req.body.userId,
        },
      });
      return res.status(200).json("投稿に「既読」を押しました");
    } else {
      //投稿にすでに「既読」を押されていたらユーザーIDを削除
      await info.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      return res
        .status(403)
        .json("あなたはすでに投稿に「既読」を押していますので外しました");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
