const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;

var engine, world;

var tower, towerImg, ground, backgroundImg, cannon;
var angle;

var cannonball;
var balls = [];
var boats = [];

var boatAnimation = [];
var brokenBoatAnimation = [];
var waterSplashAnimation = [];

var boatSS, boatSD;
var brokenBoatSS, brokenBoatSD;
var waterSplashSS, waterSplashSD;

var bgMusic, cannonW, cannonEX, PL;

var isLaughing = false;
var isGameOver = false;

var score = 0;


function preload() {
  towerImg = loadImage("assets/tower.png");
  backgroundImg = loadImage("assets/background.gif");

  boatSS = loadImage("assets/boat/boat.png");
  boatSD = loadJSON("assets/boat/boat.json");

  brokenBoatSS = loadImage("assets/boat/broken_boat.png");
  brokenBoatSD = loadJSON("assets/boat/broken_boat.json");

  waterSplashSS = loadImage("assets/water_splash/water_splash.png");
  waterSplashSD = loadJSON("assets/water_splash/water_splash.json");

  bgMusic = loadSound("assets/background_music.mp3");
  cannonW = loadSound("assets/cannon_water.mp3");
  cannonEX = loadSound("assets/cannon_explosion.mp3");
  PL = loadSound("assets/pirate_laugh.mp3");
}

function setup() {
  canvas = createCanvas(1200, 600);

  engine = Engine.create();
  world = engine.world;

  ground = Bodies.rectangle(600, 599, 1200, 1, {
    isStatic: true
  });
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, {
    isStatic: true
  });
  World.add(world, tower);

  angleMode(DEGREES);
  angle = 15;

  cannon = new Cannon(180, 115, 130, 100, angle);

  var boatFrames = boatSD.frames;
  for (var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = boatSS.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }

  var brokenBoatFrames = brokenBoatSD.frames;
  for (var i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSS.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }

  var waterSplashFrames = waterSplashSD.frames;
  for (var i = 0; i < waterSplashFrames.length; i++) {
    var pos = waterSplashFrames[i].position;
    var img = waterSplashSS.get(pos.x, pos.y, pos.w, pos.h);
    waterSplashAnimation.push(img);
  }

  rectMode(CENTER);
  ellipseMode(RADIUS);
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);
  Engine.update(engine);

  if (!bgMusic.isPlaying()) {
    bgMusic.play();
    bgMusic.setVolume(0.5);
  }

  push();
  imageMode(CENTER);
  image(towerImg, tower.position.x, tower.position.y, 160, 310);
  pop();

  showBoats();
  cannon.display();

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    collide(i);
  }

  textSize(40);
  fill("black");
  text(`Score: ${score}`, 900, 100);
}

function showCannonBalls(ball, i) {
  if (ball) {
    ball.display();
    ball.animate();
    if (ball.body.position.x >= width || ball.body.position.y >= height - 30) {
      ball.remove(i);
      cannonW.play();
    }
  }
}

function collide(i) {
  for (var c = 0; c < boats.length; c++) { // boats
    if (boats[c] != undefined && balls[i] != undefined) {
      var collision = Matter.SAT.collides(boats[c].body, balls[i].body);
      if (collision.collided) {
        score = score + 10;
        boats[c].remove(c);
        balls[i].remove(i);
      }
    }
  }
}

function keyPressed() {
  if (keyCode === 32) {
    cannonball = new CannonBall(cannon.x, cannon.y);
    balls.push(cannonball);
  }
}

function keyReleased() {
  if (keyCode === 32) {
    balls[balls.length - 1].shoot();
    cannonEX.play();
  }
}

function showBoats() {
  if (boats.length > 0) {
    if (boats[boats.length - 1] == undefined || boats[boats.length - 1].body.position.x < width - 250) {
      var p = [-70, -60, -40, -20];
      var pRandom = random(p);
      var boat = new Boat(1200, height - 60, 200, 200, pRandom, boatAnimation);
      boats.push(boat);
    }

    for (var i = 0; i < boats.length; i++) {
      if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body, {
          x: -0.9,
          y: 0
        });
        boats[i].display();
        boats[i].animate();

        var c = Matter.SAT.collides(this.tower, boats[i].body);

        if (c.collided && !boats[i].isBroken) {
          if(!isLaughing && !PL.isPlaying()){
            PL.play();
            isLaughing = true;
          }
          isGameOver = true;
          gameOver();
        }
      } else {
        boats[i];
      }
    }

  } else {
    var boat = new Boat(1200, height - 60, 200, 200, -60, boatAnimation);
    boats.push(boat);
  }
}

function gameOver() {
  swal({
    title: `GAME OVER`,
    text: `Try Again`,
    imageUrl: `https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png`,
    imageSize: `150x150`,
    confirmButtonText: `Play Again`
  }, (isConfirm) => {
    if(isConfirm){
      location.reload();
    }
  })
}