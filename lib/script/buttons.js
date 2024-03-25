
$(document).ready(function () {
    var home_path = $("#home_path").text();
    $("#btn-del-_SESS").click(function (event) {
        let del_SESS = confirm("Êtes-vous sûr de vouloir supprimer toutes les traces de votre visite sur cet ordinateur ?")

        if (del_SESS) {
            $.ajax({
                url: home_path + "PHPlib/del_SESS.php",
                type: "POST",
                data: 'simple_confirm',
                success: function (result) {
                    if (result == 'del_SESS:OK') {
                        alert("La session a bien été réinitialisée.");
                        location.reload(true);
                    } else {
                        alert("Oops: une erreur s'est produite: " + result);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // La requête a échoué
                    // Vérifier le statut de la requête (jqXHR.status)
                    // jqXHR.status === 404 : Page introuvable
                    // jqXHR.status === 500 : Erreur interne du serveur
                    alert('Erreur {' + textStatus + '} n°' + jqXHR.status + ' lors de la connexion au serveur.');
                    console.log(errorThrown);
                }
            });
        }
    });
});