import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post, Query,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger'
import { instanceToPlain } from 'class-transformer'
import * as stringify from 'json-stable-stringify'
import { UUID_V4_REGEX } from '../consts'
import { ValidBody } from '../validBodyPipe'
import {
  CommentDataBodyPayload,
  CommentEntity,
  CommentForList,
  CommentService,
  QueryOperator,
} from './comment.service'

@Controller('/api/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {
  }

  @ApiResponse({
    description: `#### get single comment`,
  })
  @Get('/:id')
  async getComment(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Find by parameter id not provided')
    }
    if (!id.match(UUID_V4_REGEX)) {
      throw new BadRequestException('Find by parameter id contain special characters')
    }
    return instanceToPlain(await this.commentService.getComment(id), {
      groups: ['comment', 'entity', 'user'],
    })
  }

  @Get()
  getComments(
    @Query() query: { page: number, pageSize: 10 },
    @Query('content') content: string,
  ) {
    return this.commentService.getList(query, {d: {content: {filters: {[QueryOperator.Equal]: content}}}})
  }

  @Post('/validate')
  @ApiCreatedResponse({
    type: CommentDataBodyPayload,
  })
  @HttpCode(HttpStatus.OK)
  @Header('content-type', 'application/json; charset=utf-8')
  async validateComment(
    @ValidBody
      createCommentDto: CommentDataBodyPayload,
  ): Promise<CommentDataBodyPayload> {
    return stringify(createCommentDto)
  }

  @Patch()
  @ApiCreatedResponse({
    type: CommentEntity,
    status: HttpStatus.OK,
  })
  async postComment(@Body() data: string): Promise<CommentForList> {
    return instanceToPlain(await this.commentService.create(data), {
      groups: ['comment', 'entity'],
    }) as CommentForList
  }
}
