import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEquipmentList } from '../services/equipmentService.js';
import { issueEquipment } from '../services/lendingService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const ROLE_OPTIONS = [
  { value: 'STUDENT', label: 'Student' },
  { value: 'PROFESSOR', label: 'Professor' },
  { value: 'TECHNICIAN', label: 'Lab Technician' },
];

function IssueEquipment() {
  const [equipment, setEquipment] = useState([]);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    equipmentId: '',
    quantity: '',
    issuedToRole: '',
    issuedTo: '',
    contactNumber: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const selectedEquipment = equipment.find((item) => item.id === Number(form.equipmentId));

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const data = await getEquipmentList(user?.id);
        setEquipment(data.filter((item) => item.availableQuantity > 0));
      } catch (err) {
        setError('Unable to load available equipment.');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (contactNumber) => {
    if (!contactNumber) return true;
    return true;
  };

  const validateStep = () => {
    setError('');

    if (step === 1) {
      if (!form.equipmentId) {
        setError('Please select available equipment.');
        return false;
      }
      return true;
    }

    if (step === 2) {
      const quantity = Number(form.quantity);
      if (!form.quantity || Number.isNaN(quantity) || quantity <= 0) {
        setError('Please enter a valid quantity greater than zero.');
        return false;
      }
      if (selectedEquipment && quantity > selectedEquipment.availableQuantity) {
        setError(`Only ${selectedEquipment.availableQuantity} item(s) are available for this equipment.`);
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (!form.issuedToRole) {
        setError('Please select a role for the person receiving the equipment.');
        return false;
      }
      return true;
    }

    if (step === 4) {
      if (!form.issuedTo.trim()) {
        setError('Please enter the name of the person receiving the equipment.');
        return false;
      }
      return true;
    }

    if (step === 5) {
      if (!validateEmail(form.contactNumber.trim())) {
        setError('Please enter a valid contact number or leave it blank.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = (event) => {
    event.preventDefault();
    if (validateStep() && step < 5) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = (event) => {
    event.preventDefault();
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateStep()) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await issueEquipment({
        equipmentId: Number(form.equipmentId),
        quantity: Number(form.quantity),
        issuedTo: form.issuedTo.trim(),
        issuedToRole: form.issuedToRole,
        contactNumber: form.contactNumber.trim() || null,
        userId: user?.id,
      });
      navigate('/lending/return');
    } catch (err) {
      const message = err?.response?.data || err?.message || 'Unable to issue equipment. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header centered-header">
        <h1>Issue Equipment</h1>
        <p>Follow the steps to issue equipment with quantity and role details.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="form-page">
          <div className="form-card">
            <h2 className="form-title">Issue Equipment</h2>
            <form onSubmit={step === 5 ? handleSubmit : handleNext}>
              <ErrorMessage message={error} />

              <div className="step-indicator">
                Step {step} of 5
              </div>

          {step === 1 && (
            <label>
              Equipment
              <select name="equipmentId" value={form.equipmentId} onChange={handleChange}>
                <option value="">Select available equipment</option>
                {equipment  
                  .filter(item =>
                    item.status === "AVAILABLE" || item.status === "IN_USE"
                  )
                  .map(item => (
                    <option key={item.id} value={item.id} disabled={item.availableQuantity === 0}>
                      {item.name} | {item.serialNumber} | {item.labLocation}
                    </option>
                  ))}
              </select>
            </label>
          )}

          {step === 2 && (
            <label>
              Quantity
              <input
                name="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Enter number of items to issue"
              />
              {selectedEquipment && (
                <small>{selectedEquipment.availableQuantity} available</small>
              )}
            </label>
          )}

          {step === 3 && (
            <label>
              Role
              <select name="issuedToRole" value={form.issuedToRole} onChange={handleChange}>
                <option value="">Select role</option>
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {step === 4 && (
            <label>
              Issued To
              <input
                name="issuedTo"
                value={form.issuedTo}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </label>
          )}

          {step === 5 && (
            <label>
              Contact Number
              <input
                name="contactNumber"
                type="text"
                value={form.contactNumber}
                onChange={handleChange}
                placeholder="Enter contact number"
              />
              <small>Leave blank if contact info is not required.</small>
            </label>
          )}

          <div className="button-group">
            {step > 1 && (
              <button type="button" className="button-secondary" onClick={handleBack}>
                Back
              </button>
            )}
            <button type="submit" className="button-primary" disabled={submitting}>
              {step === 5 ? (submitting ? 'Issuing…' : 'Issue Equipment') : 'Next'}
            </button>
          </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default IssueEquipment;
