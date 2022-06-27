export default function Funcion({ funcion }) {
    var imagen = `/img/${funcion[0]}.png`;
    var nombre = funcion[0].slice(0,1).toUpperCase()+funcion[0].slice(1)
/*     if (funcion[0] === 'tough solar') {
        imagen = '/img/sun.png'
    } else {
        imagen = '/img/bluetooth.png'
    } */

    return (
        <div id="funcion">
            <p>{nombre}</p>
            <img src={imagen} alt={funcion}></img>
            <p>Acciones</p>
            <ul><li>Conecta al móvil</li>
                <li>Sincroniza hora</li>
                <li>Sincroniza pasos</li></ul>
        </div>
    )
}