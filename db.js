
const sqlite3 = require('sqlite3')

const db = new sqlite3.Database("my-database.db")


db.run(
    'CREATE TABLE IF NOT EXISTS Users ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER)'
)

db.run(
    'CREATE TABLE IF NOT EXISTS Blogs ( id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, title TEXT, blogEntry TEXT)'
)

exports.getAllUsers = function(callback) {

    const query = "SELECT * FROM users ORDER BY id"
    db.all(query, (error, users) => {
        callback(error, users)
    })
}

exports.getAllBlogs = function(callback) {

    const query = "SELECT * FROM blogs ORDER BY id"
    db.all(query, (error, blogs) => {
        callback(error, blogs)
    })
}

exports.createUser = function(name, age, callback) {

    const query = "INSERT INTO users (name, age) VALUES (?, ?)"
    const values = [name, age]
    db.run(query, values, (error) => {
        callback(error, this.lastID)
    })
}

exports.createBlog = function(date, title, blogEntry, callback) {

    const query = "INSERT INTO blogs (date, title, blogEntry) VALUES (?, ?, ?)"
    const values = [date, title, blogEntry]
    db.run(query, values, (error) => {
        callback(error, this.lastID)
    })
}

exports.getUserById = function(id, callback) {

    const query = "SELECT * FROM users WHERE id = ?"
    const values = [id]
    db.get(query, values, (error, user) => {
        callback(error, user)
    })
}

exports.getBlogById = function(id, callback) {

    const query = "SELECT * FROM blogs WHERE id = ?"
    const values = [id]
    db.get(query, values, (error, blog) => {
        callback(error, blog)
    })
}


exports.updateUserById = function(id, name, age, callback) {

    const query = "UPDATE users SET name = ?, age = ? WHERE id = ?"
    const values = [id, name, age]
    db.run(query, values, (error) => {
        callback(error)
    })
}

exports.updateBlogById = function(id, date, title, blogEntry, callback) {

    const query = "UPDATE blogs SET date = ?, title = ?, blogEntry = ? WHERE id = ?"
    const values = [id, date, title, blogEntry]
    db.run(query, values, (error) => {
        callback(error)
    })
}


exports.deleteUserById = function(id, callback) {

    const query = "DELETE FROM users WHERE id = ?"
    const values = [id]
    db.run(query, values, (error) => {
        callback(error)
    })
}


exports.deleteBlogById = function(id, callback) {

    const query = "DELETE FROM blogs WHERE id = ?"
    const values = [id]
    db.run(query, values, (error) => {
        callback(error)
    })
}

