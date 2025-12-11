import React, { useState } from 'react';
import RootsList from './components/RootsList';
import RootForm from './components/RootForm';
import { Root } from './types/root';
import './App.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingRoot, setEditingRoot] = useState<Root | null>(null);
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

  return (
    <div className="app">
      <header className="app-header">
        <h1>Kelma Dictionary</h1>
        <div className="header-subtitle">Conlang Dictionary Management</div>
      </header>

      <div className="app-container">
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3>Roots</h3>
            <nav className="sidebar-nav">
              <button
                className={!showForm ? 'nav-item active' : 'nav-item'}
                onClick={() => setShowForm(false)}
              >
                List All Roots
              </button>
              <button
                className="nav-item btn-create"
                onClick={handleNewRoot}
              >
                + Enter New Root
              </button>
            </nav>
          </div>
        </aside>

        <main className="main-content">
          {showForm ? (
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
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
