# Backlog

## Tasks

### SOC-007: Implement API Integration for Emotion Creation and Feed Viewing in For You Screen

Status: In Progress
Priority: High
Dependencies: None

### Context

- Currently, the emotion selection and feed viewing in the For You screen use mock data
- Users can select emotions (joy, sadness, anger, fear, joker) but these are not persisted to the backend
- The feed displays hardcoded post cards instead of real content from the API
- We need to integrate with the backend API to create real emotions and display the actual feed

### Requirements

- Implement API integration for creating user emotions
- Implement API integration for fetching and displaying the feed content
- Support pagination and pull-to-refresh for the feed
- Display proper loading and error states
- Ensure the UI updates reactively when emotions are created or feed is refreshed

### Acceptance Criteria

1. Users can select an emotion which is persisted to the backend via API
2. Selected emotion is reflected in the UI with appropriate color theming
3. Feed displays real content from the backend API including both posts and emotions
4. Feed supports infinite scrolling with proper loading indicators
5. Pull-to-refresh functionality refreshes the feed content
6. Empty states are handled appropriately when no feed items exist
7. Error states are handled gracefully with retry options
8. Performance is optimized for smooth scrolling and transitions

### Technical Notes

- Use the existing `/v1/emotions` endpoint for creating emotions
- Use the existing `/v1/feeds` endpoint for fetching feed content
- Implement proper error handling and loading states
- Use React Query for data fetching and caching
- Update the emotion atom to reflect the server state
- Ensure proper TypeScript typing for all API responses
- Follow the established module structure pattern

### API Specifications

#### Create Emotion

```
POST /v1/emotions

Request:
{
  "type": string, // "joy", "sadness", "anger", "fear", "joker"
  "note": string | null // Optional note about the emotion
}

Response:
{
  "id": string,
  "type": string,
  "intensity": number,
  "timestamp": string,
  "note": string | null
}
```

#### Get Feed

```
GET /v1/feeds?offset=0&limit=10

Response:
{
  "edges": [
    {
      "id": string,
      "contentType": "POST" | "USER_EMOTION",
      "publishedPostId": string | null,
      "userEmotionId": string | null,
      "score": number,
      "viewedAt": string | null,
      "createdAt": string,
      "updatedAt": string,
      "publishedPost": { ... } | null, // If contentType is POST
      "userEmotion": { ... } | null // If contentType is USER_EMOTION
    }
  ],
  "pagination": {
    "limit": number,
    "offset": number,
    "total": number
  }
}
```

### Sub-tasks

1. Create emotion module structure:
   - Create emotion module with proper folder structure
   - Define interfaces and DTOs for emotion API
   - Set up repository and service layers

2. Implement emotion creation:
   - Create repository method for creating emotions
   - Update emotion atom to work with the API
   - Connect UI emotion selection to the API
   - Add proper error handling and loading states

3. Implement feed module structure:
   - Create feed module with proper folder structure
   - Define interfaces and DTOs for feed API
   - Set up repository and service layers

4. Implement feed viewing:
   - Create repository method for fetching feeds
   - Create service for handling feed data
   - Implement infinite scrolling with React Query
   - Add pull-to-refresh functionality
   - Handle different content types (posts and emotions)

5. Update UI components:
   - Update EmotionLand component to use real API
   - Create proper PostCard and EmotionCard components
   - Implement loading and error states
   - Add empty state handling

6. Add tests:
   - Add unit tests for repository and service layers
   - Add integration tests for API interactions
   - Add UI component tests
