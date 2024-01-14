import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { entities } from '../entity'
import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [CommentController,],
  providers: [CommentService,],
  exports: [],
})
export class CoreModule {}
