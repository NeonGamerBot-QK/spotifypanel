const express = require("express");
const fetch = require("node-fetch");
// const { getData, getPreview, getTracks, getDetails } = require('spotify-url-info')(fetch)
const router = express.Router();
const c = require("child_process");
function Authenticated(req, res, next) {
  if (req.headers.authorization === process.env.AUTH_TOKEN) next();
  else res.status(401).json({ message: "Unauthorized" });
}
router.get("/", (req, res) => {
  res.json({
    message: "OK",
    paths: [
      "/status",
      "/share",
      "/play",
      "/pause",
      "/next",
      "/previous",
      "/volume",
      "/shuffle",
      "/repeat"
    ]
  });
});
router.get("/auth", Authenticated, (req, res) => {
  res.json({ message: "OK" });
});
router.get("/status", (req, res) => {
  const lines = c
    .spawnSync("./bin/spotify.sh", ["status"])
    .stdout.toString()
    .split("\n");
  const songName = lines[3].split(":")[1].trim();
  const artist = lines[1].split(":")[1].trim();
  const status = lines[0].split(" ")[3].split(".")[0].trim();
  const timestamp = lines[4].split(":").slice(1).join(":").trim();
  res.json({
    songName,
    artist,
    status,
    timestamp
  });
});
router.get("/online_info", (req, res) => {
  const url = c
    .spawnSync("./bin/spotify.sh", ["share"])
    .stdout.toString()
    .split("\n")[1]
    .split(":")
    .slice(1)
    .join(":")
    .split("\x1B(B\x1B[m")[0]
    .trim();
  // console.log(url, "https://open.spotify.com/track/5EloqweGioDEbqiGXTYWgE?si=85326c0536ae4fbf")
  fetch("https://open.spotify.com/oembed?url=" + url)
    .then(r => r.json())
    .then(r => {
      res.json(r);
    });
});
router.get("/share", (req, res) => {
  const lines = c
    .spawnSync("./bin/spotify.sh", ["share"])
    .stdout.toString()
    .split("\n");
  const url = lines[0]
    .split(":")
    .slice(1)
    .join(":")
    .split("\x1B(B\x1B[m")[0]
    .trim();
  const uri = lines[1]
    .split(":")
    .slice(1)
    .join(":")
    .split("\x1B(B\x1B[m")[0]
    .trim()
    .replace("spotify:", "spotify://");
  res.json({
    url,
    uri
  });
});

router.post("/play", Authenticated, (req, res) => {
  // const songName = req.body.songName
  c.spawnSync("./bin/spotify.sh", ["play", songName]);
  res.status(200).json({ message: "OK" });
});

router.post("/pause", Authenticated, (req, res) => {
  c.spawnSync("./bin/spotify.sh", ["pause"]);
  res.status(200).json({ message: "OK" });
});

router.post("/next", Authenticated, (req, res) => {
  c.spawnSync("./bin/spotify.sh", ["next"]);
  res.status(200).json({ message: "OK" });
});

router.post("/previous", Authenticated, (req, res) => {
  c.spawnSync("./bin/spotify.sh", ["prev"]);
  res.status(200).json({ message: "OK" });
});

router.post("/volume", Authenticated, (req, res) => {
  const volume = req.body.volume;
  const lines = c
    .spawnSync("./bin/spotify.sh", ["vol", volume])
    .stdout.toString()
    .split(" ")
    .map(e => e.split("\x1B(B\x1B[m")[0].replace(".", ""))
    .find(e => !isNaN(e));
  console.log(lines);
  res.status(200).json({ message: "OK", volume: lines });
});

router.get("/volume", (req, res) => {
  const lines = c
    .spawnSync("./bin/spotify.sh", ["vol"])
    .stdout.toString()
    .split(" ")
    .map(e => e.split("\x1B(B\x1B[m")[0].replace(".", ""))
    .find(e => !isNaN(e));
  console.log(lines);
  res.status(200).json({ message: "OK", volume: lines });
});
router.post("/shuffle", Authenticated, (req, res) => {
  // const shuffle = req.body.shuffle
  c.spawnSync("./bin/spotify.sh", ["toggle", "shuffle"]);
  res.status(200).json({ message: "OK" });
});
router.post("/seek", (req, res) => {
  const time = req.body.seek;
  c.spawnSync("./bin/spotify.sh", ["pos", time]);
  res.status(200).json({ message: "OK" });
});

router.post("/repeat", Authenticated, (req, res) => {
  // const repeat = req.body.repeat
  c.spawnSync("./bin/spotify.sh", ["toggle", "repeat"]);
  res.status(200).json({ message: "OK" });
});

module.exports = router;
