import os
import requests

def fetch_youtube_video(query: str) -> dict:
    """Fetch YouTube video using YouTube Data API"""
    api_key = os.getenv("YOUTUBE_API_KEY", "")
    if not api_key:
        return {
            "title": f"{query} Full Course - Beginner to Pro",
            "url": f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}+full+course",
            "channel": "freeCodeCamp",
        }
    try:
        url = "https://www.googleapis.com/youtube/v3/search"
        params = {"part": "snippet", "q": f"{query} tutorial full course", "type": "video", "maxResults": 1, "key": api_key}
        response = requests.get(url, params=params, timeout=5)
        data = response.json()
        if data.get("items"):
            item = data["items"][0]
            vid_id = item["id"]["videoId"]
            return {
                "title": item["snippet"]["title"],
                "url": f"https://www.youtube.com/watch?v={vid_id}",
                "channel": item["snippet"]["channelTitle"],
            }
    except Exception:
        pass
    return {
        "title": f"{query} Full Course",
        "url": f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}",
        "channel": "YouTube",
    }
