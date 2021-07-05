const express = require('express')
const db = require('../db')

const USER_NAME_MIN_LENGTH = 2


function getUserValidationErrors(name, age){
    const validationErrors = []
    if(name.length < USER_NAME_MIN_LENGTH ){
        validationErrors.push("Error:: User name must be at least "+USER_NAME_MIN_LENGTH+" characters!")
    }
    if(isNaN(age)){
        validationErrors.push("Error:: Age must be a number!")
    } else if(age<0){
        validationErrors.push("Error:: Age must be 0 or greater!")
    }
    return validationErrors
}


const router = express.Router()

router.get("/", (req, res)=> {
    db.getAllUsers((error, users)=> {
        if(error){
            console.log(error)
            const model = { 
                dbErrorOccured: true
            }
            res.render("users.hbs", model)
        }else{
            const model = {
                users,
                dbErrorOccured: false
            }
            res.render("users.hbs", model)
        }
    })
})


router.get("/create", (req, res)=> {
    res.render("createUser.hbs")
})


router.post("/create", (req, res)=> {

    const name = req.body.name
    const age = parseInt(req.body.age)
    const errors = getUserValidationErrors(name, age)

    if(0<errors.length){
        const model = {errors}
        res.render("createUser.hbs", model)
        return
    }else{
        db.createUser(name, age, (error, id)=>{
            if(error){
                console.log(error)
                const model = { 
                    dbErrorOccured: true
                }
                res.render("createUser.hbs", model)
            }else{
                /*
                const model = {
                    users,
                    dbErrorOccured: false
                }
                res.redirect("/users/"+id, model) */
            res.redirect("/users")
            }
        })
    }
})



router.get("/update/:id", (req, res)=> {
    const id = req.params.id

    db.getUserById(id, (error, user)=> {
        if(error){
            console.log(error)
            const model = { 
                dbErrorOccured: true
            }
            res.render("updateUser.hbs", model)
        }else{
            const model = {
                user,
                dbErrorOccured: false
            }
            res.render("updateUser.hbs", model)
        }
    })
})


router.post("/update/:id", (req, res)=>{

    const id = req.params.id
    const newName = req.body.name
    const newAge = parseInt(req.body.age)

    const errors = getUserValidationErrors(newName, newAge)

    if(!req.session.isLoggedIn){
        errors.push("Errors:: You must log in first!")
    }
    if(0<errors.length){
        const model = {
            errors, 
            user: {
                id,
                name: newName,
                age: newAge
            }
        }
    res.render("updateUser.hbs", model)
    return
    }
    db.updateUserById(newName, newAge, id, (error)=>{
        if(error){
            console.log(error)
            const model = { 
                dbErrorOccured: true
            }
            res.render("updateUser.hbs", model)
        }else{
            /*
            const model = {
                user,
                dbErrorOccured: false
            }
            res.redirect("/users/"+id, model)  */
            res.redirect("/users")
        }
    })
})


router.post("/remove/:id", (req, res)=> {

    const id = req.params.id

    if(!req.session.isLoggedIn){
        errors.push("Errors:: You must log in first!")
    }

    db.deleteUserById(id, (error)=>{
        if(error){
            console.log(error)
            const model = { 
                dbErrorOccured: true
            }
            res.render("user.hbs", model)
        }else{
            /*
            const model = {
                user,
                dbErrorOccured: false
            }
            res.redirect("/users", model) */
            res.redirect("/users")
        }
    })
})

router.get("/:id", (req, res)=>{

    const id = req.params.id
    db.getUserById(id, (error, user)=>{
        if(error){
            console.log(error)
            const model = { 
                dbErrorOccured: true
            }
            res.render("user.hbs", model)
        }else{
            const model = {
                user,
                dbErrorOccured: false
            }
            res.render("user.hbs", model)
        }
    })
})


module.exports = router
