import React, { useState, useEffect } from 'react';
import { Container, Button, Switch, FormControlLabel, Typography, Box, List, ListItem, ListItemText, Slider } from '@mui/material';
import { WorkerPool } from './utils/workerPool';
import { TaskQueue } from './utils/taskQueue';
import { TaskManager } from './utils/taskManager';


const taskQueue = new TaskQueue();
const workerPool = new WorkerPool(2);
const taskManager = new TaskManager(taskQueue);
taskManager.addWorker(workerPool);

const generateTask = (id, payload, callback) => ({
  id,
  payload,
  callback: (result) => callback(id, result)
});

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const App = () => {
  const [useWorkers, setUseWorkers] = useState(true);
  const [taskCount, setTaskCount] = useState(0);
  const [animationRunning, setAnimationRunning] = useState(false);
  const [taskDurations, setTaskDurations] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [payload, setPayload] = useState(100000);

  const toggleUseWorkers = () => {
    setUseWorkers(!useWorkers);
  };

  const processTask = (useWorker) => {
    const callback = (id, result) => {
      console.log(`Task ${id} completed with result: ${result.result.length} primes`);
      setTaskDurations(prev => [...prev, { taskId: result.taskId, duration: result.processingTime }]);
      setCompletedTasks(prev => [...prev, result.taskId]);
      setInProgressTasks(prev => prev.filter(taskId => taskId !== result.taskId));
    };

    const task = generateTask(taskCount, { start: 1, end: payload }, callback);

    setInProgressTasks(prev => [...prev, task.id]);

    if (useWorker) {
      taskQueue.addTask(task);
    } else {
      const startTime = performance.now();
      const result = findPrimes(task.payload.start, task.payload.end);
      const endTime = performance.now();
      const processingTime = (endTime - startTime) / 1000;
      console.log(`Main thread task ${task.id} completed in ${processingTime} seconds with result: ${result.length} primes`);
      callback(task.id, { taskId: task.id, result, processingTime });
    }

    setTaskCount(taskCount + 1);
  };

  const handleAddTask = () => {
    processTask(useWorkers);
  };

  const handleResetTasks = () => {
    taskQueue.taskQueue = [];
    taskQueue.callbackMap.clear();
    setTaskDurations([]);
    setCompletedTasks([]);
    setInProgressTasks([]);
    setTaskCount(0);
  };

  const handlePayloadChange = (event, newValue) => {
    setPayload(newValue);
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

  return (
    <Container sx={{ flexDirection: 'column', alignItems: 'center', display: 'flex' }}>
      <Box sx={{ flexDirection: 'column', alignItems: 'center', display: 'flex' }}>
        <Typography variant="h4">Worker Pool vs Main Thread Demo</Typography>
        <Box id="animation" sx={{ width: 50, height: 50, backgroundColor: 'blue', marginTop: 2 }} />
        <FormControlLabel
          control={<Switch checked={useWorkers} onChange={toggleUseWorkers} />}
          label="Use Workers"
        />
        <Slider
          value={payload}
          onChange={handlePayloadChange}
          aria-labelledby="payload-slider"
          min={100000}
          max={50000000}
          step={100000}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => formatNumber(value)}
        />
        <Typography id="payload-slider" gutterBottom>
          Task Payload: {formatNumber(payload)}
        </Typography>
        <Box >
          <Button variant="contained" onClick={handleAddTask}>Add Task</Button>
          { ' '}
          <Button variant="contained" color="secondary" onClick={handleResetTasks} disabled={inProgressTasks.length}>Reset</Button>
        </Box>
      </Box>

      <Typography variant="h6">Total Tasks Added: {taskCount}</Typography>
      <Typography variant="h6">Completed Tasks: {completedTasks.length}</Typography>
      <Typography variant="h6">In Progress Tasks:</Typography>
      <List>
        {inProgressTasks.map((taskId) => (
          <ListItem key={taskId}>
            <ListItemText 
             primary={`Task ${taskId}`} 
             secondary="In Progress" 
             sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'white' }}
            />
          </ListItem>
        ))}
      </List>
      <Typography variant="h6">Task Durations:</Typography>
      <List>
        {taskDurations.map((task) => (
          <ListItem key={task.taskId}>
            <ListItemText 
              primary={`Task ${task.taskId} - Duration: ${task.duration.toFixed(2)} seconds`} 
              sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'white' }}
            />
          </ListItem>
        ))}
      </List>

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
