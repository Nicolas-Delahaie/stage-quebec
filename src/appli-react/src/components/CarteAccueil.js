import { Link } from "react-router-dom"

/**
 * Composant CarteAccueil Utilisé pour afficher une carte avec une image, un titre et un lien vers une page
 * @param {string} urlImage Prend en paramètre l'url de l'image à afficher
 * @param {string} titre Prend en paramètre le titre à afficher
 * @param {string} texteBouton Prend en paramètre le texte du bouton à afficher
 * @param {string} lien Prend en paramètre le lien vers lequel le bouton doit pointer
 * @returns la carte avec une image, un titre et un lien vers une page
 */
function CarteAccueil({ urlImage, titre, texteBouton, lien }) {
    return (
        <Link to={lien} className="carteAccueil">
            <img src={urlImage} alt={titre} />
            <h2>{titre}</h2>
        </Link>
    )
}

export default CarteAccueil