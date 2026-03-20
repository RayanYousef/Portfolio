---
name: uitoolkit-binding
description: >
  Unity UIToolkit runtime data binding for game UI. Use this skill for connecting C# data to UI elements,
  reactive UI updates, data sources, and property binding. Trigger when: user mentions "data binding",
  "bind", "dataSource", "reactive UI", "data-driven UI", "update UI from code", "SetBinding",
  "CreateProperty", "INotifyBindablePropertyChanged", or needs UI to reflect C# data automatically.
  For list/collection binding, also consult uitoolkit-lists.
---

# UIToolkit Runtime Data Binding

Unity 6 has TWO binding systems. This skill focuses on the **runtime binding system** which works in builds.

## Two Binding Systems — Know the Difference

| Feature | Runtime Binding (USE THIS) | Editor Binding (DON'T use for games) |
|---------|---------------------------|--------------------------------------|
| Works in builds | Yes | No |
| Data source | Any C# object with `[CreateProperty]` | `SerializedObject` / `SerializedProperty` |
| Setup | `data-source`, `DataBinding` | `binding-path`, `.Bind(serializedObject)` |
| Namespace | `UnityEngine.UIElements` | `UnityEditor.UIElements` |

**Rule**: If you see `SerializedObject`, `SerializedProperty`, `.Bind(so)`, or `binding-path="m_Name"`,
that's editor-only binding. Don't use it for runtime game UI.

## Runtime Binding — UXML Approach (Simplest)

### Step 1: Create a Data Source

```csharp
using Unity.Properties;
using UnityEngine;

[CreateAssetMenu]
public class PlayerData : ScriptableObject
{
    [CreateProperty]
    public string playerName = "Hero";

    [CreateProperty]
    public int health = 100;

    [CreateProperty]
    public Vector3 position;

    // Computed properties work too
    [CreateProperty]
    public float healthPercent => health / 100f;
}
```

The `[CreateProperty]` attribute is essential — it tells the binding system to generate property
accessors for the field. Without it, binding won't work.

### Step 2: Bind in UXML

```xml
<engine:UXML xmlns:engine="UnityEngine.UIElements">
    <!-- data-source points to the asset file -->
    <engine:Label text="Label" data-source="PlayerData.asset" data-source-path="playerName">
        <Bindings>
            <engine:DataBinding property="text" binding-mode="ToTarget" />
        </Bindings>
    </engine:Label>
</engine:UXML>
```

### Binding Modes

| Mode | Direction | Use Case |
|------|-----------|----------|
| `ToTarget` | Data → UI | Display-only (health bar, score label) |
| `ToSource` | UI → Data | Input fields that write back to data |
| `TwoWay` | Data ↔ UI | Editable settings, forms |

## Runtime Binding — C# Approach

For dynamic binding at runtime:

```csharp
using UnityEngine;
using UnityEngine.UIElements;

public class GameUI : MonoBehaviour
{
    [SerializeField] PlayerData playerData;

    void OnEnable()
    {
        var root = GetComponent<UIDocument>().rootVisualElement;
        var nameLabel = root.Q<Label>("player-name");

        // Set the data source on the element
        nameLabel.dataSource = playerData;

        // Create and set the binding
        nameLabel.SetBinding("text", new DataBinding
        {
            dataSourcePath = new PropertyPath("playerName"),
            bindingMode = BindingMode.ToTarget
        });
    }
}
```

## Data Source Inheritance

When you set `data-source` on a parent element, all children inherit it:

```xml
<engine:VisualElement data-source="PlayerData.asset">
    <!-- Both children use PlayerData as their source -->
    <engine:Label text="">
        <Bindings>
            <engine:DataBinding property="text" data-source-path="playerName" binding-mode="ToTarget"/>
        </Bindings>
    </engine:Label>
    <engine:ProgressBar>
        <Bindings>
            <engine:DataBinding property="value" data-source-path="health" binding-mode="ToTarget"/>
        </Bindings>
    </engine:ProgressBar>
</engine:VisualElement>
```

## Multiple Property Binding

Bind multiple UI elements to different properties of the same data source:

```csharp
[CreateAssetMenu]
public class StatsData : ScriptableObject
{
    [CreateProperty]
    public Vector3 vector3Value;

    [CreateProperty]
    public float sumOfProperties => vector3Value.x + vector3Value.y + vector3Value.z;
}
```

```xml
<engine:VisualElement data-source="StatsData.asset" style="flex-grow: 1;">
    <engine:Vector3Field label="Position">
        <Bindings>
            <engine:DataBinding property="value" data-source-path="vector3Value" binding-mode="ToSource"/>
        </Bindings>
    </engine:Vector3Field>
    <engine:FloatField label="Sum">
        <Bindings>
            <engine:DataBinding property="value" data-source-path="sumOfProperties" binding-mode="ToTarget"/>
        </Bindings>
    </engine:FloatField>
</engine:VisualElement>
```

## Making Data Sources Reactive

For data sources that aren't ScriptableObjects (plain C# classes), implement
`INotifyBindablePropertyChanged` to push updates to the UI:

```csharp
using System;
using Unity.Properties;
using UnityEngine.UIElements;

public class GameState : INotifyBindablePropertyChanged
{
    public event EventHandler<BindablePropertyChangedEventArgs> propertyChanged;

    int m_Score;

    [CreateProperty]
    public int Score
    {
        get => m_Score;
        set
        {
            if (m_Score != value)
            {
                m_Score = value;
                Notify(nameof(Score));
            }
        }
    }

    void Notify(string property)
    {
        propertyChanged?.Invoke(this, new BindablePropertyChangedEventArgs(property));
    }
}
```

## Binding with ListView

See the `uitoolkit-lists` skill for list-specific binding patterns. Key concept:

```xml
<engine:ListView data-source="GameSwitchListAsset.asset"
                 binding-source-selection-mode="AutoAssign"
                 item-template="ListViewItem.uxml">
    <Bindings>
        <engine:DataBinding property="itemsSource" data-source-path="switches"/>
    </Bindings>
</engine:ListView>
```

## Common Mistakes

1. **Forgetting `[CreateProperty]`** — Fields without this attribute won't bind
2. **Using `binding-path` for runtime** — That's the editor system. Use `data-source-path` + `<Bindings>`
3. **Using `SerializedObject.Bind()`** — Editor-only. Use `dataSource` + `SetBinding()` instead
4. **Wrong binding mode** — Use `ToTarget` for display, `ToSource` for input, `TwoWay` for editable fields
5. **Forgetting to notify** — Plain C# objects need `INotifyBindablePropertyChanged` for reactive updates

## Reference Examples

For complete working examples, see `references/examples.md` in this skill directory.
It contains runtime binding examples: simple label binding, multi-property binding, and ListView with runtime binding.
