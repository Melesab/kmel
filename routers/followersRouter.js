const express = require('express')
const db = require('../db')

const MIN_LENGTH = 5
const MIN_NAME_LENGTH = 2


function getFollowerValidationErrors(date, firstname, secondname, city, description){
    const validationErrors = []
    if(firstname.length < MIN_NAME_LENGTH && secondname.length < MIN_NAME_LENGTH){
        validationErrors.push("Error:: firstname and secondname must be at least "+MIN_NAME_LENGTH+" characters!")
    }
    if(city.length == 0){
        validationErrors.push("Error:: City can not be empty!")
    }
    if(description.length < MIN_LENGTH){
        validationErrors.push("Error:: Description must be atleast "+MIN_LENGTH+" characters!")
    }
    if(date.length != 10){
        validationErrors.push("Error:: Date must be YYYY-MM-DD!")
    } 
    return validationErrors
}

const router = express.Router()

router.get("/", (req, res)=> {
    db.getAllFollowers((error, followers)=> {
        if(error){
            console.log(error)
            const model = { 
                dbErrorOccured: true
            }
            res.render("followers.hbs", model)
        }else{
            const model = {
                followers,
                dbErrorOccured: false
            }
            res.render("followers.hbs", model)
        }
    })
})
router.get("/create", (req, res)=> {
    res.render("followerCreate.hbs")
})
router.post("/create", (req, res)=> {
    const date = req.body.date
    const firstname = req.body.firstname
    const secondname = req.body.secondname
    const city = req.body.city
    const description = req.body.description
    const errors = getFollowerValidationErrors(date, firstname, secondname, city, description)

    if(0<errors.length){
        const model = {errors}
        res.render("followerCreate.hbs", model)
        return
    }else{
        db.createFollower(date, firstname, secondname, city, description, (error, id)=>{
            if(error){
                const model = { 
                    dbErrorOccured: true
                }
                res.render("followerCreate.hbs", model)
            }else{
                res.redirect("/followers")
            }
        })
    }
})
router.get("/update/:id", (req, res)=> {
    const id = req.params.id
    if(!req.session.isLoggedIn){
        errors.push("Errors:: You must log in first!")
    }
    db.getFollowerById(id, (error, follower)=> {
        if(error){
            const model = { 
                dbErrorOccured: true
            }
            res.render("followerUpdate.hbs", model)
        }else{
            const model = {
                follower,
                dbErrorOccured: false
            }
            res.render("followerUpdate.hbs", model)
        }
    })
})
router.post("/update/:id", (req, res)=>{

    const id = req.params.id
    const newDate = req.body.date
    const newFirstname = req.body.firstname
    const newSecondname = req.body.secondname
    const newCity = req.body.city
    const newDescription = req.body.description
    const errors = getFollowerValidationErrors(newDate, newFirstname, newSecondname, newCity, newDescription)
    if(!req.session.isLoggedIn){
        errors.push("Errors:: You must log in first!")
    }
    if(0<errors.length){
        const model = {
            errors, 
            follower: {
                id,
                date: newDate,
                firstname: newFirstname,
                secondname: newSecondname,
                city: newCity,
                description: newDescription
            }
        }
    res.render("followerUpdate.hbs", model)
    return
    }
    db.updateFollowerById(newDate, newFirstname, newSecondname, newCity, newDescription, id, (error)=>{
        if(error){
            const model = { 
                dbErrorOccured: true
            }
            res.render("followerUpdate.hbs", model)
        }else{
            res.redirect("/followers")
        }
    })
})
router.post("/delete/:id", (req, res)=> {

    const id = req.params.id
    if(!req.session.isLoggedIn){
        errors.push("Errors:: You must log in first!")
    }
    db.deleteFollowerById(id, (error)=>{
        if(error){
            const model = { 
                dbErrorOccured: true
            }
            res.render("follower.hbs", model)
        }else{
            res.redirect("/followers")
        }
    })
})
router.get("/:id", (req, res)=>{

    const id = req.params.id
    db.getFollowerById(id, (error, follower)=>{
        if(error){
            const model = { 
                dbErrorOccured: true
            }
            res.render("follower.hbs", model)
        }else{
            const model = {
                follower,
                dbErrorOccured: false
            }
            res.render("follower.hbs", model)
        }
    })
})

module.exports = router
