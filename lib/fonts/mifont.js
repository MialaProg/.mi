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
    //console.log(width);
    // No word-break
    return splited.map(c => {
        i += 1;

        if (c == "\n") {
            let returned = wordMiFont;
            lengthMiFont = 0;
            wordMiFont = "";
            //console.log("Jump", returned);
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
            //console.log("Max", returned);
            return "<br>" + returned;
        }

        //console.log(i, splited.length, lengthMiFont, maxW);
        if (c == " " || i === splited.length) {
            let returned = wordMiFont;
            wordMiFont = "";
            //console.log("Space", lengthMiFont, returned);
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
        //console.log('MiFontERR', element);
        //console.log(error);
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

var currentChars = [{"id":33,"x":0,"y":0,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":34,"x":148,"y":0,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":35,"x":296,"y":0,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":36,"x":444,"y":0,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":37,"x":592,"y":0,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":38,"x":740,"y":0,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":39,"x":888,"y":0,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":40,"x":1036,"y":0,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":41,"x":1184,"y":0,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":42,"x":1332,"y":0,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":43,"x":1480,"y":0,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":44,"x":1628,"y":0,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":45,"x":1776,"y":0,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":46,"x":0,"y":198,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":47,"x":148,"y":198,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":48,"x":296,"y":198,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":49,"x":444,"y":198,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":50,"x":592,"y":198,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":51,"x":740,"y":198,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":52,"x":888,"y":198,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":53,"x":1036,"y":198,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":54,"x":1184,"y":198,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":55,"x":1332,"y":198,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":56,"x":1480,"y":198,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":57,"x":1628,"y":198,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":58,"x":1776,"y":198,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":59,"x":0,"y":396,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":60,"x":148,"y":396,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":61,"x":296,"y":396,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":62,"x":444,"y":396,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":63,"x":592,"y":396,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":64,"x":740,"y":396,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":65,"x":888,"y":396,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":66,"x":1036,"y":396,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":67,"x":1184,"y":396,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":68,"x":1332,"y":396,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":69,"x":1480,"y":396,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":70,"x":1628,"y":396,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":71,"x":1776,"y":396,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":72,"x":0,"y":594,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":73,"x":148,"y":594,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":74,"x":296,"y":594,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":75,"x":444,"y":594,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":76,"x":592,"y":594,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":77,"x":740,"y":594,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":78,"x":888,"y":594,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":79,"x":1036,"y":594,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":80,"x":1184,"y":594,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":81,"x":1332,"y":594,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":82,"x":1480,"y":594,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":83,"x":1628,"y":594,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":84,"x":1776,"y":594,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":85,"x":0,"y":792,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":86,"x":148,"y":792,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":87,"x":296,"y":792,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":88,"x":444,"y":792,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":89,"x":592,"y":792,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":90,"x":740,"y":792,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":91,"x":888,"y":792,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":92,"x":1036,"y":792,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":93,"x":1184,"y":792,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":94,"x":1332,"y":792,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":95,"x":1480,"y":792,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":96,"x":1628,"y":792,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":97,"x":1776,"y":792,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":98,"x":0,"y":990,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":99,"x":148,"y":990,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":100,"x":296,"y":990,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":101,"x":444,"y":990,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":102,"x":592,"y":990,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":103,"x":740,"y":990,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":104,"x":888,"y":990,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":105,"x":1036,"y":990,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":106,"x":1184,"y":990,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":107,"x":1332,"y":990,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":108,"x":1480,"y":990,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":109,"x":1628,"y":990,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":110,"x":1776,"y":990,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":111,"x":0,"y":1188,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":112,"x":148,"y":1188,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":113,"x":296,"y":1188,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":114,"x":444,"y":1188,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":115,"x":592,"y":1188,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":116,"x":740,"y":1188,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":117,"x":888,"y":1188,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":118,"x":1036,"y":1188,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":119,"x":1184,"y":1188,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":120,"x":1332,"y":1188,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":121,"x":1480,"y":1188,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":122,"x":1628,"y":1188,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":123,"x":1776,"y":1188,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":124,"x":0,"y":1386,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":125,"x":148,"y":1386,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":126,"x":296,"y":1386,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":127,"x":444,"y":1386,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":233,"x":592,"y":1386,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15},{"id":232,"x":740,"y":1386,"width":148,"height":198,"xoffset":0,"yoffset":0,"xadvance":148,"page":0,"chnl":15}];
// currentChars = JSON.parse(currentChars);
