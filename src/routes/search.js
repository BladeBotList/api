const express = require('express');
const router = express.Router();
const db = require("../modules/Database").r

router.get('/', async (req, res) => {
    return res.json({ok: "search page!" });
});


router.get('/recommendations', async (req, res) => {
// recommendations will work with points attributed to each bots
    let bots = await db.table("bots")

    let stats = await db.table("stats")

    let pts = await bots.map(b => {
    return {
        'id': b.id,
        'points':0,
        'votes': b.votes,
        'invites': stats.filter(s => s.id === b.id)[0] ? stats.filter(s => s.id === b.id)[0].invitations||0 : 0,
        'visits': stats.filter(s => s.id === b.id)[0] ? stats.filter(s => s.id === b.id)[0].visits||0 : 0,
        'certified': Boolean(b.certified),
        'promoted': Boolean(b.promoted)
    }})

    let luckyBots = await rItemArray(pts, 10) // 10 lucky bots

    // giving to random bots point to help them even if they don't have much votes

    for(let i1=0; i1 < luckyBots.length;i1++) {
        let b = luckyBots[i1]
        let index = pts.indexOf(b)
        pts[index].points++ // +1 point completely free
    }


    // giving away 1 point to 10 bots with the most of votes
    let bwvotes = pts.sort((a, b) => {
        if(a.votes === Infinity) {
            return 1;
        }
        if(a.votes === Infinity) {
            return -1;
        }

        return a - b
    })

    bwvotes = bwvotes.slice(0, 9) // 10 first bots

    for(let i1=0; i1 < bwvotes.length;i1++) {
        let b = bwvotes[i1]
        let bpts = pts.filter(pb => pb.id === b.id)
        if(!bpts) continue;

        bpts.points = bpts.points++ // +1 point for votes
    }


    //giving away 2 points to bots with the best invites/views ratio
    let ratiobots = pts.map(b => {
        let ratio = b.invites/b.visits // must returns a number between 0 and 1 (if it's more that's suspect)
        return {
            'ratio':ratio,
            'id': b.id
        }
    })

    ratiobots = ratiobots.sort((a, b) => a - b)

    ratiobots = ratiobots.slice(0, 9)

    for(let iii=0; iii < ratiobots.length;iii++) {
        let b = ratiobots[iii]
        let ptsb = pts.filter(pb => pb.id === b.id)[0]
        if(!ptsb) continue;
        ptsb.points = ptsb.points+2 // +2 point for ratio
        console.log(pts.filter(pb => pb.id === b.id)[0])
    }






    return res.json({ok: "search page!", recommended: pts.sort((a,b) => { return a - b}) });
});


module.exports = router;


async function rItemArray(array = [], nbItems = 1) {
    let items = []
    for(let i = 0; i < nbItems; i++) {
        items.push(array[Math.floor(Math.random() * array.length)])
    }
    return items
}
