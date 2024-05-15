require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const original = []
const shorten = []


app.post('/api/shorturl', (req, res) => {
  const url = req.body.url

  if(!url.includes("https://") && !url.includes("http://")){
    return res.json({
      error: 'invalid url'
    })
  }

  const index = original.indexOf(url)

  if(index < 0){
    original.push(url)
    shorten.push(shorten.length)

    return res.json({
      original_url: url,
      short_url: shorten.length - 1
    })
  }

  return res.json({
    original_url: url,
    short_url: shorten[index]
  })
})

app.get('/api/shorturl/:url', (req, res) => {
  const url = parseInt(req.params.url)
  const index = shorten.indexOf(url)

  if(index < 0){
    return res.json({
      error: "No short URL found"
    })
  }

  res.redirect(original[index])
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
