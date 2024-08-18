import express from "express";
import webpush from "web-push";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

const publicKey = process.env.PUBLIC_KEY!;
const privateKey = process.env.PRIVATE_KEY!;

webpush.setVapidDetails("mailto:email@gmail.com", publicKey, privateKey);

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "js")));

const payload = JSON.stringify({ title: "hello" });

app.post("/subscribe", (req, res) => {
  console.log(req.body);
  return res.status(201).json({});
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/main.js", (req, res) => {
  res.sendFile(__dirname + "/main.js");
});
app.get("/sw.js", (req, res) => {
  res.sendFile(__dirname + "/sw.js");
});

app.post("/push", (req, res) => {
  const { subscription } = req.body;
  if (!subscription) return res.send("Subscription not found");
  webpush
    .sendNotification(
      { endpoint: subscription.endpoint, keys: subscription.keys },
      payload
    )
    .then((sub) => res.send({ sub }))
    .catch((error) => {
      res.send(error.stack);
    });
});

app.listen(3001, () => console.log("App is running"));
