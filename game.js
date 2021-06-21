const canvas = document.getElementById('game')
const context = canvas.getContext('2d')

const drawRect = (x, y, w, h, color) => {
    context.fillStyle = color
    context.fillRect(x, y, w, h)
}

const drawCircleF = (x, y, r, color) => {
    context.fillStyle = color;
    context.beginPath()
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.closePath();
    context.fill()
}

const drawCircleS = (x, y, r, w, color) => {
    context.strokeStyle = color;
    context.lineWidth = w
    context.beginPath()
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.closePath();
    context.stroke()

}
const drawText = (text, x, y, color) => {
    context.fillStyle = color
    context.font = '50px sans-serif'
    context.fillText(text, x, y)

}

const user = {
    x: 20,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: '#fff',
    score: 0
}

const computer = {
    x: canvas.width - 30,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: '#fff',
    score: 0
}

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    r: 13,
    color: '#a51890',
    speed: 5,
    velocityX: 3,
    velocityY: 4,
    stop: true
}

const movePaddle = (e) => {
    let rect = canvas.getBoundingClientRect()
    user.y = e.clientY - rect.top - user.height / 2
    ball.stop = false
}

canvas.addEventListener('mousemove', movePaddle)

const collision = (b, p) => {
    b.top = b.y - b.r
    b.bottom = b.y + b.r
    b.left = b.x - b.r
    b.right = b.x + b.r

    p.top = p.y
    p.bottom = p.y + p.height
    p.left = p.x
    p.right = p.x + p.width

    return (b.top < p.bottom && b.bottom > p.top && b.left < p.right && b.right > p.left)
}


const resetBall = () => {
    ball.x = canvas.width / 2
    ball.y = canvas.height / 2

    ball.speed = 5
    ball.velocityX = 3
    ball.velocityY = 4
    ball.stop = true
}


const update = () => {
    if (!ball.stop) {

        ball.x += ball.velocityX
        ball.y += ball.velocityY
    }

    if (ball.y + ball.r > canvas.height || ball.y - ball.r < 0) {
        ball.velocityY = -ball.velocityY
    }

    let comLvl = 0.1
    computer.y += (ball.y - (computer.y + computer.height / 2)) * comLvl

    let player = (ball.x < canvas.width / 2) ? user : computer
    if (collision(ball, player)) {
        // ball.velocityX = -ball.velocityX
        let intersectY = ball.y - (player.y + player.height / 2)
        intersectY /= player.height / 2


        let maxBounceRate = Math.PI / 3
        let bounceAngel = intersectY * maxBounceRate

        let direction = (ball.x < canvas.width / 2) ? 1 : -1
        ball.velocityX = direction * ball.speed * Math.cos(bounceAngel)
        ball.velocityY = ball.speed * Math.sin(bounceAngel)

        ball.speed += 2
    }

    if (ball.x > canvas.width) {
        user.score++
        resetBall()
    } else if (ball.x < 0) {
        computer.score++
        resetBall()
    }
}

const render = () => {
    drawRect(0, 0, canvas.width, canvas.clientHeight, '#008374')
    drawRect(canvas.width / 2 - 2, 0, 4, canvas.height, '#fff')
    drawCircleF(canvas.width / 2, canvas.height / 2, 8, '#fff')
    drawCircleS(canvas.width / 2, canvas.height / 2, 50, 4, '#fff')
    drawText(user.score, canvas.width / 4, 100, '#fff')
    drawText(computer.score, 3 * canvas.width / 4, 100, '#fff')

    drawRect(user.x, user.y, user.width, user.height, user.color)
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color)
    drawCircleF(ball.x, ball.y, ball.r, ball.color)
}

const game = () => {
    update()
    render()
}

const fps = 50
setInterval(game, 1000 / fps)