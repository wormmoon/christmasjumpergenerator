var canvas, ctx;
var width, height;
var colourScheme;
var row, column;
var jumperWidth = 89; //in stitches
var jumperHeight = 70; //in stitches
var xScale = 11;
var yScale = 10;

function init() {
	//  CANVAS STUFF  //
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	//  SET UP METRICS  //
	metrics();

	//  CHOOSE COLOUR SCHEME  //
	colourScheme = genColourScheme();

	//  FILL BG  //
	drawBG();

	// 	// BOTTOM ROW OF STITCHES // not working???????
	// var bottomRow = genBottomRow();
	// drawBottomRow(bottomRow, xScale * 5, yScale * 68);

	// TOP PATTERN BLOCK // moved up here as it makes the origin points right
	var patternTop = choosePattern();
	drawPattern(patternTop, xScale * 5, yScale * 3);

	// BOTTOM PATTERN BLOCK //
	var patternBottom = choosePattern();
	drawPattern(patternBottom, xScale * 5, yScale * 52);



	// MESSAGE //
	var message = chooseMessage();

	drawMessageLine1(message[0], xScale * 5, yScale * 17);

	drawMessageLine1(message[1], xScale * 5, yScale * 39);

	// MIDDLE PATTERN //
	var midPattern = genMidPattern1();
	drawMidPattern(midPattern, xScale * 5, yScale * 31);



	// SIDEBARS //
	var sidebarLeft = genSidebar(5);
	drawSidebar(sidebarLeft, 0, 0);

	var sidebarRight = genSidebar(5);
	drawSidebar(sidebarRight, xScale * 84, 0);
	// HEADER //
	var headerBlock = genHeaderBlock();
	drawBothHeaders(headerBlock);





	genPattern2();




}









//-------------------------------------------------------------
//  BACKGROUND
//-------------------------------------------------------------

function drawBG() {
	ctx.fillStyle = `${colourScheme[0]}`;
	ctx.fillRect(0, 0, width, height);
}




//-------------------------------------------------------------
//  KNIT STITCH
//-------------------------------------------------------------

function KnitStitch(x, y, colour) {
	this.x = x;
	this.y = y;
	this.colour = colour;
}

KnitStitch.prototype.draw = function() {
	ctx.fillStyle = `${this.colour}`;
	//these can go back to fixed values
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(3, 3);
	ctx.lineTo(5, 7);
	ctx.lineTo(7, 3);
	ctx.lineTo(10, 0);
	ctx.lineTo(10, 5);
	ctx.lineTo(5, 14);
	ctx.lineTo(0, 5);
	ctx.lineTo(0, 0);
	ctx.fill();
}




//-------------------------------------------------------------
//  COLOUR SCHEME
//-------------------------------------------------------------

function genColourScheme() {
	var bg, stitch, cont;
	var i = Math.round(Math.random() * 3);

	if (i === 1) {
		bg = "#000";
		stitch = "#616161";
		cont = "#fff";
	} else if (i === 2) {
		bg = "#386527";
		stitch = "#66BE46";
		cont = "#fff";
	} else {
		bg = "#711212";
		stitch = "#CC2020";
		cont = "#fff";
	};

	return [bg, stitch, cont];
}




//-------------------------------------------------------------
//  SIDEBARS
//-------------------------------------------------------------


function genSidebar(width) {
	//like genRow but the colour will change 
	//width must be odd
	var row;
	var rows = [];
	var whiteStitch = new KnitStitch(0, 0, `${colourScheme[2]}`);
	var colourStitch = new KnitStitch(0, 0, `${colourScheme[1]}`);
	var counter = 1;
	for (var i = 0; i < jumperHeight; i++) {
		row = [];
		if (counter % 2 == 0) {
			row.push(colourStitch);
			for (var j = 0; j < width - 3; j++) {
				row.push(whiteStitch);
				row.push(colourStitch);
				} 
			} else {
				row.push(whiteStitch);
				for (var k = 0; k < width - 3; k++) {
					row.push(colourStitch);
					row.push(whiteStitch);
				}
			}

			rows.push(row);
			counter++;
		}

		return rows;
}

