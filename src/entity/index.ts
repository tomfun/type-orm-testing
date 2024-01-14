export * from './comment.entity'
export * from './signature.entity'
export * from './report.entity'

// import { CommentSchema } from './comment.entity'
import { CommentEntity, CommentSchema } from './comment.entity'
import { SignatureEntity, SignatureSchema } from './signature.entity'
// import { ReportSchema } from './report.entity'
// import { ReportEntity } from './report.entity'
import { UgcSchema } from './ugc.entity'

export const entities = [
  UgcSchema,
  SignatureSchema,
  // SignatureEntity,
  // CommentSchema,
  // CommentEntity,
  CommentSchema,
  // ReportEntity,
  // ReportSchema,
  // ReportEntity,
]
