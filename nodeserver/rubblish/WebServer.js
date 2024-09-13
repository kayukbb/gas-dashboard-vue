const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    console.log('Got request');

    let Path = "";
    if (req.url === "/") {
        Path = "./page/index.html";
    } else if (req.url === "/about") {
        Path = "./page/about.html";
    } else {
        Path = "./page/404.html";
    }

    fs.readFile(Path, (error, data) => {
        if (error) {
            console.log(error);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        }
    });
});

const port = 3000;
const ip = "127.0.0.1";

server.listen(port, ip, () => {
    console.log(`Server is running at http://${ip}:${port}`);
});