function drawSidebar(sidebar, originX, originY) {
	ctx.save();
	ctx.translate(originX, originY);
	for (var y = 0; y < sidebar.length; y++) {
		for (var x = 0; x < sidebar[y].length; x++) {
			ctx.save();
			ctx.translate(x * xScale, y * yScale);
			sidebar[y][x].draw();
			ctx.restore();
		}
	}
	ctx.restore();
}




//-------------------------------------------------------------
//  HEADER/FOOTER
//-------------------------------------------------------------

function genHeaderBlock() {
	var border, row1, row2, row3;
	var block = [];
	var whiteStitch = new KnitStitch(0, 0, `${colourScheme[2]}`);
	var colourStitch = new KnitStitch(0, 0, `${colourScheme[1]}`);

	border = [whiteStitch, whiteStitch, whiteStitch, whiteStitch];

	row1 = [];
	row1.push(colourStitch);
	row1.push(whiteStitch);
	row1.push(colourStitch);
	row1.push(colourStitch);

	row2 = [];
	row2.push(whiteStitch);
	row2.push(colourStitch);
	row2.push(whiteStitch);
	row2.push(colourStitch);

	row3 = [];
	row3.push(colourStitch);
	row3.push(colourStitch);
	row3.push(colourStitch);
	row3.push(whiteStitch);


	block = [border, row1, row2, row3];


	return block;
}

function drawHeader(header, originX, originY) {
	ctx.save();
	ctx.translate(originX, originY);
	for (var y = 0; y < header.length; y++) {
		for (var x = 0; x < header[y].length; x++) {
			ctx.save();
			ctx.translate(x * xScale, y * yScale);
			header[y][x].draw();
			ctx.restore();
		}
	}
	ctx.restore();
}

function drawBothHeaders(headerBlock) {
	for (var i = 0; i < (jumperWidth - 10) / 4; i++) {
		ctx.save();
		drawHeader(headerBlock, 55, -10);
		drawHeader(headerBlock, 55, 660);
		ctx.translate(44, 0);
	}
	ctx.restore();
}




//-------------------------------------------------------------
//  TOP & BOTTOM PATTERN ROW
//-------------------------------------------------------------

function choosePattern() {
	var pattern;
	var num = Math.floor(Math.random() * 2) + 1;

	if (num === 1) {
		pattern = genPattern1();
	} else if (num === 2) {
		pattern = genPattern2();
	} else {
		pattern = genPattern3();
	}

	return pattern;
}



//  SELBU ROSE PATTERN //

function genPattern1() {
	var whiteStitch = new KnitStitch(0, 0, `${colourScheme[1]}`);
	var colourStitch = new KnitStitch(0, 0, `${colourScheme[2]}`);
	var borderTop, row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11, row12, row13;

	borderTop = [];
	for (var i = 0; i < 79; i++) {
		borderTop.push(colourStitch);
	}
	row1 = [whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch];
	row2 = [whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch];
	row3 = [whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch];
	row4 = [whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch];
	row5 = [whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch];
	row6 = [whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch];
	row7 = [whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch];
	row8 = [whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch];
	row9 = [whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch];
	row10 = [whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch];
	row11 = [whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch];
	row12 = [whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch];
	row13 = [whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch];

	for (var i = 0; i < 3; i++) {
		row1 = row1.concat(row1);
		row2 = row2.concat(row2);
		row3 = row3.concat(row3);
		row4 = row4.concat(row4);
		row5 = row5.concat(row5);
		row6 = row6.concat(row6);
		row7 = row7.concat(row7);
		row8 = row8.concat(row8);
		row9 = row9.concat(row9);
		row10 = row10.concat(row10);
		row11 = row11.concat(row11);
		row12 = row12.concat(row12);
		row13 = row13.concat(row13);
	}

	var block = [borderTop, row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11, row12, row13];
	console.log(block);
	console.log(borderTop);

	return block;

}




