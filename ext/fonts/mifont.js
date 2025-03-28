var __MiFontElements = {};

// Set properties of the MiFont as size, bottom, charWidth & charHeight
function setMiFontProp(prop, value, element=document.documentElement) {
    element.style.setProperty('--mifont-' + prop, value);

    if (prop === "size") {
        resizeMiFont(element);
    }
}

// Get properties of the MiFont as size, right, adaptR and bottom
function getMiFontProp(prop, element = document.documentElement) {
    while (element) {
        let value = false;
        try {
            value = getComputedStyle(element).getPropertyValue('--mifont-' + prop);
        } catch (error) { }

        if (value) {
            return value;
        }
        element = element.parentElement;
    }
    return null;
}

var lengthMiFont = 0;
var wordMiFont = "";
function textToMiFont(text, width = getMiFontProp('charWidth') * getMiFontProp('size'), maxW = window.innerWidth) {

    lengthMiFont = 0;
    wordMiFont = "";
    let splited = text.split('');
    let i = 0;
    console.log(width);
    // No word-break
    return splited.map(c => {
        i += 1;

        if (c == "\n") {
            let returned = wordMiFont;
            lengthMiFont = 0;
            wordMiFont = "";
            console.log("Jump", returned);
            return returned + "<br>";
        }


        const code = c.charCodeAt(0);
        let char = currentChars.find(ch => ch.id === code);
        
        lengthMiFont += char ? width : .6 * width;
        char = char ? `<span class="mibmp-font char-${code}"></span>` : `<span class="mifont-nochar">${c}</span>`;


        wordMiFont += char;

        if (lengthMiFont > maxW) {
            let returned = wordMiFont;
            wordMiFont = "";
            lengthMiFont = returned.length  *width;
            console.log("Max", returned);
            return "<br>" + returned;
        }

        console.log(i, splited.length, lengthMiFont, maxW);
        if (c == " " || i === splited.length) {
            let returned = wordMiFont;
            wordMiFont = "";
            console.log("Space", lengthMiFont, returned);
            return returned;
        }
    }).join('');
}

function convertMiFont(element, parent = undefined) {

    try {
        // Convert to MiFont
        const size = parseFloat(getMiFontProp('size', element));
        let width = parseFloat(getMiFontProp('charWidth', element));
        if (isNaN(width) || isNaN(size)) {
            width = undefined;
        } else {
            width *= size;
        }

        if (element.nodeType === Node.TEXT_NODE) {
            let txt = textToMiFont(element.nodeValue, width, parent.clientWidth);
            const div = document.createElement('div');
            div.innerHTML = txt;
            div.setAttribute('beforeMiFont', element.nodeValue);

            parent.replaceChild(div, element);

        } else if (element.nodeType === Node.ELEMENT_NODE) {
            // Convert children
            element.childNodes.forEach(child => convertMiFont(child, element));
        }
    } catch (error) {
        console.log('MiFontERR', element);
        console.log(error);
    }
}

function restoreFromMiFont(element) {

    if (element.nodeType === Node.ELEMENT_NODE) {
        if (element.hasAttribute('beforeMiFont')) {
            const textNode = document.createTextNode(element.getAttribute('beforeMiFont'));
            element.parentNode.replaceChild(textNode, element);
        } else {
            Array.from(element.childNodes).forEach(child => restoreFromMiFont(child));
        }
    }

}

function resizeMiFont(item = document) {
    const elements = item.querySelectorAll('[beforeMiFont]');
    elements.forEach(element => {
        let parent = element.parentNode;
        restoreFromMiFont(element);
        convertMiFont(parent);
    });
}


window.addEventListener('resize', () => {
    resizeMiFont();
});

