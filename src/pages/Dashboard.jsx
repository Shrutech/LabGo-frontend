import { useEffect, useState } from 'react';
import { getEquipmentList, resetSystem } from '../services/equipmentService.js';
import { getLendingList } from '../services/lendingService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

function Dashboard() {
  const [equipment, setEquipment] = useState([]);
  const [lendings, setLendings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [name, setName] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const loadData = async () => {
    setError('');
    setLoading(true);
    try {
      const [equipmentData, lendingData] = await Promise.all([
        getEquipmentList(user?.id),
        getLendingList(user?.id),
      ]);
      setEquipment(equipmentData);
      setLendings(lendingData);
    } catch (err) {
      setError('Unable to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    if (user?.id) {
      const API = import.meta.env.VITE_API_URL;
      fetch(`${API}/auth/user/${user.id}`)
        .then(res => res.json())
        .then(data => setName(data.name))
        .catch(() => setName("User"));
    }
  }, []);

  const handleReset = async () => {
    const confirmed = window.confirm('Are you sure? This will delete ALL data.');
    if (!confirmed) return;

    try {
      await resetSystem();
      alert('System reset successful');
      loadData();
    } catch (err) {
      console.error('FULL ERROR:', err);
      alert(
        err?.response?.data ||
        err?.response?.data?.message ||
        err.message ||
        'Reset failed'
      );
    }
  };

  const activeEquipment = equipment.filter(
    (item) => item.status !== 'RETIRED'
  );
  const issuedCount = lendings.filter((item) => item.status === 'ISSUED').length;
  const totalQuantity = activeEquipment.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const availableEquipment = equipment.filter(
    item =>
      item.status === "AVAILABLE" ||
      item.status === "IN_USE"
  );

  const availableQuantity = availableEquipment.reduce(
    (sum, item) => sum + (item.availableQuantity || 0),
    0
  );

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            👋 Hi User {user?.id || ""} 
          </p>

        </div>

        <button
          type="button"
          className="button-danger"
          onClick={handleReset}
        >
          Reset System
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ErrorMessage message={error} />
          {error && (
            <button type="button" className="button-secondary" onClick={loadData}>
              Retry
            </button>
          )}

          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Total Equipment</span>
              <strong>{activeEquipment.length}</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Total Quantity</span>
              <strong>{totalQuantity}</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Available Quantity</span>
              <strong>{availableQuantity}</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Issued Items</span>
              <strong>{issuedCount}</strong>
            </div>
          </div>

          <section className="section-block">
            <h2>Recent Lending Activity</h2>
            {lendings.length === 0 ? (
              <div className="empty-state">No lending records found.</div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Equipment</th>
                      <th>Student</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Issued</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lendings.map((item) => (
                      <tr key={item.id}>
                        <td>{item.equipmentName || 'Unknown'}</td>
                        <td>{item.issuedToName || '—'}</td>
                        <td>{item.contactNumber || '—'}</td>
                        <td>{item.status || '—'}</td>
                        <td>{item.issueDate || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;