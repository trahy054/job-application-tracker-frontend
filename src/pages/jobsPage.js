import React, { useState, useEffect } from 'react';
import { addJob } from '../services/jobService';
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

  const [stats, setStats] = useState({
    totalJobs: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0
  });

  // Helper function to update stats based on current jobs array
  const updateStats = (jobsArray) => {
    const newStats = {
      totalJobs: jobsArray.length,
      applied: jobsArray.filter(j => j.status === "Applied").length,
      interview: jobsArray.filter(j => j.status === "Interview").length,
      offer: jobsArray.filter(j => j.status === "Offer").length,
      rejected: jobsArray.filter(j => j.status === "Rejected").length,
    };

    setStats(newStats);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch jobs with current filters and sorting
  const fetchJobs = async () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (filterStatus) params.append("status", filterStatus);
    if (sortBy) params.append("sortBy", sortBy);

    try {
      const { data } = await axios.get(`http://localhost:5000/api/jobs?${params.toString()}`);
      setJobs(data);
      updateStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission to add a new job
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newJob = await addJob(form);
      const updatedJobs = [...jobs, newJob];
      setJobs(updatedJobs);
      setForm({ company: "", position: "", status: "" });
      updateStats(updatedJobs);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle job deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`);
      const updatedJobs = jobs.filter(job => job._id !== id);
      setJobs(updatedJobs);
      updateStats(updatedJobs);
    } catch (err) {
      console.error(err);
    }
  };

  // Start updating a job
  const startUpdating = (job) => {
    setUpdatingId(job._id);
    setUpdateForm({ company: job.company, position: job.position, status: job.status });
  };

  const handleUpdateChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  // Handle form submission to update a job
  const handleUpdateSubmit = async (e, id) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5000/api/jobs/${id}`, updateForm);
      const updatedJobs = jobs.map(job => job._id === id ? res.data : job);
      setJobs(updatedJobs);
      setUpdatingId(null);
      updateStats(updatedJobs);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="stats-container">
        <div className="stat-card">Total Jobs: {stats.totalJobs}</div>
        <div className="stat-card">Applied: {stats.applied}</div>
        <div className="stat-card">Interview: {stats.interview}</div>
        <div className="stat-card">Offer: {stats.offer}</div>
        <div className="stat-card">Rejected: {stats.rejected}</div>
      </div>

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
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          required
        >
          <option value="">All Status</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="submit" className="add-btn">Add Job</button>
      </form>

      <ul className="job-list">
        {jobs.map(job => (
          <li key={job._id} className="job-item">
            {updatingId === job._id ? (
              <form className="inline-form" onSubmit={(e) => handleUpdateSubmit(e, job._id)}>
                <input name="company" value={updateForm.company} onChange={handleUpdateChange} required />
                <input name="position" value={updateForm.position} onChange={handleUpdateChange} />
                <select
                  name="status"
                  value={updateForm.status}
                  onChange={handleUpdateChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button type="submit" className="add-btn">Save</button>
                <button type="button" onClick={() => setUpdatingId(null)} className="cancel-btn">Cancel</button>
              </form>
            ) : (
              <>
                <>
                  <span>{job.company}</span>
                  <span>{job.position}</span>
                  <span className={`status-badge status-${job.status.toLowerCase()}`}>
                    {job.status}
                  </span>
                </>
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