
initTimeout(60,()=>{
    logout("Votre session est expirée. Veillez vous reconnecter")
 });   
let contentScrollPosition = 0;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering
init_UI();
function init_UI() {
    showLoginForm();
}
function logout(logoutMessage)
{
    API.logout();
    showLoginForm(logoutMessage);
    noTimeout();
}
async function login(credential)
{
    let email = $(credential.target.Email).val();
    let loginMessage = "";
    let emailError = "";
    let passwordError = "";
    let serverOnline = true;
    let userToken = await API.login(email,$(credential.target.Password).val());
    if(userToken)
    {
        if(userToken.VerifyCode == "unverified")
        {
            showVerifyEmail();
        }
        else
        {
            showMainPage(); 
        }

        startCountdown();    
    }
    else
    {
        switch(API.currentStatus){
            case 481:
            {
                emailError = "Courriel introuvable";
                isValid = false;
                break;
            }
            case 482:
            {
                passwordError = "Mot de passe incorrect";
                isValid = false;
                break;
            }
            case 0:
            {
                serverOnline = false;
                break;
            }
        }
        if(serverOnline)//check server connexion
        {
            showLoginForm(loginMessage,email,emailError,passwordError);
        }
        else
        {
            showOffline();
        }
    }


    
}
function showLoginForm(loginMessage = "",email = "",emailError="",passwordError ="")
{
    eraseContent();
    $("#content").append($(`<h3 style="
    display: flex;
    justify-content: center;
    ">${loginMessage}</h3>
    <form class="form" id="loginForm">
    <input type='email'
    name='Email'
    class="form-control Email"
    required
    RequireMessage = 'Veuillez entrer votre courriel'
    InvalidMessage = 'Courriel invalide'
    placeholder="adresse de courriel"
    value='${email}'>
    <span style='color:red'>${emailError}</span>
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
    $('#createProfilCmd').on("click", function () {
        showContactForm();
    });
    $('#loginForm').on("submit", function (e) {

        e.preventDefault();
        login(e);
        //API.login($("[name='Email']").val(),$("[name='Password']").val())
        //updateHeader("Connecté", "connected");
    });
}
function showMainPage()
{
    eraseContent();
    updateHeader("Connecté", "connected");
    $("#content").append($(`<h2>Vous etes connecté</h2>`));
}

//voir lui du contact
function newContact() {
    contact = {};
    contact.Id = 0;
    contact.Name = "";
    contact.Phone = "";
    contact.Email = "";
    return contact;
}

function showVerifyEmail()  {
    updateHeader("Vérification", "verify");
    eraseContent();

    $("#content").append($(`
    <form class="form" id="verifyForm">
    <input type='text'
    name='VerifyCode'
    class="form-control"
    required
    RequireMessage = 'Veuillez entrer votre code de vérification'
    InvalidMessage = 'Code de vérification invalide'
    placeholder="Code de vérification de courriel">
    <span id="verifyError" style='color:red'>Code de vérification invalide</span>
    <input type='submit' name='submit' value="Vérifier" class="form-control btn-primary">
    </form>
    <div class="form">
    </div`));

    let verifyError = $("#verifyError");
    verifyError.hide();

    initFormValidation();

    $('#verifyForm').on("submit", async function (e) {
        e.preventDefault();

        //showWaitingGif();
        let result = await API.verifyEmail(API.retrieveLoggedUser().Id, $(e.target.VerifyCode).val());

        if(result) {
            showMainPage();
        }
        else if (API.currentStatus == 0) {
            showOffline();
        }
        else {
            verifyError.show();
        }
    });
}

function showContactForm(contact = null)
{
    let create = contact == null;
    if (create) {
        contact = newContact();
        contact.Avatar = 'images/no-avatar.png';
    }

    eraseContent();

    $("#content").append($(`<form class="form" id="ProfilForm"'>
    <input type="hidden" name="Id" value="${contact.Id}"/>
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
    CustomErrorMessage ="Ce courriel est déjà utilisé"
    value="${contact.Email}"/>
    <input class="form-control MatchedInput"
    type="text"
    matchedInputId="Email"
    name="matchedEmail"
    id="matchedEmail"
    placeholder="Vérification"
    required
    RequireMessage = 'Veuillez entrez de nouveau votre courriel'
    InvalidMessage="Les courriels ne correspondent pas" 
    value="${contact.Email}"/>
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
    InvalidMessage = 'Nom invalide'
    value="${contact.Name}"/>
    </fieldset>
    <fieldset>
    <legend>Avatar</legend>
    <div class='imageUploader'
    newImage='${create}'
    controlId='Avatar'
    imageSrc='${contact.Avatar}'
    waitingImage="images/Loading_icon.gif">
    </div>
    </fieldset>
    <input type='submit' name='submit' id='saveUserCmd' value="Enregistrer" class="form-control btn-primary">
    </form>
    <div class="cancel">
    <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
    </div>`));

    initFormValidation();
    initImageUploaders();

    $("#ProfilForm").on("submit", async function(e) {
        e.preventDefault();
        let contact = getFormData($("#ProfilForm"));

        contact.Id = contact.Id;
        //showWaitingGif();
        
        let result;

        if (create) {
            result = await API.register(contact);
        }
        else {
            result = await API.modifyUserProfil(contact);
        }

        if (result)
        {
            showLoginForm(create ?
                
                `votre compte a été créé. Veuillez regarder vos courriels pour réccupérer votre code
                de vérification qui vous sera demandé lors de votre prochaine connexion.` :

                "votre compte a modifé avec succès.");
        }
        else
            renderError("Une erreur est survenue! " + API_getcurrentHttpError());
    });

    $('#abortCmd').on("click", function () {
        showLoginForm();
    });
}
function showOffline()
{
    eraseContent();
    $("#content").append($(`<h3 class="errorContainer">Le serveur ne répond pas</h3>
    <hr>
    <form class="form" id="tryConnexion">
    <input type='submit' name='submit' value="Connexion" class="form-control btn-primary">
    </form>`));
    updateHeader("Problème", "problem");

}

//voir lui du contact
function getFormData($form) {
    const removeTag = new RegExp("(<[a-zA-Z0-9]+>)|(</[a-zA-Z0-9]+>)", "g");
    var jsonObject = {};
    $.each($form.serializeArray(), (index, control) => {
        jsonObject[control.name] = control.value.replace(removeTag, "");
    });
    return jsonObject;
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
            <span class="dropdown-item" id="loginCmd">
                <i class="menuIcon fa fa-sign-in mx-2"></i> Connexion
            </span>

            <div class="dropdown-divider"></div>
            <span class="dropdown-item" id="aboutCmd">
                <i class="menuIcon fa fa-info-circle mx-2"></i> À propos...
            </span>
        `)
    ); 
}

