using UnityEngine;
using UnityEngine.UIElements;
using System.Collections;

public class ChatController : MonoBehaviour
{
    [SerializeField] private UIDocument _uiDocument;
    [SerializeField] private VisualTreeAsset _chatMessageTemplate;
    [SerializeField] private LlmProvider _cliProxyAPI;
    [SerializeField] private ChatPersona _currentPersona;

    private ChatHistory _chatHistory = new ChatHistory();

    private ScrollView _scrollView;
    private TextField _inputField;
    private Button _sendButton;
    private VisualElement _root;

    private void OnEnable()
    {
        if (_uiDocument == null)
        {
            _uiDocument = GetComponent<UIDocument>();
        }

        if (_uiDocument == null || _uiDocument.rootVisualElement == null)
            return;

        _root = _uiDocument.rootVisualElement;

        // Query the necessary elements
        _scrollView = _root.Q<ScrollView>();
        _inputField = _root.Q<TextField>();
        _sendButton = _root.Q<Button>();

        // Register events
        if (_sendButton != null)
        {
            _sendButton.clicked += SendMessageFromInput;
        }

        if (_inputField != null)
        {
            _inputField.RegisterCallback<KeyDownEvent>(OnInputKeyDown, TrickleDown.TrickleDown);
        }
    }

    private void OnDisable()
    {
        // Unregister events to prevent memory leaks
        if (_sendButton != null)
        {
            _sendButton.clicked -= SendMessageFromInput;
        }

        if (_inputField != null)
        {
            _inputField.UnregisterCallback<KeyDownEvent>(OnInputKeyDown, TrickleDown.TrickleDown);
        }

        SaveConversationMemory();
    }

    private void OnInputKeyDown(KeyDownEvent evt)
    {
        // Check for Enter key without relying on legacy KeyCode
        if (evt.character == '\n' || evt.character == '\r')
        {
            // Allow Shift+Enter for newlines
            if (!evt.shiftKey)
            {
                evt.StopPropagation(); // Prevent the multiline textfield from creating a new line
                SendMessageFromInput();
            }
        }
    }

    private void SendMessageFromInput()
    {
        if (_inputField == null) return;

        string text = _inputField.value;

        // Ensure robust against empty-string input
        if (string.IsNullOrWhiteSpace(text))
            return;

        SendUserMessage(text);
    }

    public void SendUserMessage(string text)
    {
        if (_inputField != null)
        {
            _inputField.value = string.Empty;
        }

        if (_chatMessageTemplate == null || _scrollView == null)
            return;

        // Initialize chat history on first message
        if (_chatHistory.GetMessages().Count == 0 && _currentPersona != null)
        {
            string memorySummary = ChatMemory.LoadMemory(_currentPersona.PersonaId);
            _chatHistory.Initialize(_currentPersona.SystemPrompt, memorySummary);
        }
        _chatHistory.AddUserMessage(text);

        var messageElement = _chatMessageTemplate.CloneTree();
        messageElement.AddToClassList("message-user");

        // Explicitly move the avatar to the end so it appears on the right side
        var avatar = messageElement.Q<VisualElement>("chat-avatar");
        if (avatar != null)
        {
            avatar.BringToFront();
        }

        var label = messageElement.Q<Label>();
        if (label != null)
        {
            label.text = text;
        }

        _scrollView.Add(messageElement);

        // Wait for the exact moment the layout is drawn before scrolling
        EventCallback<GeometryChangedEvent> onGeometryChanged = null;
        onGeometryChanged = (evt) =>
        {
            messageElement.UnregisterCallback(onGeometryChanged);
            _scrollView.ScrollTo(messageElement);
        };
        messageElement.RegisterCallback(onGeometryChanged);

        // Send to LLM if API is configured, otherwise simulate
        if (_cliProxyAPI != null && _currentPersona != null)
        {
            _cliProxyAPI.SendMessage(_chatHistory, _currentPersona, OnAIResponseReceived, OnAIError);
        }
        else
        {
            StartCoroutine(SimulateBotResponse());
        }
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

    private void SaveConversationMemory()
    {
        if (_currentPersona == null || _cliProxyAPI == null) return;
        if (_chatHistory.GetMessages().Count <= 2) return;
        if (!_cliProxyAPI.gameObject.activeInHierarchy) return;

        string summarizationPrompt = ChatMemory.BuildSummarizationPrompt(_chatHistory);

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

    /// <summary>
    /// Switch to a different persona. Saves current memory and starts fresh.
    /// </summary>
    public void SetPersona(ChatPersona newPersona)
    {
        if (_currentPersona != null)
        {
            SaveConversationMemory();
        }

        _currentPersona = newPersona;
        _chatHistory.Clear();

        if (_scrollView != null)
        {
            _scrollView.Clear();
        }
    }

    private IEnumerator SimulateBotResponse()
    {
        yield return new WaitForSeconds(1f);
        ReceiveAIMessage("This is a simulated AI response to your message.");
    }

    public void ReceiveAIMessage(string text)
    {
        if (_chatMessageTemplate == null || _scrollView == null)
            return;

        var messageElement = _chatMessageTemplate.CloneTree();
        messageElement.AddToClassList("message-bot");

        var label = messageElement.Q<Label>();
        if (label != null)
        {
            label.text = text;
        }

        _scrollView.Add(messageElement);

        // Wait for the exact moment the layout is drawn before scrolling
        EventCallback<GeometryChangedEvent> onGeometryChanged = null;
        onGeometryChanged = (evt) =>
        {
            messageElement.UnregisterCallback(onGeometryChanged);
            _scrollView.ScrollTo(messageElement);
        };
        messageElement.RegisterCallback(onGeometryChanged);
    }
}
