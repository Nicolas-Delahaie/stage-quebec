import { calculCIP, calculCIL } from "./calculCI"


describe('calculCIP', () => {
    it('revoyer 2.9 avec 1,1,20,1 ', () => {
        const resultatAttendu = 2.9;
        const resultat = parseFloat(calculCIP(1, 1, 20, 1));
        
        expect(resultat).toEqual(resultatAttendu);
    });

    it('renvoyer 3.75 avec 1,1,20,4', () => {
        const resultatAttendu = 3.75;
        const resultat = parseFloat(calculCIP(1, 1, 20, 4));

        expect(resultat).toEqual(resultatAttendu);
    });

    it('renvoyer 19.05 avec 1,1,420,1', () => {
        const resultatAttendu = 19.05;
        const resultat = parseFloat(calculCIP(1, 1, 420, 1));

        expect(resultat).toEqual(resultatAttendu);
    });

    it('renvoyer 12863.55 avec 100,100,1,100', () => {
        const resultatAttendu = 12863.55;
        const resultat = parseFloat(calculCIP(100, 100, 1, 100));

        expect(resultat).toEqual(resultatAttendu);
    });

    it('renvoyer 89732.55 avec 100,100,10,100', () => {
        const resultatAttendu = 89732.55;
        const resultat = parseFloat(calculCIP(100, 100, 10, 100));

        expect(resultat).toEqual(resultatAttendu);
    });

    it('renvoyer 2.1 avec 1,1,0,1', () => {
        const resultatAttendu = 2.1;
        const resultat = parseFloat(calculCIP(1, 1, 0, 1));

        expect(resultat).toEqual(resultatAttendu);
    });

    it('renvoyer 0 avec aucun paramètres', () => {
        const resultatAttendu = 0;
        const resultat = parseFloat(calculCIP());

        expect(resultat).toEqual(resultatAttendu);
    });

    it('renvoyer 0 avec des paramètres qui ne sont pas du type number', () => {
        const resultatAttendu = 0;
        const resultat = parseFloat(calculCIP('a', 'b', 'c', 'd'));

        expect(resultat).toEqual(resultatAttendu);
    });

    it('renvoyer null si tout les paramètres sont a zéro ', () => {
        const resultatAttendu = 0;
        const resultat = parseFloat(calculCIP(0, 0, 0, 0));
        
        expect(resultat).toEqual(resultatAttendu);
    });

    it('renvoyer 0 avec des paramètres négatifs', () => {
        const resultatAttendu = 0;
        const resultat = parseFloat(calculCIP(-1, -1, -1, -1));

        expect(resultat).toEqual(resultatAttendu);
    });
});

describe('calculCIL', () => {
    it('renvoyer 0 avec 0', () => {
        const resultatAttendu = 0;
        const resultat = parseFloat(calculCIL(0));

        expect(resultat).toEqual(resultatAttendu);
    }
    );

    it('renvoyer 8000 avec 200', () => {
        const resultatAttendu = 8000;
        const resultat = parseFloat(calculCIL(200));

        expect(resultat).toEqual(resultatAttendu);
    });

    it('renvoyer 0 avec un paramètre autre qu\'un number', () => {
        const resultatAttendu = 0;
        const resultat = parseFloat(calculCIL('a'));

        expect(resultat).toEqual(resultatAttendu);
    });

    it('renvoyer 0 avec un paramètre aucun paramètres', () => {
        const resultatAttendu = 0;
        const resultat = parseFloat(calculCIL());

        expect(resultat).toEqual(resultatAttendu);
    });

    it('renvoyer 0 avec un paramètre négatif', () => {
        const resultatAttendu = 0;
        const resultat = parseFloat(calculCIL(-1));

        expect(resultat).toEqual(resultatAttendu);
    });

});

    