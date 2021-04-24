const express = require('express');
const router = express.Router();
const db = require("../modules/Database").r

router.get('/', async (req, res) => {
  //  let bots = await db.table("bots")
    return res.json({ok: "bots page!" });
});

router.get('/:botID', async (req, res) => {
    const id = req.params.botID;
    let bot = await db.table("bots").get(id || "undefined")
    if (!bot)
        return res.status(404).json({
            error: 'This bot is not in our database please check later'
        });

    return res.json({
        name: bot.name || "unfetchable",
        id: id || "unfetchable",
        avatar: bot.avatar || "unfetchable",
        prefix: bot.prefix || "unfetchable",
        library: bot.library || "unfetchable",
        owner: bot.owner || "unfetchable",
        ownerid: bot.ownerid || "unfetchable",
        short_desc: bot.short_desc || "unfetchable",
        long_desc: "private",
        tags: bot.tags || "unfetchable",
        support: bot.support || undefined,
        website: bot.website || undefined,
        github: bot.github || undefined,
        donate: bot.donate || undefined,
        privacy: bot.privacy || undefined,
        twitter: bot.twitter || undefined,
        servers: bot.servercount || null,
        shards: bot.shardcount || null,
        status: bot.status || 'waiting',
        votes: bot.votes || 0,
        certified: Boolean(bot.certified),
    });
})

router.get("/:botID/votes/:userID", async(req, res) => {
    const id = req.params.botID;
    const userr = req.params.userID;

    let b = await db.table("bots").get(id)

    if (!b)
        return res.json({error: 'Invalid bot ID or not specified!'});

    let v = await db.r.table("votes").get(`${id}-${userr}`)

    return res.json({
        voted: Boolean(v),
        votes: b.votes || 0,
    });
})

router.get("/:botID/votes", async(req, res) => {
    const id = req.params.botID;
    const userr = req.params.userID;

    let b = await db.table("bots").get(id)

    if (!b)
        return res.json({error: 'Invalid bot ID or not specified!'});

    return res.json({
        votes: b.votes || 0,
    });
})

router.post("/:botID/stats", async (req, res) => {
    const id = req.params.botID;
    let bot = await req.db.r.table("bots").get(id || "undefined")

    if (!bot) return res.status(403).json({error: 'Invalid bot ID or not specified!'});

    let key = await req.db.r.table("keys").get(id)

    if (!key) return res.status(404).json({error: 'Invalid API authorization in headers!'});

    const token = req.headers.authorization || req.headers.key || req.headers.token;
    if (!token) return res.status(400).json({error: 'Invalid API authorization in headers!'});

    if (key.key !== token) return res.status(403).json({error: 'Invalid API authorization in headers!'});

    const amount = req.body.count || req.body.servercount || req.body.server_count || req.body.guild_count;

    const shards = req.body.shardcount || req.body.shard_count || req.body.shards_count || req.body.shardscount || req.body.shards;

    const servercount = Math.round(amount);
    const shardcount = Math.round(shards);

    let data = {
        servercount: servercount, // mandatory
        lastpost: Date.now() // Rate limit :soon:
    }

    if (!servercount) return res.status(400).json({error: 'No server_count defined in body!'});

    if (isNaN(servercount) || servercount <= 0) {
        return res.status(400).json({
            error: 'servercount is not a valid number!',
        });
    }
    if (!bot.certified && servercount > 1000000) return res.status(400).json({
        error: 'Oops your bot has too much servers please become certified to continue to post servers!',
    });


    if (shardcount) {

        if (isNaN(shardcount) || shardcount <= 0) return res.status(400).json({error: 'shardcount is not a valid number!'});
        if (!bot.certified && shardcount > 100) // for limit crazy guys
        {
            return res.status(400).json({
                error: 'Oops your bot has too much shard! please become certified to can continue to post your servers.',
            });
        }

        data.shardcount = shardcount
    }

    res.status(200).json({
        ok: `Successfully posted ${servercount} servers for the bot ${bot.name} and (if defined) shards!`
    });


    await req.db.r.table("bots").get(bot.id).update(data)
})


module.exports = router;
