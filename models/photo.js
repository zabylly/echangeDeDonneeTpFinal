import Model from './model.js';
import UserModel from './user.js';
import LikeModel from './like.js';
import Repository from '../models/repository.js';

export default class Photo extends Model {
    constructor()
    {
        super();
        this.addField('OwnerId', 'string');
        this.addField('Title', 'string');        
        this.addField('Description', 'string');
        this.addField('Image', 'asset');
        this.addField('Date','integer');
        this.addField('Shared','boolean');

        this.setKey("Title");
    }

    bindExtraData(instance) {
        instance = super.bindExtraData(instance);
        let usersRepository = new Repository(new UserModel());
        let owner = usersRepository.get(instance.OwnerId);
        instance.OwnerName = owner.Name;
        instance.OwnerAvatar = owner.Avatar;
        
        let likesRepository = new Repository(new LikeModel());
        let likes = likesRepository.getAll({PhotoId: instance.Id});
        instance.likes = likes;
        instance.likeCount = likes.length;
        return instance;
    }
}