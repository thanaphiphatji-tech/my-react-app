import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import EntryPage from './EntryPage';
import AuthGate from './AuthGate/AuthGate';
import './index.css';

function Root() {
  const [entered, setEntered] = useState(false);

  if (!entered) {
    return <EntryPage onEnterApp={() => setEntered(true)} />;
  }

  return <AuthGate />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <Root />
);