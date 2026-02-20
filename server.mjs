// server.mjs
// where your node app starts

// init project
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import { configDotenv } from "dotenv";
configDotenv();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Alle Seiten auf HTTPS umleiten.
function checkHttps(req, res, next) {
  // protocol check, if http, redirect to https

  if (req.get("X-Forwarded-Proto").indexOf("https") != -1) {
    return next();
  } else {
    res.redirect("https://" + req.hostname + req.url);
  }
}

app.all("*", checkHttps);

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// Die statischen Seiten in public und content werden als "statisch" definiert. So können Sie direkt adressiert werden.
app.use(express.static("public"));
app.use(express.static("assets"));
app.use(express.static("content"));
app.use(express.static("views"));

// This is the basic-routing
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});
// Routing der index.html als /index
app.get("/index", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});
// Routing der daten.html als /daten
app.get("/daten", (request, response) => {
  response.sendFile(`${__dirname}/views/daten.html`);
});
// Routing der schulbildung.html als /schulbildung
app.get("/schulbildung", (request, response) => {
  response.sendFile(`${__dirname}/views/schulbildung.html`);
});
// Routing der berufsbildung.html als /berufsbildung
app.get("/berufsbildung", (request, response) => {
  response.sendFile(`${__dirname}/views/berufsbildung.html`);
});
// Routing der kontakt.html als /kontakt
app.get("/kontakt", (request, response) => {
  response.sendFile(`${__dirname}/views/kontakt.html`);
});

// Routing der impressum.html als /impressum
app.get("/impressum", (request, response) => {
  response.sendFile(`${__dirname}/views/impressum.html`);
});


// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
