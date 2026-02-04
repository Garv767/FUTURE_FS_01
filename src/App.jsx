import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Card from './Coponents/Card/Card.jsx' 
import Home from './Coponents/Home/Home.jsx'
import Header from './Coponents/Header/Header.jsx'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
function App() {
  return (
    <Router>
      <Header/>
      <Home/>
      <Card/>
      <Card/>
    </Router>
  );
}

export default App
