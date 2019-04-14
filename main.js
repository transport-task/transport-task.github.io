var buttonStart = document.getElementById("buttonStart");
var buttonSet = document.getElementById("buttonSet");
var buttonNext = document.getElementById("buttonNext");
var buttonClear = document.getElementById("buttonClear");

var filledUV = document.getElementById("filledUV");
var notFilledUV = document.getElementById("notFilledUV");

var size = 4;

var prices = [[], [], [], []];
var selectedRes = [[], [], [], []];

var factoryRes = [];
var needRes = [];

var occupancyCells = [[], [], [], []];
var u = [];
var v = [];
var cicleCells = [[], [], [], []];

buttonStart.addEventListener("click", start);
buttonSet.addEventListener("click", set);
buttonNext.addEventListener("click", next);
buttonClear.addEventListener("click", clearCicle);

var plusMinus = 1;
doForEachElement((i, z) => {
	document.getElementById("s" + i + z).addEventListener("click", () => {
		document.getElementById("s" + i + z).className = "selectedCell";
		cicleCells[i][z] = plusMinus;
		plusMinus *= -1; 
		document.getElementById("cicle").innerHTML += " => [" + (z + 1) + ", " + (i + 1) + "]<br> ";
	});
});

function start() {
	getPrices();
	setDefaultSelectedRes();
	showCost();
	checkOccupancyCells();
	showUV();
	showSelectedRes();
}

function set() {
	showCost();
	checkOccupancyCells();
	showUV();
	showSelectedRes();
	getUV();
	showUV();
	resetUV();
}

function next() {
	doCicle();
	showCost();
	checkOccupancyCells();
	showUV();
	showSelectedRes();
	clearCicle();
	clearUV();
}


function showSelectedRes() {
	doForEachElement((i, z) => {
		document.getElementById("s" + i + z).innerHTML = selectedRes[i][z];
	});
}

function setDefaultSelectedRes() {
	var tmpFactoryRes = [];
	var tmpNeedRes = [];

	for (let i = 0; i < size; i++) {
		factoryRes[i] = document.getElementById("factoryRes" + i).value;
		needRes[i] = document.getElementById("needRes" + i).value;

		tmpFactoryRes[i] = factoryRes[i];
		tmpNeedRes[i] = needRes[i];
	}

	doForEachElement((i, z) => {
		if (tmpNeedRes[i] <= tmpFactoryRes[z]) {
			selectedRes[i][z] = tmpNeedRes[i];
			tmpFactoryRes[z] -= tmpNeedRes[i];
			tmpNeedRes[i] = 0;
		} else {
			selectedRes[i][z] = tmpFactoryRes[z];
			tmpNeedRes[i] -= tmpFactoryRes[z];
			tmpFactoryRes[z] = 0;
		}
	});
}

function getUV() {
	for (let i = 0; i < size; i++) {
		u[i] = document.getElementById("u" + i).value;
		v[i] = document.getElementById("v" + i).value;
	}
}

function getPrices() {
	doForEachElement((i, z) => {
		prices[i][z] = document.getElementById("p" + i + z).value;
	});
}

function showCost() {
	var c = 0;

	doForEachElement((i, z) => {
		c += selectedRes[i][z] * prices[i][z];
	});

	document.getElementById("cost").innerHTML = c;
}

function checkOccupancyCells() {
	doForEachElement((i, z) => {
		if (selectedRes[i][z] != 0) {
			occupancyCells[i][z] = true;
		} else {
			occupancyCells[i][z] = false;
		}
	});
}

function showUV() {
	var textFilled = "";
	var textNotFilled = "";

	doForEachElement((i, z) => {
		if (factoryRes[z] != 0) {
			if (occupancyCells[i][z]) {
				textFilled += "U" + (z + 1) + " + V" + (i + 1) + " = " + prices[i][z] + "<br>";
			} else {
				textNotFilled += "U" + (z + 1) + " + V" + (i + 1) + " <= " + prices[i][z] + "<br>";
			}
		}
		document.getElementById("s" + i + z).className = "cell";
	});

	filledUV.innerHTML = textFilled;
	notFilledUV.innerHTML = textNotFilled;
}

function getMinInCicle() {
	var min = 999999;
	doForEachElement((i, z) => {
		if (cicleCells[i][z] == -1 || cicleCells[i][z] == 1) {
			if ((+selectedRes[i][z]) < min && (+selectedRes[i][z]) != 0) {
				min = (+selectedRes[i][z]);
			}
		}
	});
	return min;
}

function doCicle() {
	var min = getMinInCicle();
	doForEachElement((i, z) => {
		if (cicleCells[i][z] == 1 || cicleCells[i][z] == -1) {
			selectedRes[i][z] = (+selectedRes[i][z]) + min * cicleCells[i][z];
		}
	});
}

function clearCicle() {
	doForEachElement((i, z) => {
		document.getElementById("s" + i + z).className = "cell";
		plusMinus = 1;
		cicleCells[i][z] = 0;
	});
	document.getElementById("cicle").innerHTML = "";
}

function clearUV() {
	for (let i = 0; i < size; i++) {
		u[i] = 0;
		v[i] = 0;
		document.getElementById("u" + i).value = "";
		document.getElementById("v" + i).value = "";
	}
	document.getElementById("u0").value = "0";
}

function resetUV() {
	var t = "";
	var cell;
	var plusMinus = 1;
	doForEachElement((i, z) => {
		cell = document.getElementById("s" + i + z);
		cell.className = "cell";
		if (!occupancyCells[i][z] && factoryRes[z] != 0) {
			t += "U" + (z + 1) + " + V" + (i + 1) + " <= " + prices[i][z];
			if ((+v[i]) + (+u[z]) <= prices[i][z]) {
				t += " (+) <br>";
			} else {
				t += " (-) <br>";
				cell.className = "activeCell";
			}
		}
	});

	notFilledUV.innerHTML = t;
}

function doForEachElement(f) {
	for (let i = 0; i < size; i++)
		for (let z = 0; z < size; z++)
			f(i, z);
}