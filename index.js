import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import auth from "./auth.js";

// REFRESH_TOKEN_SECRET
dotenv.config();
const app = express();

app.use(express.json());

const posts = [
  {
    username: "Kyle",
    title: "Post 1",
  },
  {
    username: "Jim",
    title: "Post 2",
  },
  {
    username: "Kyle",
    title: "Post 3",
  },
];
let refreshTokens = [];

app.get("/post", auth, (req, res) => {
  const userName = req.user;
  const userPosts = posts.filter((post) => post.username === userName);
  res.json(userPosts);
});

app.post("/login", (req, res) => {
  const userName = req.body.username;
  const user = { user: userName };
  const accessToken = generateToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter(
    (token) => token !== req.body.refreshToken
  );
  res.sendStatus(200);
});

app.post("/tokenGet", (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return sendStatus(403);
    const accessToken = generateToken({ user: user.user });
    res.json({ accessToken: accessToken });
  });
});

const generateToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20s" });
};

app.listen("5000", console.log("Server is up"));
