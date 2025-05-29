import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './Admin/Dashboard'
import HostDashboard from './Host/Dashboard'
import Category from './Admin/Category'
import Login from './Pages/Login'
import Home from './Pages/Home'
import AuthProvider from './Context/AuthProvider'
import AdminRoute from './Protected/AdminRoute'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Navbar2 from './Components/Navbar2'
import FarmHouse from './Pages/FarmHouse'
import Villa from './Pages/Villa'
import PropertyDetail from './Pages/PropertyDetail'

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/farmhouse' element={<FarmHouse />} />
            <Route path='/villa' element={<Villa />} />
            <Route path='/property/:slug' element={<PropertyDetail/>} />
            <Route path='/admin/dashboard' element={<AdminRoute><Dashboard/></AdminRoute>} />
            <Route path='/host/dashboard' element={<HostDashboard />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
