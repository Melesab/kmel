const express = require('express')
const db = require('../db')

const MIN_INPUT_LENGTH = 3


function getCommentValidationErrors(blogId, userId, userName, theComment){
    const validationErrors = []
    if(theComment.length < MIN_INPUT_LENGTH && userName < MIN_INPUT_LENGTH){
        validationErrors.push("Error:: Comment must be at least "+MIN_INPUT_LENGTH+" characters!")
    }
    if(isNaN(blogId) && isNaN(userId)){
        validationErrors.push("Error:: CommentID not generated!")
    } 
    return validationErrors
}


const router = express.Router()

router.get("/", (req, res)=> {
    db.getAllComments((error, comments)=> {
        if(error){
            console.log(error)
            const model = { 
                dbErrorOccured: true
            }
            res.render("comments.hbs", model)
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
    res.render("createComment.hbs")
})


router.post("/create", (req, res)=> {

    const blogId = req.params.blog.id
    const userId = req.params.user.id
    const userName = req.params.user.name
    const theComment = req.body.theComment
    console.log(blogId)
    console.log(userId)
    console.log(userName)
    console.log(theComment)
    const errors = getCommentValidationErrors(blogId, userId, userName, theComment)

    if(0<errors.length){
        const model = {errors}
        res.render("createComment.hbs", model)
        return
    }else{
        db.createComment(blogId, userId, userName, theComment, (error, id)=>{
            if(error){
                console.log(error)
                const model = { 
                    dbErrorOccured: true
                }
                res.render("createComment.hbs", model)
            }else{
                res.redirect("/comments")
            }
        })
    }
})



router.get("/update/:id", (req, res)=> {
    const id = req.params.id

    db.getCommentById(id, (error, comment)=> {
        if(error){
            console.log(error)
            const model = { 
                dbErrorOccured: true
            }
            res.render("updateComment.hbs", model)
        }else{
            const model = {
                comment,
                dbErrorOccured: false
            }
            res.render("updateComment.hbs", model)
        }
    })
})


router.post("/update/:id", (req, res)=>{

    const id = req.params.id
    const blogId = req.params.blogId
    const userId = req.params.userId
    const userName = req.params.userName
    const newComment = req.body.theComment

    const errors = getCommentValidationErrors(blogId, userId, userName, newComment)

    if(0<errors.length){
        const model = {
            errors, 
            comment: {
                id,
                blogId,
                userId,
                userId,
                theComment: newComment
            }
        }
    res.render("updateComment.hbs", model)
    return
    }
    db.updateCommentById(blogId, userId, userName, newComment, id, (error)=>{
        if(error){
            console.log(error)
            const model = { 
                dbErrorOccured: true
            }
            res.render("updateComment.hbs", model)
        }else{
            res.redirect("/comments")
        }
    })
})


router.post("/remove/:id", (req, res)=> {

    const id = req.params.id

    if(!req.session.isLoggedIn){
        errors.push("Errors:: You must log in first!")
    }

    db.deleteCommentById(id, (error)=>{
        if(error){
            console.log(error)
            const model = { 
                dbErrorOccured: true
            }
            res.render("comment.hbs", model)
        }else{
            res.redirect("/comments")
        }
    })
})

router.get("/:id", (req, res)=>{

    const id = req.params.id
    db.getCommentById(id, (error, comment)=>{
        if(error){
            console.log(error)
            const model = { 
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
