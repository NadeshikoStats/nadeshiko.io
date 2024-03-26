const express = require('express');
const axios = require('axios');


const app = express();
const port = 80;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/player/:name', async (req, res) => {
  const name = req.params.name;
  
  try {
       const response = await axios.get(`http://localhost:2000/stats?name=${name}`);
       let playerData = response.data;
      
      res.render('player', { name, playerData });
   } catch(error) {
       console.error("Fetching player data failed! → ", error);
       res.status(500).send("An error occurred fetching player data :(");
   }
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
  
      // Forward the headers and status code from the response, and then...
      res.set(response.headers);
      res.status(response.status);
  
      // Send back the response data!
      res.send(response.data);
    } catch (error) {
      // Error handling
      console.error('Error forwarding the request:', error);
      res.status(500).send('Error forwarding request');
    }
});
  
  app.listen(port, () => {
    console.log(`Listening at https://localhost:${port} !`);
  });