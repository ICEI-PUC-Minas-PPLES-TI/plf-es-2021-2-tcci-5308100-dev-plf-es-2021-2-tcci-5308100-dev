import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { SocialMedia } from '@Models/SocialMedia.entity';
import axios from 'axios';
import { PostService } from '../post/post.service';
import { PostStatus, SocialMediaName, SocialMediaParamType } from '@sec/common';
import { SocialMediaParamService } from '../socialMediaParam/socialMediaParam.service';

@Injectable()
export class SocialMediaService extends BaseService<SocialMedia> {
  constructor(
    @InjectRepository(SocialMedia)
    private readonly socialMediaRepository: Repository<SocialMedia>,
    private readonly postService: PostService,
    private readonly socialMediaParamService: SocialMediaParamService,
  ) {
    super(socialMediaRepository, []);
    this.socialMediaRepository = socialMediaRepository;
  }

  public async fetchPostsByHashtagsOnSocialSearcher(
    {
      q,
      networks,
    }: {
      q: string[];
      networks: string[];
    },
    {
      limit = 80,
      page,
      requestid,
    }: { limit?: number } & (
      | { page?: undefined; requestid?: undefined }
      | { page: number; requestid: string }
    ) = {},
  ) {
    if (limit < 0 || limit > 100) return undefined;

    try {
      const { data } = await axios.get(
        'https://api.social-searcher.com/v2/search',
        {
          params: {
            q: q.join('OR'),
            lang: 'pt-BR',
            network: networks.join(','),
            limit: limit,
            page: page,
            requestid: requestid,
          },
        },
      );
      // const data: { posts: SocialSearcherPosts[] } = temp as any;

      if (data.posts) {
        const posts = await this.upsertPosts(data.posts);

        return posts;
      } else {
        return undefined;
      }
    } catch (error) {
      console.dir(error);
      return undefined;
    }
  }

  public async fetchPostsByHashtagsOnTikApi(
    {
      q,
    }: {
      q: string[];
    },
    {
      limit = 80,
      page,
    }: { limit?: number } & ({ page?: undefined } | { page: number }) = {},
  ) {
    try {
      const { data } = await axios.get('https://api.tikapi.io/public/hashtag', {
        params: {
          name: q.join('OR'),
          country: 'br',
          count: limit,
          cursor: page,
        },
      });
    } catch (error) {
      console.dir(error);
      return undefined;
    }
  }

  public async fetchPostsByAccount(
    {
      userId,
      networks,
    }: {
      userId: string;
      networks: string[];
    },
    {
      limit = 20,
      page,
      requestid,
    }: { limit: number } & (
      | { page: undefined; requestid: undefined }
      | { page: number; requestid: string }
    ),
  ) {
    if (limit < 0 || limit > 100) return undefined;

    try {
      const { data } = await axios.get(
        `https://api.social-searcher.com/v2/users/${userId}/posts`,
        {
          params: {
            lang: 'pt-BR',
            network: networks.join(','),
            limit: limit,
            page: page,
            requestid: requestid,
          },
        },
      );
      // const data = temp;

      if (data.posts) {
        const posts = await this.upsertPosts(data.posts);

        return posts;
      } else {
        return undefined;
      }
    } catch (error) {
      return undefined;
    }
  }

  public async searchUsersByName(accountName: string, networks: string[]) {
    try {
      return undefined;

      const { data } = await axios.get(
        'https://api.social-searcher.com/v2/users',
        {
          params: {
            q: accountName,
            network: networks.join(','),
          },
        },
      );

      return data;
    } catch (error) {
      return undefined;
    }
  }

  private async upsertPosts(posts: SocialSearcherPosts[]) {
    const [instagram, twitter] = await Promise.all([
      this.findOne({ name: SocialMediaName.INSTAGRAM }),
      this.findOne({ name: SocialMediaName.TWITTER }),
    ]);

    const socialMedias = {
      instagram,
      twitter,
    };

    const socialMediaParam =
      await this.socialMediaParamService.getParamsWithApproveAll();

    const hashtagsWithApproveAll = socialMediaParam
      .filter(({ type }) => type === SocialMediaParamType.ACCOUNT)
      .map(({ param }) => param);

    const accountsWithApproveAll = socialMediaParam
      .filter(({ type }) => type === SocialMediaParamType.HASHTAG)
      .map(({ param }) => param);

    const postsSaved = await this.postService.getRepository().upsert(
      posts
        .filter((post) => !!post)
        .map((post) => ({
          token: post.postid,
          status:
            accountsWithApproveAll.includes(post.user.userid) ||
            post.tags?.some(({ text }) => hashtagsWithApproveAll.includes(text))
              ? PostStatus.APPROVED
              : PostStatus.UNDER_REVIEW,
          url: post.url,
          socialMedia: socialMedias[post.network].id,
        })),
      { conflictPaths: ['token'], skipUpdateIfNoValuesChanged: true },
    );

    return postsSaved;
  }
}

type SocialSearcherPosts = {
  network: string;
  posted: string;
  postid: string;
  text: string;
  type: string;
  sentiment: string;
  image: string;
  url: string;
  user: {
    userid: string;
  };
  popularity: {
    name: string;
    count: number;
  }[];
  tags?: {
    text: string;
    url: string;
  }[];
  user_mentions?: {
    text: string;
    url: string;
  }[];
};