function renderUserMenu() {
    $("#contextualMenu").empty();
    $("#contextualMenu").append(
        $(`
            <span class="dropdown-item" id="logoutCmd">
                <i class="menuIcon fa fa-sign-out mx-2"></i> Déconnexion
            </span>
            <span class="dropdown-item" id="editProfilCmd">
                <i class="menuIcon fa fa-user-edit mx-2"></i> Modifier votre profil
            </span>

            <div class="dropdown-divider"></div>
            <span class="dropdown-item" id="listPhotosMenuCmd">
                <i class="menuIcon fa fa-image mx-2"></i> Liste des photos
            </span>

            <div class="dropdown-divider"></div>
            <span class="dropdown-item" id="sortByDateCmd">
                <i class="menuIcon fa fa-check mx-2"></i>
                <i class="menuIcon fa fa-calendar mx-2"></i>
                Photos par date de création
            </span>
            <span class="dropdown-item" id="sortByOwnersCmd">
                <i class="menuIcon fa fa-fw mx-2"></i>
                <i class="menuIcon fa fa-users mx-2"></i>
                Photos par créateur
            </span>
            <span class="dropdown-item" id="sortByLikesCmd">
                <i class="menuIcon fa fa-fw mx-2"></i>
                <i class="menuIcon fa fa-user mx-2"></i>
                Photos les plus aiméés
            </span>
            <span class="dropdown-item" id="ownerOnlyCmd">
                <i class="menuIcon fa fa-fw mx-2"></i>
                <i class="menuIcon fa fa-user mx-2"></i>
                Mes photos
            </span>

            <div class="dropdown-divider"></div>
            <span class="dropdown-item" id="aboutCmd">
                <i class="menuIcon fa fa-info-circle mx-2"></i> À propos...
            </span>
        `)
    ); 
    $('#logoutCmd').on("click", function () {
        logout("Vous êtes déconnecté");
    });
}

