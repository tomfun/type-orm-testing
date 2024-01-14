import { ApiProperty } from '@nestjs/swagger'
import { Equals, IsIn, IsSemVer, IsString, } from 'class-validator'
import { ChildEntity, Column, EntitySchema, } from 'typeorm'
// import { UgcSchema } from './ugc.entity'
import { UgcEntity } from './ugc.entity'

export class CommentDataBodyPayload {
  @ApiProperty()
  @Equals('CommentEntity')
  declare readonly type: 'CommentEntity'

  @ApiProperty()
  @IsSemVer()
  @IsIn(['0.0.1-alpha-1'])
  declare readonly version: string

  @ApiProperty()
  @IsIn(['text'])
  declare contentType: 'text'

  @ApiProperty()
  @IsString()
  declare content: string
}

@ChildEntity()
export class CommentEntity extends UgcEntity {
  @ApiProperty()
  @Column({ type: 'jsonb' })
  declare d: CommentDataBodyPayload
}

// export const CommentSchema = new EntitySchema<CommentEntity>({
//   target: CommentEntity,
//   name: 'CommentEntity',
//   type: 'entity-child',
//   // inheritance: { pattern: 'STI' },
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
