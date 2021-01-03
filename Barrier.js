class Barrier {
  constructor(pos){
    this.pos = pos;
  }
  draw(){
    ctx.fillStyle = '#FF0000'
    ctx.translate(this.pos.x, this.pos.y);
    ctx.beginPath();
    ctx.arc(0, 0, 5 ,0,2*Math.PI);
    ctx.fill();
    ctx.translate(-this.pos.x, -this.pos.y);
  }
}