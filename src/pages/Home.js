import React from 'react';
import Relojes from '../components/Relojes'

export default function Home({ category }) {

    return (
        <div id="home">
            <div className="fondo">
                <Relojes category={category} />
            </div>
        </div>
    )
}