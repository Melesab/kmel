const express = require('express')
const db = require('../db')

const MIN_INPUT_LENGTH = 3


function getCommentValidationErrors(username, blogTitle, comment){
    const validationErrors = []
    if(comment.length < MIN_INPUT_LENGTH){
        validationErrors.push("Error:: Comment must be at least "+MIN_INPUT_LENGTH+" characters!")
    }
    if(username.length == 0){
        validationErrors.push("Error:: Username can not be empty!")
    }
    if(blogTitle.length == 0){
        validationErrors.push("Error:: Blog Title can not be empty!")
    } 
    return validationErrors
}


const router = express.Router()

router.get("/", (req, res)=> {
    const errors = []
    db.getAllComments((error, comments)=> {
        if(error){
            errors.push("Internal Error:: check connection to server!")
            errors.push(error)
            const model = {
                errors,
                dbErrorOccured: true
            }
            res.render("comments.hbs", model)
            return
        }else{
            const model = {
                comments,
                dbErrorOccured: false
            }
            res.render("comments.hbs", model)
        }
    })
})
router.get("/create", (req, res)=> {
    res.render("commentCreate.hbs")
})
router.post("/create", (req, res)=> {
    const username = req.body.username
    const blogTitle = req.body.blogTitle
    const comment = req.body.comment
    const errors = getCommentValidationErrors(username, blogTitle, comment)
    if(0<errors.length){
        const model = {errors}
        res.render("commentCreate.hbs", model)
        return
    }else{
        db.createComment(username, blogTitle, comment, (error, id)=>{
            if(error){
                errors.push("Internal Error:: check connection to server!")
                errors.push(error)
                if(0<errors.length){
                    const model = {errors}
                    res.render("commentCreate.hbs", model)
                    return
                }
                const model = {
                    dbErrorOccured: true
                }
                res.render("commentCreate.hbs", model)
            }else{
                res.redirect("/comments")
            }
        })
    }
})
router.get("/update/:id", (req, res)=> {
    const id = req.params.id
    const errors = []
    if(!req.session.isLoggedIn){
        errors.push("Error:: You must log in first!")
    }
    db.getCommentById(id, (error, comment)=> {
        if(error){
            errors.push("Internal Error:: check connection to server!")
            errors.push(error)
            const model = {
                errors,
                dbErrorOccured: true
            }
            res.render("commentUpdate.hbs", model)
        }else{
            const model = {
                comment,
                dbErrorOccured: false
            }
            res.render("commentUpdate.hbs", model)
        }
    })
})
router.post("/update/:id", (req, res)=>{
    const id = req.params.id
    const blogTitle = req.body.blogTitle
    const newUsername = req.body.username
    const newComment = req.body.comment
    const errors = getCommentValidationErrors(newUsername, blogTitle, newComment)
    if(!req.session.isLoggedIn){
        errors.push("Error:: You must log in first!")
    }
    if(0<errors.length){
        const model = {
            errors, 
            comment: {
                id,
                blogTitle: blogTitle,
                username: newUsername,
                comment: newComment
            }
        }
    res.render("commentUpdate.hbs", model)
    return
    }
    db.updateCommentById(newUsername, blogTitle, newComment, id, (error)=>{
        if(error){
            errors.push("Internal Error:: check connection to server!")
            errors.push(error)
            const model = {
                errors,
                dbErrorOccured: true
            }
            res.render("commentUpdate.hbs", model)
        }else{
            res.redirect("/comments")
        }
    })
})
router.post("/delete/:id", (req, res)=> {
    console.log("====>> Line 138, commentsRouter.js. delete post")
    const id = req.params.id
    const errors = []
    if(!req.session.isLoggedIn){
        errors.push("Error:: You must log in first!")
        console.log("====>> Line 138, commentsRouter.js. delete post")
    }
    db.deleteCommentById(id, (error)=>{
        console.log("====>> Line 146, commentsRouter.js. delete/post/db")
        if(error){
            console.log("====>> Line 148, commentsRouter.js. delete post/dbError")
            errors.push("Internal Error:: check connection to server!")
            errors.push(error)
            const model = { 
                errors,
                dbErrorOccured: true
            }
            res.render("comment.hbs", model)
        }else{
            console.log("====>> Line 157, commentsRouter.js. delete post/noDBError")
            res.redirect("/comments")
        }
        console.log("====>> Line 138, commentsRouter.js. delete post/clear")
    })
})
router.get("/:id", (req, res)=>{

    const id = req.params.id
    const errors = []
    db.getCommentById(id, (error, comment)=>{
        if(error){
            errors.push("Internal Error:: check connection to server!")
            errors.push(error)
            const model = { 
                errors,
                dbErrorOccured: true
            }
            res.render("comment.hbs", model)
        }else{
            const model = {
                comment,
                dbErrorOccured: false
            }
            res.render("comment.hbs", model)
        }
    })
})

module.exports = router
