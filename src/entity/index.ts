export * from './comment.entity'
export * from './signature.entity'
export * from './report.entity'

// import { CommentSchema } from './comment.entity'
import { CommentEntity } from './comment.entity'
import { SignatureEntity } from './signature.entity'
// import { ReportSchema } from './report.entity'
import { ReportEntity } from './report.entity'
// import { UgcSchema } from './ugc.entity'
import { UgcEntityInner } from './ugc.entity'

export const entities = [
  // UgcSchema,
  UgcEntityInner,
  // CommentSchema,
  CommentEntity,
  SignatureEntity,
  // ReportEntity,
  // ReportSchema,
  ReportEntity,
]
