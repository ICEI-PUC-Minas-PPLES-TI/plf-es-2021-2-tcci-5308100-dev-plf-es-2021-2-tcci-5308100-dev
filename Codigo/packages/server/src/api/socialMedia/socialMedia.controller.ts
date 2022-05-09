import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { UtilsService } from '~/utils/utils.service';
import { SocialMediaService } from './socialMedia.service';
import { SocialMediaParamService } from '../socialMediaParam/socialMediaParam.service';
import { In } from 'typeorm';
import {
  GetAllSocialMediaPostsParams,
  GetAllSocialMediaPostsPayload,
  PostStatus,
  SocialMediaParamType,
  UpdatePostStatusDTO,
  UpdatePostStatusPayload,
  UpdatePostStatusValidator,
} from '@sec/common';
import { PostService } from '../post/post.service';
import { GetAvailablePostsPayload } from '@sec/common';
import { Roles } from '~/authentication/role.guard';
import { SocialMedia } from '@Models/SocialMedia.entity';

@Controller('social-media')
export class SocialMediaController {
  constructor(
    private readonly socialMediaService: SocialMediaService,
    private readonly socialMediaParamService: SocialMediaParamService,
    private readonly postService: PostService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get()
  public async searchPublications() {
    try {
      const hashtags =
        await this.socialMediaParamService.prepareSocialMediaParam(
          SocialMediaParamType.HASHTAG,
        );
      // const accounts = await this.socialMediaParamService.prepareSocialMediaParam(
      //   SocialMediaParamType.ACCOUNT,
      // );

      //Hashtags
      const instagramHashtagsPosts =
        await this.socialMediaService.fetchPostsByHashtagsOnSocialSearcher({
          q: hashtags.INSTAGRAM.map(({ param }) => param),
          networks: ['instagram'],
        });
      const twitterHashtagsPosts =
        await this.socialMediaService.fetchPostsByHashtagsOnSocialSearcher({
          q: hashtags.TWITTER.map(({ param }) => param),
          networks: ['twitter'],
        });
      // const tikTokHashtagsPosts =
      //   await this.socialMediaService.fetchPostsByHashtagsOnTikApi({
      //     q: hashtags.TIKTOK.map(({ param }) => param),
      //   });

      //Accounts
      // const instagramAccountsPosts =
      //   await this.socialMediaService.fetchPostsByAccount(
      //     accounts.instagram.map(({ param }) => param),
      //     ['instagram'],
      //   );
      // const twitterAccountsPosts =
      //   await this.socialMediaService.fetchPostsByAccount(
      //     accounts.twitter.map(({ param }) => param),
      //     ['twitter'],
      //   );

      return this.utilsService.apiResponseSuccess<any>({
        message: 'A lista de publicações disponíveis foi atualizada.',
        payload: { instagramHashtagsPosts, twitterHashtagsPosts },
      });
    } catch (error) {
      return this.utilsService.apiResponseFail({
        message:
          'Ocorreu um erro ao atualizar a lista de publicações disponíveis.',
      });
    }
  }

  @Post('/search-user-id')
  public async searchUserIdByAccountName() {
    return 'METHOD NOT IMPLEMENTED';
  }

  @Get('all-posts')
  public async getAllSocialMediaPosts(
    @Query() queries: GetAllSocialMediaPostsParams,
  ) {
    const posts = await this.postService.findWithRelations({
      where: { status: In(queries.status || []) },
      relations: ['socialMedia'],
    });

    return this.utilsService.apiResponse<GetAllSocialMediaPostsPayload>({
      status: !!posts ? 'SUCCESS' : 'FAIL',
      message: 'Lista com todos os desafios cadastrados.',
      payload: { posts },
    });
  }

  @Get('posts')
  @Roles('*')
  public async getAvailablePosts() {
    try {
      const posts = await this.postService
        .getRepository()
        .createQueryBuilder('posts')
        .innerJoinAndSelect('posts.socialMedia', 'socialMedia')
        .where('status = :status', { status: PostStatus.APPROVED })
        .orderBy('RANDOM()')
        .limit(200)
        .getMany();

      return this.utilsService.apiResponseSuccess<GetAvailablePostsPayload>({
        message: 'Lista de publicações aprovadas.',
        payload: {
          posts: posts.map((post) => ({ ...post, socialMedia: undefined })),
        },
      });
    } catch (error) {
      return this.utilsService.apiResponseFail({
        message: 'Erro ao buscar publicações.',
      });
    }
  }

  @Put('update-post-status')
  public async updatePostStatus(@Body() body: UpdatePostStatusDTO) {
    const { success, dto, error } = await UpdatePostStatusValidator(body);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const post = await this.postService.updateById(dto.id, {
      status: dto.status,
    });

    return this.utilsService.apiResponseSuccessOrFail<UpdatePostStatusPayload>({
      success: !!post,
      onSuccess: {
        message: 'O status da publicação foi atualizado',
        payload: { post },
      },
      onFail: {
        message: 'Ocorreu um erro ao atualizar o status da publicação.',
      },
    });
  }
}
