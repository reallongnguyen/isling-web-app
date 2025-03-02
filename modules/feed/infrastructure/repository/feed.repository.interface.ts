import {
  FeedItem,
  FeedQueryParams,
  FeedResponse,
  CreatePostDto,
} from '../../models';

/**
 * Feed repository interface
 */
export interface FeedRepository {
  /**
   * Get feed items
   * @param params Query parameters
   * @returns Feed response
   */
  getFeed(params?: FeedQueryParams): Promise<FeedResponse>;

  /**
   * Create a new post
   * @param data Post data
   * @returns Created feed item
   */
  createPost(data: CreatePostDto): Promise<FeedItem>;

  /**
   * Like a feed item
   * @param id Feed item ID
   * @returns Updated feed item
   */
  likeFeedItem(id: string): Promise<FeedItem>;

  /**
   * Unlike a feed item
   * @param id Feed item ID
   * @returns Updated feed item
   */
  unlikeFeedItem(id: string): Promise<FeedItem>;
}
