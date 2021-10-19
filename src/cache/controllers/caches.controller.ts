import express from 'express';
import CachesService from '../services/caches.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:caches-controller');

class CachesController {
  async listAll(req: express.Request, res: express.Response) {
    const keys = await CachesService.list(100, 0);
    res.status(200).send(keys);
  }

  async getByKey(req: express.Request, res: express.Response) {
    const key = await CachesService.readByKey(req.params.key);
    res.status(200).send(key);
  }

  async putKey(req: express.Request, res: express.Response) {
    log(await CachesService.putByKey(req.params.key, req.body.value));
    res.status(204).send();
  }

  async removeKey(req: express.Request, res: express.Response) {
    log(await CachesService.deleteByKey(req.params.key));
    res.status(204).send();
  }

  async removeAll(req: express.Request, res: express.Response) {
    log(await CachesService.delete());
    res.status(204).send();
  }
}

export default new CachesController();