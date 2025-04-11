// For DB:
// FR;MI;racine;exemple

var [dico,
    ctxt,
    indexJS,
    rcc,
    fra_eng,
    AbcMi
] = Array(5).fill(false);

async function fetchFiMi(path, sep = ';') {
    try {
        const response = await fetch(path); // + '?randomId=' + Math.random() // Offline remove
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        let list = text.split('\n').sort((a, b) => a.localeCompare(b));
        return list.map(line => line.split(sep));
    } catch (error) {
        console.error("Error fetching the FiMi file:", error);
    }
}

async function initDBs() {
    dico = await fetchFiMi('./dico.fimi');
    ctxt = await fetchFiMi('./ctxt.fimi');
    rcc = await fetchFiMi('./rcc.fimi', ':');
    fra_eng = await fetchFiMi('../ext/fra-eng.fimi', ':');
    createTable(dico);
}

initDBs();

// Remplace les racourcis claviers par la prononciation
function miToAudio(w) {
    if (!rcc) {
        return w;
    }

    /*
        for (let [from, to] of rcc) {
        w = w.split(from).join(to);
    }
    return w;
    */

    return rcc.reduce((acc, [from, to]) => acc.replaceAll(from, to), w);
}

function frToEn(w) {
    if (!fra_eng) {
        return undefined;
    }

    w = w.split(/[\s.,;!?]+/)[0];

    let trad = fra_eng.find(([fr]) => fr === w);
    if (!trad) {
        return undefined;
    }
    return trad[1];
}

// Update padding for content below the search bar
function updatePadding() {
    const search = document.getElementById('searchBar');
    const firstItem = document.querySelector('#dicoTable');
    firstItem.style.paddingTop = search.offsetHeight + 3 + 'px';
}

// Update padding on window resize and load events
window.addEventListener('resize', updatePadding);
window.addEventListener('load', updatePadding);

// Wait until all content is loaded
document.addEventListener("DOMContentLoaded", () => {

    const waitForConvertMiFont = () => {
        if (dico && typeof convertMiFont === "function" && indexJS) {
            code();
        } else {
            setTimeout(waitForConvertMiFont, 100);
        }
    };

    waitForConvertMiFont();

    // Restore theme
    let savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        let html = document.querySelector('html');
        html.classList.remove('theme-dark', 'theme-light');
        html.classList.add(savedTheme === 'dark' ? 'theme-dark' : 'theme-light');
    }

    // Restore alphabet
    let savedAbc = localStorage.getItem('abc');
    if (savedAbc) {
        AbcMi = JSON.parse(savedAbc);
    }
});

function code() {
    createTable(dico);
    init_search();
}

function createTable(list, id = "dicoTable") {

    const table = document.createElement('table');
    table.classList.add('table', 'is-bordered', 'is-striped', 'is-hoverable');
    // var thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    // var tr = document.createElement('tr');
    // var th = document.createElement('th');
    // th.textContent = 'Code';
    // tr.appendChild(th);
    // th = document.createElement('th');
    // th.textContent = 'Char';
    // tr.appendChild(th);
    // thead.appendChild(tr);
    // table.appendChild(thead);
    list.forEach((item) => {
        tr = document.createElement('tr');
        // French
        var td = document.createElement('td');
        td.textContent = item[0];
        tr.appendChild(td);
        // Mi
        td = document.createElement('td');
        if (AbcMi) {
            abbr = document.createElement('abbr');
            abbr.title = item[1];
            abbr.textContent = item[1];
            td.appendChild(abbr);
            convertMiFont(td);
        } else {
            td.textContent = miToAudio(item[1]);
        }
        tr.appendChild(td);
        // English
        let en = frToEn(item[0]);
        if (en) {
            td = document.createElement('td');
            td.textContent = en;
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    document.getElementById(id).innerHTML = ''; // Clear the existing table
    document.getElementById(id).appendChild(table);
    try {
        document.getElementById('deleteMe').remove();
    } catch (e) { }
}


// Function to switch the theme
function changeTheme() {
    var html = document.querySelector('html');
    if (html.classList.contains('theme-dark')) {
        html.classList.remove('theme-dark');
        html.classList.add('theme-light');
    } else {
        html.classList.remove('theme-light');
        html.classList.add('theme-dark');
    }
    localStorage.setItem('theme', html.classList.contains('theme-dark') ? 'dark' : 'light');
}

// Function to switch the alphabet
function changeAbc() {
    AbcMi = !AbcMi;
    localStorage.setItem('abc', JSON.stringify(AbcMi));
    createTable(dico);
}

function init_search() {
    // Detect when the search bar is completed and filter the dico variable
    document.getElementById('searchBar').addEventListener('input', (event) => {
        const inCtxt = document.getElementById('inCtxt');
        inCtxt.classList.add('is-hidden');

        const searchTerm = event.target.value.toLowerCase();
        if (searchTerm.length > 0) {
            const filteredDico = dico.filter(item =>
                item.some(field => field.toLowerCase().includes(searchTerm))
            );
            createTable(filteredDico); // Recreate the table with filtered data
            if (ctxt) {
                const filteredCtxt = ctxt.filter(item =>
                    item.some(field => field.toLowerCase().includes(searchTerm))
                );
                if (filteredCtxt.length > 0) {
                    createTable(filteredCtxt, "ctxtTable");
                    inCtxt.classList.remove('is-hidden');
                }
            }

        } else {
            createTable(dico); // Recreate the table with the original data
        }
    });
}

// Gestion de l'utilisation hors connexion
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/.mi/lang/sw.js')
            .then(reg => {
                console.log('Service worker registered.', reg);
            })
            .catch(err => {
                console.error('Service worker registration failed:', err);
            });
    });
}


