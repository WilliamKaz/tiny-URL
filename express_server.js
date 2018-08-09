const bodyParser = require("body-parser");
var express = require("express");
var cookieParser = require('cookie-parser')
var app = express();
var PORT = 8080;

app.use(cookieParser())

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

// app.get()


var urlDatabase = {
  // "b2xVn2": "http://www.lighthouselabs.ca",
  // "9sm5xK": "http://www.google.com"
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {userName: req.cookies['userName']}
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, userName: req.cookies['userName'] };
  res.render("urls_index", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], userName: req.cookies['userName']};
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  var newId = generateRandomString();
  urlDatabase[newId] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${newId}`);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) =>{
  var updateID =  req.params.id;
  urlDatabase[updateID] = req.body.longURL;
  res.redirect('/urls/' + updateID);
});

app.post('/login', (req,res) =>{
  res.cookie('userName', req.body.userName);
  res.redirect('/urls');
});

app.post('/logout', (req,res) =>{
  res.clearCookie('userName');
  res.redirect('/urls');
});





// needs to add functionality in a for loop of the database that determines if the short url as been used
function generateRandomString() {
  // used a stack overflow response to expedite writing this just
  // changed the length in the for loop to suit the implementation
  // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
  // other persons code ends here

// this solion limits us to a limited number of available small urls based on the number of letters 26 * 2  and numbers 1-9

}