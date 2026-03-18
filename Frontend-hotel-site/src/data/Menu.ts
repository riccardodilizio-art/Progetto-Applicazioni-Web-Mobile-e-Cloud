import type { DayMenu } from '../types/Menu'

export const breakfastItems: string[] = [
    'Cornetti e brioches appena sfornati',
    'Pane artigianale di grano locale',
    'Marmellate e confetture artigianali',
    'Formaggi e salumi della tradizione marchigiana',
    'Frutta fresca di stagione',
    'Yogurt greco con miele del Montefeltro',
    'Succhi di frutta naturali e spremute',
    'Caffè, cappuccino, latte, tè e tisane',
]

export const lunchItems: string[] = [
    'Antipasti di mare: insalata di polpo, cozze gratinate, gamberi marinati',
    'Antipasti di terra: bruschette, salumi misti, formaggi locali',
    'Insalate fresche e verdure grigliate di stagione',
    'Pasta fredda e riso freddo con condimenti vari',
    'Piatto caldo del giorno (a rotazione)',
    'Contorni caldi e freddi',
    'Pane e focacce artigianali del forno di Pesaro',
    'Frutta fresca e dolci leggeri',
]

export const weeklyMenu: DayMenu[] = [
    {
        id: 0,
        day: 'Lunedì',
        dinner: {
            primi: [
                {
                    name: "Spaghetti alle Vongole Veraci dell'Adriatico",
                    description:
                        "Vongole fresche dell'Adriatico con aglio, prezzemolo e vino bianco Verdicchio dei Castelli di Jesi",
                    category: 'pesce',
                },
                {
                    name: 'Tagliatelle al Ragù di Cinghiale dei Sibillini',
                    description:
                        "Pasta fresca all'uovo con ragù lento di cinghiale, pomodoro San Marzano e bacche di ginepro",
                    category: 'carne',
                },
                {
                    name: 'Risotto ai Funghi Porcini e Tartufo di Acqualagna',
                    description:
                        'Riso Carnaroli con funghi porcini freschi e pregiato tartufo nero di Acqualagna, mantecato al parmigiano',
                    category: 'vegetariano',
                },
            ],
            secondi: [
                {
                    name: 'Filetto di Branzino al Forno alle Erbe',
                    description:
                        "Branzino fresco dell'Adriatico con erbe aromatiche marchigiane, olio EVO e verdure di stagione",
                    category: 'pesce',
                },
                {
                    name: 'Tagliata di Manzo Marchigiana',
                    description:
                        'Tagliata di manzo locale con rucola selvatica, scaglie di grana stagionato e pomodorini confit',
                    category: 'carne',
                },
                {
                    name: 'Parmigiana di Melanzane al Forno',
                    description:
                        'Melanzane a strati con passata di pomodoro datterino, mozzarella di bufala campana e basilico fresco',
                    category: 'vegetariano',
                },
            ],
        },
    },
    {
        id: 1,
        day: 'Martedì',
        dinner: {
            primi: [
                {
                    name: 'Linguine al Brodetto Pesarese',
                    description:
                        "Ricetta tradizionale pesarese: brodetto di pesce misto dell'Adriatico con scorfano, gallinella e cozze",
                    category: 'pesce',
                },
                {
                    name: 'Maccheroncini di Campofilone al Ragù di Vitello',
                    description:
                        "Pasta tipica del Piceno, sottile come capelli d'angelo, con ragù bianco di vitello alla maniera antica",
                    category: 'carne',
                },
                {
                    name: 'Pappardelle ai Funghi Misti del Montefeltro',
                    description:
                        'Pasta fresca larga con mix di funghi selvatici — porcini, galletti e finferli — timo e aglio rosa',
                    category: 'vegetariano',
                },
            ],
            secondi: [
                {
                    name: 'Sogliola alla Mugnaia',
                    description:
                        "Sogliola fresca dell'Adriatico dorata in burro nocciola con limone e prezzemolo, patate novelle al vapore",
                    category: 'pesce',
                },
                {
                    name: 'Pollo alla Cacciatora Marchigiana',
                    description:
                        'Pollo ruspante con olive taggiasche, rosmarino, capperi di Pantelleria e pomodoro fresco',
                    category: 'carne',
                },
                {
                    name: 'Tortino di Zucchine al Formaggio Caprino',
                    description:
                        'Tortino di zucchine estive con formaggio caprino fresco, menta selvatica e pinoli tostati',
                    category: 'vegetariano',
                },
            ],
        },
    },
    {
        id: 2,
        day: 'Mercoledì',
        dinner: {
            primi: [
                {
                    name: 'Risotto ai Frutti di Mare Adriatici',
                    description: "Riso con cozze, vongole, gamberi rosa e calamari freschissimi dell'Adriatico",
                    category: 'pesce',
                },
                {
                    name: 'Vincisgrassi Marchigiani Tradizionali',
                    description:
                        'Il grande classico della cucina marchigiana: sfoglie di pasta fresca con ragù bianco di fegatini e besciamella',
                    category: 'carne',
                },
                {
                    name: 'Gnocchi di Patate al Pomodoro Fresco e Basilico',
                    description:
                        "Gnocchi fatti in casa con passata di pomodoro fresco dell'orto, basilico di Pesaro e olio EVO",
                    category: 'vegetariano',
                },
            ],
            secondi: [
                {
                    name: 'Rombo al Forno con Capperi e Olive',
                    description:
                        'Rombo chiodato al forno con capperi di Pantelleria, olive taggiasche e olio extravergine marchigiano',
                    category: 'pesce',
                },
                {
                    name: 'Coniglio in Porchetta alla Pesarese',
                    description:
                        'Coniglio ripieno con finocchio selvatico del Metauro, aglio e rosmarino — ricetta tradizionale di Pesaro',
                    category: 'carne',
                },
                {
                    name: 'Melanzane Ripiene di Ricotta e Spinaci',
                    description:
                        'Melanzane al forno con ripieno di ricotta fresca marchigiana, spinaci saltati e parmigiano reggiano',
                    category: 'vegetariano',
                },
            ],
        },
    },
    {
        id: 3,
        day: 'Giovedì',
        dinner: {
            primi: [
                {
                    name: 'Tagliolini Neri al Nero di Seppia con Gamberi',
                    description:
                        'Pasta nera colorata con inchiostro di seppia, gamberi rossi del Tirreno, pomodorini e basilico',
                    category: 'pesce',
                },
                {
                    name: 'Ravioli di Carne al Burro e Salvia',
                    description:
                        'Ravioli ripieni di manzo, maiale e mortadella in burro nocciola profumato alla salvia con parmigiano',
                    category: 'carne',
                },
                {
                    name: 'Orecchiette con Broccoli e Pecorino Stagionato',
                    description:
                        'Orecchiette con broccoletti ripassati in padella, aglio, peperoncino e pecorino marchigiano stagionato',
                    category: 'vegetariano',
                },
            ],
            secondi: [
                {
                    name: 'Grigliata Mista di Pesce Adriatico',
                    description:
                        'Gamberoni, calamari, scampi, sogliola e pescatrice alla griglia con limone, capperi e olio EVO',
                    category: 'pesce',
                },
                {
                    name: 'Arrosto di Maiale al Rosmarino',
                    description:
                        'Lonza di maiale locale arrosto al forno con patate al rosmarino, aglio e vino Bianchello del Metauro',
                    category: 'carne',
                },
                {
                    name: 'Torta Salata di Verdure e Ricotta',
                    description:
                        'Torta rustica di pasta brisée con verdure di stagione, ricotta fresca marchigiana ed erbe aromatiche',
                    category: 'vegetariano',
                },
            ],
        },
    },
    {
        id: 4,
        day: 'Venerdì',
        dinner: {
            primi: [
                {
                    name: 'Spaghetti alla Trabaccolara',
                    description:
                        "Ricetta storica dei pescatori pesaresi: spaghetti con sugo di pesce povero dell'Adriatico e pomodoro",
                    category: 'pesce',
                },
                {
                    name: 'Tagliatelle al Sugo di Lepre del Montefeltro',
                    description:
                        'Pasta fresca con ragù di lepre selvatica, vino rosso Rosso Piceno, alloro e aromi della macchia',
                    category: 'carne',
                },
                {
                    name: 'Risotto al Radicchio Rosso e Gorgonzola',
                    description:
                        'Riso Vialone Nano con radicchio rosso di Treviso, gorgonzola dolce lombardo e noci di Sorrento',
                    category: 'vegetariano',
                },
            ],
            secondi: [
                {
                    name: "Fritto Misto di Paranza dell'Adriatico",
                    description:
                        "Frittura croccante di piccolo pesce fresco dell'Adriatico con verdure in pastella e salsa agli agrumi",
                    category: 'pesce',
                },
                {
                    name: 'Scaloppine al Limone del Gargano',
                    description:
                        'Tenere scaloppine di vitello al limone fresco con capperi, patate al vapore e insalatina di campo',
                    category: 'carne',
                },
                {
                    name: 'Zuppa di Legumi del Montefeltro',
                    description:
                        'Zuppa ricca di lenticchie di Castelluccio IGP, ceci, fagioli borlotti ed erbe selvatiche del Montefeltro',
                    category: 'vegetariano',
                },
            ],
        },
    },
    {
        id: 5,
        day: 'Sabato',
        dinner: {
            primi: [
                {
                    name: "Spaghetti all'Astice Adriatico",
                    description:
                        "Spaghetti di Gragnano con astice fresco dell'Adriatico, pomodorini datterini, aglio e prezzemolo",
                    category: 'pesce',
                },
                {
                    name: 'Pappardelle al Cinghiale del Montefeltro',
                    description:
                        'Pasta larga con ragù di cinghiale selvatico del Montefeltro, bacche di ginepro e vino Sangiovese',
                    category: 'carne',
                },
                {
                    name: 'Tortellini di Ricotta e Spinaci in Brodo',
                    description:
                        'Tortellini fatti a mano ripieni di ricotta fresca e spinaci in brodo vegetale aromatico al parmigiano',
                    category: 'vegetariano',
                },
            ],
            secondi: [
                {
                    name: 'Spigola in Crosta di Sale',
                    description:
                        'Spigola intera cotta lentamente in crosta di sale marino con finocchi brasati e olio al limone',
                    category: 'pesce',
                },
                {
                    name: 'Costolette di Agnello della Vallesina alla Brace',
                    description: 'Agnello locale alla brace con timo, aglio e rosmarino, verdure grigliate di stagione',
                    category: 'carne',
                },
                {
                    name: 'Sformato di Carciofi con Besciamella',
                    description:
                        'Sformato di carciofi romaneschi con besciamella al parmigiano, mentuccia e pinoli dorati',
                    category: 'vegetariano',
                },
            ],
        },
    },
    {
        id: 6,
        day: 'Domenica',
        dinner: {
            primi: [
                {
                    name: "Brodetto all'Anconetana con Crostini",
                    description:
                        'Zuppa di pesce fresco della tradizione marchigiana con crostini di pane casereccio tostato',
                    category: 'pesce',
                },
                {
                    name: 'Lasagne al Forno della Domenica',
                    description:
                        "Sfoglie fresche all'uovo con ragù di manzo e maiale, besciamella vellutata e parmigiano reggiano",
                    category: 'carne',
                },
                {
                    name: 'Passatelli in Brodo di Parmigiano Stagionato',
                    description:
                        'Passatelli romagnoli in brodo leggero di parmigiano reggiano stagionato 36 mesi con noce moscata',
                    category: 'vegetariano',
                },
            ],
            secondi: [
                {
                    name: 'Trancio di Tonno Rosso alla Griglia',
                    description:
                        'Tonno rosso alla griglia con salsa di capperi di Pantelleria, olive nere taggiasche e pomodorini',
                    category: 'pesce',
                },
                {
                    name: 'Piccione Arrosto al Tartufo di Acqualagna',
                    description:
                        'Piccione nostrano arrosto con salsa al tartufo nero di Acqualagna e cremosa polenta di Storo',
                    category: 'carne',
                },
                {
                    name: 'Quiche di Asparagi Selvatici e Provolone',
                    description:
                        'Quiche rustica con asparagi selvatici del Montefeltro, provolone Valpadana piccante e timo fresco',
                    category: 'vegetariano',
                },
            ],
        },
    },
]
