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

// function findPrimeFactorsInRange(start, end) {
//     const getPrimeFactors = (num) => {
//         const factors = [];
//         while (num % 2 === 0) {
//             factors.push(2);
//             num = Math.floor(num / 2);
//         }
//         for (let i = 3; i * i <= num; i += 2) {
//             while (num % i === 0) {
//                 factors.push(i);
//                 num = Math.floor(num / i);
//             }
//         }
//         if (num > 2) {
//             factors.push(num);
//         }
//         return factors;
//     };

//     const results = {};
//     for (let num = start; num <= end; num++) {
//         results[num] = getPrimeFactors(num);
//     }
//     return results;
// }

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