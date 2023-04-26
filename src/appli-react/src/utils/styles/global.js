import { createGlobalStyle } from 'styled-components';
import { fonts } from './fonts';
import './fonts.css'
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
        height: 100vh;
    }
`;

function GlobalStyles() {
    return <GlobalStyle />;
}

export default GlobalStyles;