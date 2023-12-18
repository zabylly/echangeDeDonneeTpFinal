import * as utilities from '../utilities.js';
import HttpContext from '../httpContext.js';
import TokenManager from '../tokensManager.js';
import Authorizations from '../authorizations.js';
import LikeModel from './like.js';
import Repository from './repository.js';
// http://localhost:5000/api/bookmarks?fields=Category,Title&limit=3&offset=1&Category=c*&sort=Category&sort=Title,desc
// http://localhost:5000/api/words?sort=Val,desc&limit=5&offset=20&Val=*z&fields=Val,Def,Gen

export default class permissionFilter {
    constructor(collection, params,model) {
        this.model = model;
        this.params = params;
        this.collection = collection;
        this.HttpContext = HttpContext.get();
    }

    addSearchKey(keyName, value) {
        if (this.model && !this.model.isMember(keyName))
            return;
        this.searchKeys.push({ name: keyName, value: value });
    }

    get() {
        if(this.model.isMember("Shared"))
        {

            if(this.HttpContext.req.headers["authorization"] != null)
            {
                let token = this.HttpContext.req.headers["authorization"].replace('Bearer ', '');
                token = TokenManager.find(token);
                if(token.User.Authorizations["readAccess"] == 2)
                {
                    return this.collection;
                }
                this.collection = this.collection.filter((e)=>e["Shared"] || e["OwnerId"] == token.User["Id"]);
                
            }
            else
            {
                this.collection = this.collection.filter((e)=>e["Shared"]);
            }
            let likesRepository = new Repository(new LikeModel());
            this.collection.forEach(element => {
                let likes = likesRepository.getAll({PhotoId: element.Id});
                element.likes = likes;
                element.LikeCount = likes.length;
            });

        }
        return this.collection;
    }
}
