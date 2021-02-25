const express = require('express');
const app = express();

const PORT = 9000;

app.use(express.static('dist'));
app.use(express.static('./'));

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

app.post("/profanity", (req, res) => {
  console.log(req.body) 
  res.status(200).end() // Responding is important
})

app.listen(process.env.PORT || PORT);
console.log(`[SERVER RUNNING] 127.0.0.1:${PORT}`);
