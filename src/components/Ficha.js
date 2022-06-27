import Funcion from '../components/Funcion'
import { addFavorite, auth } from '../firebase'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'

export default function Ficha({ nombre = '', elementos = {}, funciones = { bluetooth: true } }) {
    const [clase, setClase] = useState('flotante none')
    const user = (auth.currentUser !== null) ? auth.currentUser.uid : ''
    const guardarFavorito = async () => {
        setClase('flotante')
        addFavorite(user, nombre.toUpperCase(), JSON.stringify(elementos))
        setTimeout(() => {
            setClase('flotante none')
        }, 1000)
    }
    var peso = (nombre === '') ? '' : 'g'
    const guardar = (auth.currentUser !== null) ? <button className='guardar' onClick={guardarFavorito}>Guardar</button> : <Link to="/login"><button className="guardar">Login to fav</button></Link>
    const titulo = (nombre === '') ? <h1>{guardar}</h1> : <h1>G-SHOCK <span>{nombre.toUpperCase()}</span> {guardar}</h1>
    const guardado = <p className={clase} ><b>{nombre}</b> guardado en favoritos</p>
    return (
        <div id="ficha">
            {guardado}
            {titulo}
            <h2>{elementos.peso}{peso}</h2>
            {Object.entries(funciones).map((elemento, key) => {
                return <Funcion funcion={elemento} key={key} />
            })}
        </div>
    )
}