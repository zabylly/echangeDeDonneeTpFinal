let rowHeight = 345 - 1;
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
    style="background-image:url('${ avatar.slice(avatar.lastIndexOf("/") + 1) != "" ? avatar : 'images/no-avatar.png'}');"
    title="${name}"></span>
    <span class="UserContainer">
    <span class="UserName">${name}</span>`    
}
function AccountPicture(avatar, name, pictureClass = "UserAvatar") {
    
    return `<div class="${pictureClass}"
    style="background-image:url('${avatar.slice(avatar.lastIndexOf("/") + 1) != "" ? avatar : 'images/no-avatar.png'}')"
    title="${name}"></div>`    
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
function generateLike(picture)
{
    let title="";
    for(const like of picture.likes)
    {
        title += like.UserName + "\n";
    }
    userLike = picture.likes.find(obj => obj["UserId"] === API.retrieveLoggedUser().Id);
    likeId = userLike == undefined ?false:userLike.Id;
    return `<div>${picture.LikeCount}</div>
    <div idLike="${likeId?likeId:"none"}" idPicture="${picture.Id}" class="${likeId?'UnlikeCmd':'LikeCmd'}" title="${title}">
        <i style="margin: unset;" class="cmdIcon ${likeId?'fa fa-thumbs-up':'fa-regular fa-thumbs-up'}"></i>
    </div>`;
}
function getLimit() {
    let nbColumn = 3;
    // estimate the value of limit according to height of content
    let limit = Math.round($("#content").innerHeight() / rowHeight);
    return limit * nbColumn;
}
