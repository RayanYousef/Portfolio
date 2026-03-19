# Task 2 — Create ChatHistory Manager

## Objective
Create a plain C# class that manages the conversation message list for multi-turn chat with an LLM.

## Output File
**Path:** `h:\Portfolio\Portfolio\Assets\_Portfolio\ChatbotUI\Scripts\ChatHistory.cs`

## Requirements

Create a C# script with the following:

```csharp
using System;
using System.Collections.Generic;

[Serializable]
public class ChatMessage
{
    public string role;
    public string content;

    public ChatMessage(string role, string content)
    {
        this.role = role;
        this.content = content;
    }
}

[Serializable]
public class ChatHistory
{
    private List<ChatMessage> _messages = new List<ChatMessage>();

    /// <summary>
    /// Initialize the conversation with a system prompt.
    /// Optionally inject a memory summary from previous sessions.
    /// </summary>
    public void Initialize(string systemPrompt, string memorySummary = null)
    {
        _messages.Clear();

        // Build the full system message, injecting memory if available
        string fullSystemPrompt = systemPrompt;
        if (!string.IsNullOrEmpty(memorySummary))
        {
            fullSystemPrompt += "\n\n[Memory from previous conversations]\n" + memorySummary;
        }

        _messages.Add(new ChatMessage("system", fullSystemPrompt));
    }

    /// <summary>Add a user message to the history.</summary>
    public void AddUserMessage(string content)
    {
        _messages.Add(new ChatMessage("user", content));
    }

    /// <summary>Add an assistant (AI) message to the history.</summary>
    public void AddAssistantMessage(string content)
    {
        _messages.Add(new ChatMessage("assistant", content));
    }

    /// <summary>Get all messages in the conversation.</summary>
    public List<ChatMessage> GetMessages()
    {
        return _messages;
    }

    /// <summary>Clear all messages and reset the conversation.</summary>
    public void Clear()
    {
        _messages.Clear();
    }
}
```

## Key Rules
1. `ChatMessage` and `ChatHistory` must both be `[Serializable]` for `JsonUtility` compatibility
2. `role` must be one of: `"system"`, `"user"`, `"assistant"` — matching OpenAI API format
3. `Initialize()` has an optional `memorySummary` parameter — when provided, it's appended to the system prompt under a `[Memory from previous conversations]` header
4. Do NOT inherit from `MonoBehaviour` or `ScriptableObject` — this is a plain C# class created at runtime with `new ChatHistory()`
5. The class must be safe to construct from any script (no Unity-specific lifecycle dependencies)

## Dependencies
None — this is a pure data/logic class.

## What Uses This
- `ChatController` creates an instance via `new ChatHistory()` and calls `Initialize()`, `AddUserMessage()`, `AddAssistantMessage()`, `GetMessages()`
- `CLIProxyAPI` reads messages via `GetMessages()` to build the API request body
- `ChatMemory` reads the full history via `GetMessages()` when generating a summary

## Verification
- Script compiles with no errors in Unity
- Can create an instance: `var history = new ChatHistory();`
- `Initialize("You are a wizard")` → `GetMessages()` returns 1 system message
- `Initialize("You are a wizard", "Player asked about potions")` → system message content contains both the prompt and the memory
- `AddUserMessage("Hello")` → `GetMessages()` returns 2 messages
- `Clear()` → `GetMessages()` returns 0 messages
