
initTimeout(120,()=>{
    logout("Votre session est expirée. Veuillez vous reconnecter");
 });   
let contentScrollPosition = 0;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering
init_UI();
function init_UI() {
    showLoginForm();
}
async function logout(logoutMessage)
{
    let result = await API.logout();
    if(result)
    {
        showLoginForm(logoutMessage);
    }
    else
    {
        console.log(API.currentHttpError);
        showOffline();
    }

}
async function login(credential)
{
    let email = $(credential.target.Email).val();
    let loginMessage = "";
    let emailError = "";
    let passwordError = "";
    let serverOnline = true;
    let userToken = await API.login(email,$(credential.target.Password).val());
    console.log(userToken.VerifyCode);
    if(userToken && !isBan(userToken))
    {
        if(userToken.VerifyCode == "verified")
        {
            showMainPage();
            renderUserAvatar(); 
        }
        else
        {
            showVerifyEmail();
        }
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
            if(userToken && isBan(userToken))
                loginMessage = "Votre compte à été bannis";
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
    noTimeout();
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
        showAccountForm();
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
    startCountdown();    
    eraseContent();
    updateHeader("Connecté", "connected");
    $("#content").append($(`<h2>Vous êtes connecté</h2>`));
}

//voir lui du account
function newAccount() {
    account = {};
    account.Id = 0;
    account.Name = "";
    account.Phone = "";
    account.Email = "";
    return account;
}

function showVerifyEmail()  {
    startCountdown(); 
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
    </form>`));

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
function showConfirmDeleteAccount()
{
    startCountdown(); 
    eraseContent();
    $("#content").append($(`
    <h3 style="
    display: flex;
    justify-content: center;" >Voulez-vous vraiment effacer votre compte?</h3>
    <div class="cancel">
        <button class="form-control btn btn-danger form-control" id="confirmDeleteAccount">Effacer mon compte</button>
    </div>
    <br>
    <div class="cancel">
    <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
    </div>`));
    $('#abortCmd').on("click", function () {
        showMainPage();
    });
    $('#confirmDeleteAccount').on("click",async function (){
        let result = await API.unsubscribeAccount(API.retrieveLoggedUser().Id);
        console.log(result);
        if(result)
        {
            showLoginForm("Votre compte a été supprimé");
        }
        else
        {
            console.log(API.currentHttpError);
            showOffline();
        }

    });

}
function showAccountForm(account = null)
{
    let create = account == null;
    let requiredPassword =create ? "required": "" ;
    if (create) {
        noTimeout();
        account = newAccount();
        account.Avatar = 'images/no-avatar.png';
    }
    else
    {
        startCountdown();
    }
    eraseContent();

    $("#content").append($(`<form class="form" id="ProfilForm"'>
    <input type="hidden" name="Id" value="${account.Id}"/>
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
    value="${account.Email}"/>
    <input class="form-control MatchedInput"
    type="text"
    matchedInputId="Email"
    name="matchedEmail"
    id="matchedEmail"
    placeholder="Vérification"
    required
    RequireMessage = 'Veuillez entrez de nouveau votre courriel'
    InvalidMessage="Les courriels ne correspondent pas" 
    value="${account.Email}"/>
    </fieldset>
    <fieldset>
    <legend>Mot de passe</legend>
    <input type="password"
    class="form-control"
    name="Password"
    id="Password"
    placeholder="Mot de passe" `
    +
    requiredPassword
    + `
    RequireMessage = 'Veuillez entrer un mot de passe'
    InvalidMessage = 'Mot de passe trop court'/>
    <input class="form-control MatchedInput"
    type="password"
    matchedInputId="Password"
    name="matchedPassword"
    id="matchedPassword"
    placeholder="Vérification" 
    `
    +
    requiredPassword
    + `
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
    value="${account.Name}"/>
    </fieldset>
    <fieldset>
    <legend>Avatar</legend>
    <div class='imageUploader'
    newImage='${create}'
    controlId='Avatar'
    imageSrc='${account.Avatar}'
    waitingImage="images/Loading_icon.gif">
    </div>
    </fieldset>
    <input type='submit' name='submit' id='saveUserCmd' value="Enregistrer" class="form-control btn-primary">
    </form>
    <div class="cancel">
    <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
    </div>`));
    if(!create)
    {
        $("#content").append($(`<div class="cancel">
        <hr>
        <button class="form-control btn btn-danger form-control" id="deleteAccount">Effacer le compte</button>
        </div>`));
        $('#deleteAccount').on("click", function () {
            
            showConfirmDeleteAccount();
        });

    }
    initFormValidation();
    initImageUploaders();

    let urlConflict = API.checkConflictURL();
    addConflictValidation(urlConflict, 'Email', 'saveUser');
    
    let email = $("#Email");

    email.off("blur");
    email.on("blur", () => {
            if (email.val() != "")
                ConflictTestRequest(urlConflict, "Email");
        });

    $("#ProfilForm").on("submit", async function(e) {
        let profil = getFormData($("#ProfilForm"));
``
        if (create)
        {
            delete profil.matchedPassword;
            delete profil.matchedEmail;
        }
        e.preventDefault();

        profil.Id = account.Id;
        //showWaitingGif();
        
        let result;

        if (create) {
            result = await API.register(profil);
        }
        else {
            result = await API.modifyUserProfil(profil);
        }

        if (result)
        {
            if(create)
            {
                showLoginForm(`Votre compte a été créé. Veuillez regarder vos courriels pour réccupérer votre code
                de vérification qui vous sera demandé lors de votre prochaine connexion.`);
            }
            else
            {
                logout("Votre compte a été modifé avec succès. n'oublier pas de récupérer votre code si vous avez changer votre email.");
            }
        }
        else
        {
            console.log(API.currentHttpError);
            showOffline();
        }

    });

    $('#abortCmd').on("click", function () {
        if(create)
        {
            showLoginForm();
        }
        else
        {
            showMainPage();
        }
    });
}
function showOffline()
{
    API.eraseLoggedUser();
    API.eraseAccessToken();
    noTimeout();
    eraseContent();
    $("#content").append($(`<h3 class="errorContainer">Le serveur ne répond pas</h3>
    <hr>
    <form class="form" id="tryConnexion">
    <input type='submit' name='submit' value="Connexion" class="form-control btn-primary">
    </form>`));
    $("#tryConnexion").on("click", function (e) {
        e.preventDefault();
        showLoginForm();
    });
    updateHeader("Problème", "problem");
}

//voir lui du account
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
    $('#aboutCmd').on("click", function () {
        renderAbout();
    });
    $('#loginCmd').on("click", function () {
        renderAbout();
        showLoginForm();
    });
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
        renderUserAvatar();
    });
    $('#editProfilCmd').on("click",function(){
        showAccountForm(API.retrieveLoggedUser());
    });
    $('#aboutCmd').on("click", function () {
        renderAbout();
    });
}

function renderAdminMenu() {
    $("#contextualMenu").empty();
    $("#contextualMenu").append(
        $(`
            <span class="dropdown-item" id="manageUserCmd">
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
    $('#logoutCmd').on("click", function () {
        logout("Vous êtes déconnecté");
        renderUserAvatar();
    });
    $('#editProfilCmd').on("click",function(){
        showAccountForm(API.retrieveLoggedUser());
    });
    $('#manageUserCmd').on("click", function () {
        renderManageUsers();
    });
    $('#aboutCmd').on("click", function () {
        renderAbout();
    });
}

function eraseHeader() {
    $("#header").empty();
}

function renderUserAvatar() {
    let loggedUser = API.retrieveLoggedUser();

    if (loggedUser != null)
    {
        let avatar = $('#picture');

        let picture = loggedUser.Avatar;

        avatar.empty();

        avatar.append (`<i class="editProfilCmd">
            <div class="UserAvatarSmall" userid="${loggedUser.Id}"
            style="background-image:url('${picture.slice(picture.lastIndexOf("/") + 1) != ""
             ? picture : 'images/no-avatar.png'}')"
            title="Modifier votre profil"></div>
            </i>`);

        $(".editProfilCmd").on("click", () => showAccountForm(loggedUser));
    }
}

function isAdmin(user) {
    return user.Authorizations.readAccess == 2 && user.Authorizations.writeAccess == 2;
}

function isBan(user) {
    return user.Authorizations.readAccess == -1 && user.Authorizations.writeAccess == -1;
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
                <i id="picture">
                </i>
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

    renderUserAvatar();

    let user = API.retrieveLoggedUser();

    if (user == null || user.VerifyCode !== "verified") {
        renderAnonymousMenu();
    }
    else if (isAdmin(user)) {
        renderAdminMenu();
    }
    else {
        renderUserMenu();
    }
}

function AccountPicture(account) {
    let avatar = account.Avatar;
    let name = account.Name;
    return `<span class="UserAvatar"
    style="background-image:url('${avatar.slice(avatar.lastIndexOf("/") + 1) != "" ? avatar : 'images/no-avatar.png'}')"
    title="${name}"></span>
    <span class="UserContainer">
    <span class="UserName">${name}</span>`    
}

async function renderManageUsers() {
    timeout();
    let user = API.retrieveLoggedUser();

    if (user == null)
    {
        showLoginForm();
    }
    else if (!isAdmin(user)) {
        showMainPage();
    }
    else {
        eraseContent();
        updateHeader("Gestions des usagers", "manageUsers");
    
        let accounts = Object.entries(await API.GetAccounts())[0][1];
    
        let userId = user.Id;
    
        for (const account of accounts) {
            let accountId = account.Id;

            if (accountId != userId)
            {
                let isAdministrator = isAdmin(account);
                let isBlocked = isBan(account);

                $("#content").append(                
                    `<i class="UserLayout">
                        ${AccountPicture(account)}
                        <div class="UserCommandPanel">
                            <span id="rightCmd_${accountId}" class="fas ${isAdministrator ? "fa-user-cog" : "fa-user-alt"}
                              cmdIconVisible dodgerblueCmd"></span>

                            <span id="banCmd_${accountId}" 
                            class="${isBlocked ? "fa fa-ban redCmd" : "fa-regular fa-circle greenCmd" }
                            cmdIconVisible"></span>
                            
                            <span id="deleteCmd_${accountId}" class="fas fa-user-slash goldenrodCmd cmdIconVisible"></span>
                        </div>
                        <span class="UserEmail">${account.Email}</span>
                        </span>
                    </i>`
                );
            }

            
            $(`#rightCmd_${accountId}`).on("click", (e) => {
                let target = $(e.target);

                if (target.hasClass("fa-user-cog"))
                {
                    target.removeClass("fa-user-cog");
                    target.addClass("fa-user-alt");
                    GrantUserAcess(account);
                }
                else {
                    target.removeClass("fa-user-alt");
                    target.addClass("fa-user-cog");
                    GrantAdminAcess(account);
                }
            });

            $(`#banCmd_${accountId}`).on("click", (e) => {
                let target = $(e.target);

                if (target.hasClass("fa-ban"))
                {
                    target.removeClass("fa");
                    target.removeClass("fa-ban");
                    target.removeClass("redCmd");
                    target.addClass("fa-regular");
                    target.addClass("fa-circle");
                    target.addClass("greenCmd");
                    GrantUserAcess(account);
                }
                else {
                    target.removeClass("fa-regular");
                    target.removeClass("fa-circle");
                    target.removeClass("greenCmd");
                    target.removeClass("ban");
                    target.addClass("fa");
                    target.addClass("fa-ban");
                    target.addClass("redCmd");
                    GrantBanAcess(account);
                }
            });

            $(`#deleteCmd_${accountId}`).on("click", async function() {
                showAdminConfirmDeleteAccount(account);
            });
        }

    }
}

function showAdminConfirmDeleteAccount(account)
{
    if (isAdmin(API.retrieveLoggedUser())) {
        startCountdown(); 
        eraseContent();
        updateHeader("Retrait de compte");
        $("#content").append($(`
        <h3 style="
        display: flex;
        justify-content: center;" >Voulez-vous vraiment effacer cette usager?</h3>
        <div class="UserLayout" 
        style="
        display: flex;
        justify-content: center;" >
            ${AccountPicture(account)}
        </div>
        <br>
        <div class="cancel">
            <button class="form-control btn btn-danger form-control" id="confirmDeleteAccount">Effacer</button>
        </div>
        <br>
        <div class="cancel">
        <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
        </div>`));
        $('#abortCmd').on("click", function () {
            renderManageUsers();
        });
        let accountId = account.Id;

        $('#confirmDeleteAccount').on("click",async function (){
            let result = await API.unsubscribeAccount(accountId);
            console.log(result);
            if(result)
            {
                showLoginForm("Cette usager a été supprimé");
            }
            else
            {
                console.log(API.currentHttpError);
                showOffline();
            }
    
        });
    }
}

async function GrantBanAcess(profil) {
    if (isAdmin(API.retrieveLoggedUser())) {
        profil.Authorizations.readAccess = -1;
        profil.Authorizations.writeAccess = -1;
        profil.Password = "";
        profil.Avatar = "";
        await API.modifyUserProfilByAdmin(profil);
    }
}

async function GrantAdminAcess(profil) {
    if (isAdmin(API.retrieveLoggedUser())) {
        profil.Authorizations.readAccess = 2;
        profil.Authorizations.writeAccess = 2;
        profil.Password = "";
        profil.Avatar = "";
        await API.modifyUserProfilByAdmin(profil);
    }
}

async function GrantUserAcess(profil) {
    if (isAdmin(API.retrieveLoggedUser())) {
        profil.Authorizations.readAccess = 1;
        profil.Authorizations.writeAccess = 1;
        profil.Password = "";
        profil.Avatar = "";
        await API.modifyUserProfilByAdmin(profil);
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
