![Logo of nadeshiko. A pixelated duo of pink flowers is to the left of a stylized logo saying "nadeshiko.io". A blurred field of cherry blossom trees stand in the background.](https://nadeshiko.io/img/banner.png)

<h1 align="center">nadeshiko – a beautiful Hypixel stats viewer</h1>

![The frontend running, displaying the Hypixel stats of a player named "kittycatchloe". Headers on the top allow users to switch from the "Home", "About", "Cards", and "Settings", with a second header allowing users to pick the currently selected gamemode.](https://github.com/NadeshikoStats/nadeshiko.io/assets/96643991/fba77ec1-f126-4be4-a4f4-b8730e1deda8)

![A nadeshiko Bed Wars card generated for the player "brookeafk" by using the card wizard.](https://github.com/NadeshikoStats/nadeshiko.io/assets/96643991/e3cea29a-2c03-4aa0-abab-cfe7a08b1e83)





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

Made with ♥&#xFE0E; by <a href="https://github.com/niqumu" target="_blank">niqumu</a> and <a href="https://brookie.dev" target="_blank">BrookeAFK</a>
