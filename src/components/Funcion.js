export default function Funcion({ funcion }) {
    var imagen;
    if (funcion[0] === 'tough solar') {
        imagen = '/img/sun.png'
    } else {
        imagen = '/img/bluetooth.png'

    }

    return (
        <div id="funcion">
            <p>{funcion}</p>
            <img src={imagen} alt={funcion}></img>
            <p>Acciones</p>
            <ul><li>Conecta al móvil</li>
                <li>Sincroniza hora</li>
                <li>Sincroniza pasos</li></ul>
        </div>
    )
}