// frontend/src/components/AdminPanel.js (Updated)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faArrowLeft, faListAlt, faUserShield, faSignOutAlt, faTrashAlt,faEdit } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'bootstrap';

const AdminPanel = () => {
  const [file, setFile] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [updatedQuestion, setUpdatedQuestion] = useState('');
  const [updatedAnswer, setUpdatedAnswer] = useState('');
  const navigate = useNavigate();

  const fetchFAQs = async () => {
    try {
      const res = await api.get('/api/faq/list');
      setFaqs(res.data);
    } catch (err) {
      console.error('Failed to fetch FAQs:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch FAQ list. You may not have admin privileges.');
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      return toast.error('Please select a file to upload.');
    }
    const formData = new FormData();
    formData.append('faqDocument', file);
    try {
      await api.post('/api/faq/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('File uploaded and FAQs updated successfully!');
      setFile(null);
      await fetchFAQs();
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error(err.response?.data?.message || 'File upload failed. You may not have admin privileges.');
    }
  };

  const handleDeleteFAQ = async (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ? This action cannot be undone.")) {
      try {
        await api.delete(`/api/faq/delete/${id}`);
        toast.success('FAQ deleted successfully!');
        setFaqs(faqs.filter(faq => faq._id !== id));
      } catch (err) {
        console.error('Delete failed:', err);
        toast.error(err.response?.data?.message || 'Failed to delete FAQ. You may not have admin privileges.');
      }
    }
  };

  const handleUpdateFAQ = async (e) => {
    e.preventDefault();
    if (!updatedQuestion || !updatedAnswer) {
      return toast.error('Question and Answer cannot be empty.');
    }
    try {
      await api.put(`/api/faq/update/${selectedFAQ._id}`, {
        question: updatedQuestion,
        answer: updatedAnswer,
      });
      toast.success('FAQ updated successfully!');
      
      setFaqs(faqs.map(faq => 
        faq._id === selectedFAQ._id ? { ...faq, question: updatedQuestion, answer: updatedAnswer } : faq
      ));
      const modal = Modal.getInstance(document.getElementById('faqModal'));
      modal.hide();
      setSelectedFAQ(null);
      setUpdatedQuestion('');
      setUpdatedAnswer('');
    } catch (err) {
      console.error('Update failed:', err);
      toast.error(err.response?.data?.message || 'Failed to update FAQ. You may not have admin privileges.');
    }
  };

  const handleEditFAQ = (faq) => {
    setSelectedFAQ(faq);
    setUpdatedQuestion(faq.question);
    setUpdatedAnswer(faq.answer);
    const modalElement = document.getElementById('faqModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  };

  const handleViewFAQ = (faq) => {
    setSelectedFAQ(faq);
    setUpdatedQuestion(faq.question);
    setUpdatedAnswer(faq.answer);
    const modalElement = document.getElementById('faqModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully!'); 
    navigate('/');
  };

  return (
    <div className="d-flex flex-column h-100 container-fluid p-0">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <FontAwesomeIcon icon={faUserShield} className="me-2" />
            Admin Panel
          </a>
          <div className="d-flex ms-auto">
            <button 
              className="btn btn-outline-warning me-2 rounded-pill"
              onClick={() => navigate('/chat')}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Back to Chat
            </button>
            <button 
              className="btn btn-outline-danger rounded-pill"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="me-1" /> Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="container p-4 flex-grow-1">
        <div className="card shadow-lg mb-4 rounded-3">
          <div className="card-body">
            <h5 className="card-title text-center mb-3">Upload FAQs</h5>
            <form onSubmit={handleUpload}>
              <div className="input-group mb-3">
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                />
                <button className="btn btn-primary" type="submit">
                  <FontAwesomeIcon icon={faCloudUploadAlt} className="me-2" /> Upload
                </button>
              </div>
              <p className="text-muted text-center">Supported formats: .txt or .pdf</p>
            </form>
          </div>
        </div>
        <div className="card shadow-lg rounded-3">
          <div className="card-body">
            <h5 className="card-title text-center mb-3">
              <FontAwesomeIcon icon={faListAlt} className="me-2" />
              Stored FAQs
            </h5>
            {faqs.length > 0 ? (
              <ul className="list-group list-group-flush">
                {faqs.map((faq) => (
                  <li key={faq._id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-column flex-grow-1 me-3">
                      <strong>Source: {faq.sourceDocument}</strong>
                      <div className="text-xs text-muted">
                        <small>Uploaded: {new Date(faq.createdAt).toLocaleString()}</small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <button 
                        className="btn btn-sm btn-outline-info me-2"
                        onClick={() => handleEditFAQ(faq)}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteFAQ(faq._id)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} /> Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted">No FAQs found. Upload a document to get started.</p>
            )}
          </div>
        </div>
      </div>
      {/* Modal for viewing and editing FAQ content */}
      <div className="modal fade" id="faqModal" tabIndex="-1" aria-labelledby="faqModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="faqModalLabel">
                {selectedFAQ?.sourceDocument}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleUpdateFAQ}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="faqQuestion" className="form-label">Question</label>
                  <input
                    type="text"
                    className="form-control"
                    id="faqQuestion"
                    value={updatedQuestion}
                    onChange={(e) => setUpdatedQuestion(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="faqAnswer" className="form-label">Answer</label>
                  <textarea
                    className="form-control"
                    id="faqAnswer"
                    rows="10"
                    value={updatedAnswer}
                    onChange={(e) => setUpdatedAnswer(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-success">Save changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;