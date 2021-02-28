import React from 'react';

/**
 * FC -> Function Component permite a passagem de propriedades
 * title?: string; -> Titulo não obrigatório
 * title: string; -> Titulo obrigatório
 */

interface HeaderProps{
    title: string;
}

const Header: React.FC<HeaderProps> = (props) => {
    return(
        <header>
            <h1>{props.title}</h1>
        </header>
    );
}

export default Header;