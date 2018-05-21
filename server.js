const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

let highScore = 0;

app.get('/api/', (req, res) => {
  console.log("the high score is now " + highScore);
  res.send(highScore.toString());
});

app.put('/api/', (req, res) => {
  highScore = req.body.highScore;
  res.send(highScore.toString());
});

app.listen(3000, () => console.log('Server listening on port 3000!'))