function generateTrainingExercises() {
    const trainingContent = document.getElementById('trainingContent');
    trainingContent.innerHTML = ''; // Clear previous content

    let currentExerciseIndex = 0;
    let exercise = false

    // Exercise 1: Match the correct translation
    if (dico) {
        let exercise = () => {
            const exerciseDiv = document.createElement('div');
            exerciseDiv.classList.add('exercise');

            const question = document.createElement('p');
            question.textContent = "Choisi la bonne traduction: ";
            exerciseDiv.appendChild(question);

            const randomWord = dico[Math.floor(Math.random() * dico.length)];
            const correctAnswer = randomWord[1];

            const wordDisplay = document.createElement('strong');
            wordDisplay.textContent = randomWord[0];
            exerciseDiv.appendChild(wordDisplay);

            const options = dico
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 5) + 3) // Ensure between 3 and 7 options
                .map(item => item[1]);
            if (!options.includes(correctAnswer)) {
                options[Math.floor(Math.random() * options.length)] = correctAnswer;
            }

            const buttonsDiv = document.createElement('div');
            options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('button');
                button.addEventListener('click', () => {
                    if (option === correctAnswer) {
                        alert('Correct!');
                        generateTrainingExercises();
                    } else {
                        alert('Try again!');
                    }
                });
                buttonsDiv.appendChild(button);
            });
            exerciseDiv.appendChild(buttonsDiv);
            trainingContent.appendChild(exerciseDiv);
        };
    }

    // Exercise 2: Reorder the sentence
    if (ctxt && Math.random() > 0.6) {
        exercise = () => {
            const exerciseDiv = document.createElement('div');
            exerciseDiv.classList.add('exercise');

            const question = document.createElement('p');
            question.textContent = "Remet cette phrase dans l'ordre !";
            exerciseDiv.appendChild(question);

            const randomSentence = ctxt[Math.floor(Math.random() * ctxt.length)][0].split(' ');
            const correctOrder = randomSentence.join(' ');

            const shuffledWords = [...randomSentence].sort(() => 0.5 - Math.random());
            const wordButtons = shuffledWords.map(word => {
            const button = document.createElement('button');
            button.textContent = word;
            button.classList.add('button');
            return button;
            });

            const sentenceDiv = document.createElement('div');
            sentenceDiv.classList.add('sentence');
            exerciseDiv.appendChild(sentenceDiv);

            const optionsDiv = document.createElement('div');
            optionsDiv.classList.add('options');
            wordButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.parentNode === optionsDiv) {
                sentenceDiv.appendChild(button);
                } else {
                optionsDiv.appendChild(button);
                }

                if (sentenceDiv.childNodes.length === shuffledWords.length) {
                const userAnswer = Array.from(sentenceDiv.childNodes)
                    .map(node => node.textContent)
                    .join(' ');
                if (userAnswer === correctOrder) {
                    alert('Correct!');
                    generateTrainingExercises();
                } else {
                    alert('Try again!');
                }
                }
            });
            optionsDiv.appendChild(button);
            });

            // Add a separator between the sentence and the options
            const separator = document.createElement('hr');
            separator.classList.add('separator');
            exerciseDiv.appendChild(separator);

            exerciseDiv.appendChild(optionsDiv);
            trainingContent.appendChild(exerciseDiv);
        };
    }
    
    exercice();
}

function training(){
    generateTrainingExercises();
    openModal(document.getElementById('trainingModal'));
}





indexJS = true;