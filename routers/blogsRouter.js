const express = require('express')
const db = require('../db')

const MIN_LENGTH = 5

function getBlogValidationErrors(date, title, blogEntry){
    const validationErrors = []
    if(title.length < MIN_LENGTH && blogEntry.length < MIN_LENGTH){
        validationErrors.push("Error:: Title and blogEntry must be at least "+TITLE_MIN_LENGTH+" characters!")
    }
    if(date.length != 10){
        validationErrors.push("Error:: Date must be YYYY-MM-DD!")
    } 
    return validationErrors
}

const router = express.Router()

router.get("/", (req, res)=> {
    db.getAllBlogs((error, blogs)=> {
        if(error){
            console.log(error)
            const model = { 
                dbErrorOccured: true
            }
            res.render("blogs.hbs", model)
        }else{
            const model = {
                blogs,
                dbErrorOccured: false
            }
            res.render("blogs.hbs", model)
        }
    })
})
router.get("/create", (req, res)=> {
    res.render("createBlog.hbs")
})
router.post("/create", (req, res)=> {
    
    const date = req.body.date
    const title = req.body.title
    const blogEntry = req.body.blogEntry
    const errors = getBlogValidationErrors(date, title, blogEntry)

    if(!req.session.isLoggedIn){
        errors.push("Error:: You must log in first!")
    }
    if(0<errors.length){
        const model = {errors}
        res.render("createBlog.hbs", model)
        return
    }else{
        db.createBlog(date, title, blogEntry, (error, id)=>{
            if(error){
                console.log(error)
                const model = { 
                    dbErrorOccured: true
                }
                res.render("createBlog.hbs", model)
            }else{
                res.redirect("/blogs")
            }
        })
    }
})
router.get("/update/:id", (req, res)=> {
    const id = req.params.id

    db.getBlogById(id, (error, blog)=> {
        if(error){
            console.log(error)
            const model = { 
                dbErrorOccured: true
            }
            res.render("updateBlog.hbs", model)
        }else{
            const model = {
                blog,
                dbErrorOccured: false
            }
            res.render("updateBLog.hbs", model)
        }
    })
})
router.post("/update/:id", (req, res)=>{

    const id = req.params.id
    const newDate = req.body.date
    const newTitle = req.body.title
    const newBlogEntry = req.body.blogEntry

    const errors = getBlogValidationErrors(newDate, newTitle, newBlogEntry)

    if(!req.session.isLoggedIn){
        errors.push("Errors:: You must log in first!")
    }
    if(0<errors.length){
        const model = {
            errors, 
            blog: {
                id,
                date: newDate,
                title: newTitle,
                blogEntry: newBlogEntry
            }
        }
    res.render("updateBlog.hbs", model)
    return
    }
    db.updateBlogById(newDate, newTitle, newBlogEntry, id, (error)=>{
        if(error){
            console.log(error)
            const model = { 
                dbErrorOccured: true
            }
            res.render("updateBlog.hbs", model)
        }else{
            res.redirect("/blogs")
        }
    })
})
router.post("/delete/:id", (req, res)=> {

    const id = req.params.id

    if(!req.session.isLoggedIn){
        errors.push("Errors:: You must log in first!")
    }

    db.deleteBlogById(id, (error)=>{
        if(error){
            console.log(error)
            const model = { 
                dbErrorOccured: true
            }
            res.render("blog.hbs", model)
        }else{
            res.redirect("/blogs")
        }
    })
})
router.get("/:id", (req, res)=>{

    const id = req.params.id
    db.getBlogById(id, (error, blog)=>{
        if(error){
            console.log(error)
            const model = { 
                dbErrorOccured: true
            }
            res.render("blog.hbs", model)
        }else{
            const model = {
                blog,
                dbErrorOccured: false
            }
            res.render("blog.hbs", model)
        }
    })
})

module.exports = router
