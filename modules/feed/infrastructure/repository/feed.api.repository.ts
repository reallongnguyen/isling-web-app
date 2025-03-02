import { apiAxios } from '@/modules/common/axios/axios-instance';
import {
  Collection,
  FeedItem,
  FeedItemFactory,
  FeedQueryParams,
  FeedResponse,
  CreatePostDto,
} from '../../models';
import { FeedRepository } from './feed.repository.interface';

/**
 * Feed API repository implementation
 */
export class FeedApiRepository implements FeedRepository {
  /**
   * Get feed items
   * @param params Query parameters
   * @returns Feed response
   */
  async getFeed(params?: FeedQueryParams): Promise<FeedResponse> {
    try {
      // Convert cursor to offset if it's a number string
      const queryParams = { ...params };

      // If cursor is a number string, use it as offset
      if (queryParams.cursor && !isNaN(Number(queryParams.cursor))) {
        queryParams.offset = Number(queryParams.cursor);
        delete queryParams.cursor;
      }

      const response = await apiAxios.get('/v1/feeds', { params: queryParams });

      console.log('response', response);
      // Check if response matches Collection format
      if (
        response.data &&
        'edges' in response.data &&
        'pagination' in response.data
      ) {
        const collection = response.data as Collection<Record<string, unknown>>;

        return {
          items: Array.isArray(collection.edges)
            ? collection.edges.map((item) => FeedItemFactory.fromResponse(item))
            : [],
          // Use offset + limit as the next cursor if there are more items
          nextCursor:
            collection.pagination.offset + collection.pagination.limit <
            collection.pagination.total
              ? String(
                  collection.pagination.offset + collection.pagination.limit
                )
              : undefined,
          hasMore:
            collection.pagination.offset + collection.pagination.limit <
            collection.pagination.total,
        };
      }

      // Fallback to previous implementation for backward compatibility
      return {
        items: Array.isArray(response.data?.items)
          ? response.data.items.map((item: Record<string, unknown>) =>
              FeedItemFactory.fromResponse(item)
            )
          : [],
        nextCursor: response.data?.nextCursor,
        hasMore: !!response.data?.hasMore,
      };
    } catch (error) {
      console.error('Error fetching feed:', error);
      throw error;
    }
  }

  /**
   * Create a new post
   * @param data Post data
   * @returns Created feed item
   */
  async createPost(data: CreatePostDto): Promise<FeedItem> {
    try {
      const response = await apiAxios.post('/v1/posts', data);

      if (!response.data) {
        throw new Error('Invalid response from server when creating post');
      }

      return FeedItemFactory.fromResponse(response.data);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  /**
   * Like a feed item
   * @param id Feed item ID
   * @returns Updated feed item
   */
  async likeFeedItem(id: string): Promise<FeedItem> {
    try {
      const response = await apiAxios.post(`/v1/feeds/${id}/like`);

      if (!response.data) {
        throw new Error('Invalid response from server when liking feed item');
      }

      return FeedItemFactory.fromResponse(response.data);
    } catch (error) {
      console.error('Error liking feed item:', error);
      throw error;
    }
  }

  /**
   * Unlike a feed item
   * @param id Feed item ID
   * @returns Updated feed item
   */
  async unlikeFeedItem(id: string): Promise<FeedItem> {
    try {
      const response = await apiAxios.delete(`/v1/feeds/${id}/like`);

      if (!response.data) {
        throw new Error('Invalid response from server when unliking feed item');
      }

      return FeedItemFactory.fromResponse(response.data);
    } catch (error) {
      console.error('Error unliking feed item:', error);
      throw error;
    }
  }
}
