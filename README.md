![nadeshiko_social](https://github.com/NadeshikoStats/nadeshiko.io/assets/146425360/0c06133e-4aca-48b0-ad07-e2389904bfb8)

<h1 align="center">nadeshiko – a beautiful Hypixel stats viewer</h1>

![image](https://github.com/NadeshikoStats/nadeshiko.io/assets/146425360/e87cee8b-f9d5-4703-b270-91dd65c2ade1)


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
