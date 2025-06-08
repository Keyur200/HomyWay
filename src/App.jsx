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
import Profile from './Pages/Profile/profile'
import Booking from './Pages/Booking'
import { ToastContainer } from 'react-toastify'
import { GoogleMap, InfoWindow, LoadScript, Marker, StandaloneSearchBox,useJsApiLoader  } from '@react-google-maps/api';
import HostRoute from './Protected/HostRoute'

function App() {

  return (
    <>
      <LoadScript googleMapsApiKey={""}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/farmhouse' element={<FarmHouse />} />
              <Route path='/villa' element={<Villa />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/booking' element={<Booking />} />
              <Route path='/property/:slug' element={<PropertyDetail />} />
              <Route path='/admin/dashboard' element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path='/host/dashboard' element={<HostDashboard />} />
            </Routes>
          </AuthProvider>
          <ToastContainer />
        </BrowserRouter>
      </LoadScript>

    </>
  )
}

export default App