//  DIAMOND PATTERN  //

function genPattern2() {
	var whiteStitch = new KnitStitch(0, 0, `${colourScheme[1]}`);
	var colourStitch = new KnitStitch(0, 0, `${colourScheme[2]}`);
	var border, border2, row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11, row12, row13;

	border = [];
	for (var i = 0; i < 79; i++) {
		border.push(colourStitch);
	}
	row1 = [colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch];
	row2 = [whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch];
	row3 = [whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch];
	row4 = [whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch];
	row5 = [whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch];
	row6 = [whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch];
	row7 = [whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch];
	row8 = [whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch];
	row9 = [whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch];
	row10 = [whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch];
	row11 = [colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch];

	border2 = [];
	for (var i = 0; i < 40; i++) {
		border2.push(whiteStitch);
		border2.push(colourStitch);
	}

	for (var i = 0; i < 2; i++) {
		row1 = row1.concat(row1);
		row2 = row2.concat(row2);
		row3 = row3.concat(row3);
		row4 = row4.concat(row4);
		row5 = row5.concat(row5);
		row6 = row6.concat(row6);
		row7 = row7.concat(row7);
		row8 = row8.concat(row8);
		row9 = row9.concat(row9);
		row10 = row10.concat(row10);
		row11 = row11.concat(row11);
	}

	var block = [border, row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11, border, border2];
	console.log(block);
	console.log(border);

	return block;
}




function drawPattern(pattern, originX, originY) {
	ctx.save();
	ctx.translate(originX, originY);
	for (var y = 0; y < pattern.length; y++) {
		for (var x = 0; x < pattern[y].length; x++) {
			ctx.save();
			ctx.translate(x * xScale, y * yScale);
			pattern[y][x].draw();
			ctx.restore();
		}
	}
	ctx.restore();
}





//-------------------------------------------------------------
//  MESSAGES
//-------------------------------------------------------------

function chooseMessage() {
	var messageLine1, messageLine2;
	var num = Math.floor(Math.random() * 3) + 1;

	if (num === 1) {
		messageLine1 = genMessage1Line1();
		messageLine2 = genMessage1Line2();
	} else if (num === 2) {
		messageLine1 = genMessage2Line1();
		messageLine2 = genMessage2Line2();;
	} else {
		messageLine1 = genMessage2Line1();
		messageLine2 = genMessage1Line2();
	}

	return [messageLine1, messageLine2];
}


// MERRY CHRISTMAS //

function genMessage1Line1() {
	var whiteStitch = new KnitStitch(0, 0, `${colourScheme[2]}`);
	var colourStitch = new KnitStitch(0, 0, `${colourScheme[1]}`);
	var border, padding, row1, row2, row3, row4, row5, row6, row7, row8;

	border = [];
	for (var i = 0; i < 79; i++) {
		border.push(whiteStitch);
	}

	padding = [];
	for (var i = 0; i < 79; i++) {
		padding.push(colourStitch);
	}

	row1 = [colourStitch, 
	// DIAMOND
    colourStitch, colourStitch, colourStitch, 
	// HEART
	colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	colourStitch, colourStitch, 
	//M
	whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//E
	whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//R
	whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//R
	whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//Y
	whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	colourStitch, 
	// HEART
	colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 

	// DIAMOND
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch
];


	row2 = [colourStitch, 
	// DIAMOND
 	colourStitch, colourStitch, colourStitch, 
	// HEART
	colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	colourStitch, colourStitch, 
	//M
	colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//E
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//R
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//R
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch,
	//Y
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	colourStitch, 
	// HEART
	colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 

	// DIAMOND
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch
];


	row3 = [colourStitch, 
	// DIAMOND
	colourStitch, colourStitch, colourStitch, 
	// HEART
	colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	colourStitch, colourStitch, 
	//M
	colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//E
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//R
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//R
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch,
	//Y
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	colourStitch, 
	// HEART
	colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 

	// DIAMOND
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch
];


	row4 = [colourStitch, 
	// DIAMOND
	colourStitch, whiteStitch, colourStitch, 
	// HEART
	colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	colourStitch, colourStitch, 
	//M
	colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//E
	colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//R
	colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//R
	colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch,
	//Y
	colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	colourStitch, 
	// HEART
	colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 

	// DIAMOND
	colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch
];


	row5 = [colourStitch, 
	// DIAMOND
	whiteStitch, colourStitch, whiteStitch, 
	// HEART
	colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	colourStitch, colourStitch, 
	//M
	colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//E
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//R
	colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//R
	colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch,
	//Y
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	colourStitch, 
	// HEART
	colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	
	// DIAMOND
	colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch
];


	row6 = [colourStitch, 
	// DIAMOND
	colourStitch, whiteStitch, colourStitch, 
	// HEART
	colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	colourStitch,  colourStitch, 
	//M
	colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//E
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//R
	colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//R
	colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch,
	//Y
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	colourStitch, 
	// HEART
	colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	
	// DIAMOND
	colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch
];


	row7 = [colourStitch, 
	// DIAMOND
	colourStitch, colourStitch, colourStitch, 
	// HEART
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	colourStitch,  colourStitch, 
	//M
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//E
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//R
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//R
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch,
	//Y
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	colourStitch, 
	// HEART
	colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	
	// DIAMOND
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch
];


	row8 = [colourStitch, 
	// DIAMOND
 	colourStitch, colourStitch, colourStitch, 
	// HEART
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	colourStitch,  colourStitch, 
	//M
	whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//E
	whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//R
	whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, 
	//R
	whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, 
	//Y
	colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	colourStitch, 
	// HEART
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 

	// DIAMOND
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch
];


	var block = [border, padding, padding, row1, row2, row3, row4, row5, row6, row7, row8, padding, padding, border];
	console.log(block);
	console.log(border);

	return block;
}

function genMessage1Line2() {
	var whiteStitch = new KnitStitch(0, 0, `${colourScheme[2]}`);
	var colourStitch = new KnitStitch(0, 0, `${colourScheme[1]}`);
	var border, padding, row1, row2, row3, row4, row5, row6, row7, row8;

	border = [];
	for (var i = 0; i < 79; i++) {
		border.push(whiteStitch);
	}

	padding = [];
	for (var i = 0; i < 79; i++) {
		padding.push(colourStitch);
	}

	row1 = [colourStitch, 
	// DIAMOND
    colourStitch, colourStitch, colourStitch, 
	colourStitch, 
	//C
	colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//H
	whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//R//
	whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//I
	whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//S
	colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//T
	whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//M
	whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//A
	colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//S
	colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch,  
	// DIAMOND
	colourStitch, colourStitch, colourStitch, colourStitch
];


	row2 = [colourStitch, 
	// DIAMOND
    colourStitch, colourStitch, colourStitch, 
	colourStitch, 
	//C
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//H
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch,  
	//R
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//I
	colourStitch, whiteStitch, colourStitch, colourStitch, 
	//S
	whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//T
	whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//M
	colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//A
	colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//S
	whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch,
	// DIAMOND
	colourStitch, colourStitch, colourStitch, colourStitch
];


	row3 = [colourStitch, 
	// DIAMOND
    colourStitch, whiteStitch, colourStitch, 
	colourStitch, 
	//C
	whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//H
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch,  
	//R
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//I
	colourStitch, whiteStitch, colourStitch, colourStitch, 
	//S
	whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//T
	colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//M
	colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//A
	colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//S
	whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	// DIAMOND
	colourStitch, whiteStitch, colourStitch, colourStitch
];


	row4 = [colourStitch, 
	// DIAMOND
    whiteStitch, colourStitch, whiteStitch, 
	colourStitch, 
	//C
	whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//H
	colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//R
	colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//I
	colourStitch, whiteStitch, colourStitch, colourStitch, 
	//S
	colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//T
	colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//M
	colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//A
	colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//S
	colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch,
	// DIAMOND
	whiteStitch, colourStitch, whiteStitch, colourStitch
];


	row5 = [colourStitch, 
	// DIAMOND
    colourStitch, whiteStitch, colourStitch, 
	colourStitch, 
	//C
	whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//H
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch,  
	//R
	colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//I
	colourStitch, whiteStitch, colourStitch, colourStitch, 
	//S
	colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//T
	colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//M
	colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//A
	colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//S
	colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch,
	// DIAMOND
	colourStitch, whiteStitch, colourStitch, colourStitch 
];


	row6 = [colourStitch, 
	// DIAMOND
    colourStitch, colourStitch, colourStitch, 
	colourStitch, 
	//C
	whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//H
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch,  
	//R
	colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//I
	colourStitch, whiteStitch, colourStitch, colourStitch, 
	//S
	colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//T
	colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//M
	colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//A
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//S
	colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch,
	// DIAMOND
	colourStitch, colourStitch, colourStitch, colourStitch 
];


	row7 = [colourStitch, 
	// DIAMOND
    colourStitch, colourStitch, colourStitch, 
	colourStitch, 
	//C
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//H
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch,
	//R
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//I
	colourStitch, whiteStitch, colourStitch, colourStitch, 
	//S
	whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//T
	colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//M
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//A
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//S
	whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	// DIAMOND
	colourStitch, colourStitch, colourStitch, colourStitch 
];


	row8 = [colourStitch, 
	// DIAMOND
    colourStitch, colourStitch, colourStitch, 
	colourStitch, 
	//C
	colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//H
	whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch,
	//R
	whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, 
	//I
	whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//S
	whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//T
	colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//M
	whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//A
	whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//S
	whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	// DIAMOND
	colourStitch, colourStitch, colourStitch, colourStitch
];


	var block = [border, padding, padding, row1, row2, row3, row4, row5, row6, row7, row8, padding, padding];
	console.log(block);
	console.log(border);

	return block;
}



// HAPPY HOLIDAYS //

function genMessage2Line1() {
	var whiteStitch = new KnitStitch(0, 0, `${colourScheme[2]}`);
	var colourStitch = new KnitStitch(0, 0, `${colourScheme[1]}`);
	var border, padding, row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11, row12;

	border = [];
	for (var i = 0; i < 79; i++) {
		border.push(whiteStitch);
	}

	row1 = [ 
	// SWIRL
    colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch,  colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//H
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//A
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//P
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//P
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//Y
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	colourStitch, 
	// SWIRL
    whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch,  colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	colourStitch
];


	row2 = [ 
	// SWIRL
    whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch,  colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//H
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//A
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//P
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//P
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//Y
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	colourStitch, 
	// SWIRL
whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch,  colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch,  
	colourStitch
];


	row3 = [ 
	// SWIRL
    whiteStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//H
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//A
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//P
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//P
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//Y
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	colourStitch, 
	// SWIRL
    colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch,  
	colourStitch
];


	row4 = [ 
	// SWIRL
    colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//H
	whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//A
	colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//P
	whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//P
	whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//Y
	whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	// SWIRL
    colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	colourStitch
];


	row5 = [ 
	// SWIRL
    whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//H
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//A
	colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//P
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//P
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch,
	//Y
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	// SWIRL
    colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	colourStitch
];


	row6 = [ 
	// SWIRL
    whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//H
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//A
	colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//P
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//P
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch,
	//Y
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	// SWIRL
    colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	colourStitch
];


	row7 = [ 
	// SWIRL
    colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//H
	colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//A
	colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//P
	colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//P
	colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch,
	//Y
	colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	// SWIRL
    whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	colourStitch
];


	row8 = [ 
	// SWIRL
    colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, 
	//H
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//A
	colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//P
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//P
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch,
	//Y
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	// SWIRL
    colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch,
	colourStitch
];

	row9 = [ 
	// SWIRL
    colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, 
    //H
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//A
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//P
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//P
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch,
	//Y
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	// SWIRL
    colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, 
	colourStitch];
	

	row10 = [ 
	// SWIRL
    whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
    //H
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//A
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//P
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//P
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch,
	//Y
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	// SWIRL
    colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch,
	colourStitch];


	row11 = [	
	// SWIRL
    whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//H
	whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//A
	whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//P
	whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//P
	whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch,
	//Y
	colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	// SWIRL
    colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	colourStitch];


	row12 = [	
	// SWIRL
 	 whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 	
    //H
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//A
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//P
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//P
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//Y
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	colourStitch, 
	// SWIRL
    colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 	
	colourStitch];


	var block = [border, row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11, row12, border];
	console.log(block);
	console.log(border);

	return block;
}

