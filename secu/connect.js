var MiC_msg_elm = $("#MiC-msg");
function MiC_showMsg(txt) {
    MiC_msg_elm.html(txt);
}

var all_inputs = $("[id^='MiC-inp-']");

$(document).ready(function () {
    var home_path = $("#home_path").text();
    $("#MiC-form").submit(function (event) {
        event.preventDefault(); // Empêche la soumission normale du formulaire

        all_inputs = $("[id^='MiC-inp-']");
        all_inputs.prop('disabled', true);
        // all_inputs.addClass("is-loading");

        let form_data = $('#MiC-form').serialize() + "&secu";

        MiC_showMsg("Demande de connexion en cours...");

        $.ajax({
            url: home_path + "secu/connect_process.php",
            type: "POST",
            data: form_data,
            success: function (result) {
                MiC_showMsg("Traitement de la réponse du serveur...");

                if (result == 'ConectOK') {
                    MiC_showMsg("Connexion acceptée. Actualisation...");
                    location.reload(true);
                } else {
                    if (result == 'Incorrect') {
                        MiC_showMsg("Nom d'utilisateur ou mot de passe incorrect.");
                    } else {
                        MiC_showMsg('Oops ! Il y a eu une erreur: ' + result);
                    }

                    // all_inputs.removeClass("is-loading");
                    all_inputs.prop('disabled', false);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // La requête a échoué
                // Vérifier le statut de la requête (jqXHR.status)
                // jqXHR.status === 404 : Page introuvable
                // jqXHR.status === 500 : Erreur interne du serveur
                MiC_showMsg('Erreur ' + textStatus + 'n°' + jqXHR.status + ' lors de la connexion au serveur.');
                console.log(errorThrown);

                all_inputs.prop('disabled', false);
            }
        });

    });
});