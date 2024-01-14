import { Length, IsFQDN, IsNumber, IsOptional, Allow } from 'class-validator'
import { Expose } from 'class-transformer'

export class PgSchema {
  @Allow()
  @Expose({ name: 'LOG' })
  log: string

  get logPg() {
    return this.log ? this.log === '1' || !!this.log?.match(/pg/) : false
  }

  @IsFQDN({ require_tld: false })
  @Expose({ name: 'POSTGRES_HOST' })
  dbHost: string

  @IsNumber()
  @IsOptional()
  @Expose({ name: 'POSTGRES_PORT' })
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
