console.log('sub_domains.js >> V0.00.1');

function subd_convertan_url(an_url) {
    let an_url = new an_url(an_url);
    let host = an_url.hostname;
    let pathname = an_url.pathname;
    let segments = host.split('.');
    let newHost = segments[0] + pathname;
    segments.shift();
    let newDomain = segments.join('.');
    let newan_url = `https://${newDomain}/${newHost}${an_url.search}`;
    return newan_url;
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
        let href = new an_url(link.getAttribute('href'), subd_an_url_mtn);

        if (href.hostname.endsWith(subd_host)){
            link.setAttribute("onclick", `subd_change_an_url(${herf.toString()});`);
        }
    }
}


function subd_change_an_url(an_url) {
    let reel_an_url = subd_convertan_url(an_url);
    fetch(reel_an_url)
        .then(response => response.text())
        .then(text => {
            subd_an_url_mtn = an_url;
            history.pushState({}, "Miala", an_url);
              

            document.querySelector('html').innerHTML = newContent;

            subd_replaceLinks();

            subd_evalScripts(container);
        })
        .catch(error => {
            window.location.href = 'an_url?err&faut_vraiment_que_tu_me_donne_lan_url_parceque_sinon_ca_marche_pas';
        });
}