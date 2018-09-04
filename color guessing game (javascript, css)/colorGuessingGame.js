var colors = generateRandomColors(6);
var pickedColor = pickColor();
var squares = document.querySelectorAll(".square");
var colorDisplay = document.querySelector('#display');
var message = document.querySelector('#message');
var h1 = document.querySelector('h1');
var resetButton = document.querySelector('#new');
var easyButton = document.querySelector('#easy');
var hardButton = document.querySelector('#hard');

colorDisplay.textContent = pickedColor;

easyButton.addEventListener('click', function(){
	easyButton.classList.add('selected');
	hardButton.classList.remove('selected');
	colors = generateRandomColors(3);
	pickedColor = pickColor();
	colorDisplay.textContent = pickedColor;
	for (var i = 0; i < squares.length; i += 1) {
		if(colors[i]) {
			squares[i].style.background = colors[i];
		} else {
			squares[i].style.display = 'none';
		}
	}
})

hardButton.addEventListener('click', function(){
	easyButton.classList.remove('selected');
	hardButton.classList.add('selected');
	colors = generateRandomColors(6);
	pickedColor = pickColor();
	colorDisplay.textContent = pickedColor;
	for (var i = 0; i < squares.length; i += 1) {
		squares[i].style.background = colors[i];
		squares[i].style.display = 'block';
	}
})

resetButton.addEventListener('click', function(){
	colors = generateRandomColors(6);
	pickedColor = pickColor();
	colorDisplay.textContent = pickedColor;
	for(var i = 0; i < squares.length; i++){
		squares[i].style.background = colors[i];
	}
})

for(var i = 0; i < squares.length; i++){
	squares[i].style.background = colors[i];

	//add click listeners to squares
	squares[i].addEventListener("click", function() {
		//grab color of clicked squares
		var clickedColor = this.style.background;
		//compare color to pickedColor
		if(clickedColor === pickedColor) {
			message.textContent = 'Correct!';
			for (var j = 0; j < squares.length; j += 1) {
				squares[j].style.background = pickedColor;
			}
			h1.style.backgroundColor = pickedColor;
			resetButton.textContent = 'Play Again?';
		} else {
			this.style.background = '#232323';
			message.textContent = 'Wrong, Try Again.';
		}
	});
}

function pickColor() {
	var random = Math.floor(Math.random() * colors.length);
	return colors[random]
}

function generateRandomColors(n) {
	var arr = [];
	for (var i = 0; i < n; i += 1) {
		arr.push(`rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`);
	}
	return arr;
}
