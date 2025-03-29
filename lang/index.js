var dico = false;
var indexJS = false;

async function fetchCSV() {
    try {
        const response = await fetch('./dico.fimi?randomId=' + Math.random());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        // console.log("CSV content:", text);
        dico = text.split('\n').sort((a, b) => a.localeCompare(b));
        dico = dico.map(line => line.split(';'));
    } catch (error) {
        console.error("Error fetching the CSV file:", error);
    }
}

fetchCSV();


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
}

function createTable(list){
    
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
    
    document.getElementById('table').appendChild(table);
    document.getElementById('deleteMe').remove();
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



indexJS = true;