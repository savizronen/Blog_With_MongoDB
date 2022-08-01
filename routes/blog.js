const express = require("express");
const ObjectId = require("mongodb").ObjectID;
const db = require("../data/database");

const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
  const posts = await db.getDb().collection("posts").find().toArray();
  const authors = [];
  for (let i = 0; i < posts.length; i++) {
    let author = await db
      .getDb()
      .collection("authors")
      .findOne({ _id: ObjectId(posts[i].authorId) });
    authors.push(author);
  }

  res.render("posts-list", { posts: posts, authors: authors });
});

router.get("/new-post", async function (req, res) {
  const authors = await db.getDb().collection("authors").find().toArray();
  res.render("create-post", { authors: authors });
});

router.post("/posts", async function (req, res) {
  const authorId = req.body.author;
  const author = await db
    .getDb()
    .collection("authors")
    .findOne({ _id: authorId });

  const newPost = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
    date: new Date(),
    authorId: authorId,
  };

  const result = await db.getDb().collection("posts").insertOne(newPost);
  res.redirect("/posts");
});

router.get("/posts/:id", async function (req, res) {
  const postId = req.params.id;

  const post = await db
    .getDb()
    .collection("posts")
    .findOne({ _id: new ObjectId(postId) });

  if (!post) {
    return res.status(404).render("404");
  }
  const author = await db
    .getDb()
    .collection("authors")
    .findOne({ _id: ObjectId(post.authorId) });

  res.render("post-detail", { post: post, author: author });
});

router.get("/posts/:id/edit", async function (req, res) {
  const postId = req.params.id;
  const post = await db
    .getDb()
    .collection("posts")
    .findOne({ _id: new ObjectId(postId) }, { title: 1, summary: 1, body: 1 });

  if (!post) return res.status(404).render("404");

  res.render("update-post", { post: post });
});

router.post("/posts/:id/edit", async function (req, res) {
  const postId = req.params.id;
  const post = await db
    .getDb()
    .collection("posts")
    .updateOne(
      { _id: new ObjectId(postId) },
      {
        $set: {
          title: req.body.title,
          summary: req.body.summary,
          body: req.body.content,
        },
      }
    );

  res.redirect("/posts");
});

router.post("/posts/:id/delete", async function (req, res) {
  const postId = req.params.id;
  const result = await db
    .getDb()
    .collection("posts")
    .deleteOne({ _id: new ObjectId(postId) });
  res.redirect("/posts");
});

module.exports = router;
