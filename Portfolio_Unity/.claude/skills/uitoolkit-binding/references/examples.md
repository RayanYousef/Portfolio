# UIToolkit Runtime Binding Examples

## Simple Runtime Binding (UXML)

### ExampleObject.cs - ScriptableObject data source with [CreateProperty]

```csharp
using Unity.Properties;
using UnityEngine;

[CreateAssetMenu]
public class ExampleObject : ScriptableObject
{
    [Header("Simple binding")]
    [CreateProperty]
    public string simpleLabel = "Hello World!";
}
```

### ExampleObject.uxml - Binding in UXML with data-source

```xml
<engine:UXML xmlns:engine="UnityEngine.UIElements" editor-extension-mode="False">
    <engine:Label text="Label" data-source="ExampleObject.asset" data-source-path="simpleLabel">
        <Bindings>
            <engine:DataBinding property="text" binding-mode="ToTarget" />
        </Bindings>
    </engine:Label>
</engine:UXML>
```

---

## Multiple Property Binding

### ExampleMultiPropertiesObject.cs - Multiple properties including computed

```csharp
using Unity.Properties;
using UnityEngine;

[CreateAssetMenu]
public class ExampleMultiPropertiesObject : ScriptableObject
{
    [Header("Bind to multiple properties")]
    [CreateProperty]
    public Vector3 vector3Value;

    [CreateProperty]
    public float sumOfVector3Properties => vector3Value.x + vector3Value.y + vector3Value.z;
}
```

### ExampleMultiPropertiesObject.uxml - Multiple bindings on same data source

```xml
<engine:UXML xmlns:engine="UnityEngine.UIElements" editor-extension-mode="False">
    <engine:VisualElement data-source="MulPropertyObject.asset" style="flex-grow: 1;">
        <engine:Vector3Field label="Vec3 Field">
            <Bindings>
                <engine:DataBinding property="value" data-source-path="vector3Value" binding-mode="ToSource"/>
            </Bindings>
        </engine:Vector3Field>
        <engine:FloatField label="Float Field">
            <Bindings>
                <engine:DataBinding property="value" data-source-path="sumOfVector3Properties" binding-mode="ToTarget"/>
            </Bindings>
        </engine:FloatField>
    </engine:VisualElement>
</engine:UXML>
```

---

## ListView with Runtime Binding

### GameSwitchListAsset.cs - List data source

```csharp
using System;
using System.Collections.Generic;
using UnityEngine;

namespace UIExamples.RuntimeBindingListView
{
    [CreateAssetMenu(fileName = "GameSwitchListAsset.asset", menuName = "GameSwitchListAsset")]
    public class GameSwitchListAsset : ScriptableObject
    {
        public List<GameSwitch> switches = new();

        public void Reset()
        {
            switches = new List<GameSwitch>{
                new() { name = "Use Local Server", enabled = false },
                new() { name = "Show Debug Menu", enabled = false },
                new() { name = "Show FPS Counter", enabled = true },
            };
        }

        [Serializable]
        public struct GameSwitch
        {
            public bool enabled;
            public string name;
        }
    }
}
```

### ListViewItem.uxml - Item template with per-item binding

```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" editor-extension-mode="False">
    <ui:VisualElement style="flex-direction: row;">
        <ui:Toggle>
            <Bindings>
                <ui:DataBinding property="value" data-source-path="enabled" binding-mode="TwoWay"/>
            </Bindings>
        </ui:Toggle>
        <ui:TextField placeholder-text="filler text">
            <Bindings>
                <ui:DataBinding property="value" data-source-path="name" binding-mode="TwoWay"/>
            </Bindings>
        </ui:TextField>
    </ui:VisualElement>
</ui:UXML>
```

### UIListView.uxml - ListView with binding-source-selection-mode

```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" editor-extension-mode="False">
    <ui:ListView binding-source-selection-mode="AutoAssign" item-template="ListViewItem.uxml"
                 data-source="GameSwitchListAsset.asset" show-foldout-header="true"
                 virtualization-method="DynamicHeight" reorderable="true"
                 selection-type="Single" reorder-mode="Animated" show-add-remove-footer="true">
        <Bindings>
            <ui:DataBinding property="itemsSource" data-source-path="switches"/>
        </Bindings>
    </ui:ListView>
</ui:UXML>
```
