const currentDisplay = document.querySelector('#current-display');
const previousDisplay = document.querySelector('#previous-display');
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const actionButtons = document.querySelectorAll('[data-action]');

let currentValue = '0';
let previousValue = '';
let selectedOperation = null;
let shouldResetDisplay = false;

function updateDisplay() {
	currentDisplay.textContent = currentValue;
	previousDisplay.textContent = selectedOperation
		? `${previousValue} ${selectedOperation}`
		: '';
}

function addNumber(number) {
	if (currentValue === 'Error' || shouldResetDisplay) {
		currentValue = '0';
		shouldResetDisplay = false;
	}

	if (number === '.' && currentValue.includes('.')) {
		return;
	}

	if (currentValue === '0' && number !== '.') {
		currentValue = number;
	} else {
		currentValue += number;
	}
	updateDisplay();
}

function chooseOperation(operation) {
	if (currentValue === 'Error') {
		return;
	}

	if (selectedOperation && !shouldResetDisplay) {
		calculate();
	}

	previousValue = currentValue;
	selectedOperation = operation;
	shouldResetDisplay = true;
	updateDisplay();
}

function calculate() {
	const firstNumber = Number(previousValue);
	const secondNumber = Number(currentValue);
	let result;

	if (!selectedOperation || Number.isNaN(firstNumber) || Number.isNaN(secondNumber)) {
		return;
	}

	if (selectedOperation === '+') result = firstNumber + secondNumber;
	if (selectedOperation === '−') result = firstNumber - secondNumber;
	if (selectedOperation === '×') result = firstNumber * secondNumber;
	if (selectedOperation === '÷') result = secondNumber === 0 ? 'Error' : firstNumber / secondNumber;
	if (selectedOperation === '%') result = firstNumber % secondNumber;

	currentValue = result === 'Error' ? result : String(Number(result.toFixed(10)));
	previousValue = '';
	selectedOperation = null;
	shouldResetDisplay = true;
	updateDisplay();
}

function clearCalculator() {
	currentValue = '0';
	previousValue = '';
	selectedOperation = null;
	shouldResetDisplay = false;
	updateDisplay();
}

function deleteLastNumber() {
	if (shouldResetDisplay || currentValue === 'Error') {
		clearCalculator();
		return;
	}

	currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
	updateDisplay();
}

numberButtons.forEach((button) => {
	button.addEventListener('click', () => addNumber(button.dataset.number));
});

operationButtons.forEach((button) => {
	button.addEventListener('click', () => chooseOperation(button.dataset.operation));
});

actionButtons.forEach((button) => {
	button.addEventListener('click', () => {
		if (button.dataset.action === 'clear') clearCalculator();
		if (button.dataset.action === 'delete') deleteLastNumber();
		if (button.dataset.action === 'equals') calculate();
	});
});

document.addEventListener('keydown', (event) => {
	if (/^[0-9.]$/.test(event.key)) addNumber(event.key);
	if (['+', '-', '*', '/', '%'].includes(event.key)) {
		const operationMap = { '-': '−', '*': '×', '/': '÷' };
		chooseOperation(operationMap[event.key] || event.key);
	}
	if (event.key === 'Enter' || event.key === '=') calculate();
	if (event.key === 'Escape') clearCalculator();
	if (event.key === 'Backspace') deleteLastNumber();
});
