import React, { useState } from 'react';
import RootsList from './components/RootsList';
import RootForm from './components/RootForm';
import TranslationsList from './components/TranslationsList';
import TranslationForm from './components/TranslationForm';
import { Root } from './types/root';
import { Translation } from './types/translation';
import './App.css';

type Section = 'roots' | 'translations';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('translations');
  const [showForm, setShowForm] = useState(false);
  const [editingRoot, setEditingRoot] = useState<Root | null>(null);
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (root: Root) => {
    setEditingRoot(root);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingRoot(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRoot(null);
  };

  const handleNewRoot = () => {
    setEditingRoot(null);
    setShowForm(true);
  };

  const handleEditTranslation = (translation: Translation) => {
    setEditingTranslation(translation);
    setShowForm(true);
  };

  const handleNewTranslation = () => {
    setEditingTranslation(null);
    setShowForm(true);
  };

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setShowForm(false);
    setEditingRoot(null);
    setEditingTranslation(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Kelma Dictionary</h1>
        <div className="header-subtitle">Conlang Dictionary Management</div>
      </header>

      <div className="app-container">
        <aside className="sidebar">
        <div className="sidebar-section">
            <h3>Translations</h3>
            <nav className="sidebar-nav">
              <button
                className={activeSection === 'translations' && !showForm ? 'nav-item active' : 'nav-item'}
                onClick={() => handleSectionChange('translations')}
              >
                List All Translations
              </button>
              <button
                className="nav-item btn-create"
                onClick={() => {
                  setActiveSection('translations');
                  handleNewTranslation();
                }}
              >
                + Enter New Translation
              </button>
            </nav>
          </div>
 
 
          <div className="sidebar-section">
            <h3>Roots</h3>
            <nav className="sidebar-nav">
              <button
                className={activeSection === 'roots' && !showForm ? 'nav-item active' : 'nav-item'}
                onClick={() => handleSectionChange('roots')}
              >
                List All Roots
              </button>
              <button
                className="nav-item btn-create"
                onClick={() => {
                  setActiveSection('roots');
                  handleNewRoot();
                }}
              >
                + Enter New Root
              </button>
            </nav>
          </div>

         </aside>

        <main className="main-content">
          {activeSection === 'roots' ? (
            showForm ? (
              <RootForm
                editingRoot={editingRoot}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            ) : (
              <RootsList
                onEdit={handleEdit}
                refresh={refreshTrigger}
              />
            )
          ) : (
            showForm ? (
              <TranslationForm
                editingTranslation={editingTranslation}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            ) : (
              <TranslationsList
                onEdit={handleEditTranslation}
                refresh={refreshTrigger}
              />
            )
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
