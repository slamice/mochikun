/* Al game logic goes here */

var game = {
	center : new Circle(0, 0, 0, '#AAA'),
	circles: [],
	lines: [],
	limit : 400, // limit to stretch to
	centerFill : '#C63'
};

Circle.prototype.draw = function (ctx) {
	"use strict";
	ctx.fillStyle = this.fill;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
};

var drawStretch = function (centerX, centerY, rX, rY, lX, lY, ctx, color){
	ctx.beginPath();
	ctx.moveTo(rX,rY);
	ctx.bezierCurveTo(rX,rY,(rX+centerX)/2.2,(rY+centerY)/2.2,centerX,centerY);
	ctx.moveTo(centerX,centerY);
	ctx.bezierCurveTo(centerX, centerY, (lX+centerX)/2.2,(lY+centerY)/2.2, lX,lY);
	ctx.lineTo(rX,rY);
	ctx.lineWidth   = 0.1;
	ctx.strokeStyle = color;
	ctx.fillStyle   = color;
  ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

Line.prototype.draw = function (ctx, circle, centerX, centerY, color) {

	var B = Math.sqrt(Math.pow(circle.x - centerX, 2) + 
								    Math.pow(circle.y - centerY, 2));

	var rx = circle.x + (circle.r*(centerY  - circle.y)/B);
  var ry = circle.y + (circle.r*(circle.x - centerX)/B);

	var lx = circle.x - (circle.r*(centerY  - circle.y)/B);
	var ly = circle.y - (circle.r*(circle.x - centerX)/B);
							
	drawStretch(centerX, centerY, rx, ry, lx, ly, ctx, color);
};

function clear (ctx) {
	ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
};

var drawCenter = function (canvas, ctx) {
	game.center = new Circle(canvas.width/2, canvas.height/2, 40, game.centerFill);
	game.center.draw(ctx);
};

function CanvasState (canvas) {
	this.canvas = canvas;
	this.ctx  = canvas.getContext("2d");
	this.width = canvas.width;
	this.height = canvas.height;	

	drawCenter(canvas, ctx);
	
 $("#myCanvas").live("vmousedown",function(e) {
		
		if(insideCircle(game.center, e)){ // inside center then drag it out
			// TODO And not in any other circle in the list
			// TODO If not pulled outside circle dont create a new one
			createCircle(ctx,e.offsetX, e.offsetY, game.centerFill);
			game.circles.push(circle);
		}

		for(i in game.circles){
			if(insideCircle(game.circles[i], e)){ // If in circle then it's the one to drag
				game.targetCircle = i; 
				break;
			}
		}
	});

	$("#myCanvas").live("vmousemove",function(e) {
	   if (game.targetCircle != undefined){
				circle = new Circle(ctx,e.offsetX,e.offsetY);
				circle.line = new Line(e.offsetX,e.offsetY);
				if(circle.line.dist(game.center.x, game.center.y,
													  circle.line.x, circle.line.y) < game.limit){
					game.circles[game.targetCircle] = createCircle(ctx,e.offsetX,e.offsetY, game.centerFill);
				}
			}
			
			var offset = $(canvas).offset();
			var x = e.pageX - offset.left;
			var y = e.pageY - offset.top;
			
	  // TODO if mouse intersects line play sound
		for(i in game.circles){
			if(game.circles[i].line.intersectStretch(game.center.x, game.center.y, 
																							 x, y, ctx)){
				document.getElementById('button').play();
			}
		}
	});

	$("#myCanvas").live("vmouseup",function(e) {
	  game.targetCircle = undefined;
	});
  
  setInterval(gameloop, 30);
};

function gameloop() {
	// get the reference of the canvas element and the drawing
  var canvas = document.getElementById('myCanvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  var ctx = canvas.getContext('2d');

  clear(ctx);

	drawCenter(canvas, ctx);

  for(i in game.circles) {
    var c = game.circles[i];
		createCircle(ctx,c.x,c.y, game.centerFill);
	}
			
};

var createCircle = function (ctx, x, y, color) {
	circle = new Circle(x, y, 20, color);
	circle.line = new Line(x, y);
	circle.draw(ctx);
	circle.line.draw(ctx, circle, game.center.x, game.center.y, game.centerFill);
	return circle;
};

CanvasState.prototype.draw = function() {
};

$(function(){
	var canvasState = CanvasState(document.getElementById('myCanvas'));
});


CanvasState.prototype.getMouse = function(e) {
	var offset = $(this).offset();
  var mouseX = e.pageX - offset.left;
  var mouseY = e.pageY - offset.top;
  return {x: mouseX, y: mouseY};
};