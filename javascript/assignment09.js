//runs when PhoneGap is ready
document.addEventListener("deviceready", onDeviceReady, false);

//runs JQuery ready function once page is loaded
$(document).ready(onPageLoad);

//global values related to HTML 5 Canvases
var MazeLayer;		//HTML5 global canvas ojbect
var MarbleLayer;	//HTML5 global canvas ojbect
var Canvas01;		//ID link to HTML5 canvas 01
var Canvas02;		//ID link to HTML5 canvas 02

//global values related to the maze and marble images
var MazeImg;		//Maze Image object
var MarbleImg;		//Marble Image object

//global values related to the PhoneGap Accelerometer
var watchID;		//acceleration watch object ID
var xPosition;		//X position of marble
var yPosition;		//Y position of marble

//global value that tracks the current game level
var gameLevel;

//Deals with iOS 7 Statusbar and hides the splashbar after 5000 milliseconds.
function onDeviceReady()
{
	//Fix IOS 7+ Statusbar issues
	StatusBar.overlaysWebView(false);
}

function onPageLoad()
{
	//set up HTML5 Canvases for 2D drawing
	Canvas01 = document.getElementById("mazeCanvas");
	MazeLayer = Canvas01.getContext("2d");
	Canvas02 = document.getElementById("marbleCanvas");
	MarbleLayer = Canvas02.getContext("2d");

	//create marble image object in JavaScript
	MarbleImg = new Image();
	MarbleImg.src = "image/marble.png";
	
	//create maze image object in JavaScript
	MazeImg = new Image();
	
	//set game level to start
	gameLevel = 1;
	
	MazeImg.onload = function()	{ MazeLayer.drawImage(MazeImg, 0, 0); }
}

function startGame()
{	
	if (gameLevel === 1)
	{
		alert("YO!Complete this level to race on!");
		MazeImg.src = ""; //required for Webkit browsers to reload cached images
		MazeImg.src = "image/maze-1.png";
		//draw marble in the upper-left corner of the maze in the first white square
		xPosition = 2;
		yPosition = 2;	
	} 
	else if (gameLevel === 2)
	{
		alert("You completed level 01. Now on to Level 02!");
		MazeImg.src = ""; //required for Webkit browsers to reload cached images
		MazeImg.src = "image/maze-2.png";
		xPosition = 182;
		yPosition = 2;
	} 
	else if (gameLevel === 3)
	{
		endGame();
		alert("You've completed the game!");	
	}
	
	//draw maze across entire maze layer
	MazeLayer.drawImage(MazeImg, 0, 0);
	
	//draw marble at center of marble layer
	MarbleLayer.drawImage(MarbleImg, xPosition, yPosition);
		
	//Start watching acceleration, frequency in milliseconds (40-1000 range on IOS)
	var myOptions = {frequency:40};
	watchID = navigator.accelerometer.watchAcceleration(accelSuccess, accelError, myOptions);
}

function endGame()
{
	//if there is a watchID, stop watching the accelerometer
	if (watchID) 
	{
    	navigator.accelerometer.clearWatch(watchID);
        watchID = null;
	}
	
	//clear canvases
	MarbleLayer.clearRect(0, 0, Canvas01.width, Canvas01.height);
	MazeLayer.clearRect(0, 0, Canvas02.width, Canvas02.height);
}

function accelSuccess(acceleration)
{
	var pixel;
	var maxPixels;
	var accelPixels;
	var newX = xPosition;
	var newY = yPosition;
	
	if(acceleration.x > 1.5)	//moving left
	{
		accelPixels = Math.floor(Math.abs(acceleration.x * 2.0));
		maxPixels = maxPixelMove("left");
		
		if(maxPixels === 0)
		{
			pixel = MazeLayer.getImageData(xPosition - 2, yPosition + 8, 1, 1);
			if(isGreen(pixel) && gameLevel != 2)
			{
				endGame();
				gameLevel++;
				startGame();
				return;
			}
			else if(isBlue(pixel))
			{
				if (gameLevel === 1 && yPosition >= 20)
				{				
					newX = 272;
					newY = 272;
				}
				else if (gameLevel === 2 && yPosition >= 92)
				{
					newX = 264;
					newY = 470;	
				}
				else if (gameLevel === 2 && yPosition >= 20)
				{
					newX = 56;
					newY = 236;	
				}
			}
		}
		else if (accelPixels > 0 && accelPixels <= maxPixels)
		{
			newX = xPosition - accelPixels;
		}
		else
		{
			newX = xPosition - maxPixels;
		}
	}
	else if(acceleration.x < -1.5)		//moving right
	{
		accelPixels = Math.floor(Math.abs(acceleration.x * 2.0));
		maxPixels = maxPixelMove("right");
		
		if(maxPixels === 0)
		{
			pixel = MazeLayer.getImageData(xPosition + 18, yPosition + 8, 1, 1);
			if(isGreen(pixel))
			{
				endGame();
				gameLevel++;
				startGame();
				return;
			}
			else if(isBlue(pixel))
			{
				if (gameLevel === 1 && yPosition >= 20)
				{				
					newX = 272;
					newY = 272;
				}
				else if (gameLevel === 2 && yPosition >= 92)
				{
					newX = 264;
					newY = 470;	
				}
				else if (gameLevel === 2 && yPosition >= 20)
				{
					newX = 56;
					newY = 236;	
				}
			}
		}
		else if (accelPixels > 0 && accelPixels <= maxPixels)
		{
			newX = xPosition + accelPixels;
		}
		else
		{
			newX = xPosition + maxPixels;
		}
	}
	else if(acceleration.y < -1.5)		//moving up
	{
		accelPixels = Math.floor(Math.abs(acceleration.y * 2.0));
		maxPixels = maxPixelMove("up");
		
		if(maxPixels === 0)
		{
			pixel = MazeLayer.getImageData(xPosition + 8, yPosition - 2, 1, 1);
			if(isGreen(pixel))
			{
				endGame();
				gameLevel++;
				startGame();
				return;
			}
			else if(isBlue(pixel))
			{
				if (gameLevel === 1 && yPosition >= 20)
				{				
					newX = 272;
					newY = 272;
				}
				else if (gameLevel === 2 && yPosition >= 92)
				{
					newX = 264;
					newY = 470;	
				}
				else if (gameLevel === 2 && yPosition >= 20)
				{
					newX = 56;
					newY = 236;	
				}
			}
		}
		else if (accelPixels > 0 && accelPixels <= maxPixels)
		{
			newY = yPosition - accelPixels;
		}
		else
		{
			newY = yPosition - maxPixels;
		}
	}
	else if(acceleration.y > 1.5)		//moving down
	{
		accelPixels = Math.floor(Math.abs(acceleration.y * 2.0));
		maxPixels = maxPixelMove("down");
		
		if(maxPixels === 0)
		{
			pixel = MazeLayer.getImageData(xPosition + 8, yPosition + 18, 1, 1);
			if(isGreen(pixel))
			{
				endGame();
				gameLevel++;
				startGame();
				return;
			}
			else if(isBlue(pixel))
			{
				if (gameLevel === 1 && yPosition >= 20)
				{				
					newX = 272;
					newY = 272;
				}
				else if (gameLevel === 2 && yPosition >= 92)
				{
					newX = 264;
					newY = 470;	
				}
				else if (gameLevel === 2 && yPosition >= 20)
				{
					newX = 56;
					newY = 236;	
				}
			}
		}
		else if (accelPixels > 0 && accelPixels <= maxPixels)
		{
			newY = yPosition + accelPixels;
		}
		else
		{
			newY = yPosition + maxPixels;
		}
	}
	
	//clear marble layer, and draw marble at new position
	MarbleLayer.clearRect(0, 0, Canvas01.width, Canvas01.height);
	MarbleLayer.drawImage(MarbleImg, newX, newY);
	
	//store new position of marble for next time
	xPosition = newX;
	yPosition = newY;
		
}

function accelError()
{
	alert("Sorry, the accelerometer on this device is not available, game will not function.");
}

function maxPixelMove(direction)
{
	direction = direction.trim().toLowerCase();
	var testPixels;
	var xPosCopy = xPosition;
	var yPosCopy = yPosition;
	var numPixels = 0;
	var quitLoop = false;
	
	if(direction === "up")
	{
		xPosCopy += 0;
		yPosCopy += 0;
		while(quitLoop === false)
		{
			yPosCopy--;
			testPixels = MazeLayer.getImageData(xPosCopy, yPosCopy, 17, 1);
			if(isWhiteOrYellow(testPixels))
			{
				numPixels++;
			}
			else
			{
				quitLoop = true;
			}
		}
	}
	else if(direction === "down") 
	{
		xPosCopy += 0;
		yPosCopy += 16;
		while(quitLoop === false)
		{
			yPosCopy++;
			testPixels = MazeLayer.getImageData(xPosCopy, yPosCopy, 17, 1);
			if(isWhiteOrYellow(testPixels))
			{
				numPixels++;
			}
			else
			{
				quitLoop = true;
			}
		}
	}
	else if(direction === "left")
	{
		xPosCopy += 0;
		yPosCopy += 0;
		while(quitLoop === false)
		{
			xPosCopy--;
			testPixels = MazeLayer.getImageData(xPosCopy, yPosCopy, 1, 17);
			if(isWhiteOrYellow(testPixels))
			{
				numPixels++;
			}
			else
			{
				quitLoop = true;
			}
		}
	}
	else if(direction === "right")
	{
		xPosCopy += 16;
		yPosCopy += 0;
		while(quitLoop === false)
		{
			xPosCopy++;
			testPixels = MazeLayer.getImageData(xPosCopy, yPosCopy, 1, 17);
			if(isWhiteOrYellow(testPixels))
			{
				numPixels++;
			}
			else
			{
				quitLoop = true;
			}
		}
	}
	
	//dont move on yellow pixel!
	
	if (numPixels > 0) 
	{
		return numPixels - 1;	
	}
	else
	{
		return 0;	
	}
}


//RGB COLOR FUNCTIONS
//PLACE FUNCTIONS BELOW THAT CHECK INDIVIDUAL COLORS
//THERE ARE 6,777,216 POSSIBLE RGB COLORS...


function isWhiteOrYellow(testPixels)
{
	//Each pixel has 4 items in the data array,
	//red, green, blue, and alpha.
	//Alpha transparency is ignored.
	var items = testPixels.data.length - 4;
	var red;
	var green;
	var blue;
	var i;
	
	for(i = 0; i < items; i += 4)
	{	
		red = testPixels.data[i];
		green = testPixels.data[i + 1];
		blue = testPixels.data[i + 2];
		
		if(red >= 240)
		{
			red = 255;
		}
		
		if(red <= 25)
		{
			red = 0;
		}
		
		if(green >= 240)
		{
			green = 255;
		}
		
		if(green <= 25)
		{
			green = 0;
		}
		
		if(blue >= 240)
		{
			blue = 255;
		}
		
		if(blue <= 25)
		{
			blue = 0;
		}		
		
		if(red !== 255 || green !== 255 || blue !== 0 && blue !== 255)
		{
			return false;
		}
	}
	
	return true;
}

function isGreen(testPixel)
{
	//Each pixel has 4 items in the data array,
	//red, green, blue, and alpha.
	//Alpha transparency is ignored.
	var red = testPixel.data[0];
	var green = testPixel.data[1];
	var blue = testPixel.data[2];
	
	if(red >= 240)
	{
		red = 255;
	}
	
	if(red <= 25)
	{
		red = 0;
	}
	
	if(green >= 240)
	{
		green = 255;
	}
	
	if(green <= 25)
	{
		green = 0;
	}
	
	if(blue >= 240)
	{
		blue = 255;
	}
	
	if(blue <= 25)
	{
		blue = 0;
	}
	
	if(red === 0 && green === 255 && blue === 0)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function isBlue(testPixel)
{
	//Each pixel has 4 items in the data array,
	//red, green, blue, and alpha.
	//Alpha transparency is ignored.
	var red = testPixel.data[0];
	var green = testPixel.data[1];
	var blue = testPixel.data[2];
	
	if(red >= 240)
	{
		red = 255;
	}
	
	if(red <= 25)
	{
		red = 0;
	}
	
	if(green >= 240)
	{
		green = 255;
	}
	
	if(green <= 25)
	{
		green = 0;
	}
	
	if(blue >= 240)
	{
		blue = 255;
	}
	
	if(blue <= 25)
	{
		blue = 0;
	}
	
	if(red === 0 && green === 0 && blue === 255)
	{
		return true;
	}
	else
	{
		return false;
	}
}