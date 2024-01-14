import { DataSourceOptions } from 'typeorm'

import { entities } from './entity'
import { PgSchema } from './pg.schema'

export const config = (config: PgSchema): DataSourceOptions => ({
  type: 'postgres',
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUsername,
  password: config.dbPassword,
  database: config.dbDatabase,
  entities: entities,
  synchronize: false,
  logging: config.logPg,
  // cli: {
  //   entitiesDir: 'src/entity',
  //   migrationsDir: 'migration',
  //   subscribersDir: 'src/subscriber',
  // },
})
