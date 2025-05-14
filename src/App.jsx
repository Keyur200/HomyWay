import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './Admin/Dashboard'
import Category from './Admin/Category'
import Login from './Pages/Login'
import Home from './Pages/Home'
import AuthProvider from './Context/AuthProvider'
import AdminRoute from './Protected/AdminRoute'

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/admin/dashboard' element={<AdminRoute><Dashboard/></AdminRoute>} />
            <Route path='/admin/category' element={<Category />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
