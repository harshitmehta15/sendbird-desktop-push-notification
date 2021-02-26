const express = require('express');
require('dotenv/config');
const webpush = require('web-push');
 
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
 
webpush.setVapidDetails('mailto:mehtapresent@gmail.com', 'BAAazgdBplmyKQ-X-LnrucCF3IzkQ5DPlIw_Iy0DRcSG1xugM17Au8_9tZZnfZnXDdNVvd4k-ikbc2yIB2CeA8M', 'sUEiLwbPJeBnA2Eizro3QCxf9MysGlaZkf7MsJuw9Ec');

const app = express();
let subscription;
const PORT = 9000;

app.use(express.static('dist'));
app.use(express.static('./'));

app.use(require('body-parser').json());


app.get('/', function(req, res) {
  res.sendfile('index.html');
});

app.listen(process.env.PORT || PORT);
console.log(`[SERVER RUNNING] 127.0.0.1:${PORT}`);

app.post("/profanity", (req, res) => {
  console.log("Hook Caught");
  res.status(200).end(); 
  const payload = JSON.stringify({ title: 'test' });
  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack);
  });
});

app.post('/subscribe', (req, res) => {
  console.log("in subscribe");
  subscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title: 'test' });
  console.log(subscription);
  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack);
  });
});

/*setInterval(() => {
  console.log("pushing notification");
  if(subscription) { 
    console.log("subs !=Null - pushing notification");
    const payload = JSON.stringify({ title: 'test' });
    webpush.sendNotification(subscription,payload);
}
}, 5000); */
