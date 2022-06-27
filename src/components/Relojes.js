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
    const initialState = { count: 0 };

    const funcion = (state, actiona) => {
        const movilidad = 1
        const clientWidth = refDisplay.current.clientWidth
        const desplazamiento = window.innerWidth - clientWidth
        const x = refDisplay.current.getBoundingClientRect().x
        if (actiona.accion === 'siguiente') {
            setLlave(prev => {
                if (prev < relojes.size - 1) {
                    return prev + 1
                } else { return prev }
            })
            if (x - desplazamiento > 0)
                return { count: state.count - desplazamiento };
        }
        else if (actiona.accion === 'anterior') {
            setLlave(prev => {
                if (prev !== 0) {
                    return prev - 1
                } else {
                    return prev
                }
            })
            return { count: state.count + 100 };
        }
        if (actiona.accion === 'mover') {
            console.log('state: ' + state.anterior + ' movimiento:' + actiona.movimiento)
            if (state.anterior > actiona.movimiento) {
                return { count: state.count - movilidad, anterior: actiona.movimiento + 1 }
            } else {
                return { count: state.count + movilidad, anterior: actiona.movimiento - 1 }
            }
        } else {

        }
        return { count: 0 };

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
    useEffect(() => {
        const array = new Map();
        setLlave(0)
        window.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'ArrowRight':
                    dispatch({ accion: 'siguiente' })
                    break;
                case 'ArrowLeft':
                    dispatch({ accion: 'anterior' })
                    break
                default: break;
            }

        })
        /*         refDisplay.current.addEventListener('touchmove', (e) => {
                    const x = e.touches[0].clientX
                    console.log(x)
                    dispatch({ accion: 'mover', movimiento: x })
                }) */

        setCargando('lds-ring')
        setSinResultados('none')
        setRelojes(new Map())
        axios.get(url)
            .then((res) => {
                /* refNombre.current = null; */
                setCargando('')
                const categoria = setCategoria(res)
                if (categoria !== undefined && categoria !== null) {
                    // eslint-disable-next-line
                    Object.entries(categoria).map((reloj) => {
                        //por cada reloj
                        if (state.size !== 0) {
                            if (reloj[1].funciones === undefined) {
                                return
                            }
                            // eslint-disable-next-line
                            Object.entries(reloj[1].funciones).map((funcion) => {
                                //por cada funcion
                                if (Array.from(state)[0].includes(funcion[0].toUpperCase())) {
                                    array.set(reloj[0], reloj[1])
                                }
                            })
                        } else {
                            array.set(reloj[0], reloj[1])
                        }
                    })
                    setRelojes(array)
                    refCount.current = array.size
                    if (array.size === 0) {
                        setSinResultados('')
                    }
                }

            })
    }, [category, state, jsonRelojes, url])

    const next = (e) => {
        if (e.target.nodeName !== 'BUTTON') {
            dispatch({ accion: e.target.attributes[1].value })
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