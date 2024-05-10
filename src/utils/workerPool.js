import { WorkerInterface } from './workerInterface';

class WorkerPool extends WorkerInterface {
    constructor(size = 2) {
        super();
        this.workers = [];
        this.taskMap = new Map();
        this.initWorkers(size);
    }

    initWorkers(size) {
        for (let i = 0; i < size; i++) {
            const worker = new Worker('/worker.js');
            worker.onmessage = (event) => {
                this.onTaskComplete(worker, event.data);
            };
            this.workers.push({ worker, state: 'idle' });
            this.notifyIdleWorkerAvailable(worker);
        }
    }

    setWorkerState(worker, state) {
        const workerObj = this.workers.find(w => w.worker === worker);
        if (workerObj) {
            workerObj.state = state;
            if (state === 'idle') {
                this.notifyIdleWorkerAvailable(worker);
            }
        }
    }

    onTaskComplete(worker, result) {
        console.log('Task completed with result:', result);
        this.setWorkerState(worker, 'idle');
        const taskId = result.taskId;
        const task = this.taskMap.get(taskId);
        if (task) {
            this.taskMap.delete(taskId);
        }
        if (this.onTaskCompleteCallback) {
            this.onTaskCompleteCallback(result);
        }
    }

    notifyIdleWorkerAvailable(worker) {
        console.log('Worker is idle and ready for tasks');
    }

    isIdle() {
        return this.workers.some(w => w.state === 'idle');
    }

    async executeTask(task) {
        const workerObj = this.workers.find(w => w.state === 'idle');
        if (workerObj) {
            this.taskMap.set(task.id, task);
            workerObj.state = 'busy';
            workerObj.worker.postMessage(task);
        } else {
            await new Promise(resolve => setTimeout(resolve, 100));
            await this.executeTask(task);
        }
    }

    setOnTaskCompleteCallback(callback) {
        this.onTaskCompleteCallback = callback;
    }
}

export { WorkerPool };
