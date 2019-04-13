var buttonCalc = document.getElementById("buttonStart");
var cost = document.getElementById("cost");
var filledUV = document.getElementById("filledUV");
var notFilledUV = document.getElementById("notFilledUV");

var size = 4;

var prices = [];
var selectedRes = [];
var factoryRes = [];
var needRes = [];
var occupancyCells = [[], [], [], []];

for (let i = 0; i < size; i++) {
	prices[i] = [];
	selectedRes[i] = [];
	occupancyCells[i] = [];
}

buttonCalc.addEventListener("click", calc);

function supportsImports() {
  return 'import' in document.createElement('link');
}

function calc() {
	alert(supportsImports());

	var link = document.querySelector('link[rel="import"]');

	alert(link);

    // Clone the <template> in the import.
    var template = link.import.querySelector('template');

    alert(template);
    var clone = document.importNode(template.content, true);

    document.querySelector('#tableResults').appendChild(clone);

	getValues();
	setDefaultSelectedRes();
	showCost();
	checkOccupancyCells();
	showUV();
	showSelectedRes();
}

function showSelectedRes() {
	for (let i = 0; i < size; i++) {
		for (let z = 0; z < size; z++) {
			document.getElementById("s" + z + i).innerHTML = selectedRes[i][z];
		}
	}
}

function setDefaultSelectedRes() {
	doForEachElement((i, z) => {
		if (needRes[i] <= factoryRes[z]) {
			selectedRes[i][z] = needRes[i];
			factoryRes[z] -= needRes[i];
			needRes[i] = 0;
		} else {
			selectedRes[i][z] = factoryRes[z];
			needRes[i] -= factoryRes[z];
			factoryRes[z] = 0;
		}
	});
}

function getValues() {
	for (let i = 0; i < size; i++) {
		for (let z = 0; z < size; z++) {
			prices[i][z] = document.getElementById("p" + i + z).value;
		}
		factoryRes[i] = document.getElementById("factoryRes" + i).value;
		needRes[i] = document.getElementById("needRes" + i).value;
	}
}

function showCost() {
	var c = 0;

	doForEachElement((i, z) => {
		c += selectedRes[i][z] * prices[i][z];
	});

	cost.innerHTML = c;
}

function checkOccupancyCells() {
	doForEachElement((i, z) => {
		if (selectedRes[i][z] != 0) occupancyCells[i][z] = true;
		else occupancyCells[i][z] = false;
	});
}

function showUV() {
	var textFilled = "";
	var textNotFilled = "";

	doForEachElement((i, z) => {
		if (occupancyCells[i][z])
			textFilled += "U" + (z + 1) + " + V" + (i + 1) + " = " + prices[i][z] + "<br \/>";
		else
			textNotFilled += "U" + (z + 1) + " + V" + (i + 1) + " <= " + prices[i][z] + "<br \/>"; 
	});

	filledUV.innerHTML = textFilled;
	notFilledUV.innerHTML = textNotFilled;
}

function doForEachElement(f) {
	for (let i = 0; i < size; i++)
		for (let z = 0; z < size; z++)
			f(i, z);
}