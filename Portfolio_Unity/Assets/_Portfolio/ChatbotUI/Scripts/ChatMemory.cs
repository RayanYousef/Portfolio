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
    /// Returns the prompt string — the caller is responsible for sending it
    /// to the LLM and calling SaveMemory with the result.
    /// </summary>
    public static string BuildSummarizationPrompt(ChatHistory chatHistory)
    {
        var messages = chatHistory.GetMessages();
        var conversationText = new System.Text.StringBuilder();

        foreach (var msg in messages)
        {
            if (msg.role == "system") continue;
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
