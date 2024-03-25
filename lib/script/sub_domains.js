console.log('sub_domains.js >> V0.00.5');

function subd_convertURL(an_url) {
    let url = new URL(an_url);
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

        if (href.hostname.endsWith(subd_host)) {
            link.setAttribute("onclick", `subd_change_url(${herf.toString()});`);
        }
    }
}


function subd_change_url(url) {
    let reel_url = subd_convertURL(url).trimEnd("/");
    // fetch(reel_url)
    //     .then(response => response.text())
    //     .then(text => {
    //         subd_url_mtn = url;
    //         history.pushState({}, "Miala", url);


    //         document.querySelector('html').innerHTML = newContent;

    //         subd_replaceLinks();

    //         subd_evalScripts(container);
    //     })
    //     .catch(error => {
    //         console.log(error);
    //         setTimeout(() => {
    //             // window.location.href = ulr + '?err&faut_vraiment_que_tu_me_donne_lurl_parceque_sinon_ca_marche_pas';
    //         }, 1000);
    //     });

    const xhr = new XMLHttpRequest();

    xhr.open('GET', reel_url);

    xhr.onload = function () {
        if (xhr.status === 200) {
            let text = xhr.responseText;
                    subd_url_mtn = url;
                    history.pushState({}, "Miala", url);
        
        
                    document.querySelector('html').innerHTML = newContent;
        
                    subd_replaceLinks();
        
                    subd_evalScripts(container);
        } else {
            console.error('Error fetching data:', xhr.statusText);
            // Implement error handling (redirect or display message)
        }
    };

    xhr.onerror = function () {
        console.error('Network error:', xhr.statusText);
        // Implement error handling (redirect or display message)
    };

    xhr.send();


}