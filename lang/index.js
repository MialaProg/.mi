// For DB:
// FR;MI;racine;exemple

var [dico,
    ctxt,
    indexJS
] = Array(3).fill(false);

async function fetchFiMi(path) {
    try {
        const response = await fetch(path); // + '?randomId=' + Math.random() // Offline remove
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        let list = text.split('\n').sort((a, b) => a.localeCompare(b));
        return list.map(line => line.split(';'));
    } catch (error) {
        console.error("Error fetching the FiMi file:", error);
    }
}

async function initDBs() {
    dico = await fetchFiMi('./dico.fimi');
    ctxt = await fetchFiMi('./ctxt.fimi');
}

initDBs();

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

    let savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        let html = document.querySelector('html');
        html.classList.remove('theme-dark', 'theme-light');
        html.classList.add(savedTheme === 'dark' ? 'theme-dark' : 'theme-light');
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
        abbr = document.createElement('abbr');
        abbr.title = item[1];
        abbr.textContent = item[1];
        td.appendChild(abbr);
        convertMiFont(td);
        tr.appendChild(td);

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
        navigator.serviceWorker.register('./sw.js')
            .then(reg => {
                console.log('Service worker registered.', reg);
            })
            .catch(err => {
                console.error('Service worker registration failed:', err);
            });
    });
}
const CACHE_NAME = 'cache-v1';
const ASSETS = [
    './index.html',
    './index.js',
    './dico.fimi',
    './ctxt.fimi',
    '../lib/fonts/miala-bitmap-font.css',
    '../lib/style/divers.css',
    '../lib/style/checkbox.css',
    '../lib/style/buttons.css',
    '../lib/fonts/mifont.js',
    'https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css'
];
// Précacher les ressources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(ASSETS);
            })
    );
}
);
// Intercepter les requêtes réseau
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request))
    );
});



indexJS = true;