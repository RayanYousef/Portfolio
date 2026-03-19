# UXML Reference

## Table of Contents
1. [Built-in Elements](#built-in-elements)
2. [Editor-only Elements](#editor-only-elements)
3. [Templates and Instances](#templates-and-instances)
4. [Data Binding](#data-binding)
5. [Naming Conventions](#naming-conventions)
6. [Common Attribute Patterns](#common-attribute-patterns)

---

## Built-in Elements

| Element | Purpose | Key Attributes |
|---------|---------|---------------|
| `ui:VisualElement` | Container (like HTML div) | `name`, `class`, `style`, `picking-mode` |
| `ui:Label` | Text display | `text`, `enable-rich-text`, `display-tooltip-when-elided` |
| `ui:Button` | Clickable button | `text`, `name` |
| `ui:Toggle` | Checkbox | `label`, `value`, `name` |
| `ui:TextField` | Text input | `label`, `value`, `placeholder-text`, `readonly` |
| `ui:Slider` | Float slider | `label`, `low-value`, `high-value`, `value` |
| `ui:SliderInt` | Integer slider | `label`, `low-value`, `high-value`, `value` |
| `ui:MinMaxSlider` | Range slider | `label`, `min-value`, `max-value`, `low-limit`, `high-limit` |
| `ui:Foldout` | Collapsible section | `text`, `value` (true=open) |
| `ui:DropdownField` | Dropdown selector | `label`, `choices`, `index` |
| `ui:RadioButton` | Radio option | `label`, `value` |
| `ui:RadioButtonGroup` | Radio group | `label`, `choices` |
| `ui:ProgressBar` | Progress bar | `title`, `low-value`, `high-value`, `value` |
| `ui:ScrollView` | Scrollable container | `mode`, `horizontal-scroller-visibility`, `vertical-scroller-visibility` |
| `ui:ListView` | Virtualized list | `fixed-item-height`, `virtualization-method`, `selection-type`, `reorderable`, `show-add-remove-footer`, `show-foldout-header` |
| `ui:MultiColumnListView` | Multi-column list | `fixed-item-height` + `<ui:Columns>` children |
| `ui:TreeView` | Hierarchical list | Same as ListView |
| `ui:MultiColumnTreeView` | Hierarchical multi-column | Same as MultiColumnListView |
| `ui:GroupBox` | Labeled group | `text` |
| `ui:Box` | Simple bordered container | — |
| `ui:Image` | Image (set via C#) | — |

### ListView Configuration
```xml
<ui:ListView
    fixed-item-height="40"
    virtualization-method="DynamicHeight"
    selection-type="Single"
    reorderable="true"
    reorder-mode="Animated"
    show-add-remove-footer="true"
    show-foldout-header="true"
    show-border="true"
    name="item-list" />
```

### MultiColumnListView with Columns
```xml
<ui:MultiColumnListView fixed-item-height="20" name="data-table">
    <ui:Columns>
        <ui:Column name="name" title="Name" width="120" />
        <ui:Column name="value" title="Value" width="80" />
        <ui:Column name="active" title="Active?" width="60" />
    </ui:Columns>
</ui:MultiColumnListView>
```

### ScrollView with Wrapping Content
```xml
<ui:ScrollView name="grid-scroll">
    <ui:VisualElement class="grid-container"
        style="flex-direction: row; flex-wrap: wrap; justify-content: space-around;" />
</ui:ScrollView>
```

---

## Editor-only Elements

Require namespace: `xmlns:uie="UnityEditor.UIElements"`

| Element | Purpose |
|---------|---------|
| `uie:PropertyField` | Auto-draws a serialized property |
| `uie:ObjectField` | Object reference picker |
| `uie:ColorField` | Color picker |
| `uie:CurveField` | Animation curve editor |
| `uie:GradientField` | Gradient editor |
| `uie:EnumField` | Enum dropdown |
| `uie:FloatField` / `uie:IntegerField` / `uie:DoubleField` | Numeric inputs |
| `uie:Vector2Field` / `uie:Vector3Field` / `uie:Vector4Field` | Vector inputs |

```xml
<uie:PropertyField binding-path="tankName" name="tank-name-field" />
<uie:PropertyField binding-path="tankSize" name="tank-size-field" />
```

---

## Templates and Instances

Reusable UXML components:

```xml
<!-- Main screen references a template -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <Template name="ItemSlot" src="ItemSlot.uxml" />

    <ui:VisualElement class="inventory">
        <ui:Instance template="ItemSlot" name="slot-1" />
        <ui:Instance template="ItemSlot" name="slot-2" />
        <ui:Instance template="ItemSlot" name="slot-3" />
    </ui:VisualElement>
</ui:UXML>
```

Templates with data binding:
```xml
<Template name="switch" src="game_switch.uxml" />
<Instance template="switch" binding-path="useLocalServer" />
<Instance template="switch" binding-path="showDebugMenu" />
```

---

## Data Binding

### Editor Binding (SerializedObject)
Bind to serialized fields via `binding-path`:
```xml
<ui:TextField binding-path="playerName" label="Name" />
<ui:Toggle binding-path="isActive" label="Active" />
<ui:Slider binding-path="health" label="Health" low-value="0" high-value="100" />
<uie:PropertyField binding-path="inventory" />
```

### Nested Property Binding
Use BindableElement to scope binding:
```xml
<BindableElement binding-path="stats">
    <uie:PropertyField binding-path="armor" />
    <uie:PropertyField binding-path="life" />
</BindableElement>
```

### Runtime Data Binding (Unity 2023.2+)
```xml
<ui:Label data-source="PlayerData.asset" data-source-path="health">
    <Bindings>
        <ui:DataBinding property="text" binding-mode="ToTarget" />
    </Bindings>
</ui:Label>

<!-- Binding modes: TwoWay, ToTarget (source→UI), ToSource (UI→source) -->
<ui:Toggle>
    <Bindings>
        <ui:DataBinding property="value" data-source-path="enabled" binding-mode="TwoWay" />
    </Bindings>
</ui:Toggle>
```

### ListView with Runtime Data Binding
```xml
<ui:ListView data-source="GameData.asset" item-template="ListItem.uxml">
    <Bindings>
        <ui:DataBinding property="itemsSource" data-source-path="items" />
    </Bindings>
</ui:ListView>
```

---

## Naming Conventions

| Attribute | Convention | Example |
|-----------|-----------|---------|
| `name` | kebab-case, prefixed by purpose | `btn-play`, `lbl-score`, `txt-name`, `lst-items` |
| `class` | BEM (Block__Element--Modifier) | `card`, `card__title`, `card__title--active` |

**Name prefixes:** `btn-` (button), `lbl-` (label), `txt-` (text field), `lst-` (list), `img-` (image), `pnl-` (panel)

Names are for C# queries (`root.Q<Button>("btn-play")`). Classes are for USS styling (`.card__title { }`).

---

## Common Attribute Patterns

### Boolean Attributes
```xml
readonly="true"
show-add-remove-footer="true"
reorderable="true"
display-tooltip-when-elided="true"
enable-rich-text="true"
focusable="true"
picking-mode="Ignore"
```

### Inline Styles (use sparingly — prefer USS)
```xml
<ui:VisualElement style="flex-grow: 1; flex-direction: row; justify-content: space-between;" />
```

### Rich Text in Labels
```xml
<ui:Label text="Click &lt;color=#40a0ff&gt;&lt;b&gt;here&lt;/b&gt;&lt;/color&gt;" enable-rich-text="true" />
```

### Custom Control Elements
```xml
<!-- With custom namespace -->
<ui:UXML xmlns:ui="UnityEngine.UIElements" xmlns:custom="MyUILibrary">
    <custom:SlideToggle label="Enable Feature" />
    <custom:RadialProgress progress="0.75" />
</ui:UXML>

<!-- With fully qualified name -->
<MyUILibrary.HealthBar max-health="200" fill-color="#4CAF50" />
```
