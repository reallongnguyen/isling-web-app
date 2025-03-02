// Temporary type definition until the actual Profile type is available
interface Profile {
  id: string;
  name: string;
  avatar: string;
}

/**
 * Feed item content types
 */
export enum FeedItemType {
  POST = 'post',
  EMOTION = 'emotion',
}

/**
 * API content types (from API response)
 */
export enum ApiContentType {
  POST = 'POST',
  USER_EMOTION = 'USER_EMOTION',
}

/**
 * Base feed item interface
 */
export interface BaseFeedItem {
  id: string;
  type: FeedItemType;
  createdAt: string;
  updatedAt: string;
  author: Profile;
}

/**
 * Post content interface
 */
export interface PostContent {
  text: string;
  media?: string[];
}

/**
 * Emotion content interface
 */
export interface EmotionContent {
  type: string;
  note?: string;
}

/**
 * Post feed item
 */
export interface PostFeedItem extends BaseFeedItem {
  type: FeedItemType.POST;
  content: PostContent;
  stats: {
    likes: number;
    replies: number;
  };
}

/**
 * Emotion feed item
 */
export interface EmotionFeedItem extends BaseFeedItem {
  type: FeedItemType.EMOTION;
  content: EmotionContent;
}

/**
 * Union type for all feed item types
 */
export type FeedItem = PostFeedItem | EmotionFeedItem;

/**
 * Pagination information from API
 */
export interface Pagination {
  limit: number;
  offset: number;
  total: number;
}

/**
 * Collection response from API
 */
export interface Collection<T> {
  edges: T[];
  pagination: Pagination;
}

/**
 * Feed response from API
 */
export interface FeedResponse {
  items: FeedItem[];
  nextCursor?: string;
  hasMore: boolean;
}

/**
 * Feed API response data interface
 */
interface FeedItemResponseData {
  id?: string;
  type?: string;
  contentType?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: {
    id: string;
    name: string;
    avatar: string;
  };
  content?: {
    text?: string;
    media?: string[];
    type?: string;
  };
  stats?: {
    likes?: number;
    replies?: number;
  };
  // New API format fields
  publishedPost?: {
    id?: string;
    title?: string;
    excerpt?: string;
    likeCount?: number;
    replyCount?: number;
    author?: {
      id?: string;
      firstName?: string;
      lastName?: string;
      avatar?: string;
    };
    publishedAt?: string;
  };
  userEmotion?: {
    id?: string;
    emotion?: string;
    note?: string;
    intensity?: number;
    date?: string;
    user?: {
      id?: string;
      firstName?: string;
      lastName?: string;
      avatar?: string;
    };
  };
}

/**
 * Feed item factory
 */
export class FeedItemFactory {
  /**
   * Create a feed item from API response
   * @param data API response data
   * @returns Feed item
   */
  static fromResponse(data: FeedItemResponseData): FeedItem {
    // Check if we're dealing with the new API format
    if (data.contentType) {
      return this.fromNewApiFormat(data);
    }

    // Handle legacy format
    return this.fromLegacyFormat(data);
  }

  /**
   * Create a feed item from the new API format
   * @param data API response data in the new format
   * @returns Feed item
   */
  private static fromNewApiFormat(data: FeedItemResponseData): FeedItem {
    // Validate required fields
    if (!data || !data.id || !data.contentType) {
      throw new Error('Invalid feed item data: missing required fields');
    }

    // Ensure dates are valid
    const createdAt = data.createdAt || new Date().toISOString();
    const updatedAt = data.updatedAt || createdAt;

    switch (data.contentType) {
      case ApiContentType.POST: {
        // Extract post data
        const post = data.publishedPost || {};

        // Create author from post author
        const postAuthor = post.author || {};
        const author: Profile = {
          id: postAuthor.id || 'unknown',
          name:
            [postAuthor.firstName, postAuthor.lastName]
              .filter(Boolean)
              .join(' ') || 'Unknown User',
          avatar: postAuthor.avatar || '',
        };

        return {
          id: data.id,
          type: FeedItemType.POST,
          createdAt,
          updatedAt,
          author,
          content: {
            text: post.excerpt || '',
            media: [], // Media not available in new format
          },
          stats: {
            likes: post.likeCount || 0,
            replies: post.replyCount || 0,
          },
        };
      }

      case ApiContentType.USER_EMOTION: {
        // Extract emotion data
        const emotion = data.userEmotion || {};

        // Create author from emotion user
        const emotionUser = emotion.user || {};
        const author: Profile = {
          id: emotionUser.id || 'unknown',
          name:
            [emotionUser.firstName, emotionUser.lastName]
              .filter(Boolean)
              .join(' ') || 'Unknown User',
          avatar: emotionUser.avatar || '',
        };

        return {
          id: data.id,
          type: FeedItemType.EMOTION,
          createdAt,
          updatedAt,
          author,
          content: {
            type: emotion.emotion || 'neutral',
            note: emotion.note || '',
          },
        };
      }

      default:
        // Default to post type if unknown
        console.warn(
          `Unknown feed item content type: ${data.contentType}, defaulting to post`
        );
        return {
          id: data.id,
          type: FeedItemType.POST,
          createdAt,
          updatedAt,
          author: {
            id: 'unknown',
            name: 'Unknown User',
            avatar: '',
          },
          content: {
            text: '',
            media: [],
          },
          stats: {
            likes: 0,
            replies: 0,
          },
        };
    }
  }

  /**
   * Create a feed item from the legacy API format
   * @param data API response data in the legacy format
   * @returns Feed item
   */
  private static fromLegacyFormat(data: FeedItemResponseData): FeedItem {
    // Validate required fields
    if (!data || !data.id || !data.type) {
      throw new Error('Invalid feed item data: missing required fields');
    }

    // Ensure author exists
    const author = data.author || {
      id: 'unknown',
      name: 'Unknown User',
      avatar: '',
    };

    // Ensure dates are valid
    const createdAt = data.createdAt || new Date().toISOString();
    const updatedAt = data.updatedAt || createdAt;

    switch (data.type) {
      case FeedItemType.POST:
        // Ensure content exists
        const postContent = data.content || {};

        return {
          id: data.id,
          type: FeedItemType.POST,
          createdAt,
          updatedAt,
          author,
          content: {
            text: postContent.text || '',
            media: Array.isArray(postContent.media) ? postContent.media : [],
          },
          stats: {
            likes: data.stats?.likes || 0,
            replies: data.stats?.replies || 0,
          },
        };
      case FeedItemType.EMOTION:
        // Ensure content exists
        const emotionContent = data.content || {};

        return {
          id: data.id,
          type: FeedItemType.EMOTION,
          createdAt,
          updatedAt,
          author,
          content: {
            type: emotionContent.type || 'neutral',
          },
        };
      default:
        // Default to post type if unknown
        console.warn(
          `Unknown feed item type: ${data.type}, defaulting to post`
        );
        return {
          id: data.id,
          type: FeedItemType.POST,
          createdAt,
          updatedAt,
          author,
          content: {
            text: data.content?.text || '',
            media: Array.isArray(data.content?.media) ? data.content.media : [],
          },
          stats: {
            likes: data.stats?.likes || 0,
            replies: data.stats?.replies || 0,
          },
        };
    }
  }
}
