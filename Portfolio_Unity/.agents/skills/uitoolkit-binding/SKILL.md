---
name: uitoolkit-binding
description: Core skill for runtime data binding in Unity 6 UI Toolkit. Make sure to use this skill when asked to bind C# data to UI elements, use INotifyPropertyChanged, set data sources, use binding-path, or create custom binding converters. MUST be used for dynamic UI that updates when data changes. DO NOT use Editor-only binding APIs (SerializedObject).
---

# Unity 6 UI Toolkit Runtime Data Binding

This skill explains how to synchronize C# object properties with visual element properties at runtime.

## Trigger Conditions
- Use when requested to bind data to UI components (Labels, TextFields, Sliders).
- Use when setting up models (`INotifyPropertyChanged`) for UI Toolkit.
- Use when the prompt mentions `dataSource`, `binding-path`, or dynamic updates.

## Runtime Binding Core Principles
- **No `SerializedObject`**: Unity 6 runtime data binding uses standard C# objects and `.dataSource`, NEVER `SerializedObject` or `SerializedProperty` (which are for the Editor).
- **`INotifyPropertyChanged`**: For UI to update when data changes (two-way or one-way from source), your C# data model must implement `System.ComponentModel.INotifyPropertyChanged`.
- **Inheritance**: The `.dataSource` property inherits down the visual tree. Set it on a parent container, and all children can bind to it.

## 1. Creating the Data Model (`INotifyPropertyChanged`)
This is the standard C# pattern for observable properties.

```csharp
using System.ComponentModel;
using System.Runtime.CompilerServices;

public class PlayerStats : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler PropertyChanged;

    private string _playerName;
    public string PlayerName
    {
        get => _playerName;
        set
        {
            if (_playerName != value)
            {
                _playerName = value;
                OnPropertyChanged();
            }
        }
    }

    private int _health;
    public int Health
    {
        get => _health;
        set
        {
            if (_health != value)
            {
                _health = value;
                OnPropertyChanged();
            }
        }
    }

    protected void OnPropertyChanged([CallerMemberName] string name = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
    }
}
```

## 2. Binding via UXML (`binding-path`)
The simplest way to bind is to set the `binding-path` attribute in UXML. Elements like `Label` (binds to `text`), `TextField` (binds to `value`), and `SliderInt` (binds to `value`) know their primary binding property automatically.

### UXML Setup
```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" xmlns:uie="UnityEditor.UIElements">
    <ui:VisualElement name="player-panel">
        <!-- Binds the text property of the Label to PlayerStats.PlayerName -->
        <ui:Label binding-path="PlayerName" class="heading-1" />

        <!-- Binds the value property of the SliderInt to PlayerStats.Health -->
        <ui:SliderInt label="Health" low-value="0" high-value="100" binding-path="Health" />
    </ui:VisualElement>
</ui:UXML>
```

### C# Setup (Assigning the Data Source)
```csharp
using UnityEngine;
using UnityEngine.UIElements;

public class PlayerUIController : MonoBehaviour
{
    private PlayerStats _stats;

    void Start()
    {
        _stats = new PlayerStats { PlayerName = "Hero", Health = 100 };

        var root = GetComponent<UIDocument>().rootVisualElement;
        var panel = root.Q<VisualElement>("player-panel");

        // Setting dataSource on the parent automatically binds the children
        // using their binding-path attributes.
        panel.dataSource = _stats;
    }
}
```

## 3. Explicit Binding via C#
Sometimes you need to bind a specific property of an element that isn't its primary one, or bind multiple properties.

```csharp
// Bind the `text` property of a generic Label to a nested path
var titleLabel = root.Q<Label>("title-label");
titleLabel.SetBinding("text", new DataBinding
{
    dataSourcePath = new PropertyPath("Settings.Title")
});
```

## 4. Custom Data Type Converters
If the source type (e.g., `int`) doesn't match the UI property type (e.g., `string` on a generic Label without auto-conversion), you must create a `BindingConverter`.

```csharp
using UnityEngine.UIElements;

public class IntToStringConverter : BindingConverter<int, string>
{
    public override bool TryConvert(ref int value, out string result)
    {
        result = value.ToString();
        return true;
    }

    public override bool TryConvertBack(ref string value, out int result)
    {
        return int.TryParse(value, out result);
    }
}

// Applying the converter in C#
var scoreLabel = root.Q<Label>("score-label");
var binding = new DataBinding
{
    dataSourcePath = new PropertyPath("Score"),
    converter = new IntToStringConverter()
};
scoreLabel.SetBinding("text", binding);
```

## Best Practices & Gotchas
- **Nested Paths**: You can bind to nested properties using dot notation: `binding-path="Stats.Health"`. Ensure all intermediate objects in the path are instantiated.
- **`binding-path` vs `SetBinding`**: Prefer `binding-path` in UXML for primary properties (e.g., text, value). Use C# `SetBinding` for secondary properties (like a custom style or class name toggle) or when converters are needed.
- **Always Notify**: If a property changes in code but `PropertyChanged` isn't invoked, the UI will not update. This is the most common bug in runtime binding.

## File References
- Explore `Assets/UIToolkit-Manual-Examples/bind-with-binding-path/`
- Explore `Assets/UIToolkit-Manual-Examples/bind-custom-data-type/`
