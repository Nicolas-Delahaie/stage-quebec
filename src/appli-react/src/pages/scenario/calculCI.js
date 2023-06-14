/**
 * 
 * @param {*} nbGroupes nombre de groupe du cours
 * @param {*} ponderation ponderation du professeur
 * @param {*} tailleGroupes taille des groupes du cours
 * @param {*} preparation nombre de préparation du cours
 * @returns 
 */
export const calculCIP = (TbRepartition) => {

    if (TbRepartition === undefined) return 0;
    if (TbRepartition.length === 0) return 0;
    
    var preparation = TbRepartition.length
    var CIP = 0;
    var nbGroupes = 0;
    var ponderation = 0;
    var tailleGroupes = 0;
    var nbEtudiantsTotal = 0;
    var heuresCoursDiff = 0;
    var heuresCoursTous = 0;
    var PES = 0;

    TbRepartition.forEach((repartition) => {
        nbEtudiantsTotal += repartition.nbGroupes * repartition.tailleGroupes;
        heuresCoursTous += repartition.ponderation * repartition.nbGroupes;
        tailleGroupes += repartition.tailleGroupes;
        PES += repartition.ponderation * repartition.tailleGroupes * repartition.nbGroupes;
        heuresCoursDiff += repartition.ponderation
    });

        if (typeof nbGroupes !== 'number' || typeof ponderation !== 'number' || typeof tailleGroupes !== 'number' ) {
            return 0;
        }

        if (nbGroupes < 0 || ponderation < 0 || tailleGroupes < 0 || preparation < 0) {
            return 0;
        }

        var facteurPreparation = 0;


        //Calcul du facteur de préparation
        switch (preparation) {
            case 1 :
                facteurPreparation = 0.9;
                break;
            case 2:
                facteurPreparation = 0.9;
                break;
            case 3:
                facteurPreparation = 1.1;
                break;
            default:
                facteurPreparation = 1.75;
        }

        CIP += facteurPreparation * heuresCoursDiff;
        
        CIP += (1.2 * heuresCoursTous)

        if (PES > 415) {
            CIP += 0.04 * 415
        }
        else {
            CIP += 0.04 * (PES)
        }

        if (PES> 415) {
            CIP += 0.07 * (PES- 415)
        }

        if (nbEtudiantsTotal > 74 && preparation > 2) {
            CIP += 0.01 * nbEtudiantsTotal
        }

        if (nbEtudiantsTotal > 160 && preparation > 2) {
            CIP += 0.1 * ((nbEtudiantsTotal - 160) ** 2)
        }


    return CIP.toFixed(2);
}

export const calculCIL = (ETC = 0) => {
    if (typeof ETC !== 'number') return 0;
    if (ETC < 0) return 0;

    var CIL = 0;
    CIL = 40 * ETC;
    return CIL.toFixed(2);
}
