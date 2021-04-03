const Express = require("express")
const Compress = require("compression")
const helmet = require("helmet");

class WS {
    constructor() {
        this.app = Express()
        this.run()
    }
    async run() {
        this.app.disable('x-powered-by');
        this.app.set("trust proxy", 1);
        this.app.use(Compress());
        this.app.set("port", global.cfg.webserver.port || process.env.PORT || 3000);
        this.app.use(helmet());
        this.app.use(Express.json());

        this.app.use(require("../routes/index"))

        this.app.use((req, res) => {
           return res.status(404).json({error:"Endpoint not found!"});
        });

        this.app.locals.domain = process.env.PROJECT_DOMAIN;


        console.log(`Webserver listening on port :: ${this.app.get("port")} ::`)
    }
}
module.exports = WS;
