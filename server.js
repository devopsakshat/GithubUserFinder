require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

async function githubRequest(url) {
  const headers = {
    Accept: "application/vnd.github+json"
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch("https://api.github.com" + url, { headers });
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "GitHub request failed");
    error.status = response.status;
    throw error;
  }

  return data;
}

app.get("/api/github/search", async (req, res) => {
  const searchUser = req.query.q;

  if (!searchUser) {
    return res.status(400).json({ message: "Please enter a username to search." });
  }

  try {
    const users = await githubRequest(
      `/search/users?q=${encodeURIComponent(searchUser)}&per_page=10`
    );

    res.json(users);
  } catch (error) {
    console.log(error.message);
    res.status(error.status || 500).json({ message: error.message });
  }
});

app.get("/api/github/users/:username", async (req, res) => {
  try {
    const user = await githubRequest(
      `/users/${encodeURIComponent(req.params.username)}`
    );

    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(error.status || 500).json({ message: error.message });
  }
});

app.listen(2000, () => {
  console.log("Server is running at http://localhost:2000");
});
