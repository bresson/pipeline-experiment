class TaskQueue {
    constructor() {
      this.taskQueue = [];
      this.callbackMap = new Map();
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
      const { callback, ...taskData } = task; 
      this.taskQueue.push(taskData);
      this.callbackMap.set(taskData.id, callback); 
      this.notify();
    }
  
    getTask() {
      return this.taskQueue.shift();
    }
  
    hasTasks() {
      return this.taskQueue.length > 0;
    }
  
    getCallbackById(taskId) {
      return this.callbackMap.get(taskId);
    }
  
    removeCallbackById(taskId) {
      this.callbackMap.delete(taskId);
    }
  }
  
  export { TaskQueue };
  