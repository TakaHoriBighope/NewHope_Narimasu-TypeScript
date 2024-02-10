const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//投稿を作成する。
router.post("/", async (req, res) => {
  // "/" ---> "/api/posts"
  const newPost = new Post(req.body);
  try {
    const savePost = await newPost.save();
    return res.status(200).json(savePost);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//投稿を更新します。
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({
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

//投稿を削除します。
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // if (post.userId === req.body.userId) {
    await post.deleteOne();
    return res.status(200).json("投稿情報が削除されました");
    // } else {
    // return res.status(403).json("あなたは他の人の投稿を削除できません");
    // }
  } catch (error) {
    return res.status(500).json(error);
  }
});

//特定の投稿を取得する。
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//全ての投稿を取得する。
router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find();
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//特定の投稿に「いいね」を押す
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //まだ投稿に「いいね」が押されていなかったら
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: {
          likes: req.body.userId,
        },
      });
      return res.status(200).json("投稿に「いいね」を押しました");
    } else {
      //投稿にすでに「いいね」を押されていたら､いいねをしているユーザーIDを削除
      await post.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      return res
        .status(403)
        .json("あなたはすでに投稿に「いいね」を押していますので外しました");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

//プロファイル用の（自分自身の）投稿を取得
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    //自分が投稿したものを全て取得
    const posts = await Post.find({ userId: user._id });
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//自分のタイムライン用の投稿＆フォローしている投稿を取得
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    //自分がフォローしている投稿を全て取得する
    const followingPosts = await Promise.all(
      currentUser.followings.map((followingId) => {
        return Post.find({ userId: followingId });
      })
    );
    return res.status(200).json(userPosts.concat(...followingPosts));
  } catch (error) {
    return res.status(500).json(error);
  }
});
module.exports = router;
