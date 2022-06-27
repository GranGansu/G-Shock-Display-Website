import { login } from '../firebase'
import { useNavigate } from 'react-router-dom'
import React, {useState} from 'react'

export default function Login() {
    const navigate = useNavigate('/')
    const [error, setError] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password } = e.target
        login(email.value, password.value, navigate, setError)
    }
    return (
        <div className="body">
            <div className="login">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="email" autoComplete="email" placeholder="e-mail"></input>
                    <input type="password" name="password" autoComplete="current-password" placeholder="password"></input>
                    {error}
                    <input type="submit"></input>
                </form>
            </div>
        </div>
    )
}