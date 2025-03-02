/**
 * Feed query parameters
 */
export interface FeedQueryParams {
  /**
   * Cursor for pagination (used with cursor-based pagination)
   */
  cursor?: string;

  /**
   * Offset for pagination (used with offset-based pagination)
   */
  offset?: number;

  /**
   * Number of items to fetch
   */
  limit?: number;

  /**
   * Filter by emotion type
   */
  emotionType?: string;
}

/**
 * Create post DTO
 */
export interface CreatePostDto {
  /**
   * Post text content
   */
  text: string;

  /**
   * Optional media URLs
   */
  media?: string[];

  /**
   * Optional emotion type
   */
  emotionType?: string;
}
