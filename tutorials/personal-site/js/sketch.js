let particles=[];let numParticles=70;
function setup(){let canvas=createCanvas(windowWidth,windowHeight);canvas.position(0,0);canvas.style('z-index','-1');canvas.style('position','fixed');for(let i=0;i<numParticles;i++)particles.push(new Particle());}
function draw(){background(252);for(let p of particles){p.update();p.display();p.connect(particles);}}
class Particle{
  constructor(){this.x=random(width);this.y=random(height);this.baseX=this.x;this.baseY=this.y;this.vx=random(-0.25,0.25);this.vy=random(-0.25,0.25);this.size=random(2,4);this.angle=random(TWO_PI);this.angleSpeed=random(0.01,0.025);this.amplitude=random(24,64);this.offset=random(1000);}
  update(){this.angle+=this.angleSpeed;this.baseX+=this.vx;this.baseY+=this.vy;this.x=this.baseX+sin(this.angle+this.offset)*this.amplitude;this.y=this.baseY+cos(this.angle*0.7+this.offset)*this.amplitude*.6;const pad=60;if(this.baseX<-pad)this.baseX=width+pad;if(this.baseX>width+pad)this.baseX=-pad;if(this.baseY<-pad)this.baseY=height+pad;if(this.baseY>height+pad)this.baseY=-pad;}
  display(){noStroke();fill(91,140,255,180);circle(this.x,this.y,this.size);}
  connect(ps){for(let o of ps){const d=dist(this.x,this.y,o.x,o.y);if(d<110&&d>0){stroke(120,130,145,map(d,0,110,60,0));strokeWeight(.7);line(this.x,this.y,o.x,o.y);}}}
}
function windowResized(){resizeCanvas(windowWidth,windowHeight);}
