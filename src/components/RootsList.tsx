import React, { useEffect, useState } from 'react';
import { rootsApi } from '../services/api';
import { Root } from '../types/root';
import './RootsList.css';

interface RootsListProps {
  onEdit: (root: Root) => void;
  refresh: number;
}

const RootsList: React.FC<RootsListProps> = ({ onEdit, refresh }) => {
  const [roots, setRoots] = useState<Root[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRoots();
  }, [refresh]);

  const loadRoots = async () => {
    try {
      setLoading(true);
      const data = await rootsApi.getAll();
      // Sort alphabetically by root field
      const sorted = data.sort((a, b) => a.root.localeCompare(b.root));
      setRoots(sorted);
      setError(null);
    } catch (err) {
      setError('Failed to load roots');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this root?')) {
      return;
    }

    try {
      await rootsApi.delete(id);
      loadRoots();
    } catch (err) {
      alert('Failed to delete root');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading roots...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="roots-list">
      <div className="list-header">
        <h2>All Roots ({roots.length} roots)</h2>
      </div>
      
      {roots.length === 0 ? (
        <div className="no-data">No roots found. Create your first root!</div>
      ) : (
        <table className="roots-table">
          <thead>
            <tr>
              <th>Root</th>
              <th>Primary Meaning (Base)</th>
              <th>Act Agt</th>
              <th>Act Pat</th>
              <th>Pas Agt</th>
              <th>Pas Pat</th>
              <th>Modes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roots.map((root) => (
              <tr key={root._id}>
                <td className="root-text">{root.root}</td>
                <td>{root.mode.base.prim || '-'}</td>
                <td>{root.mode.base.act_agt || '-'}</td>
                <td>{root.mode.base.act_pat || '-'}</td>
                <td>{root.mode.base.pas_agt || '-'}</td>
                <td>{root.mode.base.pas_pat || '-'}</td>
                <td>
                  <div className="modes">
                    <span className="mode-badge">base</span>
                    {root.mode.long && <span className="mode-badge">long</span>}
                    {root.mode.strong && <span className="mode-badge">strong</span>}
                  </div>
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="btn-edit"
                      onClick={() => onEdit(root)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(root._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RootsList;
