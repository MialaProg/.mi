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








indexJS = true;