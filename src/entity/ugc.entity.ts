import {
  Column,
  CreateDateColumn,
  Entity,
  EntitySchema,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm'
import { SignatureEntity } from './signature.entity'
import { ApiProperty } from '@nestjs/swagger';

const that = this as any

export abstract class UgcEntityInner {
  id: string

  readonly type: string

  signature: SignatureEntity

  createdAt: Date

  d: { type: string }
}

export const UgcSchema = new EntitySchema<UgcEntityInner>({
  target: UgcEntityInner,
  tableName: 'ugc',
  name: 'ugc',
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
    d: {
      type: 'jsonb',
    },
  },
  relations: {
    signature: {
      type: 'many-to-one',
      target: 'SignatureEntity',
    },
  },
  // NEW: Inheritance options
  inheritance: {
    pattern: 'STI',
    column: { type: 'varchar', name: 'type' },
  },
})
