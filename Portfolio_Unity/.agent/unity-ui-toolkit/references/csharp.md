# C# UI Toolkit Patterns Reference

## Table of Contents
1. [Element Querying](#element-querying)
2. [Event Handling](#event-handling)
3. [ListView and Collections](#listview-and-collections)
4. [Custom Controls](#custom-controls)
5. [Custom Drawing (Mesh API and Painter2D)](#custom-drawing)
6. [Style Manipulation at Runtime](#style-manipulation-at-runtime)
7. [Drag and Drop](#drag-and-drop)
8. [Scheduling and Delayed Actions](#scheduling-and-delayed-actions)
9. [Data Binding (Editor)](#data-binding-editor)
10. [Responsive Layout](#responsive-layout)
11. [Coordinate Conversion](#coordinate-conversion)

---

## Element Querying

```csharp
var root = GetComponent<UIDocument>().rootVisualElement;

// By name — returns first match
Button btn = root.Q<Button>("btn-play");

// By class
Label lbl = root.Q<Label>(className: "title");

// By name + class
var el = root.Q<VisualElement>("panel", "active");

// Any element by name (not generic)
VisualElement panel = root.Q("side-panel");

// Multiple elements — UQueryBuilder with ForEach
root.Query<Button>().ForEach(b => b.clicked += OnAnyButtonClick);

// Filtered query
root.Query<Label>(className: "tab")
    .Where(tab => tab.ClassListContains("selected"))
    .ForEach(HandleSelectedTab);
```

**Timing:** Always query in `OnEnable()` (not `Awake()`). The `rootVisualElement` may not be ready in `Awake`.

---

## Event Handling

Always unregister in `OnDisable()` to prevent memory leaks.

```csharp
// Click — two patterns
button.clicked += OnPlayClicked;                                 // Simple delegate
button.RegisterCallback<ClickEvent>(evt => { });                 // With event data

// Value changes (generic on value type)
textField.RegisterCallback<ChangeEvent<string>>(evt => {
    Debug.Log($"Changed: {evt.previousValue} -> {evt.newValue}");
});
slider.RegisterCallback<ChangeEvent<float>>(evt => { });
toggle.RegisterCallback<ChangeEvent<bool>>(evt => { });

// Pointer events
element.RegisterCallback<PointerDownEvent>(evt => { });
element.RegisterCallback<PointerMoveEvent>(evt => { });
element.RegisterCallback<PointerUpEvent>(evt => { });
element.RegisterCallback<PointerEnterEvent>(evt => { });
element.RegisterCallback<PointerLeaveEvent>(evt => { });

// Keyboard
element.RegisterCallback<KeyDownEvent>(evt => {
    if (evt.keyCode == KeyCode.Return) { /* submit */ }
});

// Focus
element.RegisterCallback<FocusInEvent>(evt => { });
element.RegisterCallback<FocusOutEvent>(evt => { });

// Transition end (for chaining animations)
element.RegisterCallback<TransitionEndEvent>(evt => { });

// Navigation (gamepad/keyboard UI navigation)
element.RegisterCallback<NavigationSubmitEvent>(evt => { });
element.RegisterCallback<NavigationMoveEvent>(evt => { });

// Layout size changes (for responsive design)
element.RegisterCallback<GeometryChangedEvent>(evt => {
    float newWidth = evt.newRect.width;
});

// Link tag events (for clickable text links)
label.RegisterCallback<PointerUpLinkTagEvent>(evt => {
    Application.OpenURL(urls[evt.linkID]);
});

// Unregister
button.clicked -= OnPlayClicked;
button.UnregisterCallback<ClickEvent>(handler);
```

### Making Any Element Clickable
```csharp
var card = root.Q("my-card");
card.AddManipulator(new Clickable(() => Debug.Log("Card clicked")));
```

---

## ListView and Collections

### Basic ListView (Runtime)
```csharp
List<ItemData> items = GetItems();

var listView = root.Q<ListView>("item-list");
listView.itemsSource = items;
listView.fixedItemHeight = 40;  // set when items are same height

// makeItem: creates the visual element (called once per visible slot)
listView.makeItem = () =>
{
    var row = new VisualElement();
    row.style.flexDirection = FlexDirection.Row;
    row.style.alignItems = Align.Center;

    var icon = new VisualElement { name = "icon" };
    icon.style.width = icon.style.height = 32;
    row.Add(icon);

    var label = new Label { name = "label" };
    label.style.flexGrow = 1;
    row.Add(label);

    return row;
};

// bindItem: populates data (called on scroll/rebind)
listView.bindItem = (element, index) =>
{
    element.Q<Label>("label").text = items[index].name;
    element.Q("icon").style.backgroundImage = new StyleBackground(items[index].icon);
};

// Selection handling
listView.selectionChanged += (selectedItems) =>
{
    var selected = listView.selectedItem as ItemData;
    if (selected != null) ShowDetails(selected);
};
```

### ListView with UXML Template + Controller
This pattern separates item UI logic into a controller class stored in `userData`:

```csharp
// makeItem: instantiate UXML template, attach controller
m_CharacterList.makeItem = () =>
{
    var entry = m_ListEntryTemplate.Instantiate();
    var controller = new CharacterListEntryController();
    entry.userData = controller;              // store controller reference
    controller.SetVisualElement(entry);       // let controller cache its elements
    return entry;
};

// bindItem: delegate to controller
m_CharacterList.bindItem = (item, index) =>
{
    (item.userData as CharacterListEntryController)?.SetCharacterData(m_AllCharacters[index]);
};
```

### MultiColumnListView
```csharp
var listView = root.Q<MultiColumnListView>();
listView.itemsSource = planets;

// Column names must match UXML <ui:Column name="...">
listView.columns["name"].makeCell = () => new Label();
listView.columns["name"].bindCell = (element, index) =>
    (element as Label).text = planets[index].name;

listView.columns["populated"].makeCell = () => new Toggle();
listView.columns["populated"].bindCell = (element, index) =>
    (element as Toggle).value = planets[index].populated;
```

### TreeView
```csharp
var treeView = root.Q<TreeView>();
treeView.SetRootItems(treeRoots); // IList<TreeViewItemData<T>>

treeView.makeItem = () => new Label();
treeView.bindItem = (element, index) =>
    (element as Label).text = treeView.GetItemDataForIndex<IPlanetOrGroup>(index).name;
```

---

## Custom Controls

### Basic Custom Control (VisualElement subclass)
```csharp
public class HealthBar : VisualElement
{
    // Required for UXML — enables <custom:HealthBar /> in UXML
    public new class UxmlFactory : UxmlFactory<HealthBar, UxmlTraits> { }
    public new class UxmlTraits : VisualElement.UxmlTraits
    {
        UxmlFloatAttributeDescription m_MaxHealth = new()
            { name = "max-health", defaultValue = 100f };

        public override void Init(VisualElement ve, IUxmlAttributes bag, CreationContext cc)
        {
            base.Init(ve, bag, cc);
            ((HealthBar)ve).MaxHealth = m_MaxHealth.GetValueFromBag(bag, cc);
        }
    }

    public static readonly string ussClassName = "health-bar";

    public float MaxHealth { get; set; } = 100f;

    public HealthBar()
    {
        AddToClassList(ussClassName);  // always set base class for USS styling
        // Build internal structure...
    }
}
```

### Bindable Custom Control (BaseField subclass)
For controls with a value that supports data binding:

```csharp
public class SlideToggle : BaseField<bool>
{
    public new class UxmlFactory : UxmlFactory<SlideToggle, UxmlTraits> { }
    public new class UxmlTraits : BaseFieldTraits<bool, UxmlBoolAttributeDescription> { }

    public static readonly new string ussClassName = "slide-toggle";
    public static readonly new string inputUssClassName = "slide-toggle__input";

    VisualElement m_Input;
    VisualElement m_Knob;

    public SlideToggle() : this(null) { }
    public SlideToggle(string label) : base(label, new())
    {
        AddToClassList(ussClassName);

        m_Input = this.Q(className: BaseField<bool>.inputUssClassName);
        m_Input.AddToClassList(inputUssClassName);
        Add(m_Input);

        m_Knob = new();
        m_Knob.AddToClassList("slide-toggle__input-knob");
        m_Input.Add(m_Knob);

        // Static event handlers (best practice for custom controls)
        RegisterCallback<ClickEvent>(evt => OnClick(evt));
        RegisterCallback<KeyDownEvent>(evt => OnKeydownEvent(evt));
        RegisterCallback<NavigationSubmitEvent>(evt => OnSubmit(evt));
    }

    static void OnClick(ClickEvent evt)
    {
        var toggle = evt.currentTarget as SlideToggle;
        toggle.ToggleValue();
        evt.StopPropagation();
    }

    void ToggleValue() => value = !value;

    // Called by BaseField when value changes — update visuals here
    public override void SetValueWithoutNotify(bool newValue)
    {
        base.SetValueWithoutNotify(newValue);
        m_Input.EnableInClassList("slide-toggle__input--checked", newValue);
    }
}
```

### Unity 2023.2+ Simplified Syntax
```csharp
[UxmlElement]
public partial class HealthBar : VisualElement
{
    [UxmlAttribute] public float MaxHealth { get; set; } = 100f;
    [UxmlAttribute] public Color FillColor { get; set; } = Color.green;
    // No UxmlFactory/UxmlTraits boilerplate needed
}
```

### Reading USS Variables from C#
```csharp
// Define custom USS properties
static readonly CustomStyleProperty<Color> s_TrackColor = new("--track-color");
static readonly CustomStyleProperty<Color> s_ProgressColor = new("--progress-color");

public RadialProgress()
{
    RegisterCallback<CustomStyleResolvedEvent>(evt =>
    {
        if (evt.customStyle.TryGetValue(s_TrackColor, out var trackColor))
            m_TrackColor = trackColor;
        if (evt.customStyle.TryGetValue(s_ProgressColor, out var progressColor))
            m_ProgressColor = progressColor;
        MarkDirtyRepaint();
    });
}
```

---

## Custom Drawing

### Mesh-based Rendering (MeshGenerationContext)
Lower-level, more performant:

```csharp
public RadialProgress()
{
    generateVisualContent += OnGenerateVisualContent;
}

void OnGenerateVisualContent(MeshGenerationContext mgc)
{
    // Allocate vertices and indices
    int numVertices = 64;
    MeshWriteData mwd = mgc.Allocate(numVertices, numIndices);
    // Set vertex positions, colors, UVs
    // Set triangle indices
}
```

### Painter2D API (Vector Drawing)
Higher-level, easier to use:

```csharp
void OnGenerateVisualContent(MeshGenerationContext mgc)
{
    var painter = mgc.painter2D;
    float radius = Mathf.Min(contentRect.width, contentRect.height) * 0.4f;
    Vector2 center = contentRect.center;

    // Background circle
    painter.strokeColor = new Color(0.3f, 0.3f, 0.3f);
    painter.lineWidth = 8f;
    painter.BeginPath();
    painter.Arc(center, radius, 0, 360);
    painter.Stroke();

    // Progress arc
    painter.strokeColor = Color.green;
    painter.lineCap = LineCap.Round;
    painter.BeginPath();
    painter.Arc(center, radius, -90f, -90f + 360f * _progress);
    painter.Stroke();
}
```

Call `MarkDirtyRepaint()` whenever visual properties change to trigger a redraw.

---

## Style Manipulation at Runtime

Prefer toggling USS classes over direct style manipulation:

```csharp
// Class toggling (preferred — USS handles the actual styles)
element.AddToClassList("active");
element.RemoveFromClassList("active");
element.ToggleInClassList("active");
element.EnableInClassList("checked", isChecked);  // add or remove based on bool
bool has = element.ClassListContains("active");

// Direct style manipulation (use for dynamic values like health %)
element.style.width = Length.Percent(healthRatio * 100f);
element.style.backgroundColor = new Color(0.2f, 0.2f, 0.2f);
element.style.display = DisplayStyle.None;     // hide
element.style.display = DisplayStyle.Flex;     // show
element.style.opacity = 0.5f;
element.style.translate = new Translate(x, y);
element.style.scale = new Scale(new Vector2(1.2f, 1.2f));
element.style.position = Position.Absolute;
```

### Performance Hint for Animated Elements
```csharp
// Set on elements you move every frame (improves rendering performance)
element.usageHints = UsageHints.DynamicTransform;

// Set on containers that move as a group
container.usageHints = UsageHints.GroupTransform;
```

---

## Drag and Drop

### PointerManipulator Pattern
```csharp
public class DragManipulator : PointerManipulator
{
    private Vector3 _startPos;
    private Vector3 _pointerStart;

    public DragManipulator(VisualElement target) { this.target = target; }

    protected override void RegisterCallbacksOnTarget()
    {
        target.RegisterCallback<PointerDownEvent>(OnPointerDown);
        target.RegisterCallback<PointerMoveEvent>(OnPointerMove);
        target.RegisterCallback<PointerUpEvent>(OnPointerUp);
    }

    protected override void UnregisterCallbacksFromTarget()
    {
        target.UnregisterCallback<PointerDownEvent>(OnPointerDown);
        target.UnregisterCallback<PointerMoveEvent>(OnPointerMove);
        target.UnregisterCallback<PointerUpEvent>(OnPointerUp);
    }

    private void OnPointerDown(PointerDownEvent evt)
    {
        _startPos = target.transform.position;
        _pointerStart = evt.position;
        target.CapturePointer(evt.pointerId);
        evt.StopPropagation();
    }

    private void OnPointerMove(PointerMoveEvent evt)
    {
        if (!target.HasPointerCapture(evt.pointerId)) return;
        Vector3 delta = evt.position - _pointerStart;
        target.transform.position = _startPos + delta;
    }

    private void OnPointerUp(PointerUpEvent evt)
    {
        if (!target.HasPointerCapture(evt.pointerId)) return;
        target.ReleasePointer(evt.pointerId);
    }
}

// Attach to any element:
element.AddManipulator(new DragManipulator(element));
```

### Drop Zone Detection
```csharp
// In PointerUpEvent handler, find overlapping drop targets:
UQueryBuilder<VisualElement> slots = slotsContainer.Query<VisualElement>(className: "slot");
UQueryBuilder<VisualElement> overlapping = slots.Where(slot =>
    slot.worldBound.Overlaps(target.worldBound));

VisualElement closestSlot = overlapping.First();
if (closestSlot != null)
{
    // Snap to slot position
    Vector2 slotPos = root.WorldToLocal(closestSlot.parent.LocalToWorld(closestSlot.layout.position));
    target.transform.position = slotPos;
}
```

---

## Scheduling and Delayed Actions

```csharp
// One-time delay
element.schedule.Execute(() => {
    element.AddToClassList("visible");
}).ExecuteLater(100);  // milliseconds

// Repeating
element.schedule.Execute(() => {
    UpdateTimer();
}).Every(1000);  // every 1 second

// Delay then repeat
element.schedule.Execute(UpdatePulse).StartingIn(500).Every(2000);
```

---

## Data Binding (Editor)

### SerializedObject Binding
```csharp
// Bind entire tree to a SerializedObject
SerializedObject so = new SerializedObject(targetObject);
rootVisualElement.Bind(so);

// Elements with binding-path in UXML auto-bind:
// <ui:TextField binding-path="playerName" />

// Manual binding path in C#
var textField = new TextField("Name");
textField.bindingPath = "m_Name";
rootVisualElement.Add(textField);
rootVisualElement.Bind(serializedObject);

// Unbind
rootVisualElement.Unbind();
```

### Track Property Changes
```csharp
// Track all changes on serialized object
root.TrackSerializedObjectValue(serializedObject, so => {
    // React to any property change
    CheckForWarnings(so);
});

// Track specific property
editor.TrackPropertyValue(specificProperty, prop => {
    // React to specific property change
    RefreshUI();
});
```

---

## Responsive Layout

USS has no media queries. Handle responsive layout in C#:

```csharp
root.RegisterCallback<GeometryChangedEvent>(evt =>
{
    float width = evt.newRect.width;

    if (width < 600)
    {
        root.RemoveFromClassList("layout--wide");
        root.AddToClassList("layout--narrow");
    }
    else
    {
        root.RemoveFromClassList("layout--narrow");
        root.AddToClassList("layout--wide");
    }
});
```

Then in USS:
```css
.layout--wide .sidebar { width: 25%; display: flex; }
.layout--narrow .sidebar { display: none; }
.layout--wide .nav { flex-direction: row; }
.layout--narrow .nav { flex-direction: column; }
```

Also configure `PanelSettings` asset for screen scaling:
- **Scale Mode:** Scale With Screen Size
- **Reference Resolution:** 1920x1080
- **Screen Match Mode:** 0.5 (blend width/height matching)

---

## Coordinate Conversion

```csharp
// Element-local to panel-global and back
Vector2 worldPos = element.LocalToWorld(localPos);
Vector2 localPos = element.WorldToLocal(worldPos);

// Screen to panel coordinates
Vector2 panelPos = RuntimePanelUtils.ScreenToPanel(panel, screenPos);

// Element bounds
Rect worldBounds = element.worldBound;     // in panel space
Rect localBounds = element.layout;         // in parent space
```
