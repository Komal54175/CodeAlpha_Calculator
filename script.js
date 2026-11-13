const resultEl = document.getElementById("result");
const historyEl = document.getElementById("history");

let current = "0";
let previous = "";
let operator = null;
let justCalculated = false;

function updateDisplay() {
  resultEl.textContent = current;
  const symbols = { "*": "×", "/": "÷", "-": "−", "+": "+" };
  historyEl.textContent = operator ? previous + " " + symbols[operator] : "";
}

function inputNumber(num) {
  if (justCalculated) {
    current = "0";
    justCalculated = false;
  }
  if (num === "." && current.includes(".")) return;
  current = current === "0" && num !== "." ? num : current + num;
  updateDisplay();
}

function chooseOperator(op) {
  if (operator && !justCalculated) calculate();
  previous = current;
  operator = op;
  current = "0";
  justCalculated = false;
  updateDisplay();
}

function calculate() {
  if (!operator) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let answer;

  if (operator === "+") answer = a + b;
  if (operator === "-") answer = a - b;
  if (operator === "*") answer = a * b;
  if (operator === "/") {
    if (b === 0) {
      current = "Error";
      previous = "";
      operator = null;
      justCalculated = true;
      updateDisplay();
      return;
    }
    answer = a / b;
  }

  current = String(parseFloat(answer.toFixed(10)));
  previous = "";
  operator = null;
  justCalculated = true;
  updateDisplay();
}

function clearAll() {
  current = "0";
  previous = "";
  operator = null;
  justCalculated = false;
  updateDisplay();
}

function backspace() {
  if (justCalculated || current === "Error") {
    clearAll();
    return;
  }
  current = current.length > 1 ? current.slice(0, -1) : "0";
  updateDisplay();
}

function percent() {
  if (current === "Error") return;
  current = String(parseFloat(current) / 100);
  updateDisplay();
}

function handleAction(action) {
  if (current === "Error" && action !== "clear") clearAll();
  if ("0123456789.".includes(action)) inputNumber(action);
  else if (["+", "-", "*", "/"].includes(action)) chooseOperator(action);
  else if (action === "=") calculate();
  else if (action === "clear") clearAll();
  else if (action === "backspace") backspace();
  else if (action === "percent") percent();
}

// Mouse clicks
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", () => handleAction(button.dataset.action));
});

// Keyboard support (bonus)
document.addEventListener("keydown", (e) => {
  if ("0123456789.+-*/".includes(e.key)) handleAction(e.key);
  else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    handleAction("=");
  } else if (e.key === "Backspace") handleAction("backspace");
  else if (e.key === "Escape" || e.key.toLowerCase() === "c") handleAction("clear");
  else if (e.key === "%") handleAction("percent");
});

updateDisplay();