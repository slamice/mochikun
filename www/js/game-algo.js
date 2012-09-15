// Contains all of the game algorithms

var Line = function (x, y) {
	"use strict";
// Thickness
	this.x = x;
	this.y = y;
};

var Circle = function (x, y, r, fill) {
	"use strict";
	this.x = x  || 0;
	this.y = y  || 0;
	this.r = r  || 0;
	this.fill = fill  || '#AAA';
	this.line = new Line(x, y);
};

var insideCircle = function(circ, e){
	x = e.offsetX; y = e.offsetY;
	if(Math.pow(x - circ.x,2) + Math.pow(y - circ.y,2) < Math.pow(circ.r,2)){
		return true;
	}
	return false;
};

Line.prototype.dist = function (centerX, centerY, x, y) {	
	return Math.sqrt(Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2));
};



/* find the line intersection with the mouse
	 mX, mY: mouseX and mouseY
*/
Line.prototype.intersectStretch = function (centerX, centerY, mX, mY, ctx) {
	"use strict";

	var x1 = this.x;
	var y1 = this.y;
	var slope = (centerY-y1)/(centerX-x1);
	var answer = (centerX - mX)*slope - (centerY-mY);
	
	/* four quadrants relative to center */
	/* lower right */
	if(mY > centerY && mX > centerX)
	{
		return answer < 10 && answer > -10 &&
		 			 mY < y1     && mX < x1;		
	}

	/* upper right */
	if(mY < centerY && mX > centerX)
	{
		return answer < 10 && answer > -10 &&
		 			 mY > y1     && mX < x1;		
	}
	

	/* upper left */	
	if(mY < centerY && mX < centerX)
	{
		return answer < 10 && answer > -10 &&
		 			 mY > y1     && mX > x1;		
	}
	
	/* lower left */
	if(mY > centerY && mX < centerX)
	{
		return answer < 10 && answer > -10 &&
		 			 mY < y1     && mX > x1;		
	}

};