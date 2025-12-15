import React, { useEffect, useState } from 'react';
import { translationsApi } from '../services/api';
import { Translation } from '../types/translation';
import './TranslationsList.css';

interface TranslationsListProps {
  onEdit: (translation: Translation) => void;
  onViewRoot: (rootValue: string) => void;
  refresh: number;
}

const TranslationsList: React.FC<TranslationsListProps> = ({ onEdit, onViewRoot, refresh }) => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingTranslation, setViewingTranslation] = useState<Translation | null>(null);

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
                <td className="root-link">
                  {translation.root ? (
                    <button
                      className="link-button"
                      onClick={() => onViewRoot(translation.root!)}
                      title="View root details"
                    >
                      {translation.root}
                    </button>
                  ) : (
                    <span className="empty-value">—</span>
                  )}
                </td>
                <td className="center">
                  {translation.swadesh ? '✓' : ''}
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="btn-view"
                      onClick={() => setViewingTranslation(translation)}
                      title="View"
                    >
                      👁️
                    </button>
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

      {viewingTranslation && (
        <div className="modal-overlay" onClick={() => setViewingTranslation(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Translation Details</h2>
              <button className="modal-close" onClick={() => setViewingTranslation(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="view-section">
                <div className="view-field">
                  <label>Kelma:</label>
                  <div className="view-value kelma-text">{viewingTranslation.kelma}</div>
                </div>

                <div className="view-field">
                  <label>English:</label>
                  <div className="view-value">{viewingTranslation.english}</div>
                </div>

                <div className="view-field">
                  <label>Root:</label>
                  <div className="view-value">{viewingTranslation.root || '—'}</div>
                </div>

                <div className="view-field">
                  <label>Category:</label>
                  <div className="view-value">
                    <span className="category-badge">{viewingTranslation.cat}</span>
                  </div>
                </div>

                <div className="view-field">
                  <label>Swadesh:</label>
                  <div className="view-value">{viewingTranslation.swadesh ? 'Yes' : 'No'}</div>
                </div>

                {viewingTranslation.noun_type && (
                  <div className="view-field">
                    <label>Noun Type:</label>
                    <div className="view-value">
                      <span className="noun-type-badge">{viewingTranslation.noun_type}</span>
                    </div>
                  </div>
                )}
              </div>

              {viewingTranslation.noun_fields && (
                <div className="view-section">
                  <h3>Noun Fields</h3>
                  <div className="view-field">
                    <label>ABS Plural:</label>
                    <div className="view-value">{viewingTranslation.noun_fields.abs_plural}</div>
                  </div>
                  {viewingTranslation.noun_fields.abs_plural2 && (
                    <div className="view-field">
                      <label>ABS Plural 2:</label>
                      <div className="view-value">{viewingTranslation.noun_fields.abs_plural2}</div>
                    </div>
                  )}
                  <div className="view-field">
                    <label>ERG Plural:</label>
                    <div className="view-value">{viewingTranslation.noun_fields.erg_plural}</div>
                  </div>
                  <div className="view-field">
                    <label>GEN Plural:</label>
                    <div className="view-value">{viewingTranslation.noun_fields.gen_plural}</div>
                  </div>
                  <div className="view-field">
                    <label>DAT Plural:</label>
                    <div className="view-value">{viewingTranslation.noun_fields.dat_plural}</div>
                  </div>
                  <div className="view-field">
                    <label>Partitive:</label>
                    <div className="view-value">{viewingTranslation.noun_fields.par}</div>
                  </div>
                </div>
              )}

              {viewingTranslation.verb_fields && (
                <div className="view-section">
                  <h3>Verb Fields</h3>
                  <div className="view-field">
                    <label>Infinitive I:</label>
                    <div className="view-value">{viewingTranslation.verb_fields.inf_i}</div>
                  </div>
                  <div className="view-field">
                    <label>Progressive Stem:</label>
                    <div className="view-value">{viewingTranslation.verb_fields.prog_stem}</div>
                  </div>
                  <div className="view-field">
                    <label>Perfect Stem:</label>
                    <div className="view-value">{viewingTranslation.verb_fields.perf_stem}</div>
                  </div>
                  <div className="view-field">
                    <label>N-Participle:</label>
                    <div className="view-value">{viewingTranslation.verb_fields.n_part}</div>
                  </div>
                  <div className="view-field">
                    <label>T-Participle:</label>
                    <div className="view-value">{viewingTranslation.verb_fields.t_part}</div>
                  </div>
                  <div className="view-field">
                    <label>S-Participle:</label>
                    <div className="view-value">{viewingTranslation.verb_fields.s_part}</div>
                  </div>
                  <div className="view-field">
                    <label>V-Participle:</label>
                    <div className="view-value">{viewingTranslation.verb_fields.v_part}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setViewingTranslation(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslationsList;
