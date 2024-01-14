import { NestFactory } from '@nestjs/core'

import { AppSchema } from './app.schema'
import { BootstrapModule } from './strict-config/bootstrap.module'
import { CONFIG_OBJECT_TOKEN } from './strict-config/strict-config.constants'
import { StrictConfigModule } from './strict-config/strict-config.module'

export const strictConfigForRoot = StrictConfigModule.typeSafe({
  schema: AppSchema,
}).forRoot()

export const appPromise = NestFactory.createApplicationContext(
  BootstrapModule.boot({
    imports: [strictConfigForRoot],
  }),
)

async function bootstrap(): Promise<AppSchema> {
  const app = await appPromise
  return app.get<AppSchema>(CONFIG_OBJECT_TOKEN)
}

export const configPromise = bootstrap()
