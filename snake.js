const screenSize = 600;
const cellSize = 20;

var snake;
var food;

var screen = {
    canvas : document.createElement("canvas"),
    directions : [],
    start : function() {
        this.canvas.width = screenSize;
        this.canvas.height = screenSize;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGame, 140)
        window.addEventListener("keydown", this.onKeyDown.bind(this), false)
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    onKeyDown : function(event) {
        if (event.key === "a") { this.directions.unshift("left") }
        if (event.key === "d") { this.directions.unshift("right") }
        if (event.key === "w") { this.directions.unshift("up") }
        if (event.key === "s") { this.directions.unshift("down") }
    }
}


function startGame() {
    screen.start();
    snake = new Snake(screen.context)
    food = new Food(screen.context)
}


function updateGame() {
    screen.clear();
    food.draw();
    if (screen.directions.length > 0) { snake.setDirection(screen.directions.pop()) }
    snake.move();
    snake.draw();
    if (checkCollision(snake.head.x, snake.head.y, snake.segmentSize, food.x, food.y, food.size)) {
        snake.extend()
        food.refresh()
    }
    if (checkWallCollision() || checkSelfCollision()) {
        clearInterval(screen.interval)
    }
}


function checkCollision(x1, y1, size1, x2, y2, size2){
    if (x1 + size1 <= x2 || x1 >= x2 + size2 || y1 >= y2 + size2 || y1 + size1 <= y2){
        return false
    }else{
        return true
    }
}

function checkSelfCollision() {
    for (i = 1; i < snake.segments.length; i++) {
        if (checkCollision(snake.head.x, snake.head.y, snake.segmentSize, snake.segments[i].x, snake.segments[i].y, snake.segmentSize)) {
            return true
        }
    }
}

function checkWallCollision() {
    if (snake.head.x < 0 || snake.head.x >= screenSize || snake.head.y < 0 || snake.head.y >= screenSize) {
        return true
    }
}


class Food {
    constructor(screenContext) {
        this.color = "#F76B4A"
        this.size = cellSize;
        this.ctx = screenContext;
        this.x = 0
        this.y = 0
        this.refresh();
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    refresh() {
        let max = ((screenSize - this.size) / this.size) + 1
        this.x = this.size * (Math.floor(Math.random() * max));
        this.y = this.size * (Math.floor(Math.random() * max));
    }
}


class Snake {
    constructor(screenContext) {
        this.segments = [];
        this.segmentSize = cellSize;
        this.color = "#FFD369";
        this.ctx = screenContext;
        this.createSegment(280, 280);
        this.createSegment(260, 280);
        this.createSegment(240, 280);
        this.head = this.segments[0];
        this.direction = "right"
        this.draw();
    }
    createSegment(x_pos, y_pos) {
        let segment = {
            x: x_pos,
            y: y_pos
        }
        this.segments.push(segment);
    }
    extend() {
        this.createSegment(this.segments[this.segments.length - 1].x, this.segments[this.segments.length - 1].y);
    }
    draw() {
        for (let segmentCoord of this.segments) {
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(segmentCoord.x, segmentCoord.y, this.segmentSize, this.segmentSize);
        };
    }
    move() {
        var new_x;
        var new_y;
        for (let seg_num = this.segments.length - 1; seg_num > 0; seg_num--) {
            new_x = this.segments[seg_num - 1].x;
            new_y = this.segments[seg_num - 1].y;
            this.segments[seg_num].x = new_x;
            this.segments[seg_num].y = new_y;
        }
        this.head = this.segments[0];
        this.getDirection();      
    }
    setDirection(heading) {
        switch(heading) {
            case "left":
                if (this.direction === "up" || this.direction === "down") {
                    this.direction = heading
                }
                break;
            case "right":
                if (this.direction === "up" || this.direction === "down") {
                    this.direction = heading
                }
                break;
            case "up":
                if (this.direction === "left" || this.direction === "right") {
                    this.direction = heading
                }
                break;
            case "down":
                if (this.direction === "left" || this.direction === "right") {
                    this.direction = heading
                }
                break;
            default:
                break;
        }
    }
    getDirection() {
        switch(this.direction) {
            case "left":
                return this.head.x -= this.segmentSize
            case "right":
                return this.head.x += this.segmentSize
            case "up":
                return this.head.y -= this.segmentSize
            case "down":
                return this.head.y += this.segmentSize
            default:
                break;
        }
    }
}