const router = require("express").Router();
const Post = require('../Models/Post');
const User = require("../Models/User");


// Create a post
router.post('/', async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update a post
router.put("/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);
    try {
        if (req.body.userId === post.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("Post has been updated");
        }
        else {
            res.status(500).json("you can update only your posts");
        }
    } catch (err) {
        res.status(402).json(err);
    }
})

// Delete a post
router.delete("/:id", async (req, res) => {
    
    try {
        const post = await Post.findById(req.params.id);
        if (req.body.userId === post.userId) {
            await post.deleteOne();
            res.status(200).json("Post has been deleted");
        }
        else {
            res.status(500).json("you can delete only your posts");
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

// Like/dislike a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("Post has been liked");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("Post has been disliked");
        }
    } catch (err) {
        res.status(400).json(err);
    }
})

// Get a post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get timeline posts
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = currentUser.followings
      ? await Promise.all(
          currentUser.followings.map((friendId) =>
            Post.find({ userId: friendId })
          )
        )
      : [];

    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    console.error("Error in /timeline route:", err);
    res.status(500).json(err);
  }
});


// Get user's all posts
router.get("/profile/:username", async (req, res) => {
    try {
        const user=await User.findOne({username:req.params.username})
        const post=await Post.find({ userId: user._id });
        res.status(200).json(post)
    } catch (err) {
        console.error("Error in /timeline route:", err); // <- log this!
        res.status(500).json(err);
    }

});

module.exports = router;