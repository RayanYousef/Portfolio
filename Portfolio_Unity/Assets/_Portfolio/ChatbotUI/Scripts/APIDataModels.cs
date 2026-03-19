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
