import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import CreateAccount from './pages/CreateAccount'
import './App.css'

export default function App(){
  return (
    <BrowserRouter>
      <div style={{display: 'flex', minHeight: '100vh', flexDirection: 'column'}}>
        <Header />
        <main style={{flex: 1, maxWidth: 1024, margin: '1rem auto', padding: '0 1rem'}}>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/create-account" element={<CreateAccount/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
