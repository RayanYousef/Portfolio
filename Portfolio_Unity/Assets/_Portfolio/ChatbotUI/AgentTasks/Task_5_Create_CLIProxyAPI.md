# Task 5 — Create CLIProxyAPI HTTP Client

## Objective
Create a Unity MonoBehaviour that sends HTTP requests to the local CLIProxyAPI server (OpenAI-compatible API) and returns AI responses via callbacks.

## Output File
**Path:** `h:\Portfolio\Portfolio\Assets\_Portfolio\ChatbotUI\Scripts\CLIProxyAPI.cs`

## Server Details
- **Base URL:** `http://127.0.0.1:8317/v1/chat/completions`
- **API Key:** `your-api-key-1`
- **Method:** POST
- **Content-Type:** `application/json`
- **Auth Header:** `Authorization: Bearer your-api-key-1`

## Requirements

Create a C# script with the following:

```csharp
using System;
using System.Text;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class CLIProxyAPI : MonoBehaviour
{
    [Tooltip("Base URL of the CLIProxyAPI server")]
    [SerializeField] private string _baseUrl = "http://127.0.0.1:8317/v1/chat/completions";

    [Tooltip("API key for authentication")]
    [SerializeField] private string _apiKey = "your-api-key-1";

    [Tooltip("Request timeout in seconds")]
    [SerializeField] private int _timeout = 30;

    /// <summary>
    /// Send the current conversation to the LLM and get a response.
    /// </summary>
    /// <param name="chatHistory">The conversation history to send</param>
    /// <param name="persona">The persona configuration (model, temperature, etc.)</param>
    /// <param name="onSuccess">Callback with the AI's response text</param>
    /// <param name="onError">Callback with error message</param>
    public void SendMessage(ChatHistory chatHistory, ChatPersona persona, 
                            Action<string> onSuccess, Action<string> onError = null)
    {
        StartCoroutine(SendRequestCoroutine(chatHistory, persona, onSuccess, onError));
    }

    private IEnumerator SendRequestCoroutine(ChatHistory chatHistory, ChatPersona persona,
                                              Action<string> onSuccess, Action<string> onError)
    {
        // Convert ChatHistory messages to APIMessage array
        List<ChatMessage> messages = chatHistory.GetMessages();
        APIMessage[] apiMessages = new APIMessage[messages.Count];
        for (int i = 0; i < messages.Count; i++)
        {
            apiMessages[i] = new APIMessage(messages[i].role, messages[i].content);
        }

        // Build the request body
        var request = new ChatCompletionRequest
        {
            model = persona.ModelName,
            messages = apiMessages,
            max_tokens = persona.MaxTokens,
            temperature = persona.Temperature
        };

        string json = JsonUtility.ToJson(request);
        byte[] bodyRaw = Encoding.UTF8.GetBytes(json);

        // Create and configure the web request
        using var www = new UnityWebRequest(_baseUrl, "POST");
        www.uploadHandler = new UploadHandlerRaw(bodyRaw);
        www.downloadHandler = new DownloadHandlerBuffer();
        www.SetRequestHeader("Content-Type", "application/json");
        www.SetRequestHeader("Authorization", "Bearer " + _apiKey);
        www.timeout = _timeout;

        // Send and wait
        yield return www.SendWebRequest();

        // Handle response
        if (www.result != UnityWebRequest.Result.Success)
        {
            string errorMsg = $"API request failed: {www.error}";
            Debug.LogError($"[CLIProxyAPI] {errorMsg}");
            onError?.Invoke(errorMsg);
            yield break;
        }

        // Parse the response
        try
        {
            string responseJson = www.downloadHandler.text;
            var response = JsonUtility.FromJson<ChatCompletionResponse>(responseJson);

            if (response.choices != null && response.choices.Length > 0)
            {
                string reply = response.choices[0].message.content;
                onSuccess?.Invoke(reply);
            }
            else
            {
                onError?.Invoke("API returned no choices in response");
            }
        }
        catch (Exception e)
        {
            string errorMsg = $"Failed to parse API response: {e.Message}";
            Debug.LogError($"[CLIProxyAPI] {errorMsg}");
            onError?.Invoke(errorMsg);
        }
    }
}
```

## Key Rules
1. **Must be a MonoBehaviour** — it uses `StartCoroutine` for async HTTP. Attach to a GameObject in the scene.
2. **Uses `UnityWebRequest`** — Unity's built-in HTTP client. Do NOT use `HttpClient` or `WebClient`.
3. **Timeout:** 30 seconds default, configurable via Inspector
4. **Error handling:** Every failure path must invoke `onError` — never silently fail
5. **Base URL and API key are serialized fields** — editable in Inspector for easy configuration
6. **Method signature must match exactly:** `SendMessage(ChatHistory, ChatPersona, Action<string>, Action<string>)` — this is what `ChatController` calls

## Dependencies (interface only — agent doesn't need to implement these)
- `ChatHistory` — calls `GetMessages()` which returns `List<ChatMessage>` with `role` and `content` fields
- `ChatPersona` — reads `ModelName`, `MaxTokens`, `Temperature` fields
- `APIMessage`, `ChatCompletionRequest`, `ChatCompletionResponse` — from `APIDataModels.cs`

## What Uses This
- `ChatController` holds a `[SerializeField] private CLIProxyAPI _cliProxyAPI` reference and calls `SendMessage()`
- `ChatController` (via Integration Agent) may also use this for memory summarization requests

## Verification
- Script compiles with no errors in Unity
- Can be added as a component to a GameObject
- `_baseUrl` and `_apiKey` fields are visible in Inspector
- With the CLIProxyAPI server running, calling `SendMessage()` with a valid history and persona returns an AI response
- With the server stopped, `onError` callback fires with a meaningful error message
