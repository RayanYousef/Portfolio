# Task 6 — Integration Agent

## Objective
This task runs **AFTER** Tasks 1–5 are complete. Validate all components, wire them together in `ChatController`, and ensure the full LLM pipeline works end-to-end including per-character memory.

> **⚠️ IMPORTANT:** Do NOT start this task until Tasks 1–5 are confirmed complete. This agent depends on all prior scripts existing.

## Files to Validate
Verify these files exist and compile in `h:\Portfolio\Portfolio\Assets\_Portfolio\ChatbotUI\Scripts\`:

| File | Created By |
|------|-----------|
| `ChatPersona.cs` | Task 1 |
| `ChatHistory.cs` | Task 2 |
| `ChatMemory.cs` | Task 3 |
| `APIDataModels.cs` | Task 4 |
| `CLIProxyAPI.cs` | Task 5 |
| `ChatController.cs` | Already exists |

## Step 1 — Read and Verify All Scripts

Read each file and confirm:
1. All classes compile without errors
2. Method signatures match what `ChatController` expects:
   - `ChatPersona` has: `PersonaId`, `DisplayName`, `ModelName`, `SystemPrompt`, `Temperature`, `MaxTokens`
   - `ChatHistory` has: `Initialize(string, string)`, `AddUserMessage(string)`, `AddAssistantMessage(string)`, `GetMessages()`, `Clear()`
   - `ChatMemory` has: `LoadMemory(string)`, `SaveMemory(string, string)`, `BuildSummarizationPrompt(ChatHistory)`, `ClearMemory(string)`, `HasMemory(string)`
   - `CLIProxyAPI` has: `SendMessage(ChatHistory, ChatPersona, Action<string>, Action<string>)`
   - `APIDataModels` has: `APIMessage`, `ChatCompletionRequest`, `ChatCompletionResponse`, `ChatCompletionChoice`

## Step 2 — Update ChatController.cs

Modify the existing `ChatController.cs` to integrate all components. The current file already has basic UI logic. You need to add:

### 2a. Add Required Fields
```csharp
[SerializeField] private CLIProxyAPI _cliProxyAPI;
[SerializeField] private ChatPersona _currentPersona;
private ChatHistory _chatHistory = new ChatHistory();
```

### 2b. Add Memory Integration to SendUserMessage
When the first message is sent, load memory and initialize chat history:

```csharp
// In SendUserMessage(), before adding the user message:
if (_chatHistory.GetMessages().Count == 0 && _currentPersona != null)
{
    // Load memory from previous sessions
    string memorySummary = ChatMemory.LoadMemory(_currentPersona.PersonaId);
    _chatHistory.Initialize(_currentPersona.SystemPrompt, memorySummary);
}
_chatHistory.AddUserMessage(text);
```

### 2c. Add AI Response Handling
```csharp
// After displaying the user message bubble:
if (_cliProxyAPI != null && _currentPersona != null)
{
    _cliProxyAPI.SendMessage(_chatHistory, _currentPersona, OnAIResponseReceived, OnAIError);
}
else
{
    StartCoroutine(SimulateBotResponse());
}

private void OnAIResponseReceived(string response)
{
    _chatHistory.AddAssistantMessage(response);
    ReceiveAIMessage(response);
}

private void OnAIError(string error)
{
    ReceiveAIMessage("Error: " + error);
}
```

### 2d. Add Memory Save on Conversation End
Save a summary when the component is disabled or the scene changes:

```csharp
private void OnDisable()
{
    // ... existing event unregistration ...

    // Save conversation memory
    SaveConversationMemory();
}

private void SaveConversationMemory()
{
    // Only save if we had an actual conversation with an AI
    if (_currentPersona == null || _cliProxyAPI == null) return;
    if (_chatHistory.GetMessages().Count <= 2) return; // Skip if only system + 1 message

    string summarizationPrompt = ChatMemory.BuildSummarizationPrompt(_chatHistory);

    // Create a temporary history with the summarization request
    var summaryHistory = new ChatHistory();
    summaryHistory.Initialize("You are a helpful summarization assistant.");
    summaryHistory.AddUserMessage(summarizationPrompt);

    _cliProxyAPI.SendMessage(summaryHistory, _currentPersona,
        summary =>
        {
            ChatMemory.SaveMemory(_currentPersona.PersonaId, summary);
        },
        error =>
        {
            Debug.LogWarning($"[ChatController] Failed to save memory: {error}");
        }
    );
}
```

### 2e. Add Public Method to Switch Personas
```csharp
/// <summary>
/// Switch to a different persona. Saves current memory and starts fresh.
/// </summary>
public void SetPersona(ChatPersona newPersona)
{
    // Save memory for the current persona before switching
    if (_currentPersona != null)
    {
        SaveConversationMemory();
    }

    _currentPersona = newPersona;
    _chatHistory.Clear();

    // Clear chat UI
    if (_scrollView != null)
    {
        _scrollView.Clear();
    }
}
```

## Step 3 — Fix Any Mismatches

After updating `ChatController`, review all cross-references between scripts:

1. Check that `ChatHistory.ChatMessage.role` and `ChatHistory.ChatMessage.content` field names match what `CLIProxyAPI` reads
2. Check that `APIMessage` constructor matches how `CLIProxyAPI` creates message objects
3. Check that `ChatCompletionRequest` field names match the JSON the API expects
4. Ensure no namespace conflicts between `ChatMessage` (from ChatHistory) and `APIMessage` (from APIDataModels)

## Step 4 — Create a Default ChatPersona Asset

Create instructions for the user to create a default persona:

> In Unity: Right-click in the `Scripts` folder → Create → Chatbot → Chat Persona
> Set the following values:
> - **PersonaId:** `default_assistant`
> - **DisplayName:** `AI Assistant`
> - **ModelName:** `gemini-2.5-flash`
> - **SystemPrompt:** `You are a friendly AI assistant. Be helpful, concise, and conversational.`
> - **Temperature:** `0.7`
> - **MaxTokens:** `500`

## Step 5 — Document Unity Editor Setup

Write clear instructions for the user:

1. **ChatController GameObject:**
   - Must have `CLIProxyAPI` component on the same or another accessible GameObject
   - Drag the `CLIProxyAPI` component to the `_cliProxyAPI` field in Inspector
   - Drag the ChatPersona `.asset` file to the `_currentPersona` field

2. **CLIProxyAPI component:**
   - Verify `_baseUrl` is `http://127.0.0.1:8317/v1/chat/completions`
   - Verify `_apiKey` is `your-api-key-1`

3. **Start CLIProxyAPI server** before entering Play mode:
   ```powershell
   cd "e:\Personal Programs\Ignored\CLIProxyAPI"
   .\cli-proxy-api.exe
   ```

## Verification Checklist
- [ ] All 5 scripts + ChatController compile with zero errors
- [ ] ChatController has `_cliProxyAPI`, `_currentPersona` fields visible in Inspector
- [ ] Sending a message in Play mode triggers an API call (check Console for logs)
- [ ] AI response appears in the chat UI
- [ ] Error message appears in chat if the server is offline
- [ ] Memory file is created at `persistentDataPath/chat_memory/{personaId}.json` after a conversation
- [ ] Restarting Play mode → the NPC references previous conversation context
- [ ] Switching personas via `SetPersona()` saves memory and clears chat
