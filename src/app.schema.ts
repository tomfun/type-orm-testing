import {
  Length,
  Min,
  Max,
  Matches,
  IsIP,
  IsUrl,
  IsFQDN,
  IsNumber,
  IsOptional,
  Allow,
  ValidateIf,
} from 'class-validator'
import { Expose, Transform } from 'class-transformer'

export class AppSchema {
  @Allow()
  @Expose()
  ENVIRONMENT = 'None'

  @Allow()
  @Expose()
  VERSION = 'n/a'

  @IsOptional()
  @Expose({ name: 'SENTRY_DISABLE' })
  @Transform(({ value }) => value === '1')
  sentryDisable = false

  @IsUrl({ allow_query_components: false, require_tld: true })
  @Expose({ name: 'SENTRY_DSN' })
  @ValidateIf((o: Partial<AppSchema>) => !o.sentryDisable)
  sentryDsn = 'https://9849b7f87d72471ea55aa1c7a11d3233@sentry.io/18'

  @Allow()
  @Expose({ name: 'LOG' })
  log: string

  @Allow()
  @Expose({ name: 'CLUSTER_WORKERS' })
  @Transform(({ value }) => (value ? +value : 0))
  clusterWorkers: 1

  get logHttp(): boolean {
    return this.log ? this.log === '1' || !!this.log?.match(/http/) : false
  }

  get logPg() {
    return this.log ? this.log === '1' || !!this.log?.match(/pg/) : false
  }

  get logCassandra() {
    return this.log ? this.log === '1' || !!this.log?.match(/cassandra/) : false
  }

  @Allow()
  @Expose({ name: 'TRUST_PROXY' })
  @Transform(({ value }) => (value?.match(/^\d+$/) ? +value : value))
  trustProxy: number | string

  @IsIP()
  @Expose({ name: 'ADDRESS' })
  address: string

  @Min(1)
  @Max(65535)
  @Expose({ name: 'PORT' })
  @Transform(({ value }) => (value?.match(/^\d+/) ? +value : value))
  port: number

  @IsUrl({ allow_query_components: false, require_tld: false })
  @Matches(/[^/]$/)
  @Expose({ name: 'PUBLIC_URL' })
  publicUrl: string

  @IsFQDN({ require_tld: false })
  @Expose({ name: 'POSTGRES_HOST' })
  dbHost: string

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(65535)
  @Expose({ name: 'POSTGRES_PORT' })
  @Transform(({ value }) => +value)
  dbPort: number

  @Length(1)
  @Expose({ name: 'POSTGRES_PASSWORD' })
  dbPassword: string

  @Length(1)
  @Expose({ name: 'POSTGRES_USER' })
  dbUsername: string

  @IsOptional()
  @Length(1)
  @Expose({ name: 'POSTGRES_DB' })
  dbDatabase = 'postgres'
}
