/**
 * 
 * @param {*} nbGroupes nombre de groupe du cours
 * @param {*} ponderation ponderation du professeur
 * @param {*} tailleGroupes taille des groupes du cours
 * @param {*} nbPreparation nombre de préparation du cours
 * @returns 
 */
export const calculCIP = (nbGroupes = 0, ponderation = 0, tailleGroupes = 0, nbPreparation = 0) => {
    if (typeof nbGroupes !== 'number' || typeof ponderation !== 'number' || typeof tailleGroupes !== 'number' || typeof nbPreparation !== 'number') {
        return 0;
    }

    if (nbGroupes < 0 || ponderation < 0 || tailleGroupes < 0 || nbPreparation < 0) {
        return 0;
    }

    Math.ceil(nbGroupes);
    Math.ceil(ponderation);
    Math.ceil(tailleGroupes);
    Math.ceil(nbPreparation);

    var CIP = 0;
    var facteurPreparation = 0;
    var nbEtudiantsTotal = tailleGroupes * nbGroupes;

    //Calcul du facteur de préparation
    switch (nbPreparation) {
        case 1 || 2:
            facteurPreparation = 0.9;
            break;
        case 3:
            facteurPreparation = 1.1;
            break;
        default:
            facteurPreparation = 1.75;
    }

    CIP = facteurPreparation * ponderation

    CIP += (1.2 * ponderation * nbGroupes)

    if (ponderation * nbEtudiantsTotal > 415) {
        CIP += 0.04 * 415

    }
    else {
        CIP += 0.04 * (ponderation * nbEtudiantsTotal)

    }

    if (ponderation * nbEtudiantsTotal > 415) {
        CIP += 0.07 * (ponderation * nbEtudiantsTotal - 415)


    }
    if (nbEtudiantsTotal > 74 && ponderation > 2) {
        CIP += 0.01 * nbEtudiantsTotal

    }

    if (nbEtudiantsTotal > 160 && ponderation > 2) {
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