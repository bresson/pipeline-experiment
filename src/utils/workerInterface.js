export class WorkerInterface {
    isIdle() {
        throw new Error('Method "isIdle" must be implemented');
    }

    async executeTask(task) {
        throw new Error('Method "executeTask" must be implemented');
    }
}