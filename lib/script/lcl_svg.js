//Local save

/*
- saver_version => MàJ reset

=>> lcl_pl_id
- plid [ ,  ,  , ]
- pl_ctn [[] ,[], []]
- watch_id [ ,  ,  , ]

=>> lcl_vid_id
- vidid [ , , , ]
- vid_pgs [ [pgs, len, %], [], [], []]
 */

console.log('saver.js >> V2.02.24');

var saver_version = 'V0.02.3S.24'; //A changer pour reset les données => Eviter les erreurs au max

function lcl_rmv_all() {
    // Effacer tous les éléments
    localStorage.clear();
}

function lcl_load(id){
    let rsrc = localStorage.getItem(id);
    return rsrc;
}

function lcl_load_list(id){
    let rsrc = lcl_load(id);
    if (!rsrc){rsrc = "";}
    return rsrc.split("¤@¤");
}

function lcl_load_LIST_IN_list(id, idx){
    let rsrc = lcl_load_list(id)[idx];
    if (!rsrc){rsrc = "";}
    return rsrc.split("¤]¤");
}

function lcl_save(id, data){
    localStorage.setItem(id, data);
}

function lcl_save_list(id, list){
    let rsrc = list.join("¤@¤");
    lcl_save(id, rsrc);
}

function lcl_save_IN_list(id, data, idx='push'){
    let rsrc = lcl_load_list(id);
    if (Number.isInteger(idx) && idx < rsrc.length){
        rsrc[idx] = data;
    }else{
        rsrc.push(data);
    }
    lcl_save_list(id, rsrc);
}

function lcl_save_LIST_IN_list(id, list, idx='push'){
    let data = list.join("¤]¤");
    lcl_save_IN_list(id, data, idx);
}

//Reset lors des MàJ importantes
if (lcl_load('saver_version') != saver_version){
    lcl_rmv_all();
    lcl_save('saver_version', saver_version);
}


var $LOCAL_STORAGE = true;