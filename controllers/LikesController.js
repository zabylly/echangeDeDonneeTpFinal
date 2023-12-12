import LikeModel from '../models/like.js';
import Authorizations from '../authorizations.js';
import Repository from '../models/repository.js';
import Controller from './Controller.js';

export default class LikesController extends Controller {
    constructor(HttpContext) {
        super(HttpContext, new Repository(new LikeModel()), Authorizations.user());
    }
}