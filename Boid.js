class Boid {
  constructor(startPos, colour){
    this.pos = startPos;
    this.vel = new Vector(0,0);
    this.friends = [];
    this.thinkTimer = Math.floor(Math.random()*10);
    this.angle = this.vel.getAngle();
    this.smoothAmount = 25*Math.PI/180
    this.colour = (colour)? colour : '#019474';
    this.maxSpeed = 2.1;
  }

  update() {
    this.thinkTimer = (this.thinkTimer + 1) % 5;
    if(wrap)
      this.wrap();
    if(this.thinkTimer == 0)
      this.getFriends();
    this.flock();
    this.pos.add(this.vel)

  }

  getFriends(){
    var nearby = [];
    for(var x = 0; x < boids.length; x++){
      var boid = boids[x];
      if(this.pos.dist(boid.pos) < friendRadius){
        nearby.push(boid);
      }
    }
    this.friends = nearby;
  }

  flock() {
    var noise = new Vector(2*Math.random() - 1, 2*Math.random() -1);
    //noise.divide(2)
    this.vel.add(noise);
    this.vel.limit(this.maxSpeed);
    if(avgDirection)
      this.vel.add(this.getAverageDirection())
    if(avoidOthers)
      this.vel.add(this.getAvoidDirection())
    if(cohese)
      this.vel.add(this.getCoheseDirection())
    if(avoidBarriers)
      this.vel.add(this.getAvoidBarriersDirection())
    if(!wrap)
      this.vel.add(this.getAvoidEdgeDirection())
    this.vel.add(this.getAvoidPredsDirection());
  }

  wrap(){
    this.pos.x = (this.pos.x + totalWidth) % totalWidth;
    this.pos.y = (this.pos.y + totalHeight) % totalHeight;
  }

  getAverageDirection(){
    var sum = new Vector(0,0);
    for(var x = 0; x<this.friends.length; x++){
      var boid = this.friends[x];
      var dist = this.pos.dist(boid.pos);
      if(dist > 0){
        var direction = new Vector(boid.vel.x,boid.vel.y);
        direction.normalise();
        direction.divide(dist);
        sum.add(direction);
      }
    }
    return sum;
  }

  getAvoidDirection(){
    var sum = new Vector(0,0);
    for(var x = 0; x<this.friends.length; x++){
      var boid = this.friends[x];
      var dist = this.pos.dist(boid.pos);
      if(dist > 0 && dist < crowdRadius){
        var position = new Vector(this.pos.x,this.pos.y);
        position.subtract(boid.pos);
        position.normalise();
        position.divide(dist);
        sum.add(position);
      }
    }
    return sum;
  }

  getCoheseDirection(){
    var sum = new Vector(0,0);
    var count = 0;
    for(var x = 0; x<this.friends.length; x++){
      var boid = this.friends[x];
      var dist = this.pos.dist(boid.pos);
      if(dist > 0){
        sum.add(boid.pos);
        count++;
      }
    }
    if(count > 0){
      sum.divide(count);
      sum.subtract(this.pos);
      sum.limit(0.2)
      return sum;
    } else {
      return new Vector(0,0)
    }
  }

  getAvoidBarriersDirection(){
    var sum = new Vector(0,0);
    for(var i = 0; i < barriers.length; i++){
      var barrier = barriers[i];
      var dist = this.pos.dist(barrier.pos);
      if(dist < avoidRadius){

        var direction = new Vector(this.pos.x, this.pos.y);
        direction.subtract(barrier.pos);
        direction.divide(dist);
        direction.normalise();
        
        sum.add(direction);

      }
    }
    return sum;
  }

  getAvoidPredsDirection(){
    var sum = new Vector(0,0);
    for(var i = 0; i < preds.length; i++){
      var predator = preds[i];
      var dist = this.pos.dist(predator.body[0]);
      if(dist < avoidRadius*3){

        var direction = new Vector(this.pos.x, this.pos.y);
        direction.subtract(predator.body[0]);
        direction.divide(dist);
        direction.normalise();
        
        sum.add(direction);

      }
    }
    sum.divide(3)
    return sum;
  }

  getAvoidEdgeDirection(){
    if(this.pos.x < 0){
      this.pos.x = 0;
    } else if(this.pos.x > totalWidth){
      this.pos.x = totalWidth;
    }
    if(this.pos.y < 0){
      this.pos.y = 0;
    } else if(this.pos.y > totalHeight){
      this.pos.y = totalHeight;
    }
    var sum = new Vector(0,0);
    var dist = 1;
    if(this.pos.x < wallAvoidRadius){
      sum.add(new Vector(1,0))
      dist = this.pos.x;
    } else if(this.pos.x > totalWidth-wallAvoidRadius){
      sum.add(new Vector(-1,0));
      dist = totalWidth - this.pos.x;
    }
    if(this.pos.y < wallAvoidRadius){
      sum.add(new Vector(0,1))
      dist = this.pos.y;
    } else if(this.pos.y > totalHeight-wallAvoidRadius){
      sum.add(new Vector(0,-1));
      dist = totalHeight- this.pos.y;
    }
    //console.log(dist)
    dist = dist / 4;
    if(dist > 0)
      sum.divide(dist)

    return sum;

  }

  draw(){
    var angle = this.vel.getAngle();
    if(this.angle < angle){
      if(this.angle + this.smoothAmount < angle)
        this.angle += this.smoothAmount;
      else 
        this.angle = angle;
    } else if(this.angle > angle) {
       if(this.angle - this.smoothAmount > angle)
        this.angle -= this.smoothAmount;
      else 
        this.angle = angle;
    }
    ctx.fillStyle = this.colour;
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.arc(0, 0, 5 ,0,Math.PI);
    ctx.lineTo(0,-12);
    ctx.fill();
    ctx.rotate(-this.angle)
    ctx.translate(-this.pos.x, -this.pos.y);
  }
}