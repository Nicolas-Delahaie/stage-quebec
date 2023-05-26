/* --------------------------------- IMPORT --------------------------------- */

/*import du composant ArticleTitle */
import ArticleTitle from "../components/forms/ArticleTitle"

/* import pour créer le style */
import styled from "styled-components"

/* import des images */
import Repartition_plusieurs from "../assets/images/Home/Repartition_plusieurs.svg"
import Tableau from "../assets/images/Home/Tableau.svg"

/* ---------------------------------- STYLE --------------------------------- */

const ArticleStyle = styled.div`
    padding: 1rem 3rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    justify-items: center;
`;

const ImageArticle = styled.img`
    width: 40vw;
    height: auto;
    margin: 0 2rem;
`;

/* ----------------------------------- DOM ---------------------------------- */

function Home() {
    return (
        <div>
            <ArticleTitle texte={'Présentation'} />
            <ArticleStyle>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                    Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                    Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                    Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                    Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                </p>
                <ImageArticle src={Repartition_plusieurs} alt="image article" />
            </ArticleStyle>
            <ArticleTitle texte={'Fonctionnement'} />
            <ArticleStyle>
                <ImageArticle src={Tableau} alt="image article" />
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                    Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                    Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                    Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                    Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                </p>
            </ArticleStyle>
        </div>
    )
}

export default Home