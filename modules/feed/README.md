# Feed Module

This module handles the feed functionality of the application, including fetching feed items, creating posts, and liking/unliking feed items.

## API Response Format

The feed API supports two response formats:

### Legacy Format

```json
{
  "items": [
    {
      "id": "1",
      "type": "post",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z",
      "author": {
        "id": "user1",
        "name": "User 1",
        "avatar": "https://example.com/avatar.jpg"
      },
      "content": {
        "text": "Test post"
      },
      "stats": {
        "likes": 10,
        "replies": 5
      }
    }
  ],
  "nextCursor": "next",
  "hasMore": true
}
```

### New Collection Format

```json
{
  "edges": [
    {
      "id": "1",
      "contentType": "POST",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z",
      "publishedPost": {
        "id": "post1",
        "title": "Test Post",
        "excerpt": "This is a test post",
        "likeCount": 10,
        "replyCount": 5,
        "author": {
          "id": "user1",
          "firstName": "John",
          "lastName": "Doe",
          "avatar": "https://example.com/avatar.jpg"
        },
        "publishedAt": "2023-01-01T00:00:00Z"
      }
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 20
  }
}
```

## Implementation Details

The feed module is designed to handle both response formats seamlessly:

1. **FeedItemFactory**: Detects the response format and converts it to a consistent internal model.
   - `fromResponse`: Entry point that determines which format to use
   - `fromNewApiFormat`: Handles the new Collection format
   - `fromLegacyFormat`: Handles the legacy format

2. **FeedApiRepository**: Handles API communication and pagination.
   - Supports both cursor-based and offset-based pagination
   - Converts between cursor and offset when needed
   - Handles both response formats

3. **useInfiniteFeed**: React Query hook for infinite scrolling.
   - Supports both pagination types
   - Handles cursor conversion

## Testing

The module includes comprehensive tests:

- `feed.repository.test.ts`: Tests the repository layer
- `feed-item-factory.test.ts`: Tests the factory's ability to handle both formats

## Usage

```typescript
// Fetch feed items
const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteFeed({
  limit: 10,
  emotionType: 'happy'
});

// Create a post
const { mutate: createPost } = useCreatePost();
createPost({ text: 'Hello world!' });

// Like/unlike a feed item
const { mutate: likeFeedItem } = useLikeFeedItem();
likeFeedItem('post-id');
```
