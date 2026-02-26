import React, { useState, useEffect } from 'react';
import { getJobs, addJob } from '../services/jobService';
import axios from "axios";


const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ company: "", position: "", status: "" });

  const [updatingId, setUpdatingId] = useState(null);
  const [updateForm, setUpdateForm] = useState({ company: "", position: "", status: "" });

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("id");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (filterStatus) params.append("status", filterStatus);
    if (sortBy) params.append("sortBy", sortBy);

    const { data } = await axios.get(`http://localhost:5000/api/jobs?${params.toString()}`);
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

  const startUpdating = (job) => {
    setUpdatingId(job.id);
    setUpdateForm({ company: job.company, position: job.position, status: job.status });
  };

  const handleUpdateChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e, id) => {
    e.preventDefault();
    const res = await axios.put(`http://localhost:5000/api/jobs/${id}`, updateForm);
    setJobs(jobs.map(job => job.id === id ? res.data : job));
    setUpdatingId(null);
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
          <li key={job.id} style={{ marginBottom: "10px" }}>
            {updatingId === job.id ? (
              // Inline update form
              <form onSubmit={(e) => handleUpdateSubmit(e, job.id)}>
                <input
                  name="company"
                  value={updateForm.company}
                  onChange={handleUpdateChange}
                  required
                />
                <input
                  name="position"
                  value={updateForm.position}
                  onChange={handleUpdateChange}
                />
                <input
                  name="status"
                  value={updateForm.status}
                  onChange={handleUpdateChange}
                  required
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setUpdatingId(null)}>Cancel</button>
              </form>
            ) : (
              <>
                {job.company} - {job.position} - {job.status} {" "}
                <button onClick={() => startUpdating(job)}>Update</button>
                <button onClick={() => handleDelete(job.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default JobsPage;