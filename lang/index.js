// For DB:
// FR;MI;racine;exemple


// -5
var [dico,
    ctxt,
    indexJS,
    rcc,
    fra_eng,
    AbcMi,
    exercise,
    exoNum,
    checkAns
] = Array(9).fill(false);

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
    dico = dico.filter(item => !item[0].startsWith('_'));
    createTable(dico);
}

initDBs();

// Remplace les racourcis claviers par la prononciation
function miToAudio(w) {
    if (!(rcc && Array.isArray(rcc))) {
        return w;
    }

    /*
    Rcc : [[a,b],[c,d],...]
    w : A string
    Remplace les occurences de a par b, c par d, etc.
    */
    rcc.forEach(([shortcut, pronunciation]) => {
        const regex = new RegExp(shortcut, 'g');
        w = w.replace(regex, pronunciation);
    });
    return w;
 
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

function setMiText(text, parent) {
    if (AbcMi) {
        abbr = document.createElement('abbr');
        abbr.title = text;
        abbr.textContent = text;
        parent.appendChild(abbr);
        convertMiFont(parent);
    } else {
        parent.textContent = miToAudio(text);
    }
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
        setMiText(item[1], td);
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
            if (searchTerm == 'miabc') {
                changeAbc();
            }
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

function getRandomItem(list) {
    if (list && list.length > 0) {
        return list[Math.floor(Math.random() * list.length)];
    }
    return null;
}

function generateTrainingExercises() {
    const trainingContent = document.getElementById('trainingContent');
    trainingContent.innerHTML = ''; // Clear previous content

    exercise = false
    exoNum = Math.random();

    // Helper function to create and append an exercise div
    function createExercise(proba, list, questionText, contentCallback) {
        exoNum -= proba;
        if (list && !exercise && exoNum < 0) {
            exercise = () => {
                const exerciseDiv = document.createElement('div');
                exerciseDiv.classList.add('exercise');

                const question = document.createElement('p');
                question.textContent = questionText;
                exerciseDiv.appendChild(question);

                contentCallback(exerciseDiv);

                trainingContent.appendChild(exerciseDiv);
            };
        }
    }

    // Helper function to generate random options
    function generateRandomOptions(correctAnswer, sourceArray, min = 3, max = 7) {
        const options = sourceArray
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random() * (max - min + 1)) + min)
            .map(item => item[1]);
        if (!options.includes(correctAnswer)) {
            options[Math.floor(Math.random() * options.length)] = correctAnswer;
        }
        return options;
    }

    // Exercise 1: Match the correct translation
    createExercise(.5, dico, "Choisi la bonne traduction: ", (exerciseDiv) => {
        const randomWord = getRandomItem(dico);
        const correctAnswer = randomWord[1];

        const wordDisplay = document.createElement('strong');
        wordDisplay.textContent = randomWord[0];
        exerciseDiv.appendChild(wordDisplay);

        const options = generateRandomOptions(correctAnswer, dico);

        const buttonsDiv = document.createElement('div');
        options.forEach(option => {
            const button = document.createElement('button');
            setMiText(option, button);
            button.setAttribute('rep', option);
            button.classList.add('button');
            button.addEventListener('click', () => {
                if (option === correctAnswer) {
                    alert('Bravo !');
                    generateTrainingExercises();
                } else {
                    alert('Essai encore !');
                }
            });
            buttonsDiv.appendChild(button);
        });
        exerciseDiv.appendChild(buttonsDiv);
    });

    // Exercise 2: Reorder the sentence
    createExercise(.3, ctxt, "Remet cette phrase dans l'ordre !", (exerciseDiv) => {
        const randomCtxt = getRandomItem(ctxt);
        const randomSentence = randomCtxt[1].split(' ');
        const correctOrder = randomSentence.join(' ');

        const shuffledWords = [...randomSentence].sort(() => 0.5 - Math.random());
        const wordButtons = shuffledWords.map(word => {
            const button = document.createElement('button');
            setMiText(word, button);
            button.setAttribute('rep', word);
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
                        .map(node => node.getAttribute('rep'))
                        .join(' ');
                    if (userAnswer === correctOrder) {
                        alert('Bravo ! Cela signifie ' + randomCtxt[0]);
                        generateTrainingExercises();
                    } else {
                        alert('Essai encore !');
                    }
                }
            });
            optionsDiv.appendChild(button);
        });

        const separator = document.createElement('hr');
        separator.classList.add('separator');
        exerciseDiv.appendChild(separator);

        exerciseDiv.appendChild(optionsDiv);
    });

    // Exercise 3: Type the correct word
    createExercise(.2, dico, "Tape le mot correspondant :", (exerciseDiv) => {
        let randomWord = ['', 'n o t']
        while (randomWord[1].includes(' ')) {
            randomWord = getRandomItem(dico);
        }

        const correctAnswers = [randomWord[1], miToAudio(randomWord[1])];

        const wordDisplay = document.createElement('strong');
        wordDisplay.textContent = randomWord[0];
        exerciseDiv.appendChild(wordDisplay);

        const inputDiv = document.createElement('div');
        inputDiv.addEventListener('click', () => {
            hiddenInput.focus();
        });
        inputDiv.classList.add('input-div');

        const checkAnswer = () => {
            const userAnswer = hiddenInput.value;
            if (correctAnswers.includes(userAnswer)) {
                alert('Bravo !');
                generateTrainingExercises();
            } else {
                alert(`Essai encore !`);
            }
        };

        for (let i = 0; i < 10; i++) {
            inputDiv.textContent += '_';
        }

        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'text';
        hiddenInput.style.position = 'absolute';
        hiddenInput.style.opacity = 0;
        hiddenInput.autocapitalize = 'none';
        hiddenInput.autocomplete = 'off';
        hiddenInput.autocorrect = 'off';
        hiddenInput.spellcheck = false;
        document.body.appendChild(hiddenInput);
        hiddenInput.focus();

        hiddenInput.addEventListener('input', (event) => {
            const value = event.target.value;
            inputDiv.innerHTML = value + '_'.repeat(Math.max(0, 10 - value.length));
        });
        hiddenInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                checkAnswer();
            }
        });

        // hiddenInput.addEventListener('focusout', () => {
        //     // Refocus the input when it loses focus (useful for mobile)
        //     setTimeout(() => hiddenInput.focus(), 0);
        // });

        exerciseDiv.appendChild(inputDiv);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.removedNodes.length > 0 && Array.from(mutation.removedNodes).includes(exerciseDiv)) {
                    hiddenInput.remove();
                    observer.disconnect();
                }
            });
        });

        // Ensure exerciseDiv is appended to the DOM before observing
        setTimeout(() => {
            if (exerciseDiv.parentNode) {
                observer.observe(exerciseDiv.parentNode, { childList: true });
            }
        }, 0);
    });

    if (exercise) {
        exercise();
    } else {
        const noExerciseDiv = document.createElement('div');
        noExerciseDiv.classList.add('exercise');
        noExerciseDiv.textContent = "Aucun exercice disponible pour le moment.";
        trainingContent.appendChild(noExerciseDiv);
    }
}

function training() {
    generateTrainingExercises();
    openModal(document.getElementById('trainingModal'));
}





indexJS = true;