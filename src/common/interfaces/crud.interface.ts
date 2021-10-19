export interface CRUD {
  list: (limit: number, page: number) => Promise<any>;
  create: (key: string, value: string) => Promise<any>;
  putByKey: (key: string, value: string) => Promise<string>;
  readByKey: (key: string) => Promise<any>;
  deleteByKey: (key: string) => Promise<any>;
}