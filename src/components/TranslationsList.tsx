import React, { useEffect, useState } from 'react';
import { translationsApi } from '../services/api';
import { Translation } from '../types/translation';
import './TranslationsList.css';

interface TranslationsListProps {
  onEdit: (translation: Translation) => void;
  refresh: number;
}

const TranslationsList: React.FC<TranslationsListProps> = ({ onEdit, refresh }) => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTranslations();
  }, [refresh]);

  const loadTranslations = async () => {
    try {
      setLoading(true);
      const data = await translationsApi.getAll();
      // Sort alphabetically by kelma field
      const sorted = data.sort((a, b) => a.kelma.localeCompare(b.kelma));
      setTranslations(sorted);
      setError(null);
    } catch (err) {
      setError('Failed to load translations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this translation?')) {
      return;
    }

    try {
      await translationsApi.delete(id);
      loadTranslations();
    } catch (err) {
      alert('Failed to delete translation');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading translations...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="translations-list">
      <div className="list-header">
        <h2>All Translations ({translations.length} entries)</h2>
      </div>

      {translations.length === 0 ? (
        <div className="no-data">No translations found. Create your first translation!</div>
      ) : (
        <table className="translations-table">
          <thead>
            <tr>
              <th>Kelma</th>
              <th>English</th>
              <th>Category</th>
              <th>Root</th>
              <th>SW</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {translations.map((translation) => (
              <tr key={translation._id}>
                <td className="kelma-text">{translation.kelma}</td>
                <td>{translation.english}</td>
                <td>
                  <span className="category-badge">{translation.cat}</span>
                  {translation.noun_type && (
                    <span className="noun-type-badge">{translation.noun_type}</span>
                  )}
                </td>
                <td className="root-link">{translation.root}</td>
                <td className="center">
                  {translation.swadesh ? '✓' : ''}
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="btn-edit"
                      onClick={() => onEdit(translation)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(translation._id)}
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

export default TranslationsList;
