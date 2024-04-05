var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
var [width, height] = [canvas.width, canvas.height]

function setup() {
}

function tick(now, elapsed) {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, width, height)
    ctx.strokeStyle = "black"
    ctx.font = "12px monospace"
    ctx.strokeText(`time: ${now}`,0, 10)
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

