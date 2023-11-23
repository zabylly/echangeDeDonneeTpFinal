let contentScrollPosition = 0;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering
Init_UI();
function Init_UI() {
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
    updateHeader("Connexion", "login");
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
