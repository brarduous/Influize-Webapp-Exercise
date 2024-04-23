import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {createSession} from './api/influizeAPI';


function App() {

  const [session, setSession] = useState<any>(0);
  
  setSession(createSession(1));
  console.log(session);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
