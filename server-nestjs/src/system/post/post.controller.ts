import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PostService } from './post.service';
import { QueryPostDto } from './dto/query-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@UseGuards(JwtAuthGuard)
@Controller('system/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  list(@Query() query: QueryPostDto) {
    return this.postService.findAll(query);
  }

  @Get(':postId')
  get(@Param('postId') postId: string) {
    return this.postService.findOne(postId);
  }

  @Post()
  create(@Body() dto: CreatePostDto) {
    return this.postService.create(dto);
  }

  @Put(':postId')
  update(@Param('postId') postId: string, @Body() dto: UpdatePostDto) {
    return this.postService.update(postId, dto);
  }

  @Delete()
  remove(@Query('ids') ids: string) {
    const postIds = ids ? ids.split(',') : [];
    return this.postService.remove(postIds);
  }
}
