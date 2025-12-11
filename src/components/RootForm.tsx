import React, { useState, useEffect } from 'react';
import { rootsApi } from '../services/api';
import { Root, RootCreate, ModeFields } from '../types/root';
import './RootForm.css';

interface RootFormProps {
  editingRoot: Root | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyModeFields: ModeFields = {
  act_agt: '',
  act_pat: '',
  pas_agt: '',
  pas_pat: '',
};

const RootForm: React.FC<RootFormProps> = ({ editingRoot, onSuccess, onCancel }) => {
  const [root, setRoot] = useState('');
  const [prim, setPrim] = useState('');
  const [baseMode, setBaseMode] = useState<ModeFields>({ ...emptyModeFields });
  const [longMode, setLongMode] = useState<ModeFields>({ ...emptyModeFields });
  const [strongMode, setStrongMode] = useState<ModeFields>({ ...emptyModeFields });
  const [redupMode, setRedupMode] = useState<ModeFields>({ ...emptyModeFields });
  const [enableLong, setEnableLong] = useState(false);
  const [enableStrong, setEnableStrong] = useState(false);
  const [enableRedup, setEnableRedup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingRoot) {
      setRoot(editingRoot.root);
      setPrim(editingRoot.prim || '');
      setBaseMode(editingRoot.mode.base);

      if (editingRoot.mode.long) {
        setLongMode(editingRoot.mode.long);
        setEnableLong(true);
      }
      if (editingRoot.mode.strong) {
        setStrongMode(editingRoot.mode.strong);
        setEnableStrong(true);
      }
      if (editingRoot.mode.redup) {
        setRedupMode(editingRoot.mode.redup);
        setEnableRedup(true);
      }
    }
  }, [editingRoot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!root.trim()) {
      alert('Root is required');
      return;
    }

    const data: any = {
      root: root.trim(),
      mode: {
        base: baseMode,
        long: enableLong ? longMode : null,
        strong: enableStrong ? strongMode : null,
        redup: enableRedup ? redupMode : null,
      },
    };

    // Only include prim if it has a value
    if (prim.trim()) {
      data.prim = prim.trim();
    }

    try {
      setLoading(true);
      if (editingRoot) {
        await rootsApi.update(editingRoot._id, data);
      } else {
        await rootsApi.create(data);
      }
      handleReset();
      onSuccess();
    } catch (err) {
      alert('Failed to save root');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRoot('');
    setPrim('');
    setBaseMode({ ...emptyModeFields });
    setLongMode({ ...emptyModeFields });
    setStrongMode({ ...emptyModeFields });
    setRedupMode({ ...emptyModeFields });
    setEnableLong(false);
    setEnableStrong(false);
    setEnableRedup(false);
  };

  const updateModeField = (
    mode: 'base' | 'long' | 'strong' | 'redup',
    field: keyof ModeFields,
    value: string
  ) => {
    const setter = mode === 'base' ? setBaseMode :
                   mode === 'long' ? setLongMode :
                   mode === 'strong' ? setStrongMode : setRedupMode;

    setter(prev => ({ ...prev, [field]: value }));
  };

  const renderModeFields = (
    mode: 'base' | 'long' | 'strong' | 'redup',
    modeData: ModeFields,
    enabled: boolean = true
  ) => {
    if (!enabled && mode !== 'base') return null;

    return (
      <div className="mode-section">
        <h4>{mode.charAt(0).toUpperCase() + mode.slice(1)} Mode {mode === 'base' ? '(required)' : ''}</h4>
        <div className="mode-fields">
          <div className="field-group">
            <label>Act-Agt:</label>
            <input
              type="text"
              value={modeData.act_agt}
              onChange={(e) => updateModeField(mode, 'act_agt', e.target.value)}
              placeholder="Active Agent"
            />
          </div>
          <div className="field-group">
            <label>Act-Pat:</label>
            <input
              type="text"
              value={modeData.act_pat}
              onChange={(e) => updateModeField(mode, 'act_pat', e.target.value)}
              placeholder="Active Patient"
            />
          </div>
          <div className="field-group">
            <label>Pas-Agt:</label>
            <input
              type="text"
              value={modeData.pas_agt}
              onChange={(e) => updateModeField(mode, 'pas_agt', e.target.value)}
              placeholder="Passive Agent"
            />
          </div>
          <div className="field-group">
            <label>Pas-Pat:</label>
            <input
              type="text"
              value={modeData.pas_pat}
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
          <div className="field-group">
            <label>Primary Meaning:</label>
            <input
              type="text"
              value={prim}
              onChange={(e) => setPrim(e.target.value)}
              placeholder="Enter primary meaning (optional)"
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
            <label>
              <input
                type="checkbox"
                checked={enableRedup}
                onChange={(e) => setEnableRedup(e.target.checked)}
              />
              Redup Mode
            </label>
          </div>
        </div>

        {renderModeFields('long', longMode, enableLong)}
        {renderModeFields('strong', strongMode, enableStrong)}
        {renderModeFields('redup', redupMode, enableRedup)}

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
