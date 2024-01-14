import { ApiProperty } from '@nestjs/swagger'
import { Equals, IsIn, IsOptional, IsSemVer, Length, } from 'class-validator'
import { ChildEntity, Column, EntitySchema, } from 'typeorm'
// import { UgcSchema } from './ugc.entity'
import { UgcEntityInner, } from './ugc.entity'

/**
 * Is not true class. It is not used. But type the same
 */
export class ReportDataBodyPayload {
  @ApiProperty()
  @Equals('ReportEntity')
  readonly type: 'ReportEntity'

  @ApiProperty()
  @IsIn(['0.0.1-alpha-1'])
  @IsSemVer()
  readonly version: string

  @ApiProperty()
  @Length(4, 250)
  title: string

  @ApiProperty()
  @IsOptional()
  @Length(4, 20000)
  generalReport: string
}

@ChildEntity()
export class ReportEntity extends UgcEntityInner {
  @ApiProperty()
  @Column({ type: 'jsonb' })
  declare d: ReportDataBodyPayload
}
// export const ReportSchema = new EntitySchema<ReportEntity>({
//   target: ReportEntity,
//   name: 'ReportEntity',
//   type: 'entity-child',
//   // When saving instances of 'A', the "type" column will have the value
//   // specified on the 'discriminatorValue' property
//   // discriminatorValue: "my-custom-discriminator-value-for-A",
//   columns: {
//     ...UgcSchema.options.columns,
//     d: {
//       type: 'jsonb',
//     },
//   },
// })
