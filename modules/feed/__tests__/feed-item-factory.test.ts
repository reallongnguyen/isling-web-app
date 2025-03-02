import { ApiContentType, FeedItemFactory, FeedItemType } from '../models';

describe('FeedItemFactory', () => {
  describe('fromResponse', () => {
    it('should handle legacy post format correctly', () => {
      const mockData = {
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
      };

      const result = FeedItemFactory.fromResponse(mockData);

      expect(result.id).toBe('1');
      expect(result.type).toBe(FeedItemType.POST);
      expect(result.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(result.updatedAt).toBe('2023-01-01T00:00:00Z');
      expect(result.author).toEqual({
        id: 'user1',
        name: 'User 1',
        avatar: 'https://example.com/avatar.jpg',
      });
      expect(result.content).toEqual({
        text: 'Test post',
        media: [],
      });
      if (result.type === FeedItemType.POST) {
        expect(result.stats).toEqual({
          likes: 10,
          replies: 5,
        });
      }
    });

    it('should handle legacy emotion format correctly', () => {
      const mockData = {
        id: '1',
        type: FeedItemType.EMOTION,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        author: {
          id: 'user1',
          name: 'User 1',
          avatar: 'https://example.com/avatar.jpg',
        },
        content: {
          type: 'happy',
        },
      };

      const result = FeedItemFactory.fromResponse(mockData);

      expect(result.id).toBe('1');
      expect(result.type).toBe(FeedItemType.EMOTION);
      expect(result.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(result.updatedAt).toBe('2023-01-01T00:00:00Z');
      expect(result.author).toEqual({
        id: 'user1',
        name: 'User 1',
        avatar: 'https://example.com/avatar.jpg',
      });
      if (result.type === FeedItemType.EMOTION) {
        expect(result.content).toEqual({
          type: 'happy',
        });
      }
    });

    it('should handle new API post format correctly', () => {
      const mockData = {
        id: '1',
        contentType: ApiContentType.POST,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        publishedPost: {
          id: 'post1',
          title: 'Test Post',
          excerpt: 'This is a test post',
          likeCount: 10,
          replyCount: 5,
          author: {
            id: 'user1',
            firstName: 'John',
            lastName: 'Doe',
            avatar: 'https://example.com/avatar.jpg',
          },
          publishedAt: '2023-01-01T00:00:00Z',
        },
      };

      const result = FeedItemFactory.fromResponse(mockData);

      expect(result.id).toBe('1');
      expect(result.type).toBe(FeedItemType.POST);
      expect(result.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(result.updatedAt).toBe('2023-01-01T00:00:00Z');
      expect(result.author).toEqual({
        id: 'user1',
        name: 'John Doe',
        avatar: 'https://example.com/avatar.jpg',
      });
      expect(result.content).toEqual({
        text: 'This is a test post',
        media: [],
      });
      if (result.type === FeedItemType.POST) {
        expect(result.stats).toEqual({
          likes: 10,
          replies: 5,
        });
      }
    });

    it('should handle new API emotion format correctly', () => {
      const mockData = {
        id: '1',
        contentType: ApiContentType.USER_EMOTION,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        userEmotion: {
          id: 'emotion1',
          emotion: 'happy',
          intensity: 3,
          date: '2023-01-01T00:00:00Z',
          user: {
            id: 'user1',
            firstName: 'John',
            lastName: 'Doe',
            avatar: 'https://example.com/avatar.jpg',
          },
        },
      };

      const result = FeedItemFactory.fromResponse(mockData);

      expect(result.id).toBe('1');
      expect(result.type).toBe(FeedItemType.EMOTION);
      expect(result.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(result.updatedAt).toBe('2023-01-01T00:00:00Z');
      expect(result.author).toEqual({
        id: 'user1',
        name: 'John Doe',
        avatar: 'https://example.com/avatar.jpg',
      });
      if (result.type === FeedItemType.EMOTION) {
        expect(result.content).toEqual({
          type: 'happy',
        });
      }
    });

    it('should handle missing fields gracefully in new API format', () => {
      const mockData = {
        id: '1',
        contentType: ApiContentType.POST,
        // Missing createdAt and updatedAt
        publishedPost: {
          // Missing most fields
        },
      };

      const result = FeedItemFactory.fromResponse(mockData);

      expect(result.id).toBe('1');
      expect(result.type).toBe(FeedItemType.POST);
      expect(result.createdAt).toBeDefined(); // Should default to current date
      expect(result.updatedAt).toBeDefined();
      expect(result.author).toEqual({
        id: 'unknown',
        name: 'Unknown User',
        avatar: '',
      });
      expect(result.content).toEqual({
        text: '',
        media: [],
      });
      if (result.type === FeedItemType.POST) {
        expect(result.stats).toEqual({
          likes: 0,
          replies: 0,
        });
      }
    });

    it('should handle unknown content type in new API format', () => {
      const mockData = {
        id: '1',
        contentType: 'UNKNOWN_TYPE', // Unknown type
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      // Should log a warning but not throw
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = FeedItemFactory.fromResponse(mockData);

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(result.type).toBe(FeedItemType.POST); // Default to POST

      consoleWarnSpy.mockRestore();
    });

    it('should throw error for invalid data', () => {
      const mockData = {
        // Missing id and type/contentType
      };

      expect(() => FeedItemFactory.fromResponse(mockData)).toThrow(
        'Invalid feed item data: missing required fields'
      );
    });
  });
});
