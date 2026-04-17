// server.mjs
// where your node app starts

// init project
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { path } from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import { configDotenv } from "dotenv";
configDotenv()
import nodemailer from "nodemailer";
import multiparty from "multiparty";
import cors from 'cors';
import matter from 'gray-matter';
const app = express();
app.set("view engine", "ejs");
app.use(cors());
import path from 'path';
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
app.use(express.static("secure"));

// *******************************
// Passwortgeschützter Bereich
// *******************************

//Render die Datei login.ejs, wenn die Admin-Seite aufgerufen wird
app.get("/secure", (req, res) => {
  app.set("views", path.join(__dirname, "secure"));
  res.render("login", {
     posts: ' ',
  });
});

//Wenn die Anmeldedaten eingegeben worden sind, wird die Richtigkeit überprüft
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
  
  var userName1 = process.env.userName1;
  var userPass1 = process.env.userPass1;
  
  var userName2 = process.env.userName2;
  var userPass2 = process.env.userPass2;
  
 
	// Ensure the input fields exists and are not empty
	if (username && password) {
    
    if ((username !== userName1 || password !== userPass1) && (username !== user-Name2 || password !== userPass2)) {
              
              //Wenn die Logindaten nicht korrekt sind, melde dies;
              app.set("views", path.join(__dirname, "secure"));
              response.render("login", {
                  posts: 'Incorrect Username and/or Password!', 
              });
 
            } else {
              // Wenn die Daten korrekt sind, wird der passwortgeschützte Bereich aufgerufen
              response.redirect(`/safe-area.html#loggedin`);
              app.set("views", path.join(__dirname, "views"));
            }
  }	
})



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

// *******************************
// The E-Mail-Transport initializing
// *******************************
const transporter = nodemailer.createTransport({
  host: "mail.gmx.net", //replace with your email provider - this is the host for gmx mail
  port: 587, // this port number is usally standard
  auth: {
    user: process.env.EMAIL, //This is your E-Mail-Address as environment variable -> see .env
    pass: process.env.PASS,  //This is your E-Mail-Password as environment variable -> see .env
  },
});
// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    //console.log(error);
  } else {
    //console.log("Server is ready to take our messages");
  }
});

//Funktion für das Senden der E-Mail, hier werden alle Felder des Formulars mit den Da-ten "vorbereitet"
app.post("/send", (req, res) => {
  // Sending the E-Mail
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, function (err, fields) {
    //console.log(fields);
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });
    //Hier wird die E-Mail an Euch definiert. Bitten halten Sie sich genau an der vorge-gebenen Schreibweise, Info: \n ist ein Umbruch
    const mail1 = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: `Mail von der Website: ${data.reason}`,
      text: ` Name: ${data.fullname} \n E-Mail: <${data.email}> \n Nachricht: ${da-ta.formmessage}`,
    };
    //Hier wird die E-Mail abgesendet
    transporter.sendMail(mail1, (err, data) => {
      if (err) {
        //console.log(err);
        res.status(500).send("Something went wrong.");
      } else {
        res.status(200).send("Email successfully sent to recipient!");
      }
    });
     //Hier wird die E-Mail an den Sender definiert, der eine Kopie seiner Nachricht er-hält.
    const mail2 = {
      from: process.env.EMAIL,
      to: data.email,
      subject: `Ihre Mail von der Website: ${data.reason}`,
      text: ` Name: ${data.fullname} \n E-Mail: <${data.email}> \n Nachricht: ${da-ta.formmessage}`,
    };
    //Hier wird die E-Mail abgesendet
    transporter.sendMail(mail2, (err, data) => {
      if (err) {
        //console.log(err);
        res.status(500).send("Something went wrong.");
      } else {
        res.status(200).send("Email successfully sent to recipient!");
      }
    });
  });
});
// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
