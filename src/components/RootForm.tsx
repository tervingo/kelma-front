import React, { useState, useEffect } from 'react';
import { rootsApi } from '../services/api';
import { Root, ModeFields } from '../types/root';
import './RootForm.css';

interface RootFormProps {
  editingRoot: Root | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyModeFields: ModeFields = {
  prim: null,
  act_agt: null,
  act_pat: null,
  pas_agt: null,
  pas_pat: null,
};

const RootForm: React.FC<RootFormProps> = ({ editingRoot, onSuccess, onCancel }) => {
  const [root, setRoot] = useState('');
  const [baseMode, setBaseMode] = useState<ModeFields>({ ...emptyModeFields });
  const [longMode, setLongMode] = useState<ModeFields>({ ...emptyModeFields });
  const [strongMode, setStrongMode] = useState<ModeFields>({ ...emptyModeFields });
  const [enableLong, setEnableLong] = useState(false);
  const [enableStrong, setEnableStrong] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingRoot) {
      setRoot(editingRoot.root);
      setBaseMode(editingRoot.mode.base);

      if (editingRoot.mode.long) {
        setLongMode(editingRoot.mode.long);
        setEnableLong(true);
      }
      if (editingRoot.mode.strong) {
        setStrongMode(editingRoot.mode.strong);
        setEnableStrong(true);
      }
    }
  }, [editingRoot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!root.trim()) {
      alert('Root is required');
      return;
    }

    // Check if base mode has at least one field filled
    const baseFilled = Object.values(baseMode).some(v => v && v.trim() !== '');
    if (!baseFilled) {
      alert('Base mode must have at least one field filled');
      return;
    }

    // Check if enabled long mode has at least one field filled
    if (enableLong) {
      const longFilled = Object.values(longMode).some(v => v && v.trim() !== '');
      if (!longFilled) {
        alert('Long mode must have at least one field filled when enabled');
        return;
      }
    }

    // Check if enabled strong mode has at least one field filled
    if (enableStrong) {
      const strongFilled = Object.values(strongMode).some(v => v && v.trim() !== '');
      if (!strongFilled) {
        alert('Strong mode must have at least one field filled when enabled');
        return;
      }
    }

    const cleanMode = (mode: ModeFields): ModeFields => ({
      prim: mode.prim?.trim() || null,
      act_agt: mode.act_agt?.trim() || null,
      act_pat: mode.act_pat?.trim() || null,
      pas_agt: mode.pas_agt?.trim() || null,
      pas_pat: mode.pas_pat?.trim() || null,
    });

    const data: any = {
      root: root.trim(),
      mode: {
        base: cleanMode(baseMode),
        long: enableLong ? cleanMode(longMode) : null,
        strong: enableStrong ? cleanMode(strongMode) : null,
      },
    };

    try {
      setLoading(true);
      if (editingRoot) {
        await rootsApi.update(editingRoot._id, data);
      } else {
        await rootsApi.create(data);
      }
      handleReset();
      onSuccess();
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail?.[0]?.msg || 'Failed to save root';
      alert(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRoot('');
    setBaseMode({ ...emptyModeFields });
    setLongMode({ ...emptyModeFields });
    setStrongMode({ ...emptyModeFields });
    setEnableLong(false);
    setEnableStrong(false);
  };

  const updateModeField = (
    mode: 'base' | 'long' | 'strong',
    field: keyof ModeFields,
    value: string
  ) => {
    const setter = mode === 'base' ? setBaseMode :
                   mode === 'long' ? setLongMode : setStrongMode;

    setter(prev => ({ ...prev, [field]: value }));
  };

  const renderModeFields = (
    mode: 'base' | 'long' | 'strong',
    modeData: ModeFields,
    enabled: boolean = true
  ) => {
    if (!enabled && mode !== 'base') return null;

    return (
      <div className="mode-section">
        <h4>{mode.charAt(0).toUpperCase() + mode.slice(1)} Mode {mode === 'base' ? '(required)' : ''}</h4>
        <div className="mode-fields">
          <div className="field-group">
            <label>Prim:</label>
            <input
              type="text"
              value={modeData.prim || ''}
              onChange={(e) => updateModeField(mode, 'prim', e.target.value)}
              placeholder="Primary meaning"
            />
          </div>
          <div className="field-group">
            <label>Act-Agt:</label>
            <input
              type="text"
              value={modeData.act_agt || ''}
              onChange={(e) => updateModeField(mode, 'act_agt', e.target.value)}
              placeholder="Active Agent"
            />
          </div>
          <div className="field-group">
            <label>Act-Pat:</label>
            <input
              type="text"
              value={modeData.act_pat || ''}
              onChange={(e) => updateModeField(mode, 'act_pat', e.target.value)}
              placeholder="Active Patient"
            />
          </div>
          <div className="field-group">
            <label>Pas-Agt:</label>
            <input
              type="text"
              value={modeData.pas_agt || ''}
              onChange={(e) => updateModeField(mode, 'pas_agt', e.target.value)}
              placeholder="Passive Agent"
            />
          </div>
          <div className="field-group">
            <label>Pas-Pat:</label>
            <input
              type="text"
              value={modeData.pas_pat || ''}
              onChange={(e) => updateModeField(mode, 'pas_pat', e.target.value)}
              placeholder="Passive Patient"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="root-form">
      <h2>{editingRoot ? 'Edit Root' : 'Create New Root'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="field-group">
            <label>Root: *</label>
            <input
              type="text"
              value={root}
              onChange={(e) => setRoot(e.target.value)}
              placeholder="Enter root text"
              required
            />
          </div>
        </div>

        {renderModeFields('base', baseMode, true)}

        <div className="optional-modes">
          <h3>Optional Modes</h3>
          <div className="mode-toggles">
            <label>
              <input
                type="checkbox"
                checked={enableLong}
                onChange={(e) => setEnableLong(e.target.checked)}
              />
              Long Mode
            </label>
            <label>
              <input
                type="checkbox"
                checked={enableStrong}
                onChange={(e) => setEnableStrong(e.target.checked)}
              />
              Strong Mode
            </label>
          </div>
        </div>

        {renderModeFields('long', longMode, enableLong)}
        {renderModeFields('strong', strongMode, enableStrong)}

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Saving...' : (editingRoot ? 'Update Root' : 'Create Root')}
          </button>
          <button type="button" className="btn-cancel" onClick={() => {
            handleReset();
            onCancel();
          }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RootForm;
