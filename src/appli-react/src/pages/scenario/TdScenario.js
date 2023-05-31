import styled from 'styled-components';
import { colors, fonts } from '../../utils/styles';
import { useState, useRef, useEffect } from 'react';

export const TdScenario = styled.td`
    font-size: 0.9rem;
    max-width: 5rem;
    height: 2rem;
    overflow : scroll;
    boder-collapse: collapse;
    border: 1px solid ${colors.bleuFonce};
    text-align: center;
    &:nth-child(-n+5) {
        font-family: ${fonts.titre};
        background-color: ${colors.grisClair};
    }
    &:hover {
        background-color: ${colors.jauneClair};
    }

    ::-webkit-scrollbar {
        display: none;
    }
`;

const InputTdScenario = styled.input`
    font-size: 0.9rem;
    width: 100%;
    height: 100%;
    border: none;
    color: ${colors.bleuFonce};
    font-family: ${fonts.texte};

    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    :focus {
        outline: none;
    }
`;


export function TdScenarioComponent({ indexCours, indexProfesseur, nbGroupes, TbCours, TbProfesseurs, TbRepartition }) {
    const [estClicker, setEstClicker] = useState(false);
    const inputRef = useRef(null);
    var repartitionMatch

    const clickTest = () => {

        repartitionMatch = TbRepartition.find(
                (rep) =>
                    rep.idCours === TbCours[indexCours].id && rep.idProfesseur === TbProfesseurs[indexProfesseur].id,
            )
        setEstClicker(!estClicker);
    };

    const entreTest = (e) => {
        var value = e.target.value;
        if (e.key === 'Enter') {
            setEstClicker(!estClicker);
        }
    }

    useEffect(() => {
        if (estClicker && inputRef.current) {
            inputRef.current.focus();
        }
    }, [estClicker]);

    return (
        estClicker ? (
            <TdScenario onClick={clickTest}>
                <InputTdScenario ref={inputRef} type="number" placeholder={nbGroupes} onKeyDown={entreTest} />
            </TdScenario>
        ) : (
            <TdScenario onClick={clickTest}>
                {nbGroupes}
            </TdScenario>
        )
    );
}
