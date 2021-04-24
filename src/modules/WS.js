const Express = require("express")
const helmet = require("helmet");

class WS {
    constructor(db) {
        this.app = Express()
        this.db = db
        this.run()
    }
    async run() {
        this.app.disable('x-powered-by');
        this.app.set("trust proxy", 1);
        this.app.set("port", global.cfg.webserver.port || process.env.PORT || 3000);
        this.app.use(helmet());
        this.app.use(Express.json());

        this.app.use(require("../routes/index"))

        this.app.use((req, res) => {
           return res.status(404).json({error:"Endpoint not found!"});
        });

        this.app.locals.domain = process.env.PROJECT_DOMAIN;

        this.app.listen(this.app.get("port"), () => {
            console.log(`Webserver listening on port :: ${this.app.get("port")} ::`)
        })


    }
}
module.exports = WS;
