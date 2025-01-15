![Logo of nadeshiko. A pixelated duo of pink flowers is to the left of a stylized logo saying "nadeshiko.io". A blurred field of cherry blossom trees stand in the background. Visit nadeshiko at nadeshiko.io.](https://nadeshiko.io/img/banner.png)

<h1 align="center">nadeshiko – a beautiful Hypixel stats viewer</h1>

![The frontend running, displaying the Hypixel stats of a player named "kittycatchloe". Headers on the top allow users to switch from the "Home", "About", "Cards", and "Settings", with a second header allowing users to pick the currently selected gamemode.](https://github.com/user-attachments/assets/ed4067c0-27b1-4ab9-b761-b5ed9d1ab6d8)

![A nadeshiko Bed Wars card generated for the player "WarOG" by using the card wizard.](https://github.com/user-attachments/assets/f6986639-d7b2-4b3e-8fe5-ae0efd2ff09f)

## Running

Ensure you have a copy of the [backend](https://github.com/NadeshikoStats/NadeshikoBackend) running. If the backend is up, accessing `http://localhost:2000/stats?name=hypixel` should work and return a successful response.

After cloning this repo, simply run `node server.js` to launch the website on port 8080.

`~ $ git clone https://github.com/NadeshikoStats/nadeshiko.io.git`

`~ $ cd nadeshiko.io`

`~/nadeshiko.io $ node server.js`

Ports below 1024 are restricted on Linux. To access the website normally on port 80, redirect port 8080 to port 80. One
way of achieving this is via `iptables`:

`$ sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080`

Alternatively, if you are operating in an environment where port 80 is not restricted, simply change
`const port = 8080;` in `server.js`.

---

Made with ♥&#xFE0E; by <a href="https://brookie.dev" target="_blank">BrookeAFK</a> and <a href="https://niqumu.dev" target="_blank">niqumu</a>
