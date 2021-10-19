import debug from 'debug';
import shortid from 'shortid';
import mongooseService from '../../common/services/mongoose.service';

const log: debug.IDebugger = debug('app:cache-model');

class CachesModel {
  Schema = mongooseService.getMongoose().Schema;
  cachesSchema;
  Cache;

  constructor() {
    const cacheKeyTtl = Number(process.env.CACHEKEYTTL) || 3600
    this.cachesSchema = new this.Schema({
      _id: String,
      key: String,
      value: String
    }, { id: false, timestamps: true });

    this.cachesSchema.index({ updatedAt: 1 }, { expireAfterSeconds: cacheKeyTtl })

    // Update updatedAt on every findOne to reset the expires TTL
    this.cachesSchema.post('findOne', function(result) {
      if (result) {
        result.updatedAt = Date.now();
        result.save();
      }
    });
  
    this.Cache = mongooseService.getMongoose().model('Cache', this.cachesSchema);

    log('Created new instance of CachesModel');
  }

  async addKey(key: string, value: string) {
    const id = shortid.generate()
    const cache = new this.Cache({
      _id: id,
      key: key,
      value: value
    });
    await cache.save();
    return cache;
  }

  async getByKey(key: string) {
    return this.Cache.findOne({ key: key }).exec();
  }

  async getKeys(limit = 25, page = 0) {
    return this.Cache.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async updateByKey(
    key: string,
    value: string
  ) {
    const existingKey = await this.Cache.findOneAndUpdate(
      { key: key },
      { $set: { value: value } },
      { new: true, upsert: true }
    ).exec();
    return existingKey;
  }

  async removeByKey(key: string) {
    return this.Cache.deleteOne({ key: key }).exec();
  }

  async removeAll() {
    return this.Cache.deleteMany().exec();
  }

  async getKeysSortedByUpdateAt() {
    return this.Cache.find()
      .sort({ updatedAt: 'asc' })
      .exec();
  }
}

export default new CachesModel();