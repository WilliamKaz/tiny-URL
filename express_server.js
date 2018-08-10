const bodyParser = require("body-parser");
var express = require("express");
var cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
var app = express();
var PORT = 8080;



app.use(cookieSession({
  name: 'session',
  keys: ['qwerty123456'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


var urlDatabase = {

};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 // "user2RandomID": {
 //    id: "user2RandomID",
 //    email: "user2@example.com",
 //    password: "dishwasher-funk"
 //  }
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


// get functions

app.get("/urls/new", (req, res) => {
  let isLoggedIn = false;
  let user = null;
  if(req.session.user_Id){
    isLoggedIn = true;
    user = users[ req.session.user_Id];
  } else{
    res.redirect("/login");
  }
  let templateVars = {user: user, isLoggedIn : isLoggedIn}
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
   let isLoggedIn = false;
   let user = null;
  if(req.session.user_Id){
    isLoggedIn = true;
    user = users[req.session.user_Id];
  }
  let templateVars = { urls: urlDatabase, user: user, isLoggedIn : isLoggedIn};
   console.log(templateVars);
   console.log(req.session);
    res.render("urls_index", templateVars);
});

app.get('/register', (req, res) => {
   let isLoggedIn = false;
   let user = null;
  if(req.session.user_Id){
    isLoggedIn = true;
    user = users[ req.session.user_Id];
  }
  let templateVars = {user: user, isLoggedIn : isLoggedIn};
  res.render('urls_register', templateVars);
});
app.get('/login', (req, res) => {
  let isLoggedIn = false;
   let user = null;
  if(req.session.user_Id){
    isLoggedIn = true;
    user = users[ req.session.user_Id];
  }
  let templateVars = {user: user, isLoggedIn : isLoggedIn};
  res.render('urls_login', templateVars);
});


app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});


app.get("/urls/:id", (req, res) => {
   let isLoggedIn = false;
   let user = null;
  if(req.session.user_Id){
    isLoggedIn = true;
    user = users[ req.session.user_Id];
  }
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id].longURL, user: user, isLoggedIn : isLoggedIn};
  res.render("urls_show", templateVars);
});

app.get('*', (req, res) =>{
  res.redirect('urls_404')
});


// get functions end

// post functions

app.post("/urls", (req, res) => {
  var newId = generateRandomString(5);
  urlDatabase[newId] = {longURL : req.body.longURL, user_Id: req.session.user_Id };
  console.log(urlDatabase);
  res.redirect(`/urls/${newId}`);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) =>{
  var updateID =  req.params.id;
  urlDatabase[updateID] = {longURL : req.body.longURL, user_Id: req.session.user_Id };
  res.redirect('/urls/' + updateID);
});

app.post('/login', (req,res) =>{
   if(req.body.email === "" || req.body.password == ""){
     return res.status(403).send("Please fill both fields");
  } else{
    for(id in users ){
      if(req.body.email === users[id].email && bcrypt.compareSync(req.body.password, users[id].password )){
        req.session.user_Id = (id);
        res.redirect('/urls');
        return;
      }
    }
    return res.status(403).send("Error 303 user not found");
  }
});

app.post('/logout', (req,res) =>{
  req.session.user_Id = null;
  res.redirect('/urls');
});

app.post('/register', (req, res) =>{
  var newUserId = 'User' + generateRandomString(7).toString();


  if(req.body.email === "" || req.body.password == ""){
     return res.status(400).send("Please fill both fields");
  } else{
    for(id in users ){
      if(req.body.email == users[id].email){
        console.log(users);
        return res.status(400).send('Error: email is used by another user');
      }
    }
    users[newUserId] = { id: newUserId, email: req.body.email , password: bcrypt.hashSync(req.body.password, 10) };
    req.session.user_Id = newUserId;
    res.redirect('/urls');
  }

});

// post functions end



// used a stack overflow response to expedite writing this just
// changed the length in the for loop to suit the implementation
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
var generateRandomString = function(num) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < num; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}