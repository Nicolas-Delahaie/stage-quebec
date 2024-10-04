import { calculCIP, calculCIL } from "./calculCI"


describe('calculCIP', () => {
    it('revoyer 2.9 avec une répartion 1,1,20 ', () => {
        const resultatAttendu = 2.9;

        const TbTest = [{
            nbGroupes: 1,
            ponderation: 1,
            tailleGroupes: 20,
        }];
        const resultat = parseFloat(calculCIP(TbTest));
        
        expect(resultat).toEqual(resultatAttendu);
    });

    it('renvoyer 9.3 avec quatres répartition de 1,1,20', () => {
        const resultatAttendu = 9.3;

        const TbTest = [{
            nbGroupes: 1,
            ponderation: 1,
            tailleGroupes: 20,
        },
        {
            nbGroupes: 1,
            ponderation: 1,
            tailleGroupes: 20,
        },
        {
            nbGroupes: 1,
            ponderation: 1,
            tailleGroupes: 20,
        }
        ];
        const resultat = parseFloat(calculCIP(TbTest));

        expect(resultat).toEqual(resultatAttendu);
    });

    it('renvoyer 19.05 avec 1,1,420,1', () => {
        const resultatAttendu = 19.05;

        const TbTest = [{
            nbGroupes: 1,
            ponderation: 1,
            tailleGroupes: 420,
        }];
        const resultat = parseFloat(calculCIP(TbTest));

        expect(resultat).toEqual(resultatAttendu);
    });

    it('renvoyer 2.1 avec 1,1,0,1', () => {
        const resultatAttendu = 2.1;

        const TbTest = [{
            nbGroupes: 1,
            ponderation: 1,
            tailleGroupes: 0,
        }];
        const resultat = parseFloat(calculCIP(TbTest));

        expect(resultat).toEqual(resultatAttendu);
    });

    it('renvoyer 0 avec aucun paramètres', () => {
        const resultatAttendu = 0;
        const resultat = parseFloat(calculCIP());

        expect(resultat).toEqual(resultatAttendu);
    });

    it('renvoyer 0 avec un tableau vide', () => {
        const resultatAttendu = 0;
        const resultat = parseFloat(calculCIP([]));

        expect(resultat).toEqual(resultatAttendu);
    });

    it('renvoyer 0 avec des paramètres qui ne sont pas du type number', () => {
        const resultatAttendu = 0;

        const TbTest = [{
            nbGroupes: 'a',
            ponderation: 'b',
            tailleGroupes: 'c',
        }];
        const resultat = parseFloat(calculCIP(TbTest));

        expect(resultat).toEqual(resultatAttendu);
    });
    it('renvoyer 0 avec plusieurs repartitions qui ont des paramètres qui ne sont pas du type number', () => {
        const resultatAttendu = 0;

        const TbTest = [{
            nbGroupes: 1,
            ponderation: 2,
            tailleGroupes: 3,
        },
        {
            nbGroupes: 'a',
            ponderation: 'b',
            tailleGroupes: 'c',
        },];

        const resultat = parseFloat(calculCIP(TbTest));

        expect(resultat).toEqual(resultatAttendu);
    });


    it('renvoyer 0 avec des paramètres négatifs', () => {
        const resultatAttendu = 0;

        const TbTest = [{
            nbGroupes: -1,
            ponderation: -1,
            tailleGroupes: -1,
        }];
        const resultat = parseFloat(calculCIP(TbTest));

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
    