import { auth, getFavorites } from '../firebase'
import React, { useState, useEffect } from 'react'
import Relojes from '../components/Relojes'

export default function Favorites() {
    const [favoritos, setFavoritos] = useState()
    const user = auth.currentUser.uid
    useEffect(() => {
        getFavorites(user, setFavoritos)
    }, [user])
    return (
        <div id="favorites">
            <h1>Favoritos de {user}</h1>
            <p>Double-tap para borrar</p>
            <Relojes category={'favorites'} showFicha={false} jsonRelojes={favoritos} />
        </div >
    )
}