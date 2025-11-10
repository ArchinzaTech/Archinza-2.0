const express = require("express");
const path = require("path");
const app = express();
const port = 9040;
app.use(express.static(path.join(__dirname, "build")));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, function () {
  console.log("Web server listening on port %d in %s mode", port);
});

//something change
