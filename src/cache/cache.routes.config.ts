import express from 'express';
import { body } from 'express-validator';
import { CommonRoutesConfig } from "../common/common.routes.config";
import CachesController from './controllers/caches.controller';
import BodyValidationMiddleware from "../common/middleware/body.validation.middleware";

export class CacheRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'CacheRoutes')
  }

  configureRoutes(): express.Application {
    this.app.route('/caches')
      .get(CachesController.listAll)
      .delete(CachesController.removeAll);

    this.app
      .route(`/caches/:key`)
      .get(CachesController.getByKey)
      .put([
        body('value').isString(),
        BodyValidationMiddleware.verifyBodyFieldErrors,
        CachesController.putKey
      ])
      .delete(CachesController.removeKey);

    return this.app;
  }
}