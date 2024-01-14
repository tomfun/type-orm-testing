import { DynamicModule, Inject, Module, OnModuleDestroy } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SentryModule } from '@ntegral/nestjs-sentry'
import { AppClusterService } from './app-cluster.service'

import { strictConfigForRoot } from './app.module-config'
import { AppSchema } from './app.schema'
import { CoreModule } from './core/core.module'
import { entities } from './entity'
import { config as typeOrmConfig } from './pg.config-factory'

@Module({})
export class AppModule implements OnModuleDestroy {
  static forConfig(config: AppSchema): DynamicModule {
    return {
      module: AppModule,
      imports: [
        CoreModule,
        strictConfigForRoot,
        SentryModule.forRoot({
          enabled: !config.sentryDisable,
          dsn: config.sentryDsn,
          debug: false,
          environment: config.ENVIRONMENT,
          release: `api@${config.VERSION}`,
          close: { enabled: true },
        }),
        TypeOrmModule.forRoot(typeOrmConfig(config)),
        TypeOrmModule.forFeature(entities),
      ],
      providers: [AppClusterService],
    }
  }
  @Inject() appClusterService: AppClusterService

  async onModuleDestroy() {
    await this.appClusterService.stop()
  }
}
