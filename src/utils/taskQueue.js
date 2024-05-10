class TaskQueue {
    constructor() {
        this.taskQueue = [];
        this.observers = new Set();
    }

    subscribe(observer) {
        this.observers.add(observer);
    }

    unsubscribe(observer) {
        this.observers.delete(observer);
    }

    notify() {
        for (const observer of this.observers) {
            observer();
        }
    }

    addTask(task) {
        const { callback, ...taskData } = task; // Separate callback from task data
        this.taskQueue.push({ ...taskData, callbackId: task.id }); // Use callbackId for tracking
        this.notify(); // Notify all observers that a new task is available
    }

    getTask() {
        return this.taskQueue.shift(); // Remove the task from the queue and return it
    }

    hasTasks() {
        return this.taskQueue.length > 0;
    }

    getTaskById(taskId) {
        return this.taskQueue.find(task => task.id === taskId);
    }
}

export { TaskQueue };
