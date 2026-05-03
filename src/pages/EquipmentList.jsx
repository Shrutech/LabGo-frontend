import { useEffect, useState } from 'react';
import {
  getEquipmentList,
  updateEquipment,
  deleteEquipment,
} from '../services/equipmentService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
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

function EquipmentList() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const user = JSON.parse(localStorage.getItem("user"));

  const loadEquipment = async () => {
    setError('');
    try {
      const equipmentData = await getEquipmentList(user?.id);
      setEquipment(equipmentData);
    } catch (err) {
      setError('Could not load equipment list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  const openEdit = (item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name || '',
      category: item.category || '',
      description: item.description || '',
      labLocation: item.labLocation || '',
      quantity: item.quantity || 1,
      status: item.status || 'AVAILABLE',
      serialNumber: item.serialNumber || '',
      manufacturer: item.manufacturer || '',
      purchasePrice: item.purchasePrice || '',
    });
  };

  const closeEdit = () => {
    setEditingItem(null);
    setEditForm(initialForm);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'purchasePrice' ? Number(value) : value,
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (
      !editForm.name.trim() ||
      !editForm.category.trim() ||
      !editForm.labLocation.trim() ||
      editForm.quantity < 1 ||
      !editForm.status ||
      !editForm.serialNumber.trim() ||
      !editForm.purchasePrice ||
      editForm.purchasePrice <= 0
    ) {
      setError('Please complete all required fields before saving.');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateEquipment(editingItem.id, { ...editForm, userId: user?.id });
      setEquipment((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      closeEdit();
    } catch (err) {
      setError('Failed to save equipment changes. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteEquipment(id);
      setEquipment((prev) => prev.filter((item) => item.id !== id));
      if (editingItem?.id === id) {
        closeEdit();
      }
    } catch (err) {
      setError('Unable to delete equipment. Please try again.');
    }
  };

  const filteredEquipment = equipment
    .filter(item => item.status !== "RETIRED")
    .filter(item => {
      const term = searchTerm.toLowerCase();
      return (
        item.name?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term) ||
        item.labLocation?.toLowerCase().includes(term) ||
        item.status?.toLowerCase().includes(term) ||
        item.serialNumber?.toLowerCase().includes(term) ||
        item.manufacturer?.toLowerCase().includes(term)
      );
    });

  return (
    <div className="page-content">
      <div className="page-header centered-header">
        <h1>Equipment</h1>
        <p>Review the lab inventory and manage equipment entries.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ErrorMessage message={error} />
          {error && (
            <button type="button" className="button-secondary" onClick={loadEquipment}>
              Retry
            </button>
          )}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
            placeholder="Search equipment by name, category, location, status, serial number or manufacturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          {filteredEquipment.length === 0 ? (
            <div className="empty-state">
              {searchTerm ? 'No equipment found.' : 'No equipment available.'}
            </div>
          ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Lab</th>
                  <th>Qty</th>
                  <th>Available</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.labLocation}</td>
                    <td>{item.quantity}</td>
                    <td>{item.availableQuantity}</td>
                    <td>{item.status}</td>
                    <td className="action-cell">
                      <button className="button-secondary" onClick={() => openEdit(item)}>
                        ✏️ Edit
                      </button>
                      <button className="button-secondary" onClick={() => handleDelete(item.id)}>
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}

          {editingItem && (
            <div className="modal-backdrop">
              <div className="modal-card">
                <div className="modal-header">
                  <h2>Edit Equipment</h2>
                  <button className="button-secondary" onClick={closeEdit}>
                    Close
                  </button>
                </div>
                <form className="form-card" onSubmit={handleEditSubmit}>
                  <label>
                    Equipment Name*
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      required
                    />
                  </label>

                  <label>
                    Category*
                    <input
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      required
                    />
                  </label>

                  <label>
                    Description
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      rows="3"
                    />
                  </label>

                  <label>
                    Lab Location*
                    <input
                      name="labLocation"
                      value={editForm.labLocation}
                      onChange={handleEditChange}
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
                        value={editForm.quantity}
                        onChange={handleEditChange}
                        required
                      />
                    </label>

                    <label>
                      Status*
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                        required
                      >
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
                      value={editForm.serialNumber}
                      onChange={handleEditChange}
                      required
                    />
                  </label>

                  <label>
                    Manufacturer
                    <input
                      name="manufacturer"
                      value={editForm.manufacturer}
                      onChange={handleEditChange}
                    />
                  </label>

                  <label>
                    Purchase Price*
                    <input
                      name="purchasePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.purchasePrice}
                      onChange={handleEditChange}
                      required
                    />
                  </label>

                  <button type="submit" className="button-primary" disabled={saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EquipmentList;
