import { registerWithEmailAndPassword } from "../firebase"
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'

export default function Register() {
    const navigate = useNavigate();
    const emailRegex = /\w*@\w+\.\w+(\.\w*)*$/g
    const [display, setDisplay] = useState({ email: 'none', password: 'none', repeat: 'none' })
    const [error, setError] = useState('')
    const funcion = () => {
        navigate('/')
    }
    const handleRegister = (e) => {
        e.preventDefault();
        setError('')
        const email = e.target[0].value;
        const password = e.target[1].value;
        const passwordRepeat = e.target[2].value;
        var displayNuevo = Object.assign(display);
        //CHECK
        displayNuevo = (email.length < 6 || email.match(emailRegex) === null) ? { ...displayNuevo, email: '' } : { ...displayNuevo, email: 'none' };
        displayNuevo = (password === '' || password.length < 6) ? { ...displayNuevo, password: '' } : { ...displayNuevo, password: 'none' };
        displayNuevo = (passwordRepeat !== password) ? { ...displayNuevo, repeat: '' } : { ...displayNuevo, repeat: 'none' };
        setDisplay(displayNuevo)
        if (displayNuevo.repeat === 'none' && displayNuevo.password === 'none' && displayNuevo.email === 'none') {
            registerWithEmailAndPassword('alan', email, password, funcion, setError)
        }

    }
    const errorParragraph = () => {
        return (error === '') ? '' : <p>Error: {error}</p>
    }
    return (
        <div className="body">
            <div className="login">
                <h1>Registro</h1>
                <form onSubmit={handleRegister}>
                    {errorParragraph()}
                    <input name="email" type="text" placeholder="e-mail" autoComplete="email"></input>
                    <p className={display.email}>Debe ser un e-mail válido</p>
                    <input name="password" type="password" placeholder="password" autoComplete="new-password"></input>
                    <p className={display.password}>El password no puede estar vacío</p>
                    <input name="rep-password" type="password" placeholder="repeat password" className='rep' autoComplete="new-password"></input>
                    <p className={display.repeat}>Los passwords deben coincidir</p>
                    <input type="submit"></input>
                </form>
            </div>
        </div>
    )
}