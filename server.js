const express = require('express');
require('dotenv/config');
const webpush = require('web-push');
 
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
 
webpush.setVapidDetails('mailto:mehtapresent@gmail.com', publicVapidKey, privateVapidKey);

const app = express();

const PORT = 9000;

app.use(express.static('dist'));
app.use(express.static('./'));

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

app.listen(process.env.PORT || PORT);
console.log(`[SERVER RUNNING] 127.0.0.1:${PORT}`);

app.post("/profanity", (req, res) => {
  console.log("Hook Caught"); 
  postNotification();
  res.status(200).end();
});

const newLocal = '/notify';
app.post(newLocal, (req, res) => {
  const notify = req.body;
  res.send(200);
  let i = 0;
  setInterval(() => {
    const payload = JSON.stringify({ title: `Hello!`, body: i++ });
    webpush.sendNotification(subscription, payload);
  }, 500);
});

