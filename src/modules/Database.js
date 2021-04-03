const rethinkDB = require("rethinkdbdash")
const cfg = require("../../config")

module.exports.r = rethinkDB({
    db: cfg.database.db||"BladeBotList",
    host: cfg.database.host||"localhost",
    user: cfg.database.user||"root",
    password: cfg.database.password||"password12345",
    port: cfg.database.port||"28015"
})
