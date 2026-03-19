using UnityEngine;

public enum LlmModel
{
    // ── Gemini ──
    Gemini_2_5_Flash,
    Gemini_2_5_Flash_Lite,
    Gemini_2_5_Pro,
    Gemini_3_Flash,
    Gemini_3_Flash_Preview,
    Gemini_3_Pro_High,
    Gemini_3_Pro_Low,
    Gemini_3_Pro_Preview,
    Gemini_3_1_Flash_Image,
    Gemini_3_1_Flash_Lite_Preview,
    Gemini_3_1_Pro_High,
    Gemini_3_1_Pro_Low,
    Gemini_3_1_Pro_Preview,

    // ── Claude ──
    Claude_Sonnet_4_6,
    Claude_Opus_4_6_Thinking,

    // ── GPT / Codex ──
    GPT_5,
    GPT_5_1,
    GPT_5_1_Codex,
    GPT_5_1_Codex_Max,
    GPT_5_1_Codex_Mini,
    GPT_5_2,
    GPT_5_2_Codex,
    GPT_5_3_Codex,
    GPT_5_4,
    GPT_5_4_Mini,
    GPT_5_Codex,
    GPT_5_Codex_Mini,
    GPT_OSS_120B_Medium,
}

[CreateAssetMenu(fileName = "NewChatPersona", menuName = "Chatbot/Chat Persona")]
public class ChatPersona : ScriptableObject
{
    [Tooltip("Unique ID for this persona, used for memory file naming (e.g. wizard_npc)")]
    public string PersonaId;

    [Tooltip("Display name shown in UI (e.g. Gandalf)")]
    public string DisplayName;

    [Tooltip("LLM model to use")]
    public LlmModel Model = LlmModel.Gemini_2_5_Flash;

    /// <summary>Returns the API-compatible model name string.</summary>
    public string ModelName => Model switch
    {
        // Gemini
        LlmModel.Gemini_2_5_Flash             => "gemini-2.5-flash",
        LlmModel.Gemini_2_5_Flash_Lite         => "gemini-2.5-flash-lite",
        LlmModel.Gemini_2_5_Pro                => "gemini-2.5-pro",
        LlmModel.Gemini_3_Flash                => "gemini-3-flash",
        LlmModel.Gemini_3_Flash_Preview        => "gemini-3-flash-preview",
        LlmModel.Gemini_3_Pro_High             => "gemini-3-pro-high",
        LlmModel.Gemini_3_Pro_Low              => "gemini-3-pro-low",
        LlmModel.Gemini_3_Pro_Preview          => "gemini-3-pro-preview",
        LlmModel.Gemini_3_1_Flash_Image        => "gemini-3.1-flash-image",
        LlmModel.Gemini_3_1_Flash_Lite_Preview => "gemini-3.1-flash-lite-preview",
        LlmModel.Gemini_3_1_Pro_High           => "gemini-3.1-pro-high",
        LlmModel.Gemini_3_1_Pro_Low            => "gemini-3.1-pro-low",
        LlmModel.Gemini_3_1_Pro_Preview        => "gemini-3.1-pro-preview",
        // Claude
        LlmModel.Claude_Sonnet_4_6        => "claude-sonnet-4-6",
        LlmModel.Claude_Opus_4_6_Thinking => "claude-opus-4-6-thinking",
        // GPT / Codex
        LlmModel.GPT_5              => "gpt-5",
        LlmModel.GPT_5_1            => "gpt-5.1",
        LlmModel.GPT_5_1_Codex      => "gpt-5.1-codex",
        LlmModel.GPT_5_1_Codex_Max  => "gpt-5.1-codex-max",
        LlmModel.GPT_5_1_Codex_Mini => "gpt-5.1-codex-mini",
        LlmModel.GPT_5_2            => "gpt-5.2",
        LlmModel.GPT_5_2_Codex      => "gpt-5.2-codex",
        LlmModel.GPT_5_3_Codex      => "gpt-5.3-codex",
        LlmModel.GPT_5_4            => "gpt-5.4",
        LlmModel.GPT_5_4_Mini       => "gpt-5.4-mini",
        LlmModel.GPT_5_Codex        => "gpt-5-codex",
        LlmModel.GPT_5_Codex_Mini   => "gpt-5-codex-mini",
        LlmModel.GPT_OSS_120B_Medium => "gpt-oss-120b-medium",
        _                            => "gemini-2.5-flash",
    };

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
