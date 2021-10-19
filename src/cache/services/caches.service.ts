import randomString from 'randomstring';
import CacheModel from "../models/cache.model";
import { CRUD } from "../../common/interfaces/crud.interface";
import logger from '../../logger';

class CachesService implements CRUD {
  async create(key: string, value: string) {
    return CacheModel.addKey(key, value)
  }

  async deleteByKey(key: string) {
    return CacheModel.removeByKey(key);
  }

  async list(limit: number, page: number) {
    return CacheModel.getKeys(limit, page);
  }
  
  async readByKey(key: string) {
    const cache = await CacheModel.getByKey(key);

    if (cache) {
      logger.info('Cache Hit')
      return Promise.resolve(cache);
    } else {
      logger.info('Cache Miss')
      const value = randomString.generate(12);
      const newCache = await this.create(key, value);
      return Promise.resolve(newCache);
    }
  }
  
  async putByKey(key: string, value: string) {
    return CacheModel.updateByKey(key, value)
  }

  async delete() {
    return CacheModel.removeAll()
  }
}

export default new CachesService();