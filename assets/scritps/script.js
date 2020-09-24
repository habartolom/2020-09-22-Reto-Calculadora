const numbers = document.getElementsByClassName('number');
const operationsScreen = document.getElementById('operationsScreen');
const entry = document.getElementById('accumulator');
const clearEntry = document.getElementById('clearEntry')
const clear = document.getElementById('clear');
const backSpace = document.getElementById('backSpace');
const binaryOps = document.getElementsByClassName('binary');
const equal = document.getElementById('equal');
const registry = document.getElementById('registry');
const operationsHistory = document.getElementById('operationsHistory');
const resultHistory = document.getElementById('resultHistory');

let queueOps = [];
let entryConcatenable = false;
let newRecord = true;

// Event Listener para teclas numéricas
for (let i = 0; i < numbers.length; i++) {
    numbers[i].addEventListener('click', () => {
        validateEntry(numbers[i].innerText);
    })
}

// Event Listener para tecla CE
clearEntry.addEventListener('click', () => {
    entry.innerText = '0';
});

// Event Listener para tecla C
clear.addEventListener('click', () => {
    entry.innerText = '0';
    operationsScreen.innerText = '';
    queueOps = [];
});

// Event Listener para tecla Backspace
backSpace.addEventListener('click', () => {
    if (entryConcatenable) {
        let number = entry.innerText;
        number = number.substring(0, number.length - 1);
        if (number == '') {
            number = '0';
        }
        entry.innerText = number;
    }
});

// Event Listener para teclas de operaciones binarias
for (let i = 0; i < binaryOps.length; i++) {
    let operator = binaryOps[i];
    operator.addEventListener('click', () => {
        if (entryConcatenable) {
            operationsScreen.innerText += ' ' + entry.innerText;
            operationsScreen.innerText += ' ' + operator.innerText;
            entry.innerText = makeOperations(entry.innerText, operator.innerText);
            entryConcatenable = false;
        }
        else {
            if (newRecord) {
                operationsScreen.innerText = entry.innerText;
                operationsScreen.innerText += ' ' + operator.innerText;
                entry.innerText = makeOperations(entry.innerText, operator.innerText);
                newRecord = false;
            }
            else {
                let opsArray = operationsScreen.innerText.split(' ');
                opsArray[opsArray.length - 1] = operator.innerText;
                operationsScreen.innerText = opsArray.join(' ');
                queueOps.pop();
                queueOps.push(operator.innerText);
            }
        }

    });
}

// Event Listener para la tecla '='
equal.addEventListener('click', () => {
    if (entryConcatenable && queueOps.length != 0) {
        operationsScreen.innerText += ' ' + entry.innerText;
        operationsScreen.innerText += ' ' + equal.innerText;

        let num2 = parseFloat(entry.innerText);
        let binaryOp = queueOps.pop();
        let num1 = parseFloat(queueOps.pop());
        entry.innerText = doArithmeticOperations(num1, num2, binaryOp);

        entryConcatenable = false;
        newRecord = true;
        registry.innerHTML = `
            <div class="record">
                <div class="operations" id="operationsHistory">${operationsScreen.innerHTML}</div>
                <div class="accumulator history" id="resultHistory">${entry.innerHTML}</div>
            </div>` + registry.innerHTML;
    }
});


// Función que revisa el caracter ingresado al oprimir una de las teclas numéricas
function validateEntry(character) {

    let storedNumber = '0';
    
    if (entryConcatenable)
        storedNumber = entry.innerText;
    
    entryConcatenable = true;

    if(newRecord){
        operationsScreen.innerText = '';
        newRecord = false;
    }

    // Si lo almacenado no tiene '.'
    if (storedNumber.indexOf('.') == -1) {
        if (storedNumber.length < 16) {
            // Si el nuevo caracter es '.'
            if (character == '.')
                storedNumber += character;
            // Si el nuevo caracter no es '.'
            else {
                storedNumber = parseFloat(storedNumber + character).toString();
            }
        }
    }
    // Si lo almacenado tiene '.'
    else {
        let split = storedNumber.split('.');
        if ((character != '.') && ((split[0][0] == 0 && split[1].length < 16) || (split[0].length + split[1].length < 16)))
            storedNumber += character;
    }

    entry.innerText = storedNumber;
}

function makeOperations(number, operator) {
    let result;
    if (queueOps.length != 0) {
        let num2 = parseFloat(number);
        let binaryOp = queueOps.pop();
        let num1 = parseFloat(queueOps.pop());

        result = doArithmeticOperations(num1, num2, binaryOp);
        queueOps.push(result);
        queueOps.push(operator)
    }
    else {
        result = number;
        queueOps.push(result);
        queueOps.push(operator);
    }
    return result;
}

function doArithmeticOperations(num1, num2, binaryOp) {
    let result;
    switch (binaryOp) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case 'x':
            result = num1 * num2;
            break;
        case '/':
            result = num1 / num2;
            break;
    }
    return parseFloat(result.toPrecision(15));
}