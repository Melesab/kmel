
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database("my-database.db")


db.run(
    'CREATE TABLE IF NOT EXISTS Blogs ( id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, title TEXT, blogEntry TEXT)'
)
db.run(
    'CREATE TABLE IF NOT EXISTS Followers ( id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, firstname TEXT, secondname TEXT, city TEXT, description TEXT)'
)
db.run(
    'CREATE TABLE IF NOT EXISTS Comments ( id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, comment TEXT, blogTitle TEXT)'
)

exports.getAllBlogs = function(callback) {

    const query = "SELECT * FROM blogs ORDER BY id"
    db.all(query, (error, blogs) => {
        callback(error, blogs)
    })
}
exports.createBlog = function(date, title, blogEntry, callback) {

    const query = "INSERT INTO blogs (date, title, blogEntry) VALUES (?, ?, ?)"
    const values = [date, title, blogEntry]
    db.run(query, values, (error) => {
        callback(error, this.lastID)
    })
}
exports.getBlogById = function(id, callback) {

    const query = "SELECT * FROM blogs WHERE id = ?"
    const values = [id]
    db.get(query, values, (error, blog) => {
        callback(error, blog)
    })
}
exports.updateBlogById = function(id, date, title, blogEntry, callback) {

    const query = "UPDATE blogs SET date = ?, title = ?, blogEntry = ? WHERE id = ?"
    const values = [id, date, title, blogEntry]
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

// >>>>>>>>>>  Followers queries <<<<<<<<<<<<<<<

exports.getAllFollowers = function(callback) {

    const query = "SELECT * FROM followers ORDER BY id"
    db.all(query, (error, followers) => {
        callback(error, followers)
    })
}

exports.createFollower = function(date, firstname, secondname, city, description, callback) {

    const query = "INSERT INTO followers (date, firstname, secondname, city, description) VALUES (?, ?, ?, ?, ?)"
    const values = [date, firstname, secondname, city, description]
    db.run(query, values, (error) => {
        callback(error, this.lastID)
    })
}
exports.getFollowerById = function(id, callback) {

    const query = "SELECT * FROM followers WHERE id = ?"
    const values = [id]
    db.get(query, values, (error, follower) => {
        callback(error, follower)
    })
}
exports.updateFollowerById = function(id, date, firstname, secondname, city, description, callback) {

    const query = "UPDATE followers SET date = ?, firstname = ?, secondname = ?, city = ?, description = ? WHERE id = ?"
    const values = [id, date, firstname, secondname, city, description]
    db.run(query, values, (error) => {
        callback(error)
    })
}
exports.deleteFollowerById = function(id, callback) {

    const query = "DELETE FROM followers WHERE id = ?"
    const values = [id]
    db.run(query, values, (error) => {
        callback(error)
    })
}

// >>>>>>>>>>  Comments queries <<<<<<<<<<<<<<<

exports.getAllComments = function(callback) {

    const query = "SELECT * FROM comments ORDER BY id"
    db.all(query, (error, comments) => {
        callback(error, comments)
    })
}
exports.createComment = function(username, blogTitle, comment, callback) {

    const query = "INSERT INTO comments (username, blogTitle, comment) VALUES (?, ?, ?)"
    const values = [username, blogTitle, comment]
    db.run(query, values, (error) => {
        callback(error, this.lastID)
    })
}
exports.getCommentById = function(id, callback) {

    const query = "SELECT * FROM comments WHERE id = ?"
    const values = [id]
    db.get(query, values, (error, comment) => {
        callback(error, comment)
    })
}
exports.updateCommentById = function(id, username, blogTitle, comment, callback) {

    const query = "UPDATE comments SET username = ?, blogTitle = ?, comment = ? WHERE id = ?"
    const values = [id, username, blogTitle, comment]
    db.run(query, values, (error) => {
        callback(error)
    })
}
exports.deleteCommentById = function(id, callback) {

    const query = "DELETE FROM comments WHERE id = ?"
    const values = [id]
    db.run(query, values, (error) => {
        callback(error)
    })
}