function renderAdminMenu() {
    $("#contextualMenu").empty();
    $("#contextualMenu").append(
        $(`
            <span class="dropdown-item" id="manageUserCm">
                <i class="menuIcon fas fa-user-cog mx-2"></i>
                Gestion des usagers
            </span>

            <div class="dropdown-divider"></div>
            <span class="dropdown-item" id="logoutCmd">
                <i class="menuIcon fa fa-sign-out mx-2"></i> Déconnexion
            </span>
            <span class="dropdown-item" id="editProfilCmd">
                <i class="menuIcon fa fa-user-edit mx-2"></i> Modifier votre profil
            </span>
            <div class="dropdown-divider"></div>
            <span class="dropdown-item" id="listPhotosMenuCmd">
                <i class="menuIcon fa fa-image mx-2"></i> Liste des photos
            </span>

            <div class="dropdown-divider"></div>
            <span class="dropdown-item" id="sortByDateCmd">
                <i class="menuIcon fa fa-check mx-2"></i>
                <i class="menuIcon fa fa-calendar mx-2"></i>
                Photos par date de création
            </span>
            <span class="dropdown-item" id="sortByOwnersCmd">
                <i class="menuIcon fa fa-fw mx-2"></i>
                <i class="menuIcon fa fa-users mx-2"></i>
                Photos par créateur
            </span>
            <span class="dropdown-item" id="sortByLikesCmd">
                <i class="menuIcon fa fa-fw mx-2"></i>
                <i class="menuIcon fa fa-user mx-2"></i>
                Photos les plus aiméés
            </span>
            <span class="dropdown-item" id="ownerOnlyCmd">
                <i class="menuIcon fa fa-fw mx-2"></i>
                <i class="menuIcon fa fa-user mx-2"></i>
                Mes photos
            </span>

            <div class="dropdown-divider"></div>
            <span class="dropdown-item" id="aboutCmd">
                <i class="menuIcon fa fa-info-circle mx-2"></i> À propos...
            </span>
        `)
    ); 
}

function eraseHeader() {
    $("#header").empty();
}

//menu : le menu change selon la page
function updateHeader(headerName, menu) {
    //todo
    eraseHeader();
    $("#header").append(
        $(`
            <span title="Liste des photos" id="listPhotosCmd">
                <img src="images/PhotoCloudLogo.png" class="appLogo">
            </span>
            <span class="viewTitle">${headerName}
                <div class="cmdIcon fa fa-plus" id="newPhotoCmd" title="Ajouter une photo" style="display: none;"></div>
            </span>        
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

    let user = API.retrieveLoggedUser();

    if (user == null) {
        renderAnonymousMenu();
    }
    else if (user.Authorizations.readAccess == 2 && user.Authorizations.writeAccess == 2) {
        renderAdminMenu();
    }
    else {
        renderUserMenu();
    }
}
function renderAbout() {
    timeout();
    saveContentScrollPosition();
    eraseContent();
    updateHeader("À propos...", "about");

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
