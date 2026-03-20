---
name: uitoolkit-fundamentals
description: Core skill for setting up Unity 6 UI Toolkit runtime UI. Use this skill when the user asks to "create a UI", "setup UIDocument", "write UXML", or when starting any new UI component. Covers the fundamental UXML structure, scene setup, and basic C# scripting to query the visual tree. Always reference the 'uitoolkit-design-system' skill for styling.
---

# Unity 6 UI Toolkit Fundamentals

This skill covers the basic mechanics of integrating UI Toolkit into a Unity 6 scene at runtime. It explains UXML structure, the `UIDocument` component, and how to access UI elements via C#.

## Trigger Conditions
- Use when setting up a new scene or adding UI to an existing scene.
- Use when asked to generate simple UXML structures or query elements via C#.
- Combine with `uitoolkit-layout` for positioning and `uitoolkit-design-system` for styling.

## The UIDocument Component
The entry point for runtime UI Toolkit is the `UIDocument` component.
- Attach it to an empty GameObject in the scene.
- Assign a `.uxml` file (the "Visual Tree Asset") to its `visualTreeAsset` property.
- Assign a `.uss` file (if not globally assigned via Panel Settings) to the `panelSettings` or directly reference it in the UXML.

## Basic UXML Structure
UXML is an XML-based language for defining the UI hierarchy.
- Use `<ui:UXML>` as the root tag, defining namespaces (`xmlns:ui="UnityEngine.UIElements"`).
- Use semantic tags like `<ui:VisualElement>`, `<ui:Label>`, `<ui:Button>`.
- **Always** use `class="kebab-case-name"` for styling, not inline styles.
- Use `name="camelCaseName"` for identifying elements in C#.

### Example: Simple Menu UXML (`MainMenu.uxml`)
```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" xmlns:uie="UnityEditor.UIElements" xsi="http://www.w3.org/2001/XMLSchema-instance" engine="UnityEngine.UIElements" editor="UnityEditor.UIElements" noNamespaceSchemaLocation="../../UIElementsSchema/UIElements.xsd" editor-extension-mode="False">

    <!-- Link the specific stylesheet for this component. The global theme is expected to be on the Panel Settings -->
    <Style src="project://database/Assets/UI/MainMenu.uss" />

    <ui:VisualElement class="main-menu-container">
        <ui:Label text="Welcome to the Game" name="titleLabel" class="heading-1" />

        <ui:VisualElement class="button-group">
            <ui:Button text="Start Game" name="startBtn" class="custom-button primary-btn" />
            <ui:Button text="Settings" name="settingsBtn" class="custom-button secondary-btn" />
            <ui:Button text="Quit" name="quitBtn" class="custom-button danger-btn" />
        </ui:VisualElement>
    </ui:VisualElement>
</ui:UXML>
```

## Accessing the Visual Tree (C#)
To interact with the UI, attach a `MonoBehaviour` to the same GameObject as the `UIDocument` (or pass the UIDocument reference).
- Get the root of the visual tree via `uiDocument.rootVisualElement`.
- Query specific elements using `root.Q<T>("elementName")` or `root.Query<T>("className")`.
- Register callbacks for interactions (e.g., `ClickEvent`).

### Example: Menu Controller C# (`MainMenuController.cs`)
```csharp
using UnityEngine;
using UnityEngine.UIElements;

[RequireComponent(typeof(UIDocument))]
public class MainMenuController : MonoBehaviour
{
    private UIDocument _uiDocument;
    private Button _startBtn;
    private Button _settingsBtn;
    private Button _quitBtn;

    void OnEnable()
    {
        _uiDocument = GetComponent<UIDocument>();
        var root = _uiDocument.rootVisualElement;

        // Querying elements by name (defined in UXML)
        _startBtn = root.Q<Button>("startBtn");
        _settingsBtn = root.Q<Button>("settingsBtn");
        _quitBtn = root.Q<Button>("quitBtn");

        // Registering callbacks
        _startBtn?.RegisterCallback<ClickEvent>(OnStartClicked);
        _settingsBtn?.RegisterCallback<ClickEvent>(OnSettingsClicked);
        _quitBtn?.RegisterCallback<ClickEvent>(OnQuitClicked);
    }

    void OnDisable()
    {
        // Always unregister callbacks to prevent memory leaks
        _startBtn?.UnregisterCallback<ClickEvent>(OnStartClicked);
        _settingsBtn?.UnregisterCallback<ClickEvent>(OnSettingsClicked);
        _quitBtn?.UnregisterCallback<ClickEvent>(OnQuitClicked);
    }

    private void OnStartClicked(ClickEvent evt)
    {
        Debug.Log("Starting game...");
        // Load scene, etc.
    }

    private void OnSettingsClicked(ClickEvent evt)
    {
        Debug.Log("Opening settings...");
    }

    private void OnQuitClicked(ClickEvent evt)
    {
        Application.Quit();
    }
}
```

## Best Practices & Gotchas
- **Performance**: Avoid deep nesting of `VisualElements`. Keep the tree shallow.
- **Querying**: Querying (`Q<T>`) searches the entire tree below the node. Cache queried elements in `OnEnable` rather than querying every frame or inside frequently called methods.
- **Callbacks**: Always unregister callbacks in `OnDisable` or `OnDestroy` if the element might be destroyed while the script persists.
- **Null Checks**: Always null-check the results of `Q<T>` (`_button?.RegisterCallback...`) to avoid exceptions if the UXML is modified and names change.

## File References
- Explore `Assets/UIToolkit-Manual-Examples/simple-runtime-ui/`
- Explore `Assets/UIToolkit-Manual-Examples/simple-ui-toolkit-workflow/`
