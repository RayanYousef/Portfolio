# Task 3 — Create ChatMemory Persistence

## Objective
Create a C# class that saves and loads conversation summaries per character so NPCs remember past interactions across play sessions.

## Output File
**Path:** `h:\Portfolio\Portfolio\Assets\_Portfolio\ChatbotUI\Scripts\ChatMemory.cs`

## How Memory Works (Flow)

```
Session Start:
  1. ChatMemory.LoadMemory(personaId) → returns saved summary (or null)
  2. Summary injected into ChatHistory.Initialize(systemPrompt, memorySummary)
  3. Player chats with NPC normally

Session End:
  4. ChatMemory.GenerateSummary() → sends full history to LLM with summarization prompt
  5. LLM returns a concise summary of the conversation
  6. ChatMemory.SaveMemory(personaId, summary) → writes to disk
```

## Requirements

Create a C# script with the following structure:

```csharp
using System;
using System.IO;
using UnityEngine;

[Serializable]
public class MemoryData
{
    public string personaId;
    public string summary;
    public string timestamp;
}

public class ChatMemory
{
    private static string MemoryDirectory => 
        Path.Combine(Application.persistentDataPath, "chat_memory");

    /// <summary>
    /// Load the saved conversation summary for a persona.
    /// Returns null if no memory exists.
    /// </summary>
    public static string LoadMemory(string personaId)
    {
        string filePath = GetFilePath(personaId);
        if (!File.Exists(filePath))
            return null;

        try
        {
            string json = File.ReadAllText(filePath);
            MemoryData data = JsonUtility.FromJson<MemoryData>(json);
            return data.summary;
        }
        catch (Exception e)
        {
            Debug.LogWarning($"[ChatMemory] Failed to load memory for '{personaId}': {e.Message}");
            return null;
        }
    }

    /// <summary>
    /// Save a conversation summary for a persona.
    /// </summary>
    public static void SaveMemory(string personaId, string summary)
    {
        // Ensure directory exists
        if (!Directory.Exists(MemoryDirectory))
            Directory.CreateDirectory(MemoryDirectory);

        var data = new MemoryData
        {
            personaId = personaId,
            summary = summary,
            timestamp = DateTime.UtcNow.ToString("o")
        };

        string json = JsonUtility.ToJson(data, true);
        string filePath = GetFilePath(personaId);

        try
        {
            File.WriteAllText(filePath, json);
            Debug.Log($"[ChatMemory] Saved memory for '{personaId}'");
        }
        catch (Exception e)
        {
            Debug.LogError($"[ChatMemory] Failed to save memory for '{personaId}': {e.Message}");
        }
    }

    /// <summary>
    /// Delete a persona's memory file.
    /// </summary>
    public static void ClearMemory(string personaId)
    {
        string filePath = GetFilePath(personaId);
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
            Debug.Log($"[ChatMemory] Cleared memory for '{personaId}'");
        }
    }

    /// <summary>
    /// Check if a persona has saved memory.
    /// </summary>
    public static bool HasMemory(string personaId)
    {
        return File.Exists(GetFilePath(personaId));
    }

    /// <summary>
    /// Build a prompt that asks the LLM to summarize the conversation.
    /// This returns the prompt string — the caller (Integration Agent / ChatController) 
    /// is responsible for sending it to the LLM and calling SaveMemory with the result.
    /// </summary>
    public static string BuildSummarizationPrompt(ChatHistory chatHistory)
    {
        var messages = chatHistory.GetMessages();
        var conversationText = new System.Text.StringBuilder();

        foreach (var msg in messages)
        {
            if (msg.role == "system") continue; // Skip system prompt
            conversationText.AppendLine($"{msg.role}: {msg.content}");
        }

        return "Summarize the following conversation in 2-3 sentences. " +
               "Focus on key facts the player shared and important topics discussed. " +
               "Write in third person past tense.\n\n" +
               conversationText.ToString();
    }

    private static string GetFilePath(string personaId)
    {
        return Path.Combine(MemoryDirectory, $"{personaId}.json");
    }
}
```

## Key Rules
1. **Static methods** — `ChatMemory` is a utility class, not a MonoBehaviour. All methods are static.
2. **File location:** `Application.persistentDataPath/chat_memory/{personaId}.json`
3. **Error handling:** All file I/O must be wrapped in try/catch — never let a file error crash the game
4. **`BuildSummarizationPrompt()`** returns a string prompt — it does NOT send API requests itself. The Integration Agent wires the summarization flow in `ChatController`.
5. `MemoryData` must be `[Serializable]` for `JsonUtility.ToJson/FromJson`
6. Do NOT depend on `CLIProxyAPI` or `ChatPersona` classes directly — only use `ChatHistory.GetMessages()` for building the summarization prompt

## Dependencies
- References `ChatHistory` class (for `GetMessages()` in `BuildSummarizationPrompt`) — but only needs to know the interface, not the implementation.

## What Uses This
- `ChatController` (via Integration Agent) calls:
  - `LoadMemory(persona.PersonaId)` on conversation start
  - `BuildSummarizationPrompt(chatHistory)` on conversation end
  - `SaveMemory(persona.PersonaId, summary)` after receiving the summarization response
- Any script can call `ClearMemory()` to reset a character's memory
- Any script can call `HasMemory()` to check if memory exists

## Example Memory File (`wizard_npc.json`)
```json
{
    "personaId": "wizard_npc",
    "summary": "The player asked about healing potions and mentioned they were heading to the Dark Forest. The wizard warned them about the shadow creatures there.",
    "timestamp": "2026-03-19T17:00:00.0000000Z"
}
```

## Verification
- Script compiles with no errors in Unity
- `ChatMemory.SaveMemory("test_npc", "Player likes swords")` creates a file at `persistentDataPath/chat_memory/test_npc.json`
- `ChatMemory.LoadMemory("test_npc")` returns `"Player likes swords"`
- `ChatMemory.LoadMemory("nonexistent")` returns `null` without errors
- `ChatMemory.ClearMemory("test_npc")` deletes the file
- `ChatMemory.HasMemory("test_npc")` returns `false` after clearing
