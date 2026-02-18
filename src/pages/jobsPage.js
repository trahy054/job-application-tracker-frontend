import React, { useState, useEffect } from 'react';
import { getJobs, addJob } from '../services/jobService';

const jobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ company: "", position: "", status: "" });

  useEffect(() => {
    fetJobs();
    }, []);
    
  const fetJobs = async () => {
    const data = await getJobs();
    setJobs(data);
  };

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const newJob = await addJob(form);
      setJobs([...jobs, newJob]);
      setForm({ company: "", position: "", status: "" });
    };

    return (
      <div style={{padding: "`20px"}}>
        <h1>Job Application</h1>
        <form onSubmit={handleSubmit}>
          <input 
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            required  
          />
          <input 
            name="position"
            placeholder="Position"
            value={form.position}
            onChange={handleChange}
          />
          <input 
            name="status"
            placeholder="Status"
            value={form.status}
            onChange={handleChange}
            required
          />
          <button type="submit">Add Job</button>
        </form>

        <ul>
          {jobs.map(job => (
            <li key={job._id}>{job.company} - {job.position} - {job.status}</li>
          ))}
        </ul>
      </div>
    );
}
export default jobsPage;