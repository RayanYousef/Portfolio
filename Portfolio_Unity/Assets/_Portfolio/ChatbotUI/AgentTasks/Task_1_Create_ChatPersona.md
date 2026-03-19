# Task 1 — Create ChatPersona ScriptableObject

## Objective
Create a Unity `ScriptableObject` that stores AI persona configuration for each NPC character.

## Output File
**Path:** `h:\Portfolio\Portfolio\Assets\_Portfolio\ChatbotUI\Scripts\ChatPersona.cs`

## Requirements

Create a C# script with the following:

```csharp
using UnityEngine;

[CreateAssetMenu(fileName = "NewChatPersona", menuName = "Chatbot/Chat Persona")]
public class ChatPersona : ScriptableObject
{
    [Tooltip("Unique ID for this persona, used for memory file naming (e.g. wizard_npc)")]
    public string PersonaId;

    [Tooltip("Display name shown in UI (e.g. Gandalf)")]
    public string DisplayName;

    [Tooltip("LLM model to use (e.g. gemini-2.5-flash)")]
    public string ModelName = "gemini-2.5-flash";

    [Tooltip("System prompt that defines this character's personality and behavior")]
    [TextArea(3, 10)]
    public string SystemPrompt = "You are a helpful assistant.";

    [Tooltip("Controls randomness. 0 = deterministic, 2 = very random")]
    [Range(0f, 2f)]
    public float Temperature = 0.7f;

    [Tooltip("Maximum number of tokens in the AI response")]
    [Min(1)]
    public int MaxTokens = 500;
}
```

## Key Rules
1. Use `[CreateAssetMenu]` so the user can right-click → Create → Chatbot → Chat Persona in Unity
2. `PersonaId` must be a simple string (no spaces, lowercase + underscores preferred) — it's used as a filename for memory persistence
3. `DisplayName` is the human-readable name shown in chat UI
4. `SystemPrompt` uses `[TextArea]` for comfortable editing in the Inspector
5. `Temperature` uses `[Range]` for a slider in the Inspector
6. `MaxTokens` uses `[Min(1)]` to prevent zero/negative values

## Dependencies
None — this is a pure data container.

## What Uses This
- `ChatController` reads `SystemPrompt`, `ModelName`, `Temperature`, `MaxTokens` when sending API requests
- `CLIProxyAPI` reads `ModelName`, `Temperature`, `MaxTokens` to build the HTTP request body
- `ChatMemory` uses `PersonaId` to name the memory save file
- `ChatHistory` receives `SystemPrompt` during initialization

## Verification
- Script compiles with no errors in Unity
- Right-click in Project window → Create → Chatbot → Chat Persona creates a `.asset` file
- All fields are visible and editable in the Inspector
