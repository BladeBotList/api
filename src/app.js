class App {
    constructor() {
    this.init()
    this.startDB()
    this.startWS()
    }

    async init() {
        console.log("[ PHASE 1 ] Starting mandatory modules")
        try {
            global.cfg = require("../config")
            this.WebServer = require("./modules/WS")
        } catch (e) {
            console.log(`[ PHASE 1 ] Failed with error code: ${e.toString()}`)
        }
        console.log("[ PHASE 1 ] Finished.")
    }

    async startDB() {
        console.log("[ PHASE 2 ] Starting Database initialization")
        try {
            global.db = require("./modules/Database").r
        } catch (e) {
            console.log(`[ PHASE 2 ] Failed with error code: ${e.toString()}`)
        }
        console.log("[ PHASE 2 ] Finished.")
    }

    async startWS() {
        console.log("[ PHASE 3 ] Starting internal Webserver (WS)")
        try {
           global.ws = new this.WebServer()
        } catch (e) {
            console.log(`[ PHASE 3 ] Failed with error code: ${e.toString()}`)
        }
        console.log("[ PHASE 3 ] Finished.")
    }
}

new App()
