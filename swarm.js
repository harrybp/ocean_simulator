//-----------------------------------------------------------------------------
//  Initialisation
init();

function init() {
  //Settings
  wrap = false;
  cohese = avoidOthers = avoidBarriers = avgDirection = true;
  frameLength = 15;
  mode = 'p'
  
  //Boid settings
  
  friendRadius = 60;
  crowdRadius = friendRadius / 2;
  avoidRadius = 20;
  wallAvoidRadius = 100;

  //Objects
  boids = [];
  barriers = [];
  preds = [];
  
  addCanvas();
  addXBoidsRandomly(80)
}

function addCanvas(){
  canvas = document.getElementById('canvas');
  console.log(canvas.scrollWidth);
  canvas.addEventListener("mousedown", getMouseDown);
  document.addEventListener('mouseup', getMouseUp)
  canvas.addEventListener('mousemove', getMouseMove)
  totalWidth = canvas.scrollWidth;
  totalHeight = window.innerHeight;
  canvas.width = totalWidth;
  canvas.height = totalHeight;
  canvas.style.height = totalHeight + 'px'
  ctx = canvas.getContext("2d");
}

//-----------------------------------------------------------------------------
//  Main loop

var maxFPS = 60;
var lastFrameTimeMs = delta = count = 0;
var timestep = 20;
function mainLoop(timestamp) {
  // Throttle the frame rate.    
  if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
      requestAnimationFrame(mainLoop);
      return;
  }
  count++;
  delta += timestamp - lastFrameTimeMs;
  lastFrameTimeMs = timestamp;
  while (delta >= timestep) {
    update();
    delta -= timestep;
  }
  draw();
  requestAnimationFrame(mainLoop);
}
requestAnimationFrame(mainLoop);

function update(){
  for(var x = 0; x < boids.length; x++){
    var boid = boids[x];
    boid.update();
  }
  if(count % 10 == 0)
    friendClustering();
  for(var x = 0; x < preds.length; x++){
    var predator = preds[x];
    predator.update();
  }
}

function draw(){
  ctx.clearRect(0,0,totalWidth,totalHeight);
  for(var x = 0; x < boids.length; x++){
    var boid = boids[x];
    boid.draw();
  }
  for(var x = 0; x < barriers.length; x++){
    var barrier = barriers[x];
    barrier.draw();
  }
  for(var x = 0; x < preds.length; x++){
    var predator = preds[x];
    predator.draw();
  }
}

//-----------------------------------------------------------------------------
//  Clustering

function friendClustering(){
  clusters = [];
  var boidCopy = boids.slice();

  //order by friend count and uncheck all
  boidCopy.sort(function(a,b){
    a.checked = false;
    b.checked = false;
    return b.friends.length - a.friends.length;
  });
  if(boids.length == 1)
    boids[0].checked = false;

  var prevColours = [];
  for(var x = 0; x< boidCopy.length; x++){
    var boid = boidCopy[x];
    var colour = boid.colour;
    if(prevColours.indexOf(colour) >= 0){
      colour = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    }
    prevColours.push(colour);
    if(!boid.checked){
      var cluster = [];
      colourFriends(boid, colour, cluster);
      clusters.push(cluster);
    }
  }
}

function colourFriends(boid, colour, cluster){
  boid.checked = true;
  boid.colour = colour;
  cluster.push(boid);
  for(var i = 0; i < boid.friends.length; i++){
    var friend = boid.friends[i];
    if(!friend.checked){
      colourFriends(friend, colour, cluster);
    }
  }
}

//-----------------------------------------------------------------------------
//  Settings & Controls

//Settings toggles
function toggleWrap() { wrap = !wrap; }
function toggleCohese() { cohese = !cohese; }
function toggleAvoidBoids() { avoidOthers = !avoidOthers; }
function toggleAvoidBarriers() { avoidBarriers = !avoidBarriers; }
function toggleAverageDirection() { avgDirection = !avgDirection; }
function clearAll() {
  console.log('d')
  boids = [];
  barriers = [];
}

//Mouse controls
var clicked = false;
function radios(type){ mode = type; }
function getMouseDown(event){ count = 22; clicked = true; getMouseMove(event); }
function getMouseUp(event){ clicked = false; }
function getMouseMove(event){
  if(count > 0 && clicked){
    var loc = getMousePos(canvas, event);
    switch(mode){
      case 'p': addBarrier(loc);
      break;
      case 'b': addBoid(loc);
      break;
      case 'e': erase(loc);
      break;
      case 'k': kill(loc);
      break;
      case 'w': if(count > 20) {
        addPredator(loc);
        count = 0;
      }
      break;
    }
    if(mode != 'w')
      count = 0;
  }
}
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return new Vector(evt.clientX - rect.left, evt.clientY - rect.top);
}
function addBoid(loc){
  boids.push(new Boid(loc, '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)));
}
function addBarrier(pos){
  barriers.push(new Barrier(pos));
}
function erase(pos){
  for(var x = 0; x < barriers.length; x++){
    var barrier = barriers[x];
    var dist = pos.dist(barrier.pos);
    if(dist < 20){
      barriers.splice(x, 1);
    }
  }
}
function kill(pos){
  for(var x = 0; x < boids.length; x++){
    var boid = boids[x];
    var dist = pos.dist(boid.pos);
    if(dist < 20){
      boids.splice(x, 1);
    }
  }
  for(var x = 0; x < preds.length; x++){
    var predator = preds[x];
    var dist = pos.dist(predator.body[0]);
    if(dist < 20){
      preds.splice(x, 1);
    }
  }
}
function addXBoidsRandomly(x){
  for(var i = 0; i < x; i++){
    addBoid(new Vector(Math.random() * totalWidth, Math.random() * totalHeight));
  }
}

function addPredator(pos){
  preds.push(new Pred(pos,'#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)));
}