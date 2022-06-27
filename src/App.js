import './styles/styles.scss';
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Favorites from './pages/Favorites'
import GuardedRoute from './components/GuardedRoute'
import Footer from './components/Footer'
import { auth } from './firebase'
import React, { useState, createContext, useReducer } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
export const OpcionesContext = createContext()
export const ResetContext = createContext()

function App() {
  const funcion = (state, action) => {
    const calamapy = new Map(state)
    if (action.verificado) {
      calamapy.set(action.casilla.toUpperCase())
    } else {
      calamapy.delete(action.casilla.toUpperCase())
    }
    return calamapy
  }
  const [categoria, setCategoria] = useState('men')
  const [reset, setReset] = useState('')
  const [state, dispatch] = useReducer(funcion, new Map())
  return (
    <div className="App">
      <Router>
        <OpcionesContext.Provider value={{ state, dispatch }}>
        <ResetContext.Provider value={{reset, setReset}}>
          <NavBar estado={setCategoria}  />
          <Routes>
            <Route path="/" element={<Home category={categoria}/>} />
            <Route path="/men" element={<Home category={categoria} />} />
            <Route path="/women" element={<Home category={categoria} />} />
            <Route element={<GuardedRoute autenticacion={auth} defaultRedirect='/login' />}>
              <Route path="/favorites" element={<Favorites />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Footer />
          </ResetContext.Provider>
        </OpcionesContext.Provider>
      </Router>
    </div>
  );
}

export default App;
