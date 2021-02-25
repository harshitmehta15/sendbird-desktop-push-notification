const express = require('express');
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
  console.log("pakad liya"); 
  console.log(req.body); 
  pushNotification();
  res.status(200).end(); // Responding is important
});

function pushNotification(){
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification("Hi there!");
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}
