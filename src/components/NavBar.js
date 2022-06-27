import Opciones from './Opciones'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { auth, onAuthStateChanged, signOut } from '../firebase'
import React, { useState, useRef } from 'react'
var contador = 0

export default function NavBar({ estado }) {
    const formulario = useRef(null)
    const navigate = useNavigate()
    const loggedOut = <div>
        <Link to="login">Login</Link>
        <Link to="register">Register</Link></div>
    const [usuario, setUsuario] = useState(loggedOut)
    const location = useLocation().pathname;
    const locationURL = location.slice(1)
    const enlaces = [
        { url: '', name: 'G-SHOCK' },
        { url: 'men', name: 'MEN' },
        { url: 'women', name: 'WOMEN' },
        { url: 'favorites', name: 'FAVORITES' }
    ]
    const out = () => {
        signOut(auth).then(() => {
            console.log('logged out')
            navigate('')
        })
    }
    onAuthStateChanged(auth, user => {
        if (user !== null && usuario === loggedOut) {
            setUsuario(<div><button onClick={out}>Logout</button> {user.email}</div>)
            contador = 0
        } else if (user === null && contador === 0) {
            setUsuario(loggedOut)
            contador = 1
        }
    })
    const altOpciones = () => {
        if (Array.from(enlaces).map((elemento) => {
            return (elemento.url !== 'favorites') ? elemento.url : ''
        }).includes(locationURL)) {
            return <Opciones formulario={formulario} />
        }
    }
    return (
        <div id='nav'>
            <nav>
                <ul>
                    {Array.from(enlaces).map((elemento, key) => {
                        const activo = (elemento.url === location.slice(1)) ? 'activo' : '';
                        return <Link key={key} to={elemento.url} onClick={() => { estado(elemento.url) }}><li className={activo}>{elemento.name}</li></Link>
                    })}
                </ul>
                {usuario}
            </nav>
            {altOpciones()}
        </div>
    )
}