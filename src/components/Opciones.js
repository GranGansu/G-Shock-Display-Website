import React, { useContext, useEffect } from 'react';
import { OpcionesContext } from '../App'
import { ResetContext } from '../App'

export default function Opciones({ formulario }) {
    const { dispatch } = useContext(OpcionesContext);
    const { reset, setReset } = useContext(ResetContext);

    const funciones = ['Bluetooth', 'Tough Solar', 'Step Tracker', 'Cronometro']
    const checkUncheck = (e) => {
        const casilla = (e.target.nodeName === 'INPUT') ? e.target : e.currentTarget.children[0]
        if (e.target.nodeName !== 'INPUT') {
            casilla.checked = casilla.checked ? false : true
        }
        dispatch({ 'casilla': casilla.value, 'verificado': casilla.checked })
    }
    const borrarTodo = (e) => {
        if (e !== undefined)
            e.preventDefault()
        Array.from(formulario.current).map((elemento) => {
            elemento.checked = false;
            dispatch({ 'casilla': elemento.value, 'verificado': false })
        })
        setReset('')
        //solo funciona la primera vez
    }
    useEffect(() => {
        borrarTodo()
    }, [reset])
    return (
        <div className="funciones">
            <form ref={formulario}>
                {funciones.map((elemento, key) => {
                    return (
                        <div onClick={checkUncheck} key={key}>
                            <input type="checkbox" value={elemento} />{elemento}
                        </div>
                    )
                })}
                <button onClick={borrarTodo} className='borrar'>RESET</button>
            </form>
        </div>
    )
}