function genMessage2Line2() {
	var whiteStitch = new KnitStitch(0, 0, `${colourScheme[2]}`);
	var colourStitch = new KnitStitch(0, 0, `${colourScheme[1]}`);
	var border, padding, row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11;

	border = [];
	for (var i = 0; i < 79; i++) {
		border.push(whiteStitch);
	}

	padding = [];
	for (var i = 0; i < 79; i++) {
		padding.push(colourStitch);
	}

	row1 = [ 
	// STAR
    colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//H
	colourStitch,  colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//O
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//L
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//I
	colourStitch, colourStitch, colourStitch, colourStitch, 
	//D
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//A
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//Y
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//S
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch,  
// STAR
    colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch
];


	row2 = [ 
	// STAR
    colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//H
	colourStitch,  colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//O
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//L
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//I
	colourStitch, colourStitch, colourStitch, colourStitch, 
	//D
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//A
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//Y
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//S
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch,  
	// STAR
        colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch
];

	row3 = [ 
	// STAR
    colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//H
	whiteStitch,  whiteStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//O
	colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//L
	whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//I
	whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//D
	whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//A
	colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//Y
	whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//S
	colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch,  
	// STAR
    colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
];



	row4 = [ 
	// STAR
    colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//H
	colourStitch,  whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//O
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//L
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//I
	colourStitch, whiteStitch, colourStitch, colourStitch, 
	//D
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//A
	colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//Y
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//S
	whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch,  
	// STAR
    colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
];


	row5 = [ 
	// STAR
   whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, 
	//H
	colourStitch,  whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//O
	whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//L
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//I
	colourStitch, whiteStitch, colourStitch, colourStitch, 
	//D
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//A
	colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//Y
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//S
	whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch,  
	// STAR
    whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, 
];


	row6 = [ 
	// STAR
    colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//H
	colourStitch,  whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//O
	whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//L
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//I
	colourStitch, whiteStitch, colourStitch, colourStitch, 
	//D
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//A
	colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//Y
	colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//S
	colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch,  
	// STAR
    colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
];


	row7 = [ 
	// STAR
    colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//H
	colourStitch,  whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//O
	whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//L
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//I
	colourStitch, whiteStitch, colourStitch, colourStitch, 
	//D
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//A
	colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, 
	//Y
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//S
	colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch,  
	// STAR
    colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
];


	row8 = [ 
	// STAR
    colourStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//H
	colourStitch,  whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//O
	whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//L
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//I
	colourStitch, whiteStitch, colourStitch, colourStitch, 
	//D
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//A
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//Y
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//S
	colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch,  
	// STAR
    colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
];


	row9 = [ 
	// STAR
    colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//H
	colourStitch,  whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//O
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//L
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, 
	//I
	colourStitch, whiteStitch, colourStitch, colourStitch, 
	//D
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//A
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//Y
	colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, 
	//S
	whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch,  
	// STAR
    colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
];

	row10 = [ 
	// STAR
    colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//H
	whiteStitch,  whiteStitch, whiteStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//O
	colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//L
	whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//I
	whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//D
	whiteStitch, whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//A
	whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, 
	//Y
	colourStitch, colourStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch, colourStitch, 
	//S
	whiteStitch, whiteStitch, whiteStitch, whiteStitch, colourStitch, colourStitch,  
	// STAR
    colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
];


	row11 = [ 
	// STAR
    colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//H
	colourStitch,  colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//O
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//L
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//I
	colourStitch, colourStitch, colourStitch, colourStitch, 
	//D
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//A
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//Y
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, 
	//S
	colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch,  
// STAR
    colourStitch, colourStitch, colourStitch, colourStitch, colourStitch, whiteStitch, colourStitch, colourStitch, colourStitch, colourStitch, colourStitch
];


	var block = [border, row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11, padding, border];
	console.log(block);
	console.log(border);

	return block;
}


