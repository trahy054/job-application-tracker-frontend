import axios from 'axios';

const API_URL = 'http://localhost:5000/api/jobs';

export const getJobs = async () => {
    const res = await axios.get(API_URL);
    return res.data;
  };

  export const addJob = async (job) => {
    const res = await axios.post(API_URL, job);
  }
