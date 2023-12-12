
function newAccount() {
    account = {};
    account.Id = 0;
    account.Name = "";
    account.Phone = "";
    account.Email = "";
    return account;
}
function getFormData($form) {
    const removeTag = new RegExp("(<[a-zA-Z0-9]+>)|(</[a-zA-Z0-9]+>)", "g");
    var jsonObject = {};
    $.each($form.serializeArray(), (index, control) => {
        jsonObject[control.name] = control.value.replace(removeTag, "");
    });
    return jsonObject;
}
function isAdmin(user) {
    return user.Authorizations.readAccess == 2 && user.Authorizations.writeAccess == 2;
}
function isBan(user) {
    return user.Authorizations.readAccess == -1 && user.Authorizations.writeAccess == -1;
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
function AccountPicture(avatar, name) {
    return `<span class="UserAvatar"
    style="background-image:url('${avatar.slice(avatar.lastIndexOf("/") + 1) != "" ? avatar : 'images/no-avatar.png'}')"
    title="${name}"></span>
    <span class="UserContainer">
    <span class="UserName">${name}</span>`    
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

function newPicture() {
    picture = {};
    picture.Id = 0;
    picture.OwnerId = API.retrieveLoggedUser().Id;
    picture.Title = "";
    picture.Description = "";
    picture.Date = Date.now();
    picture.Shared = false;
    return picture;
}
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
function toDate(dateInt)
{
    let dateObj = new Date(dateInt);
    let date = dateObj.toLocaleDateString("fr-FR",{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    let heure = dateObj.toLocaleTimeString("fr-FR",{ hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return date + " @ " + heure;

}
