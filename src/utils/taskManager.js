import { WorkerPool } from './workerPool.js';
import { TaskQueue } from './taskQueue.js';
import { WorkerInterface } from './workerInterface';

class TaskManager {
    constructor(taskQueue) {
        this.taskQueue = taskQueue;
        this.workers = new Map();
        this.taskQueue.subscribe(this.dispatchTasks.bind(this));
        this.taskTimings = new Map(); // Track timings for each task
        this.callbacks = new Map(); // Store callbacks for tasks
    }

    addWorker(worker) {
        if (!(worker instanceof WorkerInterface)) {
            throw new Error('Worker must implement WorkerInterface');
        }
        if (worker instanceof WorkerPool) {
            worker.setOnTaskCompleteCallback(this.onTaskComplete.bind(this));
        }
        this.workers.set(worker.id || `worker${this.workers.size + 1}`, worker);
        this.dispatchTasks();
    }

    removeWorker(workerId) {
        this.workers.delete(workerId);
    }

    async dispatchTasks() {
        console.log('1: dispatching task');
        if (this.taskQueue.hasTasks()) {
            for (const [workerId, worker] of this.workers) {
                if (worker.isIdle()) {
                    const task = this.taskQueue.getTask();
                    if (task) {
                        console.log('2: received task', task);

                        // Record time when the task is received
                        this.taskTimings.set(task.id, {
                            received: performance.now(),
                            dispatched: null
                        });

                        // Store the callback
                        this.callbacks.set(task.id, task.callback);

                        // Dispatch the task to the worker
                        this.taskTimings.get(task.id).dispatched = performance.now();
                        const taskData = { ...task, callback: undefined }; // Remove the callback from task data
                        await worker.executeTask(taskData); // Await here to ensure dispatching is tracked correctly
                    }
                }
            }
        }
    }

    onTaskComplete(result) {
        console.log('TaskManager received completed task result:', result);
        const taskId = result.taskId;
        const taskCallback = this.callbacks.get(taskId);

        if (taskCallback) {
            taskCallback(result);
            this.callbacks.delete(taskId); // Clean up the callback
        }

        const taskTiming = this.taskTimings.get(taskId);
        if (!taskTiming) {
            console.error(`Task timing for taskId ${taskId} not found.`);
            return;
        }
        taskTiming.end = performance.now();

        const endTime = performance.now();
        const receivedTime = taskTiming.received;
        const dispatchedTime = taskTiming.dispatched;

        console.log(`Task ${taskId} received at ${receivedTime}`);
        console.log(`Task ${taskId} dispatched at ${dispatchedTime}`);
        console.log(`Task ${taskId} completed at ${endTime}`);

        const processingTime = (endTime - receivedTime) / 1000;
        console.log(`Task ${taskId} completed in ${processingTime} seconds`);

        // Clean up
        this.taskTimings.delete(taskId);
    }

    findTaskById(taskId) {
        return Array.from(this.taskQueue.taskQueue).find(task => task.id === taskId);
    }
}

export { TaskManager };
