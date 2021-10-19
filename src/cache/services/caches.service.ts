import randomString from 'randomstring';
import CacheModel from "../models/cache.model";
import { CRUD } from "../../common/interfaces/crud.interface";
import logger from '../../logger';

class CachesService implements CRUD {
  async create(key: string, value: string) {
    await this.deleteLRUEntry()
    return CacheModel.addKey(key, value)
  }

  async deleteByKey(key: string) {
    return CacheModel.removeByKey(key);
  }

  async list(limit: number, page: number) {
    const cache = await CacheModel.getKeys(limit, page);
    return Promise.resolve(cache.map(c => c.key));
  }
  
  async readByKey(key: string) {
    const cache = await CacheModel.getByKey(key);

    if (cache) {
      logger.info('Cache Hit')
      return Promise.resolve(cache.value);
    } else {
      logger.info('Cache Miss')
      const value = randomString.generate(12);
      const newCache = await this.create(key, value);
      return Promise.resolve(newCache.value);
    }
  }
  
  async putByKey(key: string, value: string) {
    await this.deleteLRUEntry()
    return CacheModel.updateByKey(key, value)
  }

  async delete() {
    return CacheModel.removeAll()
  }

  // Deletes the Least Recently Used Entry
  // Each entry has an updatedAt field which is changed on each findOne or Update operation
  // If the length on keys is more than the limit, we delete the first entry
  // sorted in ascending order by udpatedAt, effectively deleting the least recenly read or updated key
  async deleteLRUEntry() {
    const list = await CacheModel.getKeysSortedByUpdateAt();
    if (list.length >= (Number(process.env.CACHELIMIT) || 25)) {
      await this.deleteByKey(list[0].key);
    }
  }
}

export default new CachesService();