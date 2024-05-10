import { WorkerPool } from './workerPool';
import { WorkerInterface } from './workerInterface';

class TaskManager {
  constructor(taskQueue) {
    this.taskQueue = taskQueue;
    this.workers = new Map();
    this.taskQueue.subscribe(this.dispatchTasks.bind(this));
    this.taskTimings = new Map();
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

  async dispatchTasks() {
    if (this.taskQueue.hasTasks()) {
      for (const worker of this.workers.values()) {
        if (worker.isIdle()) {
          const task = this.taskQueue.getTask();
          if (task) {
            this.taskTimings.set(task.id, { received: performance.now(), dispatched: null });
            await worker.executeTask(task);
          }
        }
      }
    }
  }

  onTaskComplete(result) {
    const { taskId, processingTime } = result;
    const taskTiming = this.taskTimings.get(taskId);
    if (taskTiming) {
      taskTiming.end = performance.now();
      const duration = (taskTiming.end - taskTiming.received) / 1000;
      console.log(`Task ${taskId} completed in ${duration.toFixed(2)} seconds`);
    }

    const callback = this.taskQueue.getCallbackById(taskId);
    if (callback) {
      callback(result);
      this.taskQueue.removeCallbackById(taskId);
    }

    this.dispatchTasks();
  }
}

export { TaskManager };
