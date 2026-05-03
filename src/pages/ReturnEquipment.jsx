import { useEffect, useState } from 'react';
import { getLendingList, returnEquipment } from '../services/lendingService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

function ReturnEquipment() {
  const [lendings, setLendings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchLendings = async () => {
      setError('');
      try {
        const data = await getLendingList(user?.id);
        setLendings(data.filter((item) => item.status === 'ISSUED'));
      } catch (err) {
        setError('Unable to load issued lending records.');
      } finally {
        setLoading(false);
      }
    };

    fetchLendings();
  }, []);

  const handleReturn = async (id) => {
    setError('');
    setActionLoading(id);
    try {
      await returnEquipment(id);
      setLendings((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError('Unable to process return. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Return Equipment</h1>
        <p>View issued items and return equipment when it is back in the lab.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ErrorMessage message={error} />
          {lendings.length === 0 ? (
            <div className="empty-state">No items are currently issued.</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Equipment</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>Quantity</th>
                    <th>Issue Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lendings.map((item) => (
                    <tr key={item.id}>
                      <td>{item.equipmentName}</td>
                      <td>{item.issuedTo ?? item.issuedToName ?? 'N/A'}</td>
                      <td>{item.contactNumber ?? 'N/A'}</td>
                      <td>{item.issuedToRole ?? 'N/A'}</td>
                      <td>{item.quantity ?? 'N/A'}</td>
                      <td>{item.issueDate ?? 'N/A'}</td>
                      <td>{item.status ?? 'N/A'}</td>
                      <td>
                        <button
                          className="button-secondary"
                          disabled={actionLoading === item.id}
                          onClick={() => handleReturn(item.id)}
                        >
                          {actionLoading === item.id ? 'Returning…' : 'Return'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ReturnEquipment;
