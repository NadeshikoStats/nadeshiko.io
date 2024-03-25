const express = require('express');
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
  
  app.listen(port, () => {
    console.log(`Listening at https://localhost:${port} !`);
  });