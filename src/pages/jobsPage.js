import React, { useState, useEffect } from 'react';
import { getJobs, addJob } from '../services/jobService';
import axios from "axios";
import "../App.css";

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
    setJobs(jobs.filter(job => job._id !== id));
  };

  const startUpdating = (job) => {
    setUpdatingId(job._id);
    setUpdateForm({ company: job.company, position: job.position, status: job.status });
  };

  const handleUpdateChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e, id) => {
    e.preventDefault();
    const res = await axios.put(`http://localhost:5000/api/jobs/${id}`, updateForm);
    setJobs(jobs.map(job => job._id === id ? res.data : job));
    setUpdatingId(null);
  };

  return (
    <div className="container">
      <h1 className="title">Job Tracker</h1>

      <div className="filter-section">
        <input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="id">Sort by Time</option>
          <option value="company">Sort by Company</option>
        </select>
        <button onClick={fetchJobs}>Apply</button>
      </div>

      <form className="inline-form" onSubmit={handleSubmit}>
        <input name="company" placeholder="Company" value={form.company} onChange={handleChange} required />
        <input name="position" placeholder="Position" value={form.position} onChange={handleChange} />
        <input name="status" placeholder="Status" value={form.status} onChange={handleChange} required />
        <button type="submit" className="add-btn">Add Job</button>
      </form>

      <ul className="job-list">
        {jobs.map(job => (
          <li key={job._id} className="job-item">
            {updatingId === job._id ? (
              <form className="inline-form" onSubmit={(e) => handleUpdateSubmit(e, job._id)}>
                <input name="company" value={updateForm.company} onChange={handleUpdateChange} required />
                <input name="position" value={updateForm.position} onChange={handleUpdateChange} />
                <input name="status" value={updateForm.status} onChange={handleUpdateChange} required />
                <button type="submit" className="add-btn">Save</button>
                <button type="button" onClick={() => setUpdatingId(null)} className="cancel-btn">Cancel</button>
              </form>
            ) : (
              <>
                <span>{job.company} - {job.position} - {job.status}</span>
                <div>
                  <button onClick={() => startUpdating(job)} className="update-btn">Update</button>
                  <button onClick={() => handleDelete(job._id)} className="delete-btn">Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobsPage;