import Model from './model.js';
import UserModel from './user.js';
import Repository from '../models/repository.js';

export default class Like extends Model {
    constructor()
    {
        super();
        this.addField('UserId', 'string');
        this.addField('PhotoId', 'string');
    }
    bindExtraData(instance) {
        instance = super.bindExtraData(instance);
        let usersRepository = new Repository(new UserModel());
        let user = usersRepository.get(instance.UserId);
        if(user != null)
            instance.UserName = user.Name;
        return instance;
    }
}