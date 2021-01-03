class Vector{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
  add(otherVector){
    this.x += otherVector.x;
    this.y += otherVector.y;
  }
  limit(max){
    var actual = Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
    if(actual > max){
      this.x = this.x * max/actual;
      this.y = this.y * max/actual;
    }
  }
  dist(otherVector){
    return Math.sqrt( Math.pow( Math.abs(this.x - otherVector.x), 2) 
                    + Math.pow( Math.abs(this.y-otherVector.y), 2));
  }
  getAngle(){
    return Math.atan2(-this.x, this.y)
  }
  normalise(){
    this.limit(1);
  }
  divide(divisor){
    this.x = this.x/divisor;
    this.y = this.y/divisor;
  }
  subtract(otherVector){
    this.x -= otherVector.x;
    this.y -= otherVector.y;
  }
}