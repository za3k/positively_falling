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
    ctx.strokeText(`depth: ${now.toFixed(1)} meters`,0, 10)
}

function getLeftWall(d) { return Math.sin(d/3)/8+0.25 } // 0 t
function getRightWall(d) { return Math.sin(d/3)/8+0.75 }
function playerDead() { return !alive }
function drawWall(wallPos, d1, d2) {
    for (var pixel = 0; pixel<height; pixel++) {
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
function showLevelMagnets(d1, d2) {}
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
function showDepth() {}
function showGameOver() {}

function tick(now, elapsed) {
    var depth = now
    clear()
    if (playerDead()) {
        showGameOver()
        return
    }
    showDepth(depth)
    showLevelWalls(depth, depth+height/pixelsPerSecond)
    showLevelMagnets(depth, depth+height/pixelsPerSecond)
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

