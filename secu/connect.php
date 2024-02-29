<?php

if (empty($page_info)){
    $page_info = ["../", "Connexion", "Connectez-vous à votre compte Miala avec SecuriMi !", "connexion"];

    require_once '../PHPlib/head.php';
}

$inputs = [
    "ndu" => [
        "name" => "Nom d'utilisateur", // => label
        "placeholder" => "Votre_nom_d'utilisateur",
        "type" => "text",
        "required" => True
    ],
    "mdp" => [
        "name" => "Mot de passe", // => label
        "placeholder" => "********",
        "type" => "password",
        "autocomplete" => "new-password",
        "required" => True
    ]
];

?>

<body>
    <div class="block">
        <div class="content">
            <h1>MialaConnect - SecuriMi</h1>

            <?php if (!empty($_SESSION['MiC'][0])){
                $ndu = $_SESSION['MiC'][0];
                echo '<p>Veuillez confirmer que vous êtes bien @'.$ndu;
                $inputs['ndu']['value'] = $ndu;
            }
            ?>

            <form id="MiC-form">
                <?php
                foreach ($inputs as $name => $attr){
                    echo '
                    <label>'.$attr["name"].'</label>
                    <input type="'.$attr["type"].'" 
                        name="'.$name.'" id="MiC-inp-'.$name.'"
                        placeholder="'.$attr["placeholder"].'" 
                        '.(empty($attr["value"]) ? "" : "value=".$attr["value"]).'" 
                        '.(empty($attr["required"]) ? "" : "required").' />
                    <br>
                    ';
                }
                ?>
                <button type="submit">Connexion</button>
                <button type="button">Annuler</button>
                <br>
                <div id="MiC-msg"></div>
                            
            </form>
            
        </div>
    </div>

    <script type="text/javascript" src="<?php echo $pblGitPath; ?>secu/connect.js"></script>

</body>