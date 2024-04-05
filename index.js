var canvas = document.getElementById("canvas")
canvas.width = 600
canvas.height = 600
var ctx = canvas.getContext("2d")
var [width, height] = [canvas.width, canvas.height]
var pixelsPerSecond = 10

// State
var x = 0.5
var alive = true
var polarity = true

function randomBool() { return Math.random() < 0.5 }

function xToPixels(x) {
    // (0, 1) to (0, width)
    return x*width
}

function setup() {
}

function clear() {
    ctx.fillStyle = "lightblue"
    ctx.fillRect(0, 0, width, height)
}
function showDepth(now) {
    ctx.strokeStyle = "black"
    ctx.font = "12px monospace"
    ctx.fillStyle="white"
    ctx.lineWidth = 1
    ctx.fillRect(0, height-20, 180, 20)
    ctx.strokeText(`depth: ${now.toFixed(1)} meters`,5, height-5)
}

function getLeftWall(d) { return Math.sin(d/3)/8+0.25 } // 0 t
function getRightWall(d) { return Math.sin(d/3)/8+0.75 }
var allMagnets = {}
function randomMagnet(depth) {
    return {
        depth: depth,
        side: randomBool(),
        polarity: randomBool()
    }
}
function nthMagnet(i, depth) {
    if (!allMagnets[i]) allMagnets[i] = randomMagnet(depth)
    return allMagnets[i]
}
function getMagnets(d1, d2) {
    var magnets = []
    var spacing = 10
    for (i=Math.ceil(d1/spacing); i<d2/spacing; i++) {
        magnets.push(nthMagnet(i, i*spacing));
    }
    return magnets
}
function playerDead() { return !alive }
function drawWall(wallPos, d1, d2) {
    for (var pixel=0; pixel<height; pixel++) {
        var percent = pixel / height
        var depth = d1 + (percent * (d2-d1))
        lx = xToPixels(wallPos(depth))
        ctx.lineTo(lx, pixel);
    }
}

function showLevelWalls(d1, d2) {
    ctx.fillStyle = "black"
    ctx.lineWidth = 4

    ctx.beginPath()
    ctx.moveTo(0, 0)
    drawWall(getLeftWall, d1, d2)
    ctx.lineTo(0, height)
    ctx.lineTo(0, 0)
    ctx.fill()

    ctx.beginPath()

    ctx.moveTo(width, 0)
    drawWall(getRightWall, d1, d2)
    ctx.lineTo(width, height)
    ctx.lineTo(width, 0)
    ctx.fill()
}
function drawMagnet(x, y, polarity) {
    console.log("showPlayer")
    if (polarity) {
        ctx.fillStyle="red";
    } else {
        ctx.fillStyle = "blue";
    }
    ctx.beginPath()
    ctx.arc(x, y, 10, 0, 2*Math.PI)
    ctx.fill()
}
function showLevelMagnets(d1, d2) {
    for (magnet of getMagnets(d1, d2)) {
        var percent = (magnet.depth - d1) / (d2-d1)
        var yPixels = height*percent
        var x = magnet.side ? getLeftWall(magnet.depth) : getRightWall(magnet.depth)
        var xPixels = xToPixels(x)
        drawMagnet(xPixels, yPixels, magnet.polarity)
    }
}
function showPlayer() {
    console.log("showPlayer")
    if (polarity) {
        ctx.fillStyle="red";
    } else {
        ctx.fillStyle = "blue";
    }
    ctx.beginPath()
    ctx.arc(xToPixels(x), 50, 20, 0, 2*Math.PI)
    ctx.fill()
}
function playerCollides() { return false }
function showGameOver() {}

function tick(now, elapsed) {
    var depth = now
    clear()
    if (playerDead()) {
        showGameOver()
        return
    }
    showLevelWalls(depth, depth+height/pixelsPerSecond)
    showLevelMagnets(depth, depth+height/pixelsPerSecond)
    showDepth(depth)
    showPlayer(x)
    if (playerCollides(x)) alive=false
}

function time() { return new Date().getTime() }

window.addEventListener("load", () => {
    setup()
    var startTime = time()
    var lastTick = startTime
    setInterval(() => {
        var now = time()
        var elapsed = now - lastTick
        lastTick = now
        tick((now-startTime)/1000, elapsed/1000)
    }, 20)
})

var spacePressed = false;
document.addEventListener("keydown", (e) => {
    if (e.key == " ") {
        if (!spacePressed && alive) polarity = !polarity // Toggle polarity
        spacePressed = true
    }
})
document.addEventListener("keyup", (e) => {
    if (e.key == " ") spacePressed = false
})
