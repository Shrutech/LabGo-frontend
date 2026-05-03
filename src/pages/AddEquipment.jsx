import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEquipment } from '../services/equipmentService.js';
import ErrorMessage from '../components/ErrorMessage.jsx';

const initialForm = {
  name: '',
  category: '',
  description: '',
  labLocation: '',
  quantity: 1,
  status: 'AVAILABLE',
  serialNumber: '',
  manufacturer: '',
  purchasePrice: '',
};

function AddEquipment() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'purchasePrice' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (
      !form.name.trim() ||
      !form.category.trim() ||
      !form.labLocation.trim() ||
      form.quantity < 1 ||
      !form.status ||
      form.purchasePrice <= 0
    ) {
      setError('Please complete all required fields with valid values.');
      return;
    }

    setLoading(true);
    try {
      await createEquipment({ ...form, userId: user?.id });
      setSuccess('Equipment successfully added. Redirecting to list...');
      setTimeout(() => navigate('/equipment'), 800);
    } catch (err) {
      setError('Unable to add equipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header centered-header">
        <h1>Add Equipment</h1>
        <p>Create a new equipment record for the lab inventory.</p>
      </div>
      <div className="form-page">
        <div className="form-card">
          <h2 className="form-title" >Add Equipment</h2>
          <form onSubmit={handleSubmit}>
            <ErrorMessage message={error || success} />

            <label>
              Equipment Name*
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Microscope"
                required
              />
            </label>

        <label>
          Category*
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Optical"
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional details about the equipment"
            rows="4"
          />
        </label>

        <label>
          Lab Location*
          <input
            name="labLocation"
            value={form.labLocation}
            onChange={handleChange}
            placeholder="Physics Lab"
            required
          />
        </label>

        <div className="input-grid">
          <label>
            Quantity*
            <input
              name="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Status*
            <select name="status" value={form.status} onChange={handleChange} required>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="IN_USE">IN_USE</option>
              <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
              <option value="RETIRED">RETIRED</option>
            </select>
          </label>
        </div>

        <label>
          Serial Number*
          <input
            name="serialNumber"
            value={form.serialNumber}
            onChange={handleChange}
            placeholder="SN-12345"
          />
        </label>

        <label>
          Manufacturer
          <input
            name="manufacturer"
            value={form.manufacturer}
            onChange={handleChange}
            placeholder="Acme Labs"
          />
        </label>

        <label>
          Purchase Price*
          <input
            name="purchasePrice"
            type="number"
            min="0"
            step="0.01"
            value={form.purchasePrice}
            onChange={handleChange}
            placeholder="299.99"
          />
        </label>

        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? 'Saving…' : 'Add Equipment'}
        </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEquipment;
