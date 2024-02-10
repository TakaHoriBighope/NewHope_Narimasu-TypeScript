const Post = require("../models/Post");

exports.create = async (req, res) => {
  try {
    //メモの個数を取得
    const postCount = await Post.find().count();
    //新規メモを作成
    const post = await Post.create({
      user: req.user._id,
      position: postCount > 0 ? postCount : 0,
    });
    res.status(201).json(post);
  } catch {
    res.status(500).json(err);
  }
};

exports.getAll = async (req, res) => {
  try {
    //今ログインしているユーザーIDから、それに紐づいた📝を全て取り出している。
    const posts = await Post.find({ user: req.user._id }).sort("-position");
    // console.log(Post);
    res.status(200).json(posts);
  } catch {
    res.status(500).json(err);
  }
};

exports.getOne = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findOne({ user: req.post._id, _id: postId });
    if (!post) return res.status(404).json("投稿データが存在しません");
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.update = async (req, res) => {
  const { postId } = req.params;
  const { title, description, favorite } = req.body;

  try {
    if (title === "") req.body.title = "無題";
    if (description === "")
      req.body.description = "ここに自由に記入してください";

    // const currentPost = await Post.findOne({ user: req.user._id, _id: PostId });
    const currentPost = await Post.findById(PostId);
    if (!currentPost) return res.status(404).json("メモが存在しません");

    //現在見ているメモがお気に入りがまだされていない時
    if (favorite !== undefined && currentPost.favorite !== favorite) {
      //現在のメモ以外のお気に入りされているメモを探して配列で返す
      const favorites = await Post.find({
        user: currentPost.user,
        favorite: true,
        _id: { $ne: PostId },
      });
      // console.log(favorites);

      if (favorite) {
        //自分以外のお気に入りされているメモの数を返す=それが今のメモの位置に設定される。
        req.body.favoritePosition = favorites.length > 0 ? favorites.length : 0;
      } else {
        for (const key in favorites) {
          const element = favorites[key];
          await Post.findByIdAndUpdate(element.id, {
            $set: { favoritePosition: key },
          });
        }
      }
    }
    const updatedPost = await Post.findByIdAndUpdate(PostId, {
      $set: req.body,
    });
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.delete = async (req, res) => {
  const { postId } = req.params;
  //メモの削除
  try {
    const post = await Post.findOne({ user: req.user._id, _id: PostId });
    if (!Post) return res.status(404).json("メモが存在しません");

    await Post.deleteOne({ _id: PostId });
    res.status(200).json("メモを削除しました");
  } catch (err) {
    res.status(500).json(err);
  }
};

// exports.getFavorites = async (req, res) => {
//   try {
//     const favorites = await Post.find({
//       user: req.user._id,
//       favorite: true,
//     }).sort("-favoritePosition");
//     res.status(200).json(favorites);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// exports.updatePosition = async (req, res) => {
//   const { Posts } = req.body;
//   try {
//     for (const key in Posts.reverse()) {
//       const Post = Posts[key];
//       await Post.findByIdAndUpdate(Post.id, { $set: { position: key } });
//     }
//     res.status(200).json("更新しました");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };
