import React, { useContext, useState, useEffect, useRef, useReducer } from 'react';
import { OpcionesContext } from '../App'
import { ResetContext } from '../App'
import Ficha from '../components/Ficha'
import axios from 'axios';
import { deleteFavorite } from '../firebase'

export default function Relojes({
    url = 'https://us-central1-proyecto-react-sprint-9.cloudfunctions.net/api',
    category = 'men',
    showFicha = true,
    jsonRelojes }) {
    const [cargando, setCargando] = useState('lds-ring')
    const [sinResultados, setSinResultados] = useState('none')
    const { setReset } = useContext(ResetContext);
    const { state } = useContext(OpcionesContext);
    const [llave, setLlave] = useState(0)
    const refCount = useRef(0)
    const refNombre = useRef(null)
    const refDisplay = useRef(null)
    const [relojes, setRelojes] = useState(new Map())
    const initialState = { evento: false };

    const funcion = (state, actiona) => {
        if (actiona.accion === 'siguiente') {
            setLlave(prev => {
                if (prev < relojes.size - 1) {
                    return prev + 1
                } else { return prev }
            })
        }
        else if (actiona.accion === 'anterior') {
            setLlave(prev => {
                if (prev !== 0) {
                    return prev - 1
                } else {
                    return prev
                }
            })
        }
        return { evento: true };

    }
    const [numerito, dispatch] = useReducer(funcion, initialState)
    const FichaCondicional = ({ arrayRelojes }) => {
        if (showFicha) {
            if (arrayRelojes.size > 0) {
                const amigo = arrayRelojes.get(refNombre.current);
                return <Ficha nombre={refNombre.current} elementos={amigo} funciones={amigo.funciones} />
            } else {
                return <p></p>
            }
        }
    }

    const setCategoria = (res) => {
        switch (category) {
            case '': return {
                ...res.data.gshock.men,
                ...res.data.gshock.women
            }
            case 'men': return res.data.gshock.men
            case 'women': return res.data.gshock.women
            case 'favorites': return jsonRelojes;
            default: return {}
        }
    }
    const escuchador = (e) => {
        switch (e.key) {
            case 'ArrowRight':
                dispatch({ accion: 'siguiente' })
                break;
            case 'ArrowLeft':
                dispatch({ accion: 'anterior' })
                break
            default: break;
        }

    }
    useEffect(() => {
        const array = new Map();
        setLlave(0)
        if (numerito.evento === false) {
            window.addEventListener('keyup', escuchador)
        }
        dispatch({ evento: true })
        setCargando('lds-ring')
        setSinResultados('none')
        setRelojes(new Map())
        axios.get(url)
            .then((res) => {
                setCargando('')
                const categoria = setCategoria(res)
                if (categoria !== undefined && categoria !== null) {
                    // eslint-disable-next-line
                    Object.entries(categoria).map((reloj) => {
                        //por cada reloj
                        if (state.size !== 0) {
                            if (reloj[1].funciones === undefined) {
                                return ''
                            }
                            // eslint-disable-next-line
                            var contador = 0;
                            Object.entries(reloj[1].funciones).map((funcion) => {
                                if (Array.from(state).map((elemento) => {
                                    if (elemento[0] === funcion[0].toUpperCase()) {
                                        contador++
                                    }
                                    return elemento
                                }))
                                    if (contador === state.size) {
                                        array.set(reloj[0], reloj[1])
                                    }
                                    return funcion
                            })
                        } else {
                            array.set(reloj[0], reloj[1])
                        }
                        setRelojes(array)
                        refCount.current = array.size
                        return reloj
                    })
                    if (array.size === 0) {
                        setSinResultados('')
                    }
                }
            })
            // eslint-disable-next-line
    }, [category, state, jsonRelojes, url, numerito.evento])

    const next = (e) => {
        if (e.target.nodeName !== 'BUTTON') {
            dispatch({ accion: e.target.attributes.name.value })
        } else {
            dispatch({ accion: e.target.className })
        }
    }
    const deleteFavorites = () => {
        deleteFavorite(refNombre.current)
    }
    const resety = () => {
        setReset('a')
    }
    return (
        <div className="relojes">
            <div className="justWatches">
                <div className={cargando} ><div></div><div></div><div></div><div></div></div>
                <span className={sinResultados}>Sin resultados <br></br><button onClick={resety}>RESET</button></span>
                <button className='anterior' onClick={next}><i name="anterior" className="bi bi-arrow-left-circle"></i></button>
                <div className='imagenes' ref={refDisplay} style={{ transform: `translate(0px, 0px)` }}>
                    {Array.from(relojes).map((elemento, key) => {
                        const imgURL = 'img/' + elemento[0] + '.png'
                        if (key === llave) {
                            refNombre.current = elemento[0];
                            return <img key={key} src={imgURL} alt={elemento[0]} className="activo" onClick={deleteFavorites}></img>
                        }
                        else {
                            return <img key={key} src={imgURL} alt={elemento[0]} onClick={(e) => { setLlave(key) }}></img>
                        }
                    })}
                </div>
                <button className='siguiente' onClick={next}><i name="siguiente" className="bi bi-arrow-right-circle"></i></button>
            </div>
            <FichaCondicional arrayRelojes={relojes} />
        </div>)
}