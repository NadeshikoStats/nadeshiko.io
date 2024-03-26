const express = require('express');
const axios = require('axios');


const app = express();
const port = 80;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

app.get('/player/:name', (req, res) => {
    const name = req.params.name;
    res.render('player', { name });
  });

  app.get('/test', (req, res) => {
    res.send('This is a test route!');
  });

app.get('/card', async (req, res) => {
    try {
      // Build the URL to forward the request to
      const targetUrl = `http://localhost:2000/card?${new URLSearchParams(req.query).toString()}`;
  
      // Use axios to forward the request
      const response = await axios.get(targetUrl, {
        responseType: 'arraybuffer', // Important for images/binary content
      });
  
      // Forward the headers and status code from the response
      res.set(response.headers);
      res.status(response.status);
  
      // Send back the response data
      res.send(response.data);
    } catch (error) {
      // Error handling
      console.error('Error forwarding the request:', error);
      res.status(500).send('Error forwarding request');
    }
});

app.get('/playerData', async (req, res) => {
  const playerName = req.query.name;

  if (!playerName) {
    return res.status(400).send('Player name is required');
  }

  try {
    const response = await axios.get(`http://localhost:2000/stats?name=${encodeURIComponent(playerName)}`);
    res.send(response.data);
  } catch (error) {
    console.error('API call failed:', error);
    return res.status(500).send('failed to fetch player data :(');
  }
});
  
  app.listen(port, () => {
    console.log(`Listening at https://localhost:${port} !`);
  });