const mongoose = require('mongoose');

let db_config = process.env.db_config;
db_config = db_config.trim();

const connection = mongoose.connect(db_config, { useNewUrlParser: true })
.then(console.log('Connected to MongoDB...'))
.catch(err => console.error("Couldn't connect to DB",err));

module.exports = connection;