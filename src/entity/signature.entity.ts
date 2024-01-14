import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, } from 'typeorm'

@Entity('signature')
export class SignatureEntity {
  @ApiProperty()
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn()
  createdAt: Date
}
