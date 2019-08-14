const mongoose = require('mongoose');

let db_config = process.env.db_config;
db_config = db_config.trim();

const connection = mongoose.connect(db_config, { useNewUrlParser: true })
.then(console.log('Connected to MongoDB...'))
.catch(err => console.error("Couldn't connect to DB",err));

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomId: String,
    roomName: String,
    usersJoined: Array,
    allowedUsers: Array,
    messages: Array,
    createdDate: { type: Date, default: Date.now }
});

const userSchema = new Schema({
    userId: String,
    displayName: String,
    userName: String,
    password: String,
    createdDate: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    friendsList: Array,
    blockedList: Array
});

module.exports = { connection, roomSchema, userSchema };