class Pred {
  constructor(startPos, colour){
    var bodyLength = 10;
    this.body = [];
    for(var x = 0; x < bodyLength; x++){
      this.body.push(new Vector(startPos.x, startPos.y));
    }
    this.vel = new Vector(0,0);
    this.colour = colour;
    this.thinkTimer = Math.floor(Math.random()*10);
    this.number = preds.length;
    this.getTarget();
    this.maxSpeed = 1.4;
    
  }
  update(){
    var noise = new Vector(2*Math.random() - 1, 2*Math.random() -1);
    this.vel.limit(this.maxSpeed);

    this.thinkTimer = (this.thinkTimer + 1) % 8;
    if(this.thinkTimer == 0)
      this.getTarget();
    this.vel.add(this.getMove())
    this.body[0].add(this.vel)
    for(var x = 1; x < this.body.length; x++){
      this.pullTowards(this.body[x-1], this.body[x]);
    }
    this.body[0].add(this.getAvoidDirection());
    this.body[0].add(this.getAvoidBarriersDirection());
    this.checkBoids();
  }
  checkBoids(){
    for(var x = 0; x< boids.length; x++){
      var boid = boids[x];
      var dist = boid.pos.dist(this.body[0]);
      if(dist < 12){
        boids.splice(x, 1);
        this.grow();
        console.log('yum')
      }
        
    }
  }
  getMove(){
    var position = new Vector(this.target.x,this.target.y);
    var dist = position.dist(this.body[0])
    position.subtract(this.body[0]);
    position.divide(1/dist);
    position.normalise();
    position.divide(3);
    return position;
  }
  getAvoidDirection(){
    var sum = new Vector(0,0);
    for(var x = 0; x < preds.length; x++){
      var boid = preds[x];
      var dist = this.body[0].dist(boid.body[0]);
      if(dist > 0 && dist < crowdRadius*20){
        var position = new Vector(this.body[0].x,this.body[0].y);
        position.subtract(boid.body[0]);
        position.normalise();
        position.divide(dist);
        sum.add(position);
      }
    }
    sum.divide(1/4)
    return sum;
  }

  getAvoidBarriersDirection(){
    var sum = new Vector(0,0);
    for(var i = 0; i < barriers.length; i++){
      var barrier = barriers[i];
      var dist = this.body[0].dist(barrier.pos);
      if(dist < avoidRadius){

        var direction = new Vector(this.body[0].x, this.body[0].y);
        direction.subtract(barrier.pos);
        direction.divide(dist);
        direction.normalise();
        
        sum.add(direction);

      }
    }
    return sum;
  }

  pullTowards(infront, behind){
    var dist = infront.dist(behind);
    if(dist > 2){
      var x = new Vector(infront.x, infront.y);
      x.subtract(behind);
      x.limit(dist-5)
      behind.add(x);
    }
  }
  getTarget(){
    if(clusters.length > 0){
      clusters.sort(function(a,b){
       return b.length - a.length;
      });
      var targetNo = this.number;
      if(clusters.length-1 < this.number){
        targetNo = 0;
      }
      var biggestCluster = clusters[targetNo];
      var center = new Vector(0,0);
      for(var x = 0; x < biggestCluster.length; x++){
        var boid = biggestCluster[x];
        center.add(boid.pos);
      }
      center.divide(biggestCluster.length);
      this.target = center;
    } else {
      this.target = new Vector(Math.random() * totalWidth, Math.random() * totalHeight)
    }
  	
  }
  draw(){
    for(var x = 0; x < this.body.length; x++){
      this.drawCircle(this.body[x], 10/this.body.length * (this.body.length - x))
    }
    //this.drawCircle(this.target, 5)
  }
  drawCircle(pos, radius){
  	ctx.fillStyle = this.colour;
    ctx.translate(pos.x, pos.y);
    ctx.beginPath();
    ctx.arc(0, 0, radius ,0,2*Math.PI);
    ctx.fill();
    ctx.translate(-pos.x, -pos.y);
  }
  grow(){
    var lastPoint = this.body[this.body.length - 1]
    this.body.push(new Vector(lastPoint.x, lastPoint.y))
  }
}
//todo make more intelligent targetting