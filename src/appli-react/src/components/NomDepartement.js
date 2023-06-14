import { Link } from "react-router-dom"


function NomDepartement({ dept, cliquable = false }) {
    return (
        dept && (
            cliquable ?
                <Link className="lienUser" to={`/departements/${dept.id}`}>{dept.nom}</Link>
                :
                <>{dept.nom} {dept.prenom}</>
        )
    )
}
export default NomDepartement;