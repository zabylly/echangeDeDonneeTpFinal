import Model from './model.js';

export default class Photo extends Model {
    constructor()
    {
        super();
        this.addField('UserId', 'string');
        this.addField('PhotoId', 'string');
    }
}