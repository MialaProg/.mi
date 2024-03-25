
//NOTIFICATION
document.addEventListener('DOMContentLoaded', () => {
    
    var main_path = $("#main_path").text();

    (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
        const $notification = $delete.parentNode;

        $delete.addEventListener('click', () => {
            if ($delete.classList.contains("delnotif")) {
                console.log("delnotif");
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        if (this.responseText === "deleted") {
                            $notification.parentNode.removeChild($notification);
                            console.log("okdelnotif");
                        };
                    }
                };
                xmlhttp.open("GET", main_path + "_libs-glbl/delnotif.php", true);
                xmlhttp.send();
            } else {
                console.log("nodelnotif");
                $notification.parentNode.removeChild($notification);
            }
        });
    });

    $host_msg = document.querySelector('[title="Hosted on free web hosting 000webhost.com. Host your own website for FREE."]')
    if ($host_msg != null) {
        $host_msg.parentNode.removeChild($host_msg);
    }
});

