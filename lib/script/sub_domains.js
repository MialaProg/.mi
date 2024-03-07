

function subd_convertURL(url) {
    let url = new URL(url);
    let host = url.hostname;
    let pathname = url.pathname;
    let segments = host.split('.');
    let newHost = segments[0] + pathname;
    segments.shift();
    let newDomain = segments.join('.');
    let newUrl = `https://${newDomain}/${newHost}${url.search}`;
    return newUrl;
}

function subd_evalScripts(container) {
    let scriptElements = container.getElementsByTagName('script');
    for (let script of scriptElements) {
        if (script.type === 'text/javascript') {
            eval(script.textContent);
        }
    }
}

function subd_replaceLinks() {
    let container = document.querySelector('body');
    let links = container.getElementsByTagName('a');

    for (const link of links) {
        let href = new URL(link.getAttribute('href'), subd_url_mtn);

        if (href.hostname.endsWith(subd_host)){
            link.setAttribute("onclick", `subd_change_url(subd_convertURL(${herf}));`);
        }
    }
}


function subd_change_url(url) {
    fetch(url)
        .then(response => response.text())
        .then(text => {
            let mots = text.split(" ");
            for (let i = 0; i < mots.length; i++) {
                if (mots[i].includes(a_rech)) {
                    mots[i] = str2;
                }
            }
            text = mots.join(" ");

            let container = document.getElementById('container');
            container.innerHTML = newContent;

            subd_evalScripts(container);
        })
        .catch(error => {
            window.location.href = 'url?err&faut_vraiment_que_tu_me_donne_lurl_parceque_sinon_ca_marche_pas';
        });
}