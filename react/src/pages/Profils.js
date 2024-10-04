import { useParams } from "react-router-dom";

function Profils() {
    const { id } = useParams();
    return (
        <div className="page">
            <h1>Profil n°{id}</h1>
        </div>
    )
}
export default Profils;