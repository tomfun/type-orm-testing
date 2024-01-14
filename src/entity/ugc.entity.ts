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

// export abstract class UgcEntityInner {
//   id: string
//
//   readonly type: string
//
//   signature: SignatureEntity
//
//   createdAt: Date
//
//   d: { type: string }
// }

// var __decorate =
//   (typeof that !== 'undefined' ? that.__decorate : undefined) ||
//   function (decorators, target, key?: string | symbol, desc?: PropertyDescriptor) {
//     const c = arguments.length
//     let r =
//       c < 3
//         ? target
//         : desc === null
//         ? (desc = Object.getOwnPropertyDescriptor(target, key))
//         : desc
//     let d
//     if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
//       r = Reflect.decorate(decorators, target, key, desc)
//     else
//       for (let i = decorators.length - 1; i >= 0; i--)
//         if ((d = decorators[i]))
//           r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r
//     return c > 3 && r && Object.defineProperty(target, key, r), r
//   }
// const __metadata =
//   (that && that?.__metadata) ||
//   function (k, v) {
//     if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
//       return Reflect.metadata(k, v)
//   }
// todo: check or use https://orkhan.gitbook.io/typeorm/docs/separating-entity-definition

// equivalent
/**/
@Entity('ugc')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class UgcEntityInner {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => SignatureEntity)
  signature: SignatureEntity

  @CreateDateColumn()
  createdAt: Date

  @ApiProperty()
  @Column({ type: 'jsonb' })
  d: Object
}
/**/
// __decorate(
//   [ApiProperty(), PrimaryGeneratedColumn('uuid'), __metadata('design:type', String)],
//   UgcEntityInner.prototype,
//   'id',
//   void 0,
// )
// __decorate(
//   [ManyToOne(() => SignatureEntity), __metadata('design:type', SignatureEntity)],
//   UgcEntityInner.prototype,
//   'signature',
//   void 0,
// )
// __decorate(
//   [ApiProperty(), CreateDateColumn(), __metadata('design:type', Date)],
//   UgcEntityInner.prototype,
//   'createdAt',
//   void 0,
// )
// __decorate(
//   [ApiProperty(), Column({ type: 'jsonb' }), __metadata('design:type', Object)],
//   UgcEntityInner.prototype,
//   'd',
//   void 0,
// )
//
// export const UgcEntity: typeof UgcEntityInner = __decorate(
//   [Entity('ugc'), TableInheritance({ column: { type: 'varchar', name: 'type' } })],
//   UgcEntityInner,
// )
// export const UgcSchema = new EntitySchema<UgcEntityInner>({
//   target: UgcEntityInner,
//   name: 'ugc',
//   columns: {
//     id: {
//       type: String,
//       primary: true,
//       generated: 'uuid',
//     },
//     // type: {
//     //   type: String,
//     // },
//     createdAt: {
//       type: Date,
//       createDate: true,
//     },
//     type: {
//       type: String,
//     },
//   },
//   relations: {
//     signature: {
//       type: 'many-to-one',
//       // target: 'signature',
//       target: {
//         type: SignatureEntity,
//         name: 'signature',
//       },
//     },
//   },
//   // NEW: Inheritance options
//   inheritance: {
//     pattern: 'STI',
//     column: 'type',
//   },
// })