function drawMessageLine1(messageLine1, originX, originY) {
	ctx.save();
	ctx.translate(originX, originY);
	for (var y = 0; y < messageLine1.length; y++) {
		for (var x = 0; x < messageLine1[y].length; x++) {
			ctx.save();
			ctx.translate(x * xScale, y * yScale);
			messageLine1[y][x].draw();
			ctx.restore();
		}
	}
	ctx.restore();
}





//-------------------------------------------------------------------------------------------
//  MIDDLE PATTERN
//-------------------------------------------------------------------------------------------

function genMidPattern1() {
	var whiteStitch = new KnitStitch(0, 0, `${colourScheme[2]}`);
	var colourStitch = new KnitStitch(0, 0, `${colourScheme[1]}`);
	var border, row1, row2, row3, row4, row5, row6;

	border = [];
	for (var i = 0; i < 79; i++) {
		border.push(colourStitch);
	}

	row1 = [colourStitch, whiteStitch, colourStitch, colourStitch];
	row2 = [whiteStitch, whiteStitch, whiteStitch, colourStitch];
	row3 = [colourStitch, whiteStitch, colourStitch, colourStitch];
	row4 = [colourStitch, colourStitch, colourStitch, whiteStitch];
	row5 = [whiteStitch, colourStitch, whiteStitch, colourStitch];
	row6 = [colourStitch, whiteStitch, colourStitch, colourStitch];

	for (var i = 0; i < 6; i++) {
		row1 = row1.concat(row1);
		row2 = row2.concat(row2);
		row3 = row3.concat(row3);
		row4 = row4.concat(row4);
		row5 = row5.concat(row5);
		row6 = row6.concat(row6);
	}

	var block = [border, row1, row2, row3, row4, row5, row6, border];

	return block;

}

function drawMidPattern(pattern, originX, originY) {
	ctx.save();
	ctx.translate(originX, originY);
	for (var y = 0; y < pattern.length; y++) {
		for (var x = 0; x < pattern[y].length; x++) {
			ctx.save();
			ctx.translate(x * xScale, y * yScale);
			pattern[y][x].draw();
			ctx.restore();
		}
	}
	ctx.restore();
}





// //-------------------------------------------------------------------------------------------
// //  BOTTOM ROW OF STITCHES
// //-------------------------------------------------------------------------------------------

// function genBottomRow() {
// 	var row = [];
// 	var stitch = new KnitStitch(0, 0, `${colourScheme[2]}`);
// 	for (var i = 0; i < 80; i++) {
// 		row.push(stitch);
// 	}
// 	return row;
// }

// function drawBottomRow(row, originX, originY) {
// 	ctx.save();
// 	ctx.translate(originX, originY);
// 	for (var x = 0; x < row.length; x++) {
// 		ctx.save();
// 		row[x].draw();
// 		ctx.translate(x * xScale, 0);
// 		ctx.restore();
// 	}
// 	ctx.restore();
// }





//-------------------------------------------------------------------------------------------
//  METRICS
//-------------------------------------------------------------------------------------------

function metrics() {

    // GET DISPLAY DIMENSIONS //
    scale = window.devicePixelRatio;
    width = 979;
    height = 695;

    // SET CANVAS DIMENSIONS //
    canvas.width  = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
}

function Point(x, y) {
	this.x = x;
	this.y = y;
}
