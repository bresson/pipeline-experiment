// importScripts('primeUtils.js');

self.onmessage = function (e) {
    const startTime = performance.now();
    const task = e.data;
    const result = findPrimes(task.payload.start, task.payload.end);
    const endTime = performance.now();
    const processingTime = (endTime - startTime) / 1000;

    self.postMessage({
        taskId: task.id,
        result: result,
        processingTime: processingTime
    });
};

// evil dupe, importScripts('primeUtils.js'); isn't working right now
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

function findPrimes(start, end) {
    const primes = [];
    for (let i = start; i <= end; i++) {
        if (isPrime(i)) primes.push(i);
    }
    return primes;
}