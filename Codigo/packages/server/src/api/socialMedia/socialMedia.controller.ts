import { Body, Controller, Get, Post, Put } from '@nestjs/common';
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
    const hashtags = await this.socialMediaParamService.prepareSocialMediaParam(
      SocialMediaParamType.HASHTAG,
    );
    // const accounts = await this.socialMediaParamService.prepareSocialMediaParam(
    //   SocialMediaParamType.ACCOUNT,
    // );

    //Hashtags
    const instagramHashtagsPosts =
      await this.socialMediaService.fetchPostsByHashtags({
        q: hashtags.instagram.map(({ param }) => param),
        networks: ['instagram'],
      });
    const twitterHashtagsPosts =
      await this.socialMediaService.fetchPostsByHashtags({
        q: hashtags.twitter.map(({ param }) => param),
        networks: ['twitter'],
      });
    const mixedHashtagsPosts =
      await this.socialMediaService.fetchPostsByHashtags({
        q: hashtags.mixed.map(({ param }) => param),
        networks: ['twitter', 'instagram'],
      });

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
    // const mixedAccountsPosts =
    //   await this.socialMediaService.fetchPostsByAccount(
    //     accounts.mixed.map(({ param }) => param),
    //     ['twitter', 'instagram'],
    //   );

    return {
      hashtags,
      instagramHashtagsPosts,
      twitterHashtagsPosts,
      mixedHashtagsPosts,
      // accounts,
      // instagramAccountsPosts,
      // twitterAccountsPosts,
      // mixedAccountsPosts,
    };
  }

  @Post('/search-user-id')
  public async searchUserIdByAccountName() {
    return 'METHOD NOT IMPLEMENTED';
  }

  @Get('all-posts')
  public async getAllSocialMediaPosts(param?: GetAllSocialMediaPostsParams) {
    const posts = await this.postService.findWithRelations({
      where: param?.status ? { status: In(param.status) } : undefined,
      relations: ['socialMedia'],
    });

    return this.utilsService.apiResponse<GetAllSocialMediaPostsPayload>({
      status: !!posts ? 'SUCCESS' : 'FAIL',
      message: 'Lista com todos os desafios cadastrados.',
      payload: { posts },
    });
  }

  @Get('posts')
  public async getAvailablePosts() {
    try {
      const posts = await this.postService
        .getRepository()
        .createQueryBuilder('posts')
        .where('status = :status', { status: PostStatus.APPROVED })
        .orderBy('RANDOM()')
        .limit(200)
        .getMany();

      return this.utilsService.apiResponse<GetAvailablePostsPayload>({
        status: !!posts ? 'SUCCESS' : 'FAIL',
        message: 'Lista de publicações aprovadas.',
        payload: { posts },
      });
    } catch (error) {}
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
        payload: null,
      },
      onFail: {
        message: 'Ocorreu um erro ao atualizar o status da publicação.',
      },
    });
  }
}
