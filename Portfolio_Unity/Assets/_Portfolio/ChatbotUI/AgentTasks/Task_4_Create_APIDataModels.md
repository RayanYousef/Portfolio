# Task 4 — Create API Data Models

## Objective
Create serializable data transfer objects (DTOs) that match the OpenAI-compatible API JSON format used by CLIProxyAPI.

## Output File
**Path:** `h:\Portfolio\Portfolio\Assets\_Portfolio\ChatbotUI\Scripts\APIDataModels.cs`

## API Format Reference

### Request Body (POST `/v1/chat/completions`)
```json
{
    "model": "gemini-2.5-flash",
    "messages": [
        { "role": "system", "content": "You are a helpful assistant." },
        { "role": "user", "content": "What is Unity?" }
    ],
    "max_tokens": 500,
    "temperature": 0.7
}
```

### Response Body
```json
{
    "id": "NMG7aZmpNKXktfAPn9Wp0Ac",
    "object": "chat.completion",
    "model": "gemini-2.5-flash",
    "choices": [
        {
            "index": 0,
            "message": { "role": "assistant", "content": "Unity is a cross-platform game engine..." },
            "finish_reason": "stop"
        }
    ],
    "usage": { "prompt_tokens": 15, "completion_tokens": 50, "total_tokens": 65 }
}
```

## Requirements

Create a C# script with the following classes:

```csharp
using System;

/// <summary>
/// A single message in the API request/response.
/// Field names are snake_case to match the OpenAI JSON format.
/// </summary>
[Serializable]
public class APIMessage
{
    public string role;
    public string content;

    public APIMessage() { }

    public APIMessage(string role, string content)
    {
        this.role = role;
        this.content = content;
    }
}

/// <summary>
/// Request body for POST /v1/chat/completions
/// </summary>
[Serializable]
public class ChatCompletionRequest
{
    public string model = "gemini-2.5-flash";
    public APIMessage[] messages;
    public int max_tokens = 500;
    public float temperature = 0.7f;
}

/// <summary>
/// A single choice in the API response.
/// </summary>
[Serializable]
public class ChatCompletionChoice
{
    public int index;
    public APIMessage message;
    public string finish_reason;
}

/// <summary>
/// Top-level response from POST /v1/chat/completions
/// </summary>
[Serializable]
public class ChatCompletionResponse
{
    public string id;
    public string @object;
    public string model;
    public ChatCompletionChoice[] choices;
}
```

## Key Rules
1. **All classes must be `[Serializable]`** — required by `JsonUtility.ToJson()` and `JsonUtility.FromJson<>()`
2. **Field names must be snake_case** (e.g. `max_tokens`, `finish_reason`) — `JsonUtility` uses field names as JSON keys
3. **Use `@object`** with the `@` prefix because `object` is a C# reserved keyword
4. **No MonoBehaviour/ScriptableObject inheritance** — these are plain data classes
5. **Do NOT add `using UnityEngine;`** — these classes should have no Unity dependencies beyond being serializable
6. `APIMessage` needs both a parameterless constructor (for deserialization) and a convenience constructor

## Dependencies
None — pure data classes.

## What Uses This
- `CLIProxyAPI` creates `ChatCompletionRequest` objects and deserializes `ChatCompletionResponse` from the API
- `CLIProxyAPI` converts `ChatHistory.GetMessages()` → `APIMessage[]`

## Verification
- Script compiles with no errors in Unity
- `JsonUtility.ToJson(new ChatCompletionRequest())` produces valid JSON with snake_case keys
- `JsonUtility.FromJson<ChatCompletionResponse>(jsonString)` correctly parses a sample response
