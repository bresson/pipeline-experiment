import React, { useState, useEffect, useCallback } from 'react';
import { Container, Grid, Paper, Typography, Switch, FormControlLabel, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
// import { fetchDashboardData } from '../api';
import { TaskQueue } from './utils/taskQueue';

const Dashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);
  const [useTaskQueue, setUseTaskQueue] = useState(true);
//   const [performanceData, setPerformanceData] = useState({ labels: [], data: [] });

  const toggleProcessingMode = () => {
    setUseTaskQueue(prev => !prev);
  };



  return (
    <Container>
      <Typography variant="h4">Task Queue Dashboard</Typography>
      <FormControlLabel
        control={<Switch checked={useTaskQueue} onChange={toggleProcessingMode} />}
        label='Use Task Queue: useTaskQueue'
      />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <Typography variant="h6">Performance Metrics</Typography>
            {/* <Line data={chartData} /> */}
          </Paper>
        </Grid>
        <button>Start job stream</button>
      </Grid>
    </Container>
  );
};

export default Dashboard;
