
import { Link } from "react-router-dom"

/**
 * Composant CarteHorizontal Utilisé pour afficher une carte avec une image à gauche et du texte à droite sur la longueur
 * @param {string} urlImage Prend en paramètre l'url de l'image à afficher
 * @param {string} titre Prend en paramètre le titre à afficher
 * @param {string} texteBouton Prend en paramètre le texte du bouton à afficher
 * @param {string} lien Prend en paramètre le lien vers lequel le bouton doit pointer
 * @param enfants Prend en paramètre les enfants à afficher
 * @returns Carte avec une image à gauche et du texte à droite sur la longueur
 */
function CarteHorizontale({ urlImage, titre, lien, children: enfants }) {
    return (
        <Link to={lien} className="carteHorizontale">
            <div className="contenu">
                <h2>{titre}</h2>
                {enfants}

            </div>
            <div className="imgContainer">
                <img src={urlImage} alt={titre} />
            </div>
        </Link>
    )
}

export default CarteHorizontale