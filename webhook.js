const http = require("http");
const { spawn } = require("child_process");

http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/hooks/auto-deploy") {
    res.writeHead(200);
    res.end("OK");

    spawn("bash", ["/root/civil-ecommerce/deploy.sh"], {
      detached: true,
      stdio: "ignore",
    }).unref();
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
}).listen(9000);

