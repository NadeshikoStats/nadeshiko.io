const express = require('express');
const axios = require('axios');
const minify = require('express-minify');

const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.set('views', './views');
/*
app.use(minify({
  cache: false,
  js_match: /javascript/,
  css_match: /css/,
  ejs_match: /ejs/,
}));
console.log("Minify enabled!");
*/
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

async function getVisageImage(uuid) {
  try {
    // Sends API call to Visage
    const imageUrl = 'https://visage.surgeplay.com/face/128/' + uuid;
    const response = await await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: { 'User-Agent': 'nadeshiko.io (+https://nadeshiko.io; contact@nadeshiko.io)' }
    })
    const imageBuffer = Buffer.from(response.data, 'binary'); // Converts image to base64 so it can be sent through axios
    
    return(`data:image/jpeg;base64,${imageBuffer.toString('base64')}`);
  } catch (error) {
    console.error('Error fetching player image! ', error);
    return "";
  }
}

let gameAliases = {
  network: ["hypixel", "overall"],
  arcade: ["a"],
  bedwars: ["b", "bw", "bed"],
  blitz: ["bsg", "sg", "hungergames"],
  buildbattle: ["bb", "build"],
  classic: ["legacy", "ab", "arena", "arenabrawl", "pb", "paint", "paintball", "q", "qc", "quake", "quakecraft", "tkr", "turbo", "gingerbread", "turbokartracers", "vz", "vampire", "vampirez", "vampz", "walls"],
  copsandcrims: ["cac", "cvc", "cops", "mcgo"],
  duels: ["d", "duel"],
  megawalls: ["mw", "megawall", "megawalls", "mega", "walls3"],
  murdermystery: ["mm", "murder"],
  pit: ["thepit"],
  smashheroes: ["smash", "supersmash"],
  skywars: ["s", "sw", "sky"],
  tntgames: ["tnt"],
  uhc: ["speeduhc", "suhc", "speed"],
  warlords: ["w", "war", "wl", "bg", "battleground"],
  woolwars: ["ww", "wool", "woolgames"],
}

function getMetaDescription(game) {
  switch(game) {
    case 'skywars':
      return "SkyWars player stats";
    case 'bedwars':
      return "Bed Wars player stats";
    case 'duels':
      return "Duels player stats";
    case 'blitz':
      return "Blitz player stats";
    case 'buildbattle':
      return "Build Battle player stats";
  }
}

app.get('/player/:name/:game?', async (req, res) => {
  const name = req.params.name;
  
  let game = req.params.game;
  if (game) {
    game = game.toLowerCase();

    // Check if the specified game name is an alias
    for (let key in gameAliases) {
      if (gameAliases[key].includes(game)) {
        game = key;
        break;
      }
    }
  }
  
  var base64PlayerImage = "";
  var computationError = "";
  
  try {
       const response = await axios.get(`http://localhost:2000/stats?name=${name}`);
       let playerData = response.data;
       base64PlayerImage = await getVisageImage(playerData["uuid"]);      


       res.render('player', { name, playerData, base64PlayerImage, game });
   } catch(error) {
      if(error.response.status == 404) {
        computationError = `No player by the name of ${name} was found :(`;
      } else {
        computationError = `Could not find stats of player ${name} (${error})`;
      }
      console.error("Fetching player data failed! → ", error);
      res.render('index', { computationError });
   }
});

  app.get('/isnadeshikodown', (req, res) => {
    res.send('No (probably)');
  });

  app.get('/card/:base64', async (req, res) => {
    try {
      const { base64 } = req.params;
  
      const targetUrl = `http://localhost:2000/card/${encodeURIComponent(base64)}`;
  
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

  app.get('/:name/:game?', (req, res) => {
    const { name, game } = req.params;
    res.redirect(`/player/${name}/${game == undefined ? '' : game}`);
  });
  
  app.listen(port, () => {
    console.log(`Listening at https://localhost:${port}!`);
  });