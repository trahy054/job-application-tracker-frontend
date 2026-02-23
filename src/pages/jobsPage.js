import React, { useState, useEffect } from 'react';
import { getJobs, addJob } from '../services/jobService';
import axios from "axios";


const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ company: "", position: "", status: "" });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
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

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/jobs/${id}`);
    setJobs(jobs.filter(job => job.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
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
          <li key={job.id}>{job.company} - {job.position} - {job.status}
            <button onClick={() => handleDelete(job.id)}>
              Delete
            </button>



          </li>
        ))}
      </ul>
    </div>
  );
}
export default JobsPage;