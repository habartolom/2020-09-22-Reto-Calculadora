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
const unaryOps = document.getElementsByClassName('unary');

var queueOps = [];
var entryConcatenable = false;
var newRecord = true;

// Event Listener para botones numéricos
for (let i = 0; i < numbers.length; i++) {
    numbers[i].addEventListener('click', () => {
        if (newRecord)
            operationsScreen.innerText = '';
        
        if(queueOps.length == 1){
            registry.innerHTML = `
            <div class="record">
            <div class="operations" id="operationsHistory">${operationsScreen.innerText}</div>
            <div class="accumulator history" id="resultHistory">${queueOps.pop()}</div>
            </div>` + registry.innerHTML;
            operationsScreen.innerText = '';
        }
        if(queueOps.length == 3){
            let opsArray = operationsScreen.innerText.split(' ');
            opsArray.pop();
            queueOps.pop();
            operationsScreen.innerText = opsArray.join(' ');
        }

        validateEntry(numbers[i].innerText);
    });
}

// Event Listener para botón CE
clearEntry.addEventListener('click', () => {
    entry.innerText = '0';
    if (newRecord)
        operationsScreen.innerText = '';
});

// Event Listener para botón C
clear.addEventListener('click', () => {
    entry.innerText = '0';
    operationsScreen.innerText = '';
    queueOps = [];
});

// Event Listener para botón Backspace
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

// Event Listener para los botones de operaciones Unarias.
for (let i = 0; i < unaryOps.length; i++){
    let unaryOp = unaryOps[i];
    unaryOp.addEventListener('click', () => {
        let numberInEntry = parseFloat(entry.innerText);
        let uoperator = unaryOp.id;
        let result = doAlgebraicOperation(numberInEntry, uoperator);

        if(queueOps.length % 2 == 1){
            queueOps.pop();
            let opsArray = operationsScreen.innerText.split(' ');
            let lastNumber = opsArray.pop();
            opsArray.push(uoperator + '(' + lastNumber + ')');
            operationsScreen.innerText = opsArray.join(' ');
        }
        else
            operationsScreen.innerText += ' ' + uoperator + '(' + numberInEntry + ')';

        entry.innerText = result;

        entryConcatenable = false;
        queueOps.push(result);
    });
}

// Event Listener para los botones de operaciones Binarias.
for (let i = 0; i < binaryOps.length; i++) {
    let binaryOp = binaryOps[i];

    binaryOp.addEventListener('click', () => {
        const isUnaryOperation = queueOps.length % 2 != 0;
        let numberInEntry = parseFloat(entry.innerText);
        let newOperator = binaryOp.innerText;

        if (queueOps.length == 0) {
            queueOps.push(numberInEntry);
            queueOps.push(newOperator);
            operationsScreen.innerText += ' ' + numberInEntry + ' ' + newOperator;
        }
        else if (queueOps.length == 1) {
            queueOps.push(newOperator);
            operationsScreen.innerText += ' ' + newOperator;
        }
        else {
            if (isUnaryOperation)
                queueOps.pop();

            let oldOperator = queueOps.pop();
            let number = queueOps.pop();
            let result = doArithmeticOperations(number, numberInEntry, oldOperator);
            queueOps.push(result);
            queueOps.push(newOperator);
            entry.innerText = result;

            if (isUnaryOperation)
                operationsScreen.innerText += ' ' + newOperator;
            else
                operationsScreen.innerText += ' ' + numberInEntry + ' ' + newOperator;
        }

        entryConcatenable = false;
    });
}

// Event Listener para el boton igual
equal.addEventListener('click', ()=>{
    const isUnaryOperation = queueOps.length % 2 != 0;
    let numberInEntry = parseFloat(entry.innerText);
    let equalKey = equal.innerText;

    if(queueOps.length == 0){
        operationsScreen.innerText = ' ' + numberInEntry + ' ' + equalKey;
    }
    else if(queueOps.length == 1){
        operationsScreen.innertext += ' ' + equalKey;
        entry.innerText = queueOps.pop();
    }
    else{
        if(isUnaryOperation){
            queueOps.pop();
        }
        let oldOperator = queueOps.pop();
        let number = queueOps.pop();
        let result = doArithmeticOperations(number, numberInEntry, oldOperator);
        entry.innerText = result;

        if (isUnaryOperation)
            operationsScreen.innerText += ' ' + equalKey;
        else
            operationsScreen.innerText += ' ' + numberInEntry + ' ' + equalKey;
    }
    
    entryConcatenable = false;
    newRecord = true;
    registry.innerHTML = `
        <div class="record">
            <div class="operations" id="operationsHistory">${operationsScreen.innerText}</div>
            <div class="accumulator history" id="resultHistory">${entry.innerText}</div>
        </div>` + registry.innerHTML;
});

// Función que revisa el caracter ingresado al oprimir una de las teclas numéricas
function validateEntry(character) {
    let storedNumber = '0';

    if (entryConcatenable)
        storedNumber = entry.innerText;

    entryConcatenable = true;
    newRecord = false;

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

function doAlgebraicOperation(number, operator) {
    let result;
    switch (operator) {
        case 'percentage':
            result = number / 100;
            break;
        case 'inverse':
            result = 1 / number;
            break;
        case 'sqr':
            result = Math.pow(number, 2);
            break;
        case 'sqRoot':
            result = Math.sqrt(number);
            break;
    }
    return parseFloat(result.toPrecision(16));
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
    return parseFloat(result.toPrecision(16));
}