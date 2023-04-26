import styled from 'styled-components'

import CarteHorizontal from '../../components/layout/CarteHorizontal';

import Valider from '../../assets/images/Scenarios/Valider.svg'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding : 2rem 0rem;
`;

function scenarios() {
    return (
        <Container>
            <CarteHorizontal urlImage={Valider} titre={'Département : informatique'} texteBouton={'Voir en détail'} lien={'/'}>
                <p> Coordonateur : Frédéric Guérin </p>
                <p> Validation du responsable : X</p>
                <p> Dernière modification : il y a une semaine</p>
            </CarteHorizontal>
            <CarteHorizontal urlImage={Valider} titre={'Département : informatique'} texteBouton={'Voir en détail'} lien={'/'}>
                <p> Coordonateur : Frédéric Guérin </p>
                <p> Validation du responsable : X</p>
                <p> Dernière modification : il y a une semaine</p>
            </CarteHorizontal>
            <CarteHorizontal urlImage={Valider} titre={'Département : informatique'} texteBouton={'Voir en détail'} lien={'/'}>
                <p> Coordonateur : Frédéric Guérin </p>
                <p> Validation du responsable : X</p>
                <p> Dernière modification : il y a une semaine</p>
            </CarteHorizontal>
            <CarteHorizontal urlImage={Valider} titre={'Département : informatique'} texteBouton={'Voir en détail'} lien={'/'}>
                <p> Coordonateur : Frédéric Guérin </p>
                <p> Validation du responsable : X</p>
                <p> Dernière modification : il y a une semaine</p>
            </CarteHorizontal>
        </Container>
    )
}

export default scenarios