---
name: uitoolkit-patterns
description: >
  Complete Unity UIToolkit UI recipes combining multiple patterns for runtime game UI. Use this skill
  when building full UI screens like inventory, settings menu, HUD, character select, dialog system,
  or shop interface. Trigger when: user asks for a complete UI screen, "inventory UI", "settings menu",
  "HUD", "health bar", "dialog box", "shop UI", "character selection", "pause menu", "main menu",
  "game over screen", or any request that implies assembling multiple UIToolkit concepts together.
  This skill references all other uitoolkit-* skills for specific patterns.
---

# UIToolkit Complete UI Patterns

Ready-to-use recipes for common game UI screens. Each pattern combines UXML, USS, and C# into a
complete working solution. For detailed information on individual features, consult the specialized skills:
- **uitoolkit-design-system** — Theme variables, USS conventions
- **uitoolkit-fundamentals** — UXML structure, element queries, events
- **uitoolkit-layout** — Flexbox, positioning, ScrollView
- **uitoolkit-binding** — Runtime data binding
- **uitoolkit-lists** — ListView, TreeView
- **uitoolkit-custom-controls** — Custom VisualElements
- **uitoolkit-navigation** — Tabs, popups, drag-and-drop
- **uitoolkit-styling-animation** — Transitions, animations

---

## Pattern: Game HUD

A heads-up display with health bar, score, and minimap area.

### HUD.uxml
```xml
<engine:UXML xmlns:engine="UnityEngine.UIElements">
    <Style src="GameTheme.uss" />
    <Style src="HUD.uss" />
    <engine:VisualElement name="hud-root" picking-mode="Ignore">
        <!-- Top Bar -->
        <engine:VisualElement name="top-bar" class="hud-bar">
            <engine:VisualElement name="health-container" class="hud-stat">
                <engine:Label text="HP" class="hud-stat__label" />
                <engine:VisualElement name="health-bar" class="bar">
                    <engine:VisualElement name="health-fill" class="bar__fill bar__fill--health" />
                </engine:VisualElement>
                <engine:Label name="health-text" text="100/100" class="hud-stat__value" />
            </engine:VisualElement>
            <engine:Label name="score-label" text="Score: 0" class="hud-score" />
        </engine:VisualElement>

        <!-- Bottom Bar -->
        <engine:VisualElement name="bottom-bar" class="hud-bar hud-bar--bottom">
            <engine:Label name="interaction-prompt" class="interaction-prompt" />
        </engine:VisualElement>
    </engine:VisualElement>
</engine:UXML>
```

### HUD.uss
```css
#hud-root {
    flex-grow: 1;
    justify-content: space-between;
}

.hud-bar {
    flex-direction: row;
    padding: var(--spacing-md);
    justify-content: space-between;
    align-items: center;
}

.hud-bar--bottom {
    justify-content: center;
}

.hud-stat {
    flex-direction: row;
    align-items: center;
}

.hud-stat__label {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-right: var(--spacing-sm);
    -unity-font-style: bold;
}

.hud-stat__value {
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
    margin-left: var(--spacing-sm);
}

.bar {
    width: 200px;
    height: 16px;
    background-color: var(--color-bg-dark);
    border-radius: var(--border-radius-md);
    overflow: hidden;
}

.bar__fill {
    height: 100%;
    transition: width 0.3s ease-out;
}

.bar__fill--health {
    background-color: var(--color-success);
}

.hud-score {
    font-size: var(--font-size-lg);
    color: var(--color-text-primary);
    -unity-font-style: bold;
}

.interaction-prompt {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.interaction-prompt.visible {
    opacity: 1;
}
```

### HUDController.cs
```csharp
using UnityEngine;
using UnityEngine.UIElements;

public class HUDController : MonoBehaviour
{
    VisualElement m_HealthFill;
    Label m_HealthText;
    Label m_ScoreLabel;
    Label m_InteractionPrompt;

    void OnEnable()
    {
        var root = GetComponent<UIDocument>().rootVisualElement;
        m_HealthFill = root.Q("health-fill");
        m_HealthText = root.Q<Label>("health-text");
        m_ScoreLabel = root.Q<Label>("score-label");
        m_InteractionPrompt = root.Q<Label>("interaction-prompt");
    }

    public void SetHealth(float current, float max)
    {
        float pct = Mathf.Clamp01(current / max);
        m_HealthFill.style.width = Length.Percent(pct * 100f);
        m_HealthText.text = $"{Mathf.RoundToInt(current)}/{Mathf.RoundToInt(max)}";
    }

    public void SetScore(int score)
    {
        m_ScoreLabel.text = $"Score: {score}";
    }

    public void ShowInteractionPrompt(string text)
    {
        m_InteractionPrompt.text = text;
        m_InteractionPrompt.AddToClassList("visible");
    }

    public void HideInteractionPrompt()
    {
        m_InteractionPrompt.RemoveFromClassList("visible");
    }
}
```

---

## Pattern: Inventory Screen

A tabbed inventory with item grid, item details, and drag-and-drop.

### Architecture
```
InventoryScreen.uxml          — Main layout
├── GameTheme.uss              — Shared design tokens
├── InventoryScreen.uss        — Screen-specific styles
├── InventoryItem.uxml         — Item slot template (for ListView)
└── InventoryController.cs     — MonoBehaviour wiring
```

### Key Implementation Points

1. **Use ListView** for the item grid (see uitoolkit-lists skill):
   ```csharp
   listView.makeItem = () => m_ItemTemplate.Instantiate();
   listView.bindItem = (element, index) => {
       var icon = element.Q<VisualElement>("item-icon");
       icon.style.backgroundImage = new StyleBackground(items[index].icon);
   };
   ```

2. **Wrap items in a grid** using ScrollView with flex-wrap (see uitoolkit-layout skill):
   ```css
   .inventory-grid .unity-scroll-view__content-container {
       flex-direction: row;
       flex-wrap: wrap;
   }
   ```

3. **Item detail panel** updates on selection:
   ```csharp
   listView.selectionChanged += items => UpdateDetailPanel(items.First());
   ```

4. **Drag-and-drop** for rearranging (see uitoolkit-navigation skill):
   ```csharp
   slot.AddManipulator(new DragManipulator(slot));
   ```

---

## Pattern: Settings Menu

### SettingsMenu.uxml
```xml
<engine:UXML xmlns:engine="UnityEngine.UIElements">
    <Style src="GameTheme.uss" />
    <Style src="SettingsMenu.uss" />
    <engine:VisualElement class="settings-overlay">
        <engine:VisualElement class="settings-panel">
            <engine:Label text="Settings" class="settings-title" />

            <!-- Tabs -->
            <engine:VisualElement name="tabs" class="settings-tabs">
                <engine:Label name="AudioTab" text="Audio" class="tab currentlySelectedTab" />
                <engine:Label name="VideoTab" text="Video" class="tab" />
                <engine:Label name="ControlsTab" text="Controls" class="tab" />
            </engine:VisualElement>

            <!-- Tab Content -->
            <engine:VisualElement name="tabContent" class="settings-content">
                <engine:VisualElement name="AudioContent">
                    <engine:Slider label="Master Volume" low-value="0" high-value="100"
                                   value="80" name="master-volume" />
                    <engine:Slider label="Music" low-value="0" high-value="100"
                                   value="70" name="music-volume" />
                    <engine:Slider label="SFX" low-value="0" high-value="100"
                                   value="90" name="sfx-volume" />
                    <engine:Toggle label="Mute All" name="mute-toggle" />
                </engine:VisualElement>

                <engine:VisualElement name="VideoContent" class="unselectedContent">
                    <engine:DropdownField label="Resolution" name="resolution" />
                    <engine:DropdownField label="Quality" name="quality" />
                    <engine:Toggle label="Fullscreen" name="fullscreen" />
                    <engine:Toggle label="VSync" name="vsync" />
                </engine:VisualElement>

                <engine:VisualElement name="ControlsContent" class="unselectedContent">
                    <engine:Slider label="Mouse Sensitivity" low-value="0.1" high-value="10"
                                   value="2" name="sensitivity" />
                    <engine:Toggle label="Invert Y" name="invert-y" />
                </engine:VisualElement>
            </engine:VisualElement>

            <!-- Buttons -->
            <engine:VisualElement class="settings-buttons">
                <engine:Button text="Apply" name="apply-btn" class="btn btn--primary" />
                <engine:Button text="Cancel" name="cancel-btn" class="btn btn--secondary" />
            </engine:VisualElement>
        </engine:VisualElement>
    </engine:VisualElement>
</engine:UXML>
```

---

## Pattern: Pause Menu

```csharp
public class PauseMenu : MonoBehaviour
{
    [SerializeField] UIDocument m_PauseUI;

    void OnEnable()
    {
        var root = m_PauseUI.rootVisualElement;
        root.style.display = DisplayStyle.None;  // Hidden by default

        root.Q<Button>("resume-btn").RegisterCallback<ClickEvent>(_ => Resume());
        root.Q<Button>("settings-btn").RegisterCallback<ClickEvent>(_ => OpenSettings());
        root.Q<Button>("quit-btn").RegisterCallback<ClickEvent>(_ => QuitToMenu());
    }

    public void TogglePause()
    {
        var root = m_PauseUI.rootVisualElement;
        bool isPaused = root.style.display == DisplayStyle.Flex;

        root.style.display = isPaused ? DisplayStyle.None : DisplayStyle.Flex;
        Time.timeScale = isPaused ? 1f : 0f;
    }

    void Resume() => TogglePause();
    void OpenSettings() { /* Show settings overlay */ }
    void QuitToMenu() => SceneManager.LoadScene("MainMenu");
}
```

---

## Pattern: Character Selection (Master-Detail with ListView)

Combines ListView (left panel) with detail view (right panel).
See the complete working example in the `uitoolkit-lists` skill's `references/examples.md`.

Key architecture:
- `MainView.cs` — MonoBehaviour, wires UIDocument to controller
- `CharacterListController.cs` — Sets up ListView, handles selection
- `CharacterListEntryController.cs` — Binds data to individual list items
- `MainView.uxml` — Side-by-side layout with ListView and detail panel
- `ListEntry.uxml` — Template for each list item

---

## Best Practices Checklist

When building any game UI screen:

1. **Create `GameTheme.uss`** first with all design tokens (see uitoolkit-design-system)
2. **Import theme USS first** in every UXML file: `<Style src="GameTheme.uss" />`
3. **Set `picking-mode="Ignore"`** on the root HUD container so it doesn't block game input
4. **Use USS classes** for state changes, not inline styles
5. **Register callbacks in `OnEnable`**, unregister in `OnDisable`
6. **Use transitions** for smooth state changes (see uitoolkit-styling-animation)
7. **Set `UsageHints.DynamicTransform`** on elements that move every frame
8. **Use `fixedItemHeight`** on ListView for better performance
9. **Keep C# controllers separate** from MonoBehaviours for testability
10. **Use `data-source` binding** for data-driven UI instead of manual updates
