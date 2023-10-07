const router = require("express").Router();
const { Post, Comment, User } = require("../models/");
const formatDate = require("../utils/formatDate");

// get all posts for homepage
router.get("/", async (req, res) => {
  try {
    // TODO: 1. Find all Posts and associated Users
    const findPosts = await Post.findAll({
      attributes: ["id", "title", "body", "created_at"],
      include: [
        { model: User, attributes: ["username"] },
        {
          model: Comment,
          attributes: ["id", "body", "user_id", "post_id", "created_at"],
          include: { model: User, attributes: ["username"] },
        },
      ],
    });
    // TODO: 2. Serialize data (use .get() method, or use raw: true, nest: true in query options)
    const posts = findPosts.map((p) => {
      const post = p.get({ plain: true });
      post.created_at = formatDate(post.created_at);
      //loop through coments to format their dates aswell
      for (let i = 0; i < post.comments.length; i++) {
        const comment = post.comments[i];
        comment.created_at = formatDate(comment.created_at);
      }
      return post;
    });

    // TODO: 3. Render the 'all-posts' template with the posts data
    res.render("all-posts", { posts, loggedIn: req.session.loggedIn });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get single post
router.get("/post/:id", async (req, res) => {
  try {
    // TODO: 1. Find a single Post by primary key and include associated User and Comments (Comment will also need to include a User)
    const singlePost = await Post.findOne({
      where: { id: req.params.id },
      attributes: ["id", "title", "body", "created_at"],
      include: [
        { model: User, attributes: ["username"] },
        {
          model: Comment,
          attributes: ["id", "body", "user_id", "post_id", "created_at"],
          include: { model: User, attributes: ["username"] },
        },
      ],
    });
    // check if post is available
    if (!singlePost) return res.status(404).json({ message: "post not found" });

    // TODO: 2. Serialize data (use .get() method, or use raw: true, nest: true in query options)
    const post = singlePost.get({ plain: true });
    post.created_at = formatDate(post.created_at);
    //loop through coments to format their dates aswell
    for (let i = 0; i < post.comments.length; i++) {
      const comment = post.comments[i];
      comment.created_at = formatDate(comment.created_at);
    }

    // TODO: 3. Render the 'single-post' template with the post data
    res.render("single-post", { post, loggedIn: req.session.loggedIn });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("signup");
});

module.exports = router;
