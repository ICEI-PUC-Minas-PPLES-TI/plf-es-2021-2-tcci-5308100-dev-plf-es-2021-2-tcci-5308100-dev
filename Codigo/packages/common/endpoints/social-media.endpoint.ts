import { Post, PostStatus } from '../models/Post';

export type GetAvailablePostsPayload = {
  posts: Post[];
};

export type GetAllSocialMediaPostsParams = {
  status?: PostStatus[];
};

export type GetAllSocialMediaPostsPayload = {
  posts: Post[];
};

export type UpdatePostStatusPayload = {
  post: Post;
};
