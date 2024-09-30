# Task/Work queue

Experiment only with code quality to match.

Inspired by Erlang parallelism and messaging, experiment in modeling a producer-consumer pipeline using a task queue, task manager and worker pool to perform and potentially parallelize more intensive computation work outside of the UI/main thread. These pipelines are integral to many technology stacks such as AWS SQS, Google Cloud Pub/Sub, etc. and are applicable in many problem domains such serverless architectures, event driven and distributed systems, etc.

The pipeline is tested by a script that attempts to find every prime number between the number `2` and an upperbound set by the user (with a limit of `50,000,000`)

The key files/modules used in this experiment:
- utils/taskManager.js
- utils/taskQueue.js
- utils/workerPool.js


## To use
1. In this directory, run `npm i` or `yarn add`
2. The dashboard should open on the default browser at `http://localhost:5173/`

### Key UI Options

#### Spinning cube
This cube relies on the UI thread to spin. Any prolonged disruption to the UI thread will interrupt the cube's spin. In short, the UI cube represents any UI element and demonstrates what happens when a computationally intensive task is performed on the UI/main thread.

#### Use workers 
Toggle workers which act in the background or use the main thread. Beware, __using the main thread with Task Payload > 1,000,000 can stall and crash the browser__. If Browser does crash, refresh it.

#### Task payload
The upperbound of the test, can be 100,000 to 50,000,000. `BEWARE raising the upper bound beyond 1,000,000 for the main thread tests (tests that do not use Workers)`

#### Add Task
Each click adds a new task to the task queue

#### Reset
Resets the UI to initial state of 0. 
- Should automatically disable while tasks are pending or in process but `tests with main thread are problematic in regards to disabling this button`

## Key components

### TaskQueue
Implemented using the observer pattern and eagerly offloads work to any listening modules, such as the TaskManager in pipeline. When a new task is added, the TaskQueue notifies all subscribed observers of a new task.

### TaskManager
The TaskManager acts as the orchestrator for managing and distributing tasks. It subscribes to the TaskQueue to receive notifications when new tasks are added. Upon receiving a task, the TaskManager delegates the work to a WorkerPool for processing. It keeps track of task timings and handles task completion by invoking the task callback.

### WorkerPool
A collection of Web Workers ready to parallelize tasks in the background, offloading computationally intensive operations from the main UI thread. It manages a pool of worker threads that can execute tasks concurrently. The WorkerPool ensures efficient task distribution by dynamically allocating tasks to available workers and handling task completion.


## Potential Future Steps/Enhancements

### Kernel Architecture
Rewrite the TaskManager as a central dispatcher in a kernel architecture which would allow for more flexible and dynamic task delegation, enabling the TaskManager to route tasks to different specialized workers or external systems. 

### Actor Model
Expand the capability of Web Workers by abstracting them as actors in an Actor Model. 

### Remote/Cloud Task Runners
Integrating remote or cloud-based task runners, such as RabbitMQ or other message queuing systems, can handle distributed tasks. 

### Load/stress test
Benchmark the potential throughput of the pipeline under load and other conditions.


---
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
