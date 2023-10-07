const router = require("express").Router();
const { Post, User, Comment } = require("../models/");
// TODO: Go to '../utils/auth' and complete middleware function
const withAuth = require("../utils/auth");
const formatDate = require("../utils/formatDate");

router.get("/", withAuth, async (req, res) => {
  // console.log("HEy");
  try {
    // TODO: 1. Find all Posts for a logged in user (use the req.session.userId)
    const findPosts = await Post.findAll({
      where: { user_id: req.session.user_id },
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
    
    // TODO: 3. Render the 'all-posts-admin' template in the 'dashboard' layout with the posts data
    res.render("all-posts-admin", {
      layout: "dashboard",
       posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    res.json(err);
  }
});

router.get("/new", withAuth, (req, res) => {
  res.render("new-post", {
    layout: "dashboard",
    loggedIn: req.session.loggedIn,
  });
});

router.get("/edit/:id", withAuth, async (req, res) => {
  try {
    // TODO: 1. Find a Post by primary key
    const editPost = await Post.findByPk(req.params.id);

    // TODO: 2. Serialize data (use .get() method, or use raw: true, nest: true in query options)
    if (!editPost)
      return res.status(404).json({ message: "No post found with this id" });

    const post = editPost.get({ plain: true });

    // TODO: 3. Render the 'edit-post' template in the 'dashboard' layout with the post data
    res.render("edit-post", {
      layout: "dashboard",
      post,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
