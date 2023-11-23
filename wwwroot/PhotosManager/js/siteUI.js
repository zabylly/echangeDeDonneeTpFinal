let contentScrollPosition = 0;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering
init_UI();
function init_UI() {
    showLoginForm();
}
function showLoginForm(loginMessage = "",Email = "",EmailError="",passwordError ="")
{
    eraseContent();
    $("#content").append($(`<h3>${loginMessage}</h3>
    <form class="form" id="loginForm">
    <input type='email'
    name='Email'
    class="form-control"
    required
    RequireMessage = 'Veuillez entrer votre courriel'
    InvalidMessage = 'Courriel invalide'
    placeholder="adresse de courriel"
    value='${Email}'>
    <span style='color:red'>${EmailError}</span>
    <input type='password'
    name='Password'
    placeholder='Mot de passe'
    class="form-control"
    required
    RequireMessage = 'Veuillez entrer votre mot de passe'>
    <span style='color:red'>${passwordError}</span>
    <input type='submit' name='submit' value="Entrer" class="form-control btn-primary">
    </form>
    <div class="form">
    <hr>
    <button class="form-control btn-info" id="createProfilCmd">Nouveau compte</button>
    </div`));
    //UpdateHeader("Connexion", "login");
    $('#createProfilCmd').on("click", function () {
        showInscriptionForm();
    });
    $('#loginForm').on("submit", function (e) {

        e.preventDefault();
        console.log($("[name='Email']").val());
        console.log($("[name='Password']").val());
        API.login($("[name='Email']").val(),$("[name='Password']").val())
    });
}
function showInscriptionForm()
{
    eraseContent();
    $("#content").append($(`<form class="form" id="createProfilForm"'>
    <fieldset>
    <legend>Adresse ce courriel</legend>
    <input type="email"
    class="form-control Email"
    name="Email"
    id="Email"
    placeholder="Courriel"
    required
    RequireMessage = 'Veuillez entrer votre courriel'
    InvalidMessage = 'Courriel invalide'
    CustomErrorMessage ="Ce courriel est déjà utilisé"/>
    <input class="form-control MatchedInput"
    type="text"
    matchedInputId="Email"
    name="matchedEmail"
    id="matchedEmail"
    placeholder="Vérification"
    required
    RequireMessage = 'Veuillez entrez de nouveau votre courriel'
    InvalidMessage="Les courriels ne correspondent pas" />
    </fieldset>
    <fieldset>
    <legend>Mot de passe</legend>
    <input type="password"
    class="form-control"
    name="Password"
    id="Password"
    placeholder="Mot de passe"
    required
    RequireMessage = 'Veuillez entrer un mot de passe'
    InvalidMessage = 'Mot de passe trop court'/>
    <input class="form-control MatchedInput"
    type="password"
    matchedInputId="Password"
    name="matchedPassword"
    id="matchedPassword"
    placeholder="Vérification" required
    InvalidMessage="Ne correspond pas au mot de passe" />
    </fieldset>
    <fieldset>
    <legend>Nom</legend>
    <input type="text"
    class="form-control Alpha"
    name="Name"
    id="Name"
    placeholder="Nom"
    required
    RequireMessage = 'Veuillez entrer votre nom'
    InvalidMessage = 'Nom invalide'/>
    </fieldset>
    <fieldset>
    <legend>Avatar</legend>
    <div class='imageUploader'
    newImage='true'
    controlId='Avatar'
    imageSrc='images/no-avatar.png'
    waitingImage="images/Loading_icon.gif">
    </div>
    </fieldset>
    <input type='submit' name='submit' id='saveUserCmd' value="Enregistrer" class="form-control btn-primary">
    </form>
    <div class="cancel">
    <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
    </div>`));
    $('#abortCmd').on("click", function () {
        showLoginForm();
    });
}
function showWaitingGif() {
    eraseContent();
    $("#content").append($("<div class='waitingGifcontainer'><img class='waitingGif' src='images/Loading_icon.gif' /></div>'"));
}
function eraseContent() {
    $("#content").empty();
}
function saveContentScrollPosition() {
    contentScrollPosition = $("#content")[0].scrollTop;
}
function restoreContentScrollPosition() {
    $("#content")[0].scrollTop = contentScrollPosition;
}

function renderAnonymousMenu() {
    $("#contextualMenu").empty();
    $("#contextualMenu").append(
        $(`
            <div class="dropdown-item" id="loginCmd">
            <i class="menuIcon fa fa-sign-in mx-2"></i> Connexion
            </div>
            <div class="dropdown-divider"></div>

            <div class="dropdown-item" id="aboutCmd">
                <i class="menuIcon fa fa-info-circle mx-2"></i> À propos...
            </div>
        `)
    ); 
}

function eraseHeader() {
    $("#header").empty();
}

function updateHeader(headerName) {
    //todo
    eraseHeader();
    $("#header").append(
        $(`
            <div class="headerMenusContainer">
                <span>&nbsp;</span> <!--filler-->
                <div class="dropdown ms-auto dropdownLayout">
                    <!-- Articles de menu -->
                    <div data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="cmdIcon fa fa-ellipsis-vertical"></i>
                </div>
                <div class="dropdown-menu noselect" id="contextualMenu">
                </div>
                </div>
            </div>
        `)
    );

    if (sessionStorage.getItem('user') == null) {
        renderAnonymousMenu();
    }
    /*$("#header").append(
       $(`
        <span title="${headerName}" id="listPhotosCmd">
            <img src="images/PhotoCloudLogo.png" class="appLogo">
        </span>
        <span class="viewTitle">${headerName}
            <div class="cmdIcon fa fa-plus" id="newPhotoCmd" title="Ajouter une photo"></div>
        </span>
        <div class="headerMenusContainer">
            <span>&nbsp;</span> <!--filler-->
            <i title="Modifier votre profil">
                <div class="UserAvatarSmall" userid="${loggedUser.Id}" id="editProfilCmd"
                    style="background-image:url('${loggedUser.Avatar}')"
                    title="Nicolas Chourot"></div>
            </i>
            <div class="dropdown ms-auto dropdownLayout">
                <!-- Articles de menu -->
            </div>
        </div>
       `));
       */
}
function renderAbout() {
    timeout();
    saveContentScrollPosition();
    eraseContent();
    UpdateHeader("À propos...", "about");

    $("#content").append(
        $(`
            <div class="aboutContainer">
                <h2>Gestionnaire de photos</h2>
                <hr>
                <p>
                    Petite application de gestion de photos multiusagers à titre de démonstration
                    d'interface utilisateur monopage réactive.
                </p>
                <p>
                    Auteur: Nicolas Chourot
                </p>
                <p>
                    Collège Lionel-Groulx, automne 2023
                </p>
            </div>
        `))
}
