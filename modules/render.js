const fs = require("fs")
const GIFEncoder = require("gif-encoder-2")
const Canvas = require("node-canvas")
Canvas.registerFont("./FuturaBT-ExtraBlackCondensed.otf", {family: "Futura"})

let cache = new Map()

let width    = 498
let height   = 498
let delay    = 100

let offset   = 45
let octree   = false

exports.init = () => {
    return new Promise(async (resolve, reject) => {
        let frames = fs.readdirSync("./frames")
        for (let i = 0; i < frames.length; i++) {
            let frame = frames[i]
            let image = await Canvas.loadImage(`./frames/${frame}`)

            let c = Canvas.createCanvas(width, height)
            let ctx = c.getContext("2d")
            ctx.drawImage(image, 0, 0)
            cache.set(frame, c)
        }
        resolve()
    })
}

exports.meme = async (ip) => {
    const encoder = new GIFEncoder(width, height+offset, octree ? "octree" : undefined, true)
    encoder.setDelay(delay)
    encoder.start()

    let f = Canvas.createCanvas(width, height+offset)
    let frame = f.getContext("2d")

    for (let i = 0; i < cache.size; i++) {
        let img = cache.get(`${i}.png`)
        frame.drawImage(img, 0, offset)

        frame.fillStyle = "#ffffff"
        frame.fillRect(0, 0, f.width, offset)

        frame.fillStyle = "#000000"
        frame.font = "25px Futura Extra Black Condensed"
        frame.textAlign = "center"
        frame.fillText(ip, f.width/2, offset/2+8)

        encoder.addFrame(frame)
    }

    encoder.finish()
    return encoder.out.getData()
}