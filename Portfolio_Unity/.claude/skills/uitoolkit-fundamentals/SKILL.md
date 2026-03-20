---
name: uitoolkit-fundamentals
description: >
  Core Unity UIToolkit fundamentals for runtime game UI. Use this skill whenever creating new UI screens,
  setting up UIDocument/PanelSettings, writing UXML documents, querying elements with Q()/Query(),
  or building basic UI with VisualElement hierarchy. Trigger when: user says "create UI", "add a screen",
  "UIDocument setup", "UXML", "VisualElement", "runtime UI", "UI Toolkit", or needs to understand the
  basic building blocks of Unity UIToolkit. Consult uitoolkit-design-system for styling.
---

# UIToolkit Fundamentals

Core building blocks for Unity 6 runtime UI using UIToolkit.

## Scene Setup (Runtime)

Every runtime UI needs three things:
1. A **PanelSettings** asset (controls render settings, scale mode, theme TSS)
2. A **UIDocument** component on a GameObject
3. A **UXML** file (the visual tree) assigned to the UIDocument

### MonoBehaviour Pattern for Runtime UI

```csharp
using UnityEngine;
using UnityEngine.UIElements;

public class MyGameUI : MonoBehaviour
{
    // Optional: reference to UXML template for dynamic instantiation
    [SerializeField] VisualTreeAsset m_ListEntryTemplate;

    void OnEnable()
    {
        // UIDocument auto-instantiates the assigned UXML
        var uiDocument = GetComponent<UIDocument>();
        var root = uiDocument.rootVisualElement;

        // Query elements by name
        var button = root.Q<Button>("my-button");
        var label = root.Q<Label>("status-label");

        // Register event callbacks
        button.RegisterCallback<ClickEvent>(OnButtonClicked);
    }

    void OnDisable()
    {
        // Always unregister callbacks to prevent leaks
        var root = GetComponent<UIDocument>().rootVisualElement;
        root.Q<Button>("my-button")?.UnregisterCallback<ClickEvent>(OnButtonClicked);
    }

    void OnButtonClicked(ClickEvent evt)
    {
        Debug.Log("Button clicked!");
    }
}
```

## UXML Document Structure

### Unity 6 Namespace (Preferred)

```xml
<engine:UXML xmlns:engine="UnityEngine.UIElements">
    <Style src="MyStyles.uss" />
    <engine:VisualElement name="root-container" style="flex-grow: 1;">
        <engine:Label text="Hello World" />
        <engine:Button text="Click Me" name="my-button" />
        <engine:Toggle label="Enable?" name="my-toggle" />
        <engine:TextField label="Name" name="name-field" />
    </engine:VisualElement>
</engine:UXML>
```

### Legacy Namespace (Also Valid)

```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" editor-extension-mode="False">
    <Style src="MyStyles.uss" />
    <ui:VisualElement style="flex-grow: 1;">
        <ui:Label text="My Label" />
        <ui:Button text="My Button" name="btn" />
    </ui:VisualElement>
</ui:UXML>
```

Both formats work. The `engine:` prefix is the modern Unity 6 convention. Set `editor-extension-mode="False"` for runtime UI.

## Querying Elements

### By Name (# in USS)
```csharp
var btn = root.Q<Button>("my-button");         // Single element
var label = root.Q<Label>("status-label");
```

### By Class (. in USS)
```csharp
var item = root.Q<VisualElement>(className: "inventory-slot");
```

### Query Multiple Elements
```csharp
// UQueryBuilder for multiple elements
var allButtons = root.Query<Button>().ToList();
var tabs = root.Query<Label>(className: "tab");
tabs.ForEach(tab => tab.RegisterCallback<ClickEvent>(OnTabClicked));
```

### By Type
```csharp
var firstLabel = root.Q<Label>();  // First Label found
```

## Creating Elements in C#

```csharp
// Create elements programmatically
var container = new VisualElement();
container.name = "dynamic-container";
container.AddToClassList("my-container");

var label = new Label("Dynamic Label");
label.name = "dynamic-label";

var button = new Button(() => Debug.Log("Clicked!"));
button.text = "Dynamic Button";
button.name = "dynamic-button";

container.Add(label);
container.Add(button);
root.Add(container);
```

## Instantiating UXML Templates

```csharp
[SerializeField] VisualTreeAsset m_Template;

void CreateFromTemplate()
{
    // Instantiate returns a TemplateContainer (a VisualElement)
    var instance = m_Template.Instantiate();
    root.Add(instance);

    // Or clone directly into a parent
    m_Template.CloneTree(root);
}
```

## Built-in Controls Reference

| Control | UXML | Key Properties |
|---------|------|---------------|
| `Label` | `<engine:Label text="..." />` | text |
| `Button` | `<engine:Button text="..." />` | text, clicked event |
| `Toggle` | `<engine:Toggle label="..." />` | label, value |
| `TextField` | `<engine:TextField label="..." />` | label, value, text |
| `Slider` | `<engine:Slider low-value="0" high-value="100" />` | value, low/highValue |
| `SliderInt` | `<engine:SliderInt low-value="0" high-value="100" />` | value |
| `ProgressBar` | `<engine:ProgressBar value="50" />` | value, title |
| `DropdownField` | `<engine:DropdownField />` | choices, value |
| `RadioButton` | `<engine:RadioButton label="..." />` | value |
| `RadioButtonGroup` | `<engine:RadioButtonGroup />` | value, choices |
| `Foldout` | `<engine:Foldout text="..." />` | text, value (open/closed) |
| `ScrollView` | `<engine:ScrollView />` | mode, scrollOffset |
| `ListView` | `<engine:ListView />` | See uitoolkit-lists skill |
| `Image` | `<engine:Image />` | image, sprite |

## Event System Basics

```csharp
// Click events
button.RegisterCallback<ClickEvent>(evt => { /* handle click */ });

// Value change events (Toggle, TextField, Slider, etc.)
toggle.RegisterValueChangedCallback(evt =>
{
    Debug.Log($"New value: {evt.newValue}");
});

// Pointer events
element.RegisterCallback<PointerDownEvent>(evt => { });
element.RegisterCallback<PointerMoveEvent>(evt => { });
element.RegisterCallback<PointerUpEvent>(evt => { });

// Keyboard (requires focusable = true)
element.RegisterCallback<KeyDownEvent>(evt =>
{
    if (evt.keyCode == KeyCode.Space) { /* handle */ }
});

// Gamepad/runtime navigation
element.RegisterCallback<NavigationSubmitEvent>(evt => { /* handle */ });
```

## Style Manipulation in C#

```csharp
// Inline styles (use sparingly - prefer USS classes)
element.style.backgroundColor = new Color(0.2f, 0.2f, 0.2f);
element.style.width = 200;
element.style.height = 100;
element.style.position = Position.Absolute;
element.style.left = 20;
element.style.top = 20;
element.style.display = DisplayStyle.None;  // Hide
element.style.display = DisplayStyle.Flex;  // Show

// USS class manipulation (PREFERRED approach)
element.AddToClassList("active");
element.RemoveFromClassList("active");
element.ToggleInClassList("active");
element.EnableInClassList("highlighted", isHighlighted);  // Add/remove based on bool
bool hasClass = element.ClassListContains("active");
```

## Important Notes

- **Always use `OnEnable`/`OnDisable`** for registering/unregistering callbacks on MonoBehaviours
- **UIDocument auto-instantiates** the assigned UXML — don't manually instantiate it again
- **`rootVisualElement`** is the entry point to the entire UI tree
- **Prefer USS classes over inline styles** for maintainability
- **Set `picking-mode="Ignore"`** on overlay/decorative elements that shouldn't block input
- **For runtime, don't use `UnityEditor` namespace** — it's editor-only and won't compile in builds

## Reference Examples

For complete working examples, see `references/examples.md` in this skill directory.
It contains the full source code for the Simple Runtime UI example (MonoBehaviour + UXML) and UXML instantiation patterns.
