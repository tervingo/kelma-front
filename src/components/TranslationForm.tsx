import React, { useState, useEffect } from 'react';
import { translationsApi } from '../services/api';
import { Translation, Category, NounType, NounFields, VerbFields } from '../types/translation';
import './TranslationForm.css';

interface TranslationFormProps {
  editingTranslation: Translation | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyNounFields: NounFields = {
  abs_plural: '',
  abs_plural2: null,
  erg_plural: '',
  gen_plural: '',
  dat_plural: '',
  par: '',
};

const emptyVerbFields: VerbFields = {
  inf_i: '',
  prog_stem: '',
  perf_stem: '',
  n_part: '',
  t_part: '',
  s_part: '',
  v_part: '',
};

const categories: Category[] = [
  "adjective", "adverb", "conjunction", "interjection",
  "noun", "numeral", "prefix", "pronoun", "quantifier", "suffix", "verb"
];

const nounTypes: NounType[] = ["primary", "radical", "deverbal"];

const TranslationForm: React.FC<TranslationFormProps> = ({ editingTranslation, onSuccess, onCancel }) => {
  const [kelma, setKelma] = useState('');
  const [english, setEnglish] = useState('');
  const [root, setRoot] = useState('');
  const [swadesh, setSwadesh] = useState(false);
  const [category, setCategory] = useState<Category>('adjective');
  const [nounType, setNounType] = useState<NounType>('primary');
  const [nounFields, setNounFields] = useState<NounFields>({ ...emptyNounFields });
  const [verbFields, setVerbFields] = useState<VerbFields>({ ...emptyVerbFields });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTranslation) {
      setKelma(editingTranslation.kelma);
      setEnglish(editingTranslation.english);
      setRoot(editingTranslation.root);
      setSwadesh(editingTranslation.swadesh);
      setCategory(editingTranslation.cat);

      if (editingTranslation.noun_type) {
        setNounType(editingTranslation.noun_type);
      }
      if (editingTranslation.noun_fields) {
        setNounFields(editingTranslation.noun_fields);
      }
      if (editingTranslation.verb_fields) {
        setVerbFields(editingTranslation.verb_fields);
      }
    }
  }, [editingTranslation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kelma.trim() || !english.trim()) {
      alert('Kelma and English are required');
      return;
    }

    const data: any = {
      kelma: kelma.trim(),
      english: english.trim(),
      root: root.trim() || null,
      swadesh,
      cat: category,
    };

    if (category === 'noun') {
      data.noun_type = nounType;
      data.noun_fields = nounFields;
    }

    if (category === 'verb') {
      data.verb_fields = verbFields;
    }

    try {
      setLoading(true);
      if (editingTranslation) {
        await translationsApi.update(editingTranslation._id, data);
      } else {
        await translationsApi.create(data);
      }
      handleReset();
      onSuccess();
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail?.[0]?.msg || 'Failed to save translation';
      alert(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setKelma('');
    setEnglish('');
    setRoot('');
    setSwadesh(false);
    setCategory('adjective');
    setNounType('primary');
    setNounFields({ ...emptyNounFields });
    setVerbFields({ ...emptyVerbFields });
  };

  const updateNounField = (field: keyof NounFields, value: string) => {
    setNounFields(prev => ({ ...prev, [field]: value }));
  };

  const updateVerbField = (field: keyof VerbFields, value: string) => {
    setVerbFields(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="translation-form">
      <h2>{editingTranslation ? 'Edit Translation' : 'Create New Translation'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="field-row">
            <div className="field-group">
              <label>Kelma: *</label>
              <input
                type="text"
                value={kelma}
                onChange={(e) => setKelma(e.target.value)}
                placeholder="Word in conlang"
                required
              />
            </div>
            <div className="field-group">
              <label>English: *</label>
              <input
                type="text"
                value={english}
                onChange={(e) => setEnglish(e.target.value)}
                placeholder="English translation"
                required
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field-group">
              <label>Root:</label>
              <input
                type="text"
                value={root}
                onChange={(e) => setRoot(e.target.value)}
                placeholder="Root reference"
              />
            </div>
            <div className="field-group">
              <label>Category: *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={swadesh}
                onChange={(e) => setSwadesh(e.target.checked)}
              />
              Swadesh List
            </label>
          </div>
        </div>

        {category === 'noun' && (
          <div className="conditional-section">
            <h3>Noun Fields</h3>
            <div className="field-row">
              <div className="field-group">
                <label>Noun Type: *</label>
                <select value={nounType} onChange={(e) => setNounType(e.target.value as NounType)}>
                  {nounTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field-group">
                <label>ABS Plural: *</label>
                <input
                  type="text"
                  value={nounFields.abs_plural}
                  onChange={(e) => updateNounField('abs_plural', e.target.value)}
                  required
                />
              </div>
              <div className="field-group">
                <label>ABS Plural 2:</label>
                <input
                  type="text"
                  value={nounFields.abs_plural2 || ''}
                  onChange={(e) => updateNounField('abs_plural2', e.target.value)}
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field-group">
                <label>ERG Plural: *</label>
                <input
                  type="text"
                  value={nounFields.erg_plural}
                  onChange={(e) => updateNounField('erg_plural', e.target.value)}
                  required
                />
              </div>
              <div className="field-group">
                <label>GEN Plural: *</label>
                <input
                  type="text"
                  value={nounFields.gen_plural}
                  onChange={(e) => updateNounField('gen_plural', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field-group">
                <label>DAT Plural: *</label>
                <input
                  type="text"
                  value={nounFields.dat_plural}
                  onChange={(e) => updateNounField('dat_plural', e.target.value)}
                  required
                />
              </div>
              <div className="field-group">
                <label>PAR: *</label>
                <input
                  type="text"
                  value={nounFields.par}
                  onChange={(e) => updateNounField('par', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {category === 'verb' && (
          <div className="conditional-section">
            <h3>Verb Fields</h3>
            <div className="field-row">
              <div className="field-group">
                <label>Inf I: *</label>
                <input
                  type="text"
                  value={verbFields.inf_i}
                  onChange={(e) => updateVerbField('inf_i', e.target.value)}
                  required
                />
              </div>
              <div className="field-group">
                <label>Prog Stem: *</label>
                <input
                  type="text"
                  value={verbFields.prog_stem}
                  onChange={(e) => updateVerbField('prog_stem', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field-group">
                <label>Perf Stem: *</label>
                <input
                  type="text"
                  value={verbFields.perf_stem}
                  onChange={(e) => updateVerbField('perf_stem', e.target.value)}
                  required
                />
              </div>
              <div className="field-group">
                <label>N-Part: *</label>
                <input
                  type="text"
                  value={verbFields.n_part}
                  onChange={(e) => updateVerbField('n_part', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field-group">
                <label>T-Part: *</label>
                <input
                  type="text"
                  value={verbFields.t_part}
                  onChange={(e) => updateVerbField('t_part', e.target.value)}
                  required
                />
              </div>
              <div className="field-group">
                <label>S-Part: *</label>
                <input
                  type="text"
                  value={verbFields.s_part}
                  onChange={(e) => updateVerbField('s_part', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field-group">
                <label>V-Part: *</label>
                <input
                  type="text"
                  value={verbFields.v_part}
                  onChange={(e) => updateVerbField('v_part', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Saving...' : (editingTranslation ? 'Update Translation' : 'Create Translation')}
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

export default TranslationForm;
