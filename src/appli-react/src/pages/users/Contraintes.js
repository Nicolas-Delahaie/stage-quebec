import { useState, useEffect, useContext } from "react";
import { AppContext } from '../../utils/context/context';
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
    const { apiAccess, getUserId } = useContext(AppContext);
    const userId = getUserId();

    const [isLoading, setIsLoading] = useState(false);
    const [veutModifier, setVeutModifier] = useState(false);

    const [contraintes, setContraintes] = useState("");
    const [newContraintes, setNewContraintes] = useState("");


    const getcontraintess = async () => {
        setIsLoading(true);
        const rep = await apiAccess({
            url: `http://localhost:8000/api/users/${userId}`,
            method: "get",
        });

        // -- Analyse du coordo --
        if (rep.success) {
            setContraintes(rep.datas.contraintes);
        }
        else {
            /** @todo Gerer l erreur */
            console.log(rep.erreur)
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getcontraintess();
    }, []);


    const clicEnregistrer = async () => {
        if (newContraintes !== "") {
            // -- Enregistrement des données --
            setIsLoading(true);
            const rep = await apiAccess({
                url: `http://localhost:8000/api/users/${userId}/contraintes`,
                method: "put",
                body: {
                    contraintes: newContraintes,
                },
            });

            if (rep.success) {
                setContraintes(newContraintes);
            }
            else {
                /** @todo Gerer l erreur */
                console.log(rep.erreur)
            }
            setIsLoading(false);
        }
    }

    return (
        <DivPageContraintes>
            <ArticleTitle texte="Contraintes" />
            {isLoading ? (
                <Loader />
            ) : (
                <DivGrille>
                    <DivP>
                        <H2Scenario>Vos contraintes</H2Scenario>
                        {
                            contraintes === null && veutModifier === false ?
                                <p>Vous n'avez pas de contraintes</p>
                                :
                                veutModifier ?
                                    <TextareaContraintes value={newContraintes} onChange={(e) => setNewContraintes(e.target.value)} />
                                    :
                                    <p>{contraintes}</p>
                        }
                        {
                            veutModifier ?
                                <>
                                    <BoutonStyle onClick={() => { setVeutModifier(false); clicEnregistrer(); }}>Enregistrer</BoutonStyle>
                                    <BoutonStyle onClick={() => setVeutModifier(false)}>Annuler</BoutonStyle>
                                </>

                                :
                                <BoutonStyle onClick={() => setVeutModifier(true)}>Modifier</BoutonStyle>

                        }
                    </DivP>
                    <ImgContraintes src={ContraintesSVG} alt="Contraintes image" />
                </DivGrille>
            )}
        </DivPageContraintes>
    )
}

export default Contraintes;