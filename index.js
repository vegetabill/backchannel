const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

const port = process.env.PORT || 3001;

http.listen(port, () => {
  console.log(`listening on :${port}`);
});
