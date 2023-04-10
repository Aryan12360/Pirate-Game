class CannonBall {
  constructor(x, y) {
    var options = {
      isStatic: true
    }

    this.radius = 20;

    this.body = Bodies.circle(x, y, this.radius, options);

    this.ballImg = loadImage("assets/cannonball.png");

    this.speed = 0.05;
    this.animation = [this.ballImg];
    this.isSink = false;

    World.add(world, this.body);

    this.trajectory = [];
  }

  animate() {
    this.speed += 0.05;
  }

  remove(c) {
    Matter.Body.setVelocity(this.body, {
      x: 0,
      y: 0
    });

    this.animation = waterSplashAnimation;

    this.speed = 0.05;

    this.radius = 120;

    this.isSink = true;

    setTimeout(() => {
      World.remove(world, this.body);
      delete balls[c];
    }, 1000);
  }

  shoot() {
    var newAngle = cannon.a - 30;
    newAngle = newAngle * (3.14 / 180);
    var velocity = p5.Vector.fromAngle(newAngle);
    velocity.mult(0.5);
    Matter.Body.setStatic(this.body, false);
    Matter.Body.setVelocity(this.body, {
      x: velocity.x * (180 / 3.14),
      y: velocity.y * (180 / 3.14)
    });
  }

  display() {
    var pos = this.body.position;
    var index = floor(this.speed % this.animation.length);

    push();
    imageMode(CENTER);
    image(this.animation[index], pos.x, pos.y, this.radius, this.radius);
    pop();

    if (this.body.velocity.x > 0 && this.body.position.x > 210) {
      var p = [pos.x, pos.y];
      this.trajectory.push(p);
    }

    for (var i = 0; i < this.trajectory.length; i++) {
      image(this.ballImg, this.trajectory[i][0], this.trajectory[i][1], 5, 5);
    }
    if (pos.y > 520) {
      this.trajectory = [];
    }
  }
}