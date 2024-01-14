import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { CreateDateColumn, Entity, EntitySchema, PrimaryGeneratedColumn, } from 'typeorm'

export class SignatureEntity {
  @ApiProperty()
  @Expose()
  id: string

  createdAt: Date
}


export const SignatureSchema = new EntitySchema<SignatureEntity>({
  target: SignatureEntity,
  tableName: 'signature',
  name: 'signature',
  columns: {
    id: {
      type: String,
      primary: true,
      generated: 'uuid',
    },
    createdAt: {
      type: Date,
      createDate: true,
    },
  },
})
