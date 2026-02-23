import React, { useState, useEffect } from 'react';
import { getJobs, addJob } from '../services/jobService';
import axios from "axios";


const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ company: "", position: "", status: "" });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ company: "", position: "", status: "" });
  
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

  const startEditing = (job) => {
    setEditingId(job.id);
    setEditForm({ company: job.company, position: job.position, status: job.status });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    const res = await axios.put(`http://localhost:5000/api/jobs/${id}`, editForm);
    setJobs(jobs.map(job => job.id === id ? res.data : job));
    setEditingId(null);
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
            {editingId === job.id ? (
              // Inline edit form
              <form onSubmit={(e) => handleEditSubmit(e, job.id)}>
                <input
                  name="company"
                  value={editForm.company}
                  onChange={handleEditChange}
                  required
                />
                <input
                  name="position"
                  value={editForm.position}
                  onChange={handleEditChange}
                />
                <input
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                  required
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
              </form>
            ) : (
              <>
                {job.company} - {job.position} - {job.status} {" "}
                <button onClick={() => startEditing(job)}>Edit</button>
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