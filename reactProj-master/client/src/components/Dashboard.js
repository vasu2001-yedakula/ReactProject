import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  var { userRole } = location.state || {};
  const role = userRole === 'recruiter' ? 'Recruiter' : 'Aspirant';
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    description: '',
  });
    // State to hold the ID of the job to edit
    const [editJobId, setEditJobId] = useState(null);

  useEffect(() => {
    // Fetch jobs from the backend API
    axios
      .get('http://localhost:5000/api/jobs')
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error);
      });
  }, []);

  const handleApply = (jobId) => {
    alert('successfully applied..!')
    console.log('Applying for job with ID:', jobId);
  };

  const handleAdd = (event) => {
    event.preventDefault();
    
    if (editJobId) {
      formData.id = editJobId;
    }
      // If the formData contains an ID, it's an update
      axios
        .post(`http://localhost:5000/api/jobs`, formData)
        .then((response) => {
          // Handle successful response (e.g., show a success message)
          console.log('Job updated successfully:', response.data);
          setFormData({
            role: '',
            company: '',
            description: '',
          });
          setEditJobId(null)
          // Fetch updated jobs after updating a job
          axios
            .get('http://localhost:5000/api/jobs')
            .then((response) => {
              setJobs(response.data);
              handleCloseModal(); // Close the modal after updating the job
            })
            .catch((error) => {
              console.error('Error fetching jobs:', error);
            });
        })
        .catch((error) => {
          // Handle error (e.g., show an error message)
          console.error('Error updating job:', error);
        });
  };

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle editing a job
  const handleEdit = (jobId) => {
    // Set the ID of the job to edit
    setEditJobId(jobId);
    console.log("Editing JobID: ", editJobId);

    // Find the selected job from the jobs array
    const selectedJob = jobs.find((job) => job.id === jobId);

    // Update the formData state with the data of the selected job
    setFormData({
      role: selectedJob.role,
      company: selectedJob.company,
      description: selectedJob.description,
    });

    // Open the job form as a popup for editing
    handleOpenModal();
  };

  const jobForm = () => {
    return (
      <div className="modal">
        <div className="modal-content">
          <h3>Add Job</h3>
          <form onSubmit={handleAdd}>
            <input type="text" placeholder="Role" name="role" value={formData.role} onChange={handleChange} />
            <input type="text" placeholder="Company" name="company" value={formData.company} onChange={handleChange} />
            <textarea placeholder="Description" name="description" value={formData.description} onChange={handleChange} />
            <div className="modal-buttons">
              <button type="submit">Submit</button>
              <button type="button" onClick={handleCloseModal}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderAddJobForm = () => {
    if (userRole === 'recruiter') {
      return (
        <div>
          <button className="add-job-button" onClick={handleOpenModal}>Add Job</button>
          {showModal && jobForm()}
        </div>
      );
    }
  };

  return (
    <div className="dashboard-container">
      <div className='logout'>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <div className="header">
        <h2>{role} Dashboard</h2>
        {renderAddJobForm()}
      </div>

      {jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        jobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-card-details">
              <h3>{job.role}</h3>
              <p>{job.company}</p>
              <p>{job.description}</p>
            </div>
            <div>
              {userRole === 'aspirant' ? (
                <button onClick={() => handleApply(job.id)}>Apply</button>
              ) : (
                <button onClick={() => handleEdit(job.id)}>Edit</button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
