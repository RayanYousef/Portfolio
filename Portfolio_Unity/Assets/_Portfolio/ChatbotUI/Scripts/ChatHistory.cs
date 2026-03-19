using System;
using System.Collections.Generic;

[Serializable]
public class ChatHistory
{
    private List<APIMessage> _messages = new List<APIMessage>();

    /// <summary>
    /// Initialize the conversation with a system prompt.
    /// Optionally inject a memory summary from previous sessions.
    /// </summary>
    public void Initialize(string systemPrompt, string memorySummary = null)
    {
        _messages.Clear();

        string fullSystemPrompt = systemPrompt;
        if (!string.IsNullOrEmpty(memorySummary))
        {
            fullSystemPrompt += "\n\n[Memory from previous conversations]\n" + memorySummary;
        }

        _messages.Add(new APIMessage("system", fullSystemPrompt));
    }

    /// <summary>Add a user message to the history.</summary>
    public void AddUserMessage(string content)
    {
        _messages.Add(new APIMessage("user", content));
    }

    /// <summary>Add an assistant (AI) message to the history.</summary>
    public void AddAssistantMessage(string content)
    {
        _messages.Add(new APIMessage("assistant", content));
    }

    /// <summary>Get all messages in the conversation.</summary>
    public List<APIMessage> GetMessages()
    {
        return _messages;
    }

    /// <summary>Clear all messages and reset the conversation.</summary>
    public void Clear()
    {
        _messages.Clear();
    }
}
