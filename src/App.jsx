import React, { useState, useEffect } from 'react';
import { Container, Button, Switch, FormControlLabel, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { WorkerPool } from './utils/workerPool';
import { TaskQueue } from './utils/taskQueue';
import { TaskManager } from './utils/taskManager';

const taskQueue = new TaskQueue();
const workerPool = new WorkerPool(2);
const taskManager = new TaskManager(taskQueue);
taskManager.addWorker(workerPool);

const generateTask = (id, callback) => ({
  id,
  payload: { start: 1, end: 30_000_000 },
  callback: (result) => callback(id, result)
});

const App = () => {
  const [useWorkers, setUseWorkers] = useState(true);
  const [taskCount, setTaskCount] = useState(0);
  const [animationRunning, setAnimationRunning] = useState(false);
  const [taskDurations, setTaskDurations] = useState([]);
  // const [queueLength, setQueueLength] = useState(0);
  // const [allTasks, setAllTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const toggleUseWorkers = () => {
    setUseWorkers(!useWorkers);
  };

  const addTask = () => {
    const callback = (id, result) => {
      console.log(`2 : Task ${id} completed with result: ${result.result.length} primes`);
      setTaskDurations(prev => [...prev, { taskId: result.taskId, duration: result.processingTime }]);
      setCompletedTasks(prev => [...prev, result.taskId]);
    };
    const task = generateTask(taskCount, callback);

    taskQueue.addTask(task);
    setTaskCount(taskCount + 1);
    // setAllTasks(prev => [...prev, task.id]);
    // setQueueLength(taskQueue.taskQueue.length);
  };

  const processTaskOnMainThread = () => {
    const task = generateTask(taskCount);
    const startTime = performance.now();
    const result = findPrimes(task.payload.start, task.payload.end);
    const endTime = performance.now();
    const processingTime = (endTime - startTime) / 1000;
    console.log(`Main thread task ${task.id} completed in ${processingTime} seconds with result: ${result.length} primes`);
    setTaskDurations(prev => [...prev, { taskId: task.id, duration: processingTime }]);
    setCompletedTasks(prev => [...prev, task.id]);
  };

  const handleAddTask = () => {
    if (useWorkers) {
      addTask();
    } else {
      processTaskOnMainThread();
    }
  };

  const handleResetTasks = () => {
    taskQueue.taskQueue = [];
    // setQueueLength(0);
    setTaskDurations([]);
    // setAllTasks([]);
    setCompletedTasks([]);
  };

  useEffect(() => {
    if (!animationRunning) {
      setAnimationRunning(true);
      const animate = () => {
        const element = document.getElementById('animation');
        if (element) {
          element.style.transform = `rotate(${Date.now() % 360}deg)`;
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [animationRunning]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setQueueLength(taskQueue.taskQueue.length);
  //   }, 500);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <Container>
      <Typography variant="h4">Worker Pool vs Main Thread Demo</Typography>
      <FormControlLabel
        control={<Switch checked={useWorkers} onChange={toggleUseWorkers} />}
        label="Use Workers"
      />
      <Button variant="contained" onClick={handleAddTask}>Add Task</Button>
      <Button variant="contained" color="secondary" onClick={handleResetTasks}>Reset/Abort Tasks</Button>
      {/* <Typography variant="h6">Queue Length: {queueLength}</Typography> */}
      <Typography variant="h6">Total Tasks Added: {taskCount}</Typography>
      <Typography variant="h6">Completed Tasks: {completedTasks.length}</Typography>
      <Typography variant="h6">Task Durations:</Typography>
      <List>
        {taskDurations.map((task) => (
          <ListItem key={task.taskId}>
            <ListItemText primary={`Task ${task.taskId}`} secondary={`Duration: ${task.duration.toFixed(2)} seconds`} />
          </ListItem>
        ))}
      </List>
      <Box id="animation" sx={{ width: 50, height: 50, backgroundColor: 'blue', marginTop: 2 }} />
    </Container>
  );
};

export default App;

// Utility function to find primes
const isPrime = (num) => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
};

const findPrimes = (start, end) => {
  const primes = [];
  for (let i = start; i <= end; i++) {
    if (isPrime(i)) primes.push(i);
  }
  return primes;
};
