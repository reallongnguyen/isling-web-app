import { FeedApiRepository } from '../infrastructure';
import { apiAxios } from '@/modules/common/axios/axios-instance';
import { FeedItemType, PostFeedItem } from '../models';

// Mock axios
jest.mock('@/modules/common/axios/axios-instance', () => ({
  apiAxios: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('FeedApiRepository', () => {
  let repository: FeedApiRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new FeedApiRepository();
  });

  describe('getFeed', () => {
    it('should fetch feed items successfully with items format', async () => {
      // Mock response
      const mockResponse = {
        data: {
          items: [
            {
              id: '1',
              type: FeedItemType.POST,
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z',
              author: {
                id: 'user1',
                name: 'User 1',
                avatar: 'https://example.com/avatar.jpg',
              },
              content: {
                text: 'Test post',
              },
              stats: {
                likes: 10,
                replies: 5,
              },
            },
          ],
          nextCursor: 'next',
          hasMore: true,
        },
      };

      (apiAxios.get as jest.Mock).mockResolvedValue(mockResponse);

      // Call the method
      const result = await repository.getFeed({ limit: 10 });

      // Assertions
      expect(apiAxios.get).toHaveBeenCalledWith('/v1/feeds', {
        params: { limit: 10 },
      });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe('1');
      expect(result.items[0].type).toBe(FeedItemType.POST);
      expect(result.nextCursor).toBe('next');
      expect(result.hasMore).toBe(true);

      // Type assertion for post-specific properties
      const postItem = result.items[0] as PostFeedItem;
      expect(postItem.content.text).toBe('Test post');
    });

    it('should fetch feed items successfully with Collection format', async () => {
      // Mock response with Collection format
      const mockResponse = {
        data: {
          edges: [
            {
              id: '1',
              type: FeedItemType.POST,
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z',
              author: {
                id: 'user1',
                name: 'User 1',
                avatar: 'https://example.com/avatar.jpg',
              },
              content: {
                text: 'Test post',
              },
              stats: {
                likes: 10,
                replies: 5,
              },
            },
          ],
          pagination: {
            limit: 10,
            offset: 0,
            total: 20,
          },
        },
      };

      (apiAxios.get as jest.Mock).mockResolvedValue(mockResponse);

      // Call the method
      const result = await repository.getFeed({ limit: 10 });

      // Assertions
      expect(apiAxios.get).toHaveBeenCalledWith('/v1/feeds', {
        params: { limit: 10 },
      });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe('1');
      expect(result.items[0].type).toBe(FeedItemType.POST);
      expect(result.nextCursor).toBe('10'); // offset + limit
      expect(result.hasMore).toBe(true); // total > offset + limit

      // Type assertion for post-specific properties
      const postItem = result.items[0] as PostFeedItem;
      expect(postItem.content.text).toBe('Test post');
    });

    it('should handle cursor conversion to offset', async () => {
      // Mock response with Collection format
      const mockResponse = {
        data: {
          edges: [],
          pagination: {
            limit: 10,
            offset: 10,
            total: 20,
          },
        },
      };

      (apiAxios.get as jest.Mock).mockResolvedValue(mockResponse);

      // Call the method with cursor as a number string
      await repository.getFeed({ cursor: '10', limit: 10 });

      // Assertions - cursor should be converted to offset
      expect(apiAxios.get).toHaveBeenCalledWith('/v1/feeds', {
        params: { offset: 10, limit: 10 },
      });
    });

    it('should handle malformed response data gracefully', async () => {
      // Mock response with missing items
      const mockResponse = {
        data: {
          // items is missing
          nextCursor: null,
          hasMore: false,
        },
      };

      (apiAxios.get as jest.Mock).mockResolvedValue(mockResponse);

      // Call the method
      const result = await repository.getFeed();

      // Assertions
      expect(result.items).toEqual([]);
      expect(result.nextCursor).toBeNull();
      expect(result.hasMore).toBe(false);
    });

    it('should handle completely empty response data', async () => {
      // Mock response with empty data
      const mockResponse = {
        data: {},
      };

      (apiAxios.get as jest.Mock).mockResolvedValue(mockResponse);

      // Call the method
      const result = await repository.getFeed();

      // Assertions
      expect(result.items).toEqual([]);
      expect(result.nextCursor).toBeUndefined();
      expect(result.hasMore).toBe(false);
    });

    it('should handle errors when fetching feed', async () => {
      // Mock error
      const mockError = new Error('API error');
      (apiAxios.get as jest.Mock).mockRejectedValue(mockError);

      // Call the method and expect it to throw
      await expect(repository.getFeed()).rejects.toThrow('API error');

      // Assertions
      expect(apiAxios.get).toHaveBeenCalledWith('/v1/feeds', {
        params: {},
      });
    });
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      // Mock response
      const mockResponse = {
        data: {
          id: '1',
          type: FeedItemType.POST,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          author: {
            id: 'user1',
            name: 'User 1',
            avatar: 'https://example.com/avatar.jpg',
          },
          content: {
            text: 'New post',
          },
          stats: {
            likes: 0,
            replies: 0,
          },
        },
      };

      (apiAxios.post as jest.Mock).mockResolvedValue(mockResponse);

      // Call the method
      const result = await repository.createPost({ text: 'New post' });

      // Assertions
      expect(apiAxios.post).toHaveBeenCalledWith('/v1/posts', {
        text: 'New post',
      });
      expect(result.id).toBe('1');
      expect(result.type).toBe(FeedItemType.POST);

      // Type assertion for post-specific properties
      const postItem = result as PostFeedItem;
      expect(postItem.content.text).toBe('New post');
    });

    it('should handle errors when creating a post', async () => {
      // Mock error
      const mockError = new Error('API error');
      (apiAxios.post as jest.Mock).mockRejectedValue(mockError);

      // Call the method and expect it to throw
      await expect(repository.createPost({ text: 'New post' })).rejects.toThrow(
        'API error'
      );

      // Assertions
      expect(apiAxios.post).toHaveBeenCalledWith('/v1/posts', {
        text: 'New post',
      });
    });
  });

  describe('likeFeedItem', () => {
    it('should like a feed item successfully', async () => {
      // Mock response
      const mockResponse = {
        data: {
          id: '1',
          type: FeedItemType.POST,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          author: {
            id: 'user1',
            name: 'User 1',
            avatar: 'https://example.com/avatar.jpg',
          },
          content: {
            text: 'Test post',
          },
          stats: {
            likes: 11, // Incremented
            replies: 5,
          },
        },
      };

      (apiAxios.post as jest.Mock).mockResolvedValue(mockResponse);

      // Call the method
      const result = await repository.likeFeedItem('1');

      // Assertions
      expect(apiAxios.post).toHaveBeenCalledWith('/v1/feeds/1/like');
      expect(result.id).toBe('1');

      // Type assertion for post-specific properties
      const postItem = result as PostFeedItem;
      expect(postItem.stats.likes).toBe(11);
    });
  });

  describe('unlikeFeedItem', () => {
    it('should unlike a feed item successfully', async () => {
      // Mock response
      const mockResponse = {
        data: {
          id: '1',
          type: FeedItemType.POST,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          author: {
            id: 'user1',
            name: 'User 1',
            avatar: 'https://example.com/avatar.jpg',
          },
          content: {
            text: 'Test post',
          },
          stats: {
            likes: 9, // Decremented
            replies: 5,
          },
        },
      };

      (apiAxios.delete as jest.Mock).mockResolvedValue(mockResponse);

      // Call the method
      const result = await repository.unlikeFeedItem('1');

      // Assertions
      expect(apiAxios.delete).toHaveBeenCalledWith('/v1/feeds/1/like');
      expect(result.id).toBe('1');

      // Type assertion for post-specific properties
      const postItem = result as PostFeedItem;
      expect(postItem.stats.likes).toBe(9);
    });
  });
});
