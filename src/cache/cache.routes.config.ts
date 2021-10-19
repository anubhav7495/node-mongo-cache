import { CommonRoutesConfig } from "../common/common.routes.config";
import CachesController from './controllers/caches.controller';
import express from 'express';

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
      .put(CachesController.putKey)
      .delete(CachesController.removeKey);

    return this.app;
  }
}