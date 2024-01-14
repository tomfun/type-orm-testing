import { Injectable, ValidationPipe } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CommentDataBodyPayload, CommentEntity, } from '../entity'

export { CommentDataBodyPayload, CommentEntity } from '../entity'

export type CommentForList = Omit<CommentEntity, 'signature'>

export const TYPE = 'ero-like.online/comment@0.0.1-alpha-1'


export enum QueryOperator {
  Equal = 'equals',
  Contains = 'contains',
  Start = 'startsWith',
  End = 'endsWith',
  GreaterThan = 'gt',
  GreaterThanEqual = 'gte',
  LessThan = 'lt',
  LessThanEqual = 'lte',
  Between = 'between',
}

export type FieldFilters<Filters extends QueryOperator, T> = Partial<Record<Filters, T>>

export interface NumberFieldFilters
  extends FieldFilters<
    QueryOperator.GreaterThan | QueryOperator.LessThan | QueryOperator.Equal,
    number
  > {
  equals?: number
  lt?: number
  lte?: number
  gt?: number
  gte?: number
}

export interface StringFieldFilters
  extends FieldFilters<
    | QueryOperator.End
    | QueryOperator.Equal
    | QueryOperator.Contains
    | QueryOperator.Start,
    string
  > {
  equals?: string
  include?: string
  startsWith?: string // validation?
  endsWith?: string
}

export const TypeSymbol = Symbol('type')
export type TypeSymbolType = typeof TypeSymbol
export const FiltersSymbol = Symbol('filters')
export type FiltersSymbolType = typeof FiltersSymbol
export const KeyClassSymbol = Symbol('keyClass')
export type KeyClassSymbolType = typeof KeyClassSymbol

export interface StringField {
  filters: StringFieldFilters
  [TypeSymbol]: typeof String
  [KeyClassSymbol]?: 'jsonb_values_of_key'
}

export interface NumberField {
  filters: NumberFieldFilters
  [TypeSymbol]: typeof Number
}

@Injectable()
export class CommentService {
  @InjectRepository(CommentEntity)
  private commentRepo: Repository<CommentEntity>

  readonly validationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    validateCustomDecorators: true,
    // exceptionFactory: (e) => new TransformResourceDeserializationError(e),
  })

  async getList(
    { page, pageSize }: { page: number, pageSize: 10 },
    filters: { d: { content: string } },
  ) {
    let query = this.commentRepo
      .createQueryBuilder('c')
      .innerJoinAndSelect('r.signature', 's')
      .select(['c', 's.id', 's.signature', 's.signedAt', 's.user'])
    let i = 0
    for (const f in filters.d) {
      let key: string
      key = `r.d->>'${f}'`
      const subWhere = this.buildStringWhere(filters.d[f], key, `d${f.replace(/\W/g, '')}${i++}`)
      if (!subWhere) {
        continue
      }
      query = query.andWhere(subWhere.sql, subWhere.params)
    }

    const [items, itemsTotal] = await query
      .skip(page * pageSize)
      .take(pageSize)
      .orderBy({ 'c.id': 'ASC' })
      .cache(60000)
      .getManyAndCount()
    return {
      items,
      itemsTotal,
      page,
      pageSize,
    }
  }


  async create(content: string): Promise<CommentForList> {
    const comment = new CommentEntity()
    comment.d = {
      content,
      type: 'CommentEntity',
      version: '0.0.1-alpha-1',
      contentType: 'text',
    }
    return this.commentRepo.save(comment)
  }

  private buildStringWhere(
    field: StringField,
    key: string,
    pName: string,
  ): { sql: string; params: Record<string, string> } {
    if (QueryOperator.Equal in field.filters) {
      return {
        sql: `${key} = :${pName}`,
        params: { [pName]: field.filters[QueryOperator.Equal] },
      }
    }
    const params = {} as Record<string, string>
    const sql = [] as string[]
    if (field.filters[QueryOperator.End]) {
      sql.push(`${key} LIKE :${pName}End`)
      params[`${pName}End`] =
        '%' + field.filters[QueryOperator.End].replace(/%/g, '\\%').replace(/_/g, '\\_')
    }
    if (field.filters[QueryOperator.Start]) {
      sql.push(`${key} LIKE :${pName}Start`)
      params[`${pName}Start`] =
        field.filters[QueryOperator.Start].replace(/%/g, '\\%').replace(/_/g, '\\_') + '%'
    }
    if (field.filters[QueryOperator.Contains]) {
      sql.push(`${key} LIKE :${pName}Include`)
      params[`${pName}Include`] =
        '%' +
        field.filters[QueryOperator.Contains].replace(/%/g, '\\%').replace(/_/g, '\\_') +
        '%'
    }
    if (sql.length) {
      return { sql: sql.join(' AND '), params }
    }
    return undefined
  }

  async getComment(id: string) {
    return this.commentRepo.findOne({
      where: { id },
      relations: {
        signature: {
        },
      },
    })
  }
}
