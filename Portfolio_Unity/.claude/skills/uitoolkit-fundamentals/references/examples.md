# UIToolkit Fundamentals - Reference Examples

Complete working examples demonstrating core UIToolkit patterns for runtime UI.

---

## Simple Runtime UI Example

A minimal MonoBehaviour setup that shows how to wire up a runtime UI: querying elements by name, registering/unregistering click and change callbacks, and reading control values at runtime.

### Patterns Demonstrated

- Getting `UIDocument` via `GetComponent` in `OnEnable`
- Querying elements by name with `Q()`
- Registering `ClickEvent` and `ChangeEvent<string>` callbacks
- Unregistering callbacks in `OnDisable` to prevent leaks
- Reading `Toggle.value` at event time

### SimpleRuntimeUI.cs

```csharp
using UnityEngine;
using UnityEngine.UIElements;

public class SimpleRuntimeUI : MonoBehaviour
{
    private Button _button;
    private Toggle _toggle;
    private int _clickCount;

    private void OnEnable()
    {
        var uiDocument = GetComponent<UIDocument>();
        _button = uiDocument.rootVisualElement.Q("button") as Button;
        _toggle = uiDocument.rootVisualElement.Q("toggle") as Toggle;
        _button.RegisterCallback<ClickEvent>(PrintClickMessage);
        var _inputFields = uiDocument.rootVisualElement.Q("input-message");
        _inputFields.RegisterCallback<ChangeEvent<string>>(InputMessage);
    }

    private void OnDisable()
    {
        _button.UnregisterCallback<ClickEvent>(PrintClickMessage);
    }

    private void PrintClickMessage(ClickEvent evt)
    {
        ++_clickCount;
        Debug.Log($"{"button"} was clicked!" +
                (_toggle.value ? " Count: " + _clickCount : ""));
    }

    public static void InputMessage(ChangeEvent<string> evt)
    {
        Debug.Log($"{evt.newValue} -> {evt.target}");
    }
}
```

### SimpleRuntimeUI.uxml

A basic UXML document containing the most common built-in controls: Label, Button, Toggle, and TextField. Uses the legacy `ui:` namespace prefix with `editor-extension-mode="False"` for runtime compatibility.

```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" xmlns:uie="UnityEditor.UIElements" xsi="http://www.w3.org/2001/XMLSchema-instance" engine="UnityEngine.UIElements" editor="UnityEditor.UIElements" noNamespaceSchemaLocation="../UIElementsSchema/UIElements.xsd" editor-extension-mode="False">
    <ui:VisualElement style="flex-grow: 1;">
        <ui:Label text="This is a Label" display-tooltip-when-elided="true" />
        <ui:Button text="This is a Button" display-tooltip-when-elided="true" name="button" />
        <ui:Toggle label="Display the counter?" name="toggle" />
        <ui:TextField picking-mode="Ignore" label="Text Field" value="filler text" text="filler text" name="input-message" />
    </ui:VisualElement>
</ui:UXML>
```

---

## UXML Instantiation Patterns

A minimal UXML template intended for instantiation via `VisualTreeAsset.Instantiate()` or `CloneTree()`. Demonstrates the pattern of defining reusable UI fragments that can be loaded and added to the visual tree at runtime or in editor scripts.

### Patterns Demonstrated

- Lightweight UXML template with named elements for later querying
- Using `editor-extension-mode="False"` for runtime-safe templates
- Naming conventions for buttons and toggles (`button1`, `toggle1`) that map to `Q()` queries in C#

### SimpleCustomEditor.uxml

```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" xmlns:uie="UnityEditor.UIElements" editor-extension-mode="False">
    <ui:Label text="These controls were created in UI Builder." />
    <ui:Button text="This is button1" name="button1"/>
    <ui:Toggle label="Number?" name="toggle1"/>
</ui:UXML>
```

### Usage in C#

```csharp
[SerializeField] VisualTreeAsset m_Template;

void CreateFromTemplate()
{
    var instance = m_Template.Instantiate();
    var button = instance.Q<Button>("button1");
    var toggle = instance.Q<Toggle>("toggle1");
    root.Add(instance);
}
```
