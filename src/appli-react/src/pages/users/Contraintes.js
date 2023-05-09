import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader, colors, fonts } from "../../utils/styles";
import { ArticleTitle } from "../../components/forms";
import styled from "styled-components";
import ContraintesSVG from './../../assets/images/users/Contraintes.svg'
import { BoutonStyle } from "../../components/forms/Bouton";

/* ---------------------------------- STYLE --------------------------------- */

const DivPageContraintes = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 80.5vh;
    margin: 1rem auto;
`;

const DivGrille = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: flex-start;
    justify-content: center;
    width: 80%;

`;

const DivP = styled.div`
    display: flex
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`

const H2Scenario = styled.h2`
    font-size: 2rem;
    font-family: ${fonts.titre};
    color: ${colors.bleuFonce};
`;

const ImgContraintes = styled.img`
    justify-self: center;
    width: 75%;
`;

const TextareaContraintes = styled.textarea`
    width: 75%;
    height: 100%;
    resize: none;
    border: 1px solid ${colors.bleuFonce};
    border-radius: 5px;
    padding: 0.25rem;
    font-size: 1.1rem;
    font-family: ${fonts.texte};
    color: ${colors.bleuFonce};
`;

/* ----------------------------------- DOM ---------------------------------- */

function Contraintes() {

    const id = useParams().id;
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const [veutModifier, setVeutModifier] = useState(false);
    const [contraintes, setContraintes] = useState("");

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8000/api/users/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setUserData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const TextAreaChangement = (event) => {
        setContraintes(event.target.value);
    }

    const BoutonEnregistrer = () => {
        console.log('test');
        if (contraintes !== "") {
            setLoading(true);
            fetch(`http://localhost:8000/api/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contraintes: contraintes,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    setUserData(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
        }
    }

    return (
        <DivPageContraintes>
            <ArticleTitle texte="Contraintes" />
            {loading ? (
                <Loader />
            ) : (
                <DivGrille>
                    <DivP>
                        <H2Scenario>Voici vos contraintes</H2Scenario>
                        {
                            userData.contraintes === null && veutModifier === false ? (
                                <p>Vous n'avez pas de contraintes</p>
                            ) : (

                                veutModifier ? (
                                    <TextareaContraintes placeholder={userData.contraintes} onChange={TextAreaChangement} />
                                ) : (
                                    <p>{userData.contraintes}</p>
                                )
                            )
                        }
                        {
                            veutModifier ? (
                                <BoutonStyle onClick={() => [setVeutModifier(false), BoutonEnregistrer()]}>Enregistrer</BoutonStyle>
                            ) : (
                                <BoutonStyle onClick={() => setVeutModifier(true)}>Modifier</BoutonStyle>
                            )
                        }
                    </DivP>
                    <ImgContraintes src={ContraintesSVG} alt="Contraintes image" />
                </DivGrille>
            )}
        </DivPageContraintes>
    )
}

export default Contraintes;