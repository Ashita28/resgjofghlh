import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Order from './pages/Order'
import OrderSuccessful from './pages/OrderSuccessful'
import Navbar from './components/Navbar'

const App = () => {
  const location = useLocation()

  // if we’re on /success, don’t render Navbar
  const hideNavbar = location.pathname === '/success'

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/order' element={<Order />} />
        <Route path='/success' element={<OrderSuccessful />} />
      </Routes>
    </>
  )
}

export default App
