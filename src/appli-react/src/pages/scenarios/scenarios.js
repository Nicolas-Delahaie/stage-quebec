import styled from 'styled-components'

import CarteHorizontale from '../../components/layout/CarteHorizontale';

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
            <CarteHorizontale urlImage={Valider} titre={'Département : informatique'} texteBouton={'Voir en détail'} lien={'/'}>
                <p> Coordonateur : Frédéric Guérin </p>
                <p> Validation du responsable : X</p>
                <p> Dernière modification : il y a une semaine</p>
            </CarteHorizontale>
            <CarteHorizontale urlImage={Valider} titre={'Département : informatique'} texteBouton={'Voir en détail'} lien={'/'}>
                <p> Coordonateur : Frédéric Guérin </p>
                <p> Validation du responsable : X</p>
                <p> Dernière modification : il y a une semaine</p>
            </CarteHorizontale>
            <CarteHorizontale urlImage={Valider} titre={'Département : informatique'} texteBouton={'Voir en détail'} lien={'/'}>
                <p> Coordonateur : Frédéric Guérin </p>
                <p> Validation du responsable : X</p>
                <p> Dernière modification : il y a une semaine</p>
            </CarteHorizontale>
            <CarteHorizontale urlImage={Valider} titre={'Département : informatique'} texteBouton={'Voir en détail'} lien={'/'}>
                <p> Coordonateur : Frédéric Guérin </p>
                <p> Validation du responsable : X</p>
                <p> Dernière modification : il y a une semaine</p>
            </CarteHorizontale>
        </Container>
    )
}

export default scenarios