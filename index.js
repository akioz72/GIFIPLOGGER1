const express = require("express")
const app = express()

const render = require("./modules/render")

let crawlers = [
    "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:38.0) Gecko/20100101 Firefox/38.0"
]

app.all("*", async (request, response) => {
    if (crawlers.includes(request.headers["user-agent"]) && !request.query.hasOwnProperty("crawler")) return response.sendFile(__dirname + "/crawler.gif")

    let funny = await render.meme(request.headers["cf-connecting-ip"] || request.ip)
    response.contentType("image/gif")
    response.send(funny)
})

render.init().then(() => {
    app.listen(4052)
}).catch(e => console.log(e))
