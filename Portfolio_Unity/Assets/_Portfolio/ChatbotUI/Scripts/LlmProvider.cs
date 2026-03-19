using System;
using System.Text;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class LlmProvider : MonoBehaviour
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
    public void SendMessage(ChatHistory chatHistory, ChatPersona persona,
                            Action<string> onSuccess, Action<string> onError = null)
    {
        StartCoroutine(SendRequestCoroutine(chatHistory, persona, onSuccess, onError));
    }

    private IEnumerator SendRequestCoroutine(ChatHistory chatHistory, ChatPersona persona,
                                              Action<string> onSuccess, Action<string> onError)
    {
        List<APIMessage> messages = chatHistory.GetMessages();
        APIMessage[] apiMessages = new APIMessage[messages.Count];
        for (int i = 0; i < messages.Count; i++)
        {
            apiMessages[i] = new APIMessage(messages[i].role, messages[i].content);
        }

        var request = new ChatCompletionRequest
        {
            model = persona.ModelName,
            messages = apiMessages,
            max_tokens = persona.MaxTokens,
            temperature = persona.Temperature
        };

        string json = JsonUtility.ToJson(request);
        byte[] bodyRaw = Encoding.UTF8.GetBytes(json);

        using var www = new UnityWebRequest(_baseUrl, "POST");
        www.uploadHandler = new UploadHandlerRaw(bodyRaw);
        www.downloadHandler = new DownloadHandlerBuffer();
        www.SetRequestHeader("Content-Type", "application/json");
        www.SetRequestHeader("Authorization", "Bearer " + _apiKey);
        www.timeout = _timeout;

        yield return www.SendWebRequest();

        if (www.result != UnityWebRequest.Result.Success)
        {
            string errorMsg = $"API request failed: {www.error}";
            Debug.LogError($"[CLIProxyAPI] {errorMsg}");
            onError?.Invoke(errorMsg);
            yield break;
        }

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
