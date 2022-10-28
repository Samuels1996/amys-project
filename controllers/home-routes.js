const router = require("express").Router();
const { Post, Comment, User } = require("../Moxdels");
const withAuth = require("../utils/auth");

// GET route to show all blog posts (TO SHOW: Post Tile, Date Created) - show blog posts without login status
router.get("/", async (req, res) => {
  try {
    const allPostData = await Post.findAll({
      include: [{ model: User }],
    });
    const posts = allPostData.map((post) => post.get({ plain: true }));
    console.log(posts);
    res.render("all-posts-home", {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET route to show single blog post by ID
router.get("/post/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [{ model: User }, { model: Comment }],
    });
    const post = postData.get({ plain: true });
    console.log(
      "I am the post/id at home routes================" + JSON.stringify(post)
    );

    res.render("singlepost", { post, logged_in: req.session.logged_in });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

module.exports = router;
