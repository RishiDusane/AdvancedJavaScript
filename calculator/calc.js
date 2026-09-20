const currentDisplay = document.querySelector('#current-display');
const previousDisplay = document.querySelector('#previous-display');
const buttons = document.querySelector('.buttons');

let current = '0';
let previous = '';
let operation = '';
let resetCurrent = false;

function updateDisplay() {
	currentDisplay.textContent = current;
	previousDisplay.textContent = operation
		? `${previous} ${operation}`
		: '';
}

function addNumber(number) {
	if (current === 'Error' || resetCurrent) {
		current = '0';
		resetCurrent = false;
	}

	if (number === '.' && current.includes('.')) return;
	current = current === '0' && number !== '.' ? number : current + number;
	updateDisplay();
}

function chooseOperation(newOperation) {
	if (current === 'Error') return;
	if (operation && !resetCurrent) calculate();

	previous = current;
	operation = newOperation;
	resetCurrent = true;
	updateDisplay();
}

function calculate() {
	if (!operation) return;

	const first = Number(previous);
	const second = Number(current);
	let answer;

	switch (operation) {
		case '+': answer = first + second; break;
		case '−': answer = first - second; break;
		case '×': answer = first * second; break;
		case '÷': answer = second === 0 ? 'Error' : first / second; break;
		case '%': answer = first % second; break;
	}

	current = answer === 'Error' ? answer : String(Number(answer.toFixed(10)));
	previous = '';
	operation = '';
	resetCurrent = true;
	updateDisplay();
}

function clearCalculator() {
	current = '0';
	previous = '';
	operation = '';
	resetCurrent = false;
	updateDisplay();
}

function deleteNumber() {
	if (resetCurrent || current === 'Error') return clearCalculator();
	current = current.length > 1 ? current.slice(0, -1) : '0';
	updateDisplay();
}

buttons.addEventListener('click', (event) => {
	const button = event.target.closest('button');
	if (!button) return;

	if (button.dataset.number) addNumber(button.dataset.number);
	if (button.dataset.operation) chooseOperation(button.dataset.operation);
	if (button.dataset.action === 'clear') clearCalculator();
	if (button.dataset.action === 'delete') deleteNumber();
	if (button.dataset.action === 'equals') calculate();
});

document.addEventListener('keydown', (event) => {
	if (/^[0-9.]$/.test(event.key)) addNumber(event.key);
	if (['+', '-', '*', '/', '%'].includes(event.key)) {
		const operationMap = { '-': '−', '*': '×', '/': '÷' };
		chooseOperation(operationMap[event.key] || event.key);
	}
	if (event.key === 'Enter' || event.key === '=') calculate();
	if (event.key === 'Escape') clearCalculator();
	if (event.key === 'Backspace') deleteNumber();
});
