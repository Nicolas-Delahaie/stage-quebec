/* import permettant de créer un style global pour l'ensemble de l'application */
import { createGlobalStyle } from 'styled-components';

/* import des variables de style */
import { fonts } from './fonts';
import './fonts.css'

/* import du curseur personnalisé */
import cursor from '../../assets/svg/cursor.svg';

const GlobalStyle = createGlobalStyle`

    * {
        cursor: url(${cursor}), auto;
    }

    body {
        margin: 0;
        padding: 0;
        font-family: ${fonts.texte};
    }
    .App {
        height: 80.5vh;
    }
`;

function GlobalStyles() {
    return <GlobalStyle />;
}

export default GlobalStyles;