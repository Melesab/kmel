const express = require('express')
//#####################################
const bcrypt = require('bcrypt')
const csrf = require('csurf')
//#####################################
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
// ¤¤¤¤¤¤¤¤¤¤



//var cookieParser = require('cookie-parser');

// ¤¤¤¤¤¤¤¤¤
const SQLiteStore = require('connect-sqlite3')(expressSession)
const followersRouter = require('./routers/followersRouter')
const commentsRouter = require('./routers/commentsRouter')
const blogsRouter = require('./routers/blogsRouter')
const csrfProtection = csrf()


const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "$2b$10$dw1cKOGJ/wvDVte31NwIkOkiPt1p9bQK66FzZmgMWC0vjbnm.dvNy"
//"12345"
const SALT = 10



const app = express()

app.engine('hbs', expressHandlebars({
    defaultLayout: 'main',
    extname: '.hbs'
}))
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(expressSession({
    secret: "123456qas",         // remember to change to  lenlenmenele
    saveUninitialized: false,
    resave: false,
    store: new SQLiteStore({
        db: "sessions.db"
    })
}))
app.use(csrf())
app.use((req, res, next)=> {
    res.locals._csrf = req.csrfToken()
    next()
})
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn
    next()
})
app.use(express.static("/static"))
app.use(express.static(__dirname + '/static'))
app.use("/followers", followersRouter)
app.use("/blogs", blogsRouter)
app.use("/comments", commentsRouter)

app.get("/", function(req, res){
    console.log(">>>>>>>>>>>Line 64, index.js. csrftoken = "+ req.csrfToken() )
    res.render("home.hbs")
})
app.get("/about", function(req, res){
    res.render("about.hbs")
})
app.get("/contact", function(req, res){
    res.render("contact.hbs")
})

app.get("/login", (req,res)=>{
    res.render("login.hbs", {csrfToken: req.csrfToken()})
})
app.post("/login", function(req, res) {
    const enteredUsername = req.body.username
    const enteredPassword = req.body.password
    const errors = []
    if(enteredUsername != ADMIN_USERNAME){
        errors.push("Incorrect username!")
    }
    bcrypt.compare(enteredPassword, ADMIN_PASSWORD, (error, correctPassword)=>{
        if(correctPassword){
            console.log(">>>>>>===== line 85, index.js. req.csrfToken = "+ req.csrfToken())
            req.session.isLoggedIn = true
            res.redirect("/")
        } else{
            errors.push("Incorrect Password, please enter again!")
            req.session.isLoggedIn = false
            const model = {
                errors
            }
            res.render("login.hbs", model)
        }
    })
})
app.post("/logout", csrfProtection, (req, res)=> {
    req.session.isLoggedIn = false
    res.redirect("/")
})
app.get("/logout", (req, res)=> {
    req.session.isLoggedIn = false
    res.redirect("/")
})

console.log("Browse website on localhost:8080")
app.listen(8080)



// #################################################

const saltRounds = 10;
const plainTextPassword1 = "12345";
bcrypt
  .genSalt(saltRounds)
  .then(salt => {
    //console.log(`>>>>>>### Line 93, Salt: ${salt}`);
    return bcrypt.hash(plainTextPassword1, salt);
  })
  .then(hash => {
    console.log(`>>>>>>>> #### Line 97, Hash: ${hash}`);
  })
  .catch(err => console.error(err.message));


bcrypt.compare("12345", ADMIN_PASSWORD, function(err, result) {
        if (result) {
            console.log(">>>>>>>>>>> Password matches! correctPassord = "+ result)
        }
        else {
            console.log(">>>>>>> Invalid password! Nope "+ result);
        }
    });
    // https://auth0.com/blog/hashing-in-action-understanding-bcrypt/
    
// ##############################################################
