const countColumnsElement = document.querySelector('#countColumns');
const containerNumbersElement = document.querySelector('#containerNumbers');
const startWithElement = document.querySelector('#startWith');
const systemNumbersElement = document.querySelector('#systemNumbers');

const observer = (init) => {
    let state = typeof init === 'function' ? init() : init;
    const subs = new Set();

    return {
        getState: () => state,
        subscribe: (fn) => {
            subs.add(fn);
            subs.forEach(sub => sub(state));
        },
        next: (value) => {
            state = typeof value === 'function' ? value(state) : value;
            subs.forEach(sub => sub(state));
        }
    }
}

const range = (min, max) => {
    const elements = [];

    while (min <= max) {
        elements.push(min);
        ++min;
    }

    return elements;
}

const getPrims = (maxNumber) => {
    let numbers = Array(maxNumber + 1).fill().map((_, i) => i).filter(nr => nr >= 2);
    let index = 0;
    let currentPrim;

    while (index < numbers.length) {
        currentPrim = numbers[index];
        numbers = numbers.filter(nr => nr === currentPrim || nr % currentPrim !== 0);
        
        ++index;
    }

    return numbers;
}

const isPrim = (number, prims) => {
    return prims.includes(number);
}

const MAX_NUMBER = 1000;

const $firstNumber = observer(0);
const $countColumns = observer(10);
const $systemNumbers = observer(10);

const rangeNumbers = range(0, MAX_NUMBER);
const prims = getPrims(MAX_NUMBER);

const numbers = rangeNumbers.map((value) => {
    return isPrim(value, prims)
        ? { value, isPrim: true }
        : { value, isPrim: false }
})

const renderNumbers = () => {
    const first = $firstNumber.getState();
    const system = $systemNumbers.getState();
    const numbersList = numbers.filter(nr => nr.value >= first);

    const numberElements = numbersList.map(nr => `
        <div class="card card-${nr.isPrim ? 'second' : 'primary'}">
            <p class="card-header">${(nr.value).toString(system).toUpperCase()}</p>
        </div>
    `).join('');

    containerNumbersElement.innerHTML = numberElements;
}

$firstNumber.subscribe((value) => {
    startWithElement.value = value;
    renderNumbers();
});

$countColumns.subscribe((count) => {
    countColumnsElement.value = count;
    document.documentElement.style.setProperty("--countColums", count);
});

$systemNumbers.subscribe((system) => {
    systemNumbersElement.value = system;
    renderNumbers();
});

startWithElement.addEventListener('input', (event) => {
    $firstNumber.next(+event.target.value);
});

countColumnsElement.addEventListener('input', (event) => {
    $countColumns.next(+event.target.value);
});

systemNumbersElement.addEventListener('input', (event) => {
    $systemNumbers.next(+event.target.value);
});