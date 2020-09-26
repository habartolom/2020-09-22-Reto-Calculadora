const numbers = document.getElementsByClassName('number');
const operationsScreen = document.getElementById('operationsScreen');
const entry = document.getElementById('accumulator');
const clearEntry = document.getElementById('clearEntry')
const clear = document.getElementById('clear');
const backSpace = document.getElementById('backSpace');
const binaryOps = document.getElementsByClassName('binary');
const equal = document.getElementById('equal');
const historyBtn = document.getElementById('historyBtn');
const memoryBtn = document.getElementById('memoryBtn');
const registry = document.getElementById('registry');
const memory = document.getElementById('memory');
const operationsHistory = document.getElementById('operationsHistory');
const resultHistory = document.getElementById('resultHistory');
const unaryOps = document.getElementsByClassName('unary');
const cleanMemory = document.getElementById('cleanMemory');
const recoverMemory = document.getElementById('recoverMemory');
const addToMemory = document.getElementById('addToMemory');
const substractToMemory = document.getElementById('substractToMemory');
const storageInMemory = document.getElementById('storageInMemory');


let queueOps = [];
let entryConcatenable = false;

// Event Listener para botones numéricos
for (let i = 0; i < numbers.length; i++) {
    numbers[i].addEventListener('click', () => {
        if(queueOps.length == 1){
            queueOps.pop();
            insertRecord(operationsScreen.innerText, entry.innerText);
        }
        if(queueOps.length == 3){
            let array = operationsScreen.innerText.split(' ');
            array.pop();
            operationsScreen.innerText = array.join(' ');
            queueOps.pop();       
        }
        validateEntry(numbers[i].innerText);   
    });
}

// Event Listener para botón CE
clearEntry.addEventListener('click', () => {
    
    if(queueOps.length % 2 == 1){
        if(queueOps.length == 1)
        insertRecord(operationsScreen.innerText, entry.innerText);
        let array = operationsScreen.innerText.split(' ');
        array.pop();
        operationsScreen.innerText = array.join(' ');
        queueOps.pop();
    }
    entry.innerText = '0';
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
for (let i = 0; i < unaryOps.length; i++) {
    let unaryOp = unaryOps[i];
    unaryOp.addEventListener('click', () => {
        let numberInEntry = parseFloat(entry.innerText);
        let uOperator = unaryOp.id;
        let result = doAlgebraicOperation(numberInEntry, uOperator);

        if (queueOps.length % 2 == 0) {

            if (queueOps.length == 0)
                operationsScreen.innerText = uOperator + '(' + numberInEntry + ')';
            else
                operationsScreen.innerText += ' ' + uOperator + '(' + numberInEntry + ')';

        }
        else {
            let array = operationsScreen.innerText.split(' ');
            let lastNumber = array.pop();
            array.push(uOperator + '(' + lastNumber + ')');
            operationsScreen.innerText = array.join(' ');
            queueOps.pop();
        }
        entry.innerText = result;
        queueOps.push(result);

        entryConcatenable = false;
    });
}

// Event Listener para los botones de operaciones Binarias.
for (let i = 0; i < binaryOps.length; i++) {
    let binaryOp = binaryOps[i];

    binaryOp.addEventListener('click', () => {
        let numberInEntry = parseFloat(entry.innerText);
        let newOperator = binaryOp.innerText;

        if (queueOps.length == 0) {
            operationsScreen.innerText = ' ' + numberInEntry + ' ' + newOperator;
            queueOps.push(numberInEntry);
        }
        else if (queueOps.length == 1) {
            operationsScreen.innerText += ' ' + newOperator;
        }
        else if (queueOps.length == 2) {
            /*2+1+ */
            if (entryConcatenable) {
                operationsScreen.innerText += ' ' + numberInEntry + ' ' + newOperator;
                let result = binaryQueueOperation(numberInEntry);
                entry.innerText = result;
                queueOps.push(result);
            }
            /*2+/*/
            else {
                let array = operationsScreen.innerText.split(' ');
                array.pop();
                array.push(newOperator);
                operationsScreen.innerText = array.join(' ');
                queueOps.pop();
            }
        }
        else {
            operationsScreen.innerText += ' ' + newOperator;
            queueOps.pop();
            let result = binaryQueueOperation(numberInEntry);
            entry.innerText = result;
            queueOps.push(result);
        }

        queueOps.push(newOperator);
        entryConcatenable = false;
    });
}

function binaryQueueOperation(number2){
    let oldOperator = queueOps.pop();
    let number = queueOps.pop();
    return doArithmeticOperations(number, number2, oldOperator);
}

// Event Listener para el boton igual
equal.addEventListener('click', () => {
    let numberInEntry = parseFloat(entry.innerText);
    let equalOperator = equal.innerText;

    if(queueOps.length == 0){
        operationsScreen.innerText = numberInEntry + ' ' + equalOperator;
    }
    else if(queueOps.length == 1){
        operationsScreen.innerText += ' ' + equalOperator;
        queueOps.pop();
    }
    else if(queueOps.length == 2){
        operationsScreen.innerText += ' ' + numberInEntry + ' ' + equalOperator;
        let result = binaryQueueOperation(numberInEntry);
        entry.innerText = result;
    }
    else{
        operationsScreen.innerText += ' ' + equalOperator;
        queueOps.pop();
        let result = binaryQueueOperation(numberInEntry);
        entry.innerText = result;       
    }
    

    entryConcatenable = false;
    //newRecord = true;
    insertRecord(operationsScreen.innerText, entry.innerText);
});

function insertRecord(operations, result){
    if(registry.lastElementChild.localName == 'span')
        registry.removeChild(document.getElementById('historyEmpty'));
    registry.innerHTML = `
    <div class="record">
        <div class="operations" id="operationsHistory">${operations}</div>
        <div class="accumulator history" id="resultHistory">${result}</div>
    </div>` + registry.innerHTML;
}

// Función que revisa el caracter ingresado al oprimir una de las teclas numéricas
function validateEntry(character) {
    let storedNumber = '0';

    if (entryConcatenable)
        storedNumber = entry.innerText;

    entryConcatenable = true;

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


historyBtn.addEventListener('click', () => {
    registry.classList.remove('inactive');
    memory.classList.add('inactive');
    historyBtn.classList.add('selected');
    memoryBtn.classList.remove('selected');
});

memoryBtn.addEventListener('click', () => {
    memory.classList.remove('inactive');
    registry.classList.add('inactive');
    memoryBtn.classList.add('selected');
    historyBtn.classList.remove('selected');
});


cleanMemory.addEventListener('click', ()=>{
    desactivateMemoryButtons();
    memory.innerHTML = '<span class = "empty" id="memoryEmpty">No hay nada guardado en la memoria</span>';
});
recoverMemory.addEventListener('click', ()=>{
    entry.innerText = memory.firstElementChild.innerText;
});
addToMemory.addEventListener('click', ()=>{
    activateMemoryButtons();
    if(memory.lastElementChild.localName == 'span')
        insertMemory(doArithmeticOperations(0, parseFloat(entry.innerText), '+'));
    else{
        let inStorage = parseFloat(memory.firstElementChild.innerText);
        let inEntry = parseFloat(entry.innerText);
        memory.firstElementChild.innerText = doArithmeticOperations(inStorage, inEntry, '+');
    }
    entryConcatenable = false;
});
substractToMemory.addEventListener('click', ()=>{
    activateMemoryButtons();
    if(memory.lastElementChild.localName == 'span')
        insertMemory(doArithmeticOperations(0, parseFloat(entry.innerText), '-'));
    else{
        let inStorage = parseFloat(memory.firstElementChild.innerText);
        let inEntry = parseFloat(entry.innerText);
        memory.firstElementChild.innerText = doArithmeticOperations(inStorage, inEntry, '-');
    }
    entryConcatenable = false;
});
storageInMemory.addEventListener('click', ()=>{
    activateMemoryButtons();
    insertMemory(entry.innerText);
    entryConcatenable = false;
});


function activateMemoryButtons(){
    cleanMemory.removeAttribute('disabled');
    recoverMemory.removeAttribute('disabled');
    cleanMemory.classList.remove('disabled');
    recoverMemory.classList.remove('disabled');

}

function desactivateMemoryButtons(){
    cleanMemory.setAttribute('disabled', 'true');
    recoverMemory.setAttribute('disabled', 'true');
    cleanMemory.classList.add('disabled');
    recoverMemory.classList.add('disabled');
}

function insertMemory(value){
    if(memory.lastElementChild.localName == 'span')
        memory.removeChild(document.getElementById('memoryEmpty'));
    memory.innerHTML = `
    <div class="accumulator history" id="memoryRecord">${value}</div>` + memory.innerHTML;
}
