import Authorizations from '../authorizations.js';
import Repository from '../models/repository.js';
import PhotoModel from '../models/photo.js';
import Controller from './Controller.js';

export default
    class Photos extends Controller {
        constructor(HttpContext) {
            super(HttpContext, new Repository(new PhotoModel()), Authorizations.user());
        }
        get(id) {
            if (Authorizations.readGranted(this.HttpContext, this.authorizations)) {
                if (this.repository != null) {
                    if (id !== undefined) {
                        let data = this.repository.get(id);
                        if (data != null)
                            this.HttpContext.response.JSON(data);
                        else
                            this.HttpContext.response.notFound("Ressource not found.");
                    } else
                        this.HttpContext.response.JSON(this.repository.getAll(this.HttpContext.path.params), this.repository.ETag, true, this.authorizations);
                } else
                    this.HttpContext.response.notImplemented();
            } else
                this.HttpContext.response.unAuthorized("Unauthorized access");
        }
    }
    