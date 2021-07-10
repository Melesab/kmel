const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
// ¤¤¤¤¤¤¤¤¤¤
const path = require('path')

// ¤¤¤¤¤¤¤¤¤
const SQLiteStore = require('connect-sqlite3')(expressSession)
// const db = require('./db')
const followersRouter = require('./routers/followersRouter')
const commentsRouter = require('./routers/commentsRouter')
const blogsRouter = require('./routers/blogsRouter')

//#####################################
//const bcrypt = require('bcrypt')
//const csrf = require('csurf')

//#####################################

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "12345"

const app = express()

app.engine('hbs', expressHandlebars({
    defaultLayout: 'main',
    extname: '.hbs'
}))
app.set('view engine', 'hbs');
app.use(expressSession({
    secret: "123456qas",         // remember to change to  lenlenmenele
    saveUninitialized: false,
    resave: false,
    store: new SQLiteStore({
        db: "sessions.db"
    })
}))
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn
    next()
})
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(express.static("static"))
app.use("/followers", followersRouter)
app.use("/blogs", blogsRouter)
app.use("/comments", commentsRouter)

app.get("/", function(req, res){
    res.render("home.hbs")
})
app.get("/about", function(req, res){
    res.render("about.hbs")
})
app.get("/contact", function(req, res){
    res.render("contact.hbs")
})

app.get("/login", (req,res)=>
    res.render("login.hbs"))
app.post("/login", function(req, res) {
    const enteredUsername = req.body.username
    const enteredPassword = req.body.password
    if(enteredUsername == ADMIN_USERNAME && enteredPassword == ADMIN_PASSWORD){
        req.session.isLoggedIn = true
        res.redirect("/")
    }else{
        req.session.isLoggedIn = false
        const model = {
            isLoggedIn: false
        }
        res.render("login.hbs", model)
    }
})
app.post("/logout", (req, res)=> {
    req.session.isLoggedIn = false
    res.redirect("/")
})

console.log("Browse website on localhost:8080")
app.listen(8080)



