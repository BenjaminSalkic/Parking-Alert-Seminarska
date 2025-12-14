import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import './App.css'

export default function App(){
  return (
    <BrowserRouter>
      <div style={{display: 'flex', minHeight: '100vh', flexDirection: 'column'}}>
        <Header />
        <main style={{flex: 1, maxWidth: 1024, margin: '1rem auto', padding: '0 1rem'}}>
          <Routes>
            <Route path="/" element={<Home/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
