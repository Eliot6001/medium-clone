# Overview

The engagement tracking system monitors user interactions with an article by dividing the content into five segments. If a user remains on a segment for 20 seconds, it is considered engaged. The system batches engagement data and sends it to the backend either when all five segments are engaged or after 60 seconds.

## How It Works

### Segment Markers

- The article is divided into five equally spaced markers.
- These markers are positioned within the article content.

### Tracking Engagement

- An `IntersectionObserver` detects when a marker becomes visible.
- If the user stays on a segment for 20 seconds, it is marked as engaged.
- If the user scrolls away before 20 seconds, the timer resets.

### Batching Engagement Data

- Engagements are stored in a `Set`.
- A batch timer (60 seconds) ensures that engagement data is sent periodically.
- If all five segments are engaged before 60 seconds, data is sent immediately.

### Sending Data to the Server

When sending data, an HTTP POST request is made to `/profiles/engagement/`.

**Payload Example:**

```json
{
    "postid": "ARTICLE_ID",
    "userid": "USER_ID",
    "segments": [0, 1, 2]
}
```

- The backend processes and updates the engagement metrics.

## Edge Cases Handled

- If a user scrolls past a marker too fast, it won’t count as engagement.
- If the page is closed before 60 seconds, engagement data for completed segments is still sent.
- If the user engages with some but not all segments, only those segments are recorded.
