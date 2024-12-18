import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { getConnInfo } from 'hono/cloudflare-workers'

const app = new Hono();

app.use('/static/*', serveStatic({ root: './public' }));

app.get('/',async (c) => {
  const name = 'firework';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>${name}</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <style>
          body {
          height: 100%;
          width: 100%;
          padding: 0;
          margin: 0;
          background-image: url('https://imagenes.elpais.com/resizer/v2/2DHJ4HXONFDR7OY2EGKOQMSWMI.jpg?auth=ce7481eb3658be32046f294bcc9366a4118c542a0984464c216f7f0a5385bb2e&width=1960&height=1470&smart=true');
          background-repeat:no-repeat;
          background-position: center center;
          -webkit-background-size: cover;
          -moz-background-size: cover;
          -o-background-size: cover;
          background-size: cover;
      }

      canvas {
          display: block;
      }
		.marquee {
            overflow: hidden;
            white-space: nowrap;
        }
        .inner-marquee {
            animation: marquee 15s linear infinite;
			color: #F08080;
        }
        @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
        </style>
    </head>
    <body>
		<div class="inner-marquee">
            💖 ❤️‍🔥 💟 💗 ♡<3💕 
        </div>
		<div class="inner-marquee">
            ﮩـﮩﮩ٨ـ♡ﮩ٨ـﮩﮩ٨ـ ♡ ₍ ᐢ..ᐢ ₎ ♡
        </div>
		<div class="inner-marquee">
            ♥‿♥ 💘 (*＞ω＜*)♡
        </div>
        <canvas id="canvas"></canvas>
		<script>
       const marquee = document.querySelector('.inner-marquee');
        marquee.addEventListener('click', () => {
            marquee.style.animationDuration = '3s';
        });
    </script>
        <script>
        window.requestAnimFrame = ( function() {
	return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function( callback ) {
					window.setTimeout( callback, 1000 / 60 );
				};
})();

var canvas = document.getElementById( 'canvas' ),
		ctx = canvas.getContext( '2d' ),
		cw = window.innerWidth,
		ch = window.innerHeight,
		fireworks = [],
		particles = [],
		hue = 120,
		limiterTotal = 20,
		limiterTick = 0,
		timerTotal = 500,
		timerTick = 0,
		mousedown = false,
		mx,
		my;

canvas.width = cw;
canvas.height = ch;

function random( min, max ) {
	return Math.random() * ( max - min ) + min;
}

function calculateDistance( p1x, p1y, p2x, p2y ) {
	var xDistance = p1x - p2x,
			yDistance = p1y - p2y;
	return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
}

function Firework( sx, sy, tx, ty ) {
	this.x = sx;
	this.y = sy;
	this.sx = sx;
	this.sy = sy;
	this.tx = tx;
	this.ty = ty;
	this.distanceToTarget = calculateDistance( sx, sy, tx, ty );
	this.distanceTraveled = 0;
	this.coordinates = [];
	this.coordinateCount = 3;
	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	this.angle = Math.atan2( ty - sy, tx - sx );
	this.speed = 2;
	this.acceleration = 1.05;
	this.brightness = random( 50, 70 );
	this.targetRadius = 1;
}

Firework.prototype.update = function( index ) {
	this.coordinates.pop();
	this.coordinates.unshift( [ this.x, this.y ] );
	if( this.targetRadius < 8 ) {
		this.targetRadius += 0.3;
	} else {
		this.targetRadius = 1;
	}
	this.speed *= this.acceleration;
	
	var vx = Math.cos( this.angle ) * this.speed,
			vy = Math.sin( this.angle ) * this.speed;
	this.distanceTraveled = calculateDistance( this.sx, this.sy, this.x + vx, this.y + vy );
	
	if( this.distanceTraveled >= this.distanceToTarget ) {
		createParticles( this.tx, this.ty );
		fireworks.splice( index, 1 );
	} else {
		this.x += vx;
		this.y += vy;
	}
}

Firework.prototype.draw = function() {
	ctx.beginPath();
	ctx.moveTo( this.coordinates[ this.coordinates.length - 1][ 0 ], this.coordinates[ this.coordinates.length - 1][ 1 ] );
	ctx.lineTo( this.x, this.y );
	ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc( this.tx, this.ty, this.targetRadius, 0, Math.PI * 2 );
	ctx.stroke();
}

function Particle( x, y ) {
	this.x = x;
	this.y = y;
	this.coordinates = [];
	this.coordinateCount = 5;

	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	this.angle = random( 0, Math.PI * 2 );
	this.speed = random( 1, 10 );
	this.friction = 0.95;
	this.gravity = 0.6;
	this.hue = random( hue - 20, hue + 20 );
	this.brightness = random( 50, 80 );
	this.alpha = 1;
	this.decay = random( 0.0075, 0.009 );
}

Particle.prototype.update = function( index ) {
	this.coordinates.pop();
	this.coordinates.unshift( [ this.x, this.y ] );
	this.speed *= this.friction;
	this.x += Math.cos( this.angle ) * this.speed;
	this.y += Math.sin( this.angle ) * this.speed + this.gravity;
	this.alpha -= this.decay;
	if( this.alpha <= this.decay ) {
		particles.splice( index, 1 );
	}
}

Particle.prototype.draw = function() {
	ctx. beginPath();
	ctx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
	ctx.lineTo( this.x, this.y );
	ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';

	ctx.stroke();
}

function createParticles( x, y ) {
	var particleCount = 20;
	while( particleCount-- ) {
		particles.push( new Particle( x, y ) );
	}
}

function loop() {
	requestAnimFrame( loop );
	hue += 0.5;
	ctx.globalCompositeOperation = 'destination-out';
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fillRect( 0, 0, cw, ch );
	ctx.globalCompositeOperation = 'lighter';
	var i = fireworks.length;
	while( i-- ) {
		fireworks[ i ].draw();
		fireworks[ i ].update( i );
	}
	
	var i = particles.length;
	while( i-- ) {
		particles[ i ].draw();
		particles[ i ].update( i );

	}

	if( timerTick >= timerTotal ) {
		timerTick = 0;
	} else {
		var temp = timerTick % 400;
		if(temp <= 15){		
			fireworks.push( new Firework( 100, ch, random( 190, 200 ), random(90, 100) ));
			fireworks.push( new Firework( cw - 100, ch, random(cw - 200, cw - 190), random(90, 100) ));
		}

		var temp3 = temp / 10;

		if(temp > 319){
			fireworks.push(new Firework(300 + (temp3 - 31 ) * 100 , ch, 300 + (temp3 - 31) * 100 , 200));
		}

		timerTick++;
	}
	
	if( limiterTick >= limiterTotal ) {
		if( mousedown ) {
			fireworks.push( new Firework( cw / 2, ch, mx, my ) );
			limiterTick = 0;
		}
	} else {
		limiterTick++;
	}
}

canvas.addEventListener( 'mousemove', function( e ) {
	mx = e.pageX - canvas.offsetLeft;
	my = e.pageY - canvas.offsetTop;
});

canvas.addEventListener( 'mousedown', function( e ) {
	e.preventDefault();
	mousedown = true;
});

canvas.addEventListener( 'mouseup', function( e ) {
	e.preventDefault();
	mousedown = false;
});

window.onload = loop;
        </script>
    </body>
    </html>
  `;
  const info = getConnInfo(c)
  const ipAddress = info.remote.address; // Adjust for your platform
  console.log(`Incoming request from IP: ${ipAddress}`);
  return c.html(html);
});

export default { 
  port: process.env.PORT || 3000, 
  fetch: app.fetch, 
} 
