---
name: uitoolkit-custom-controls
description: >
  Creating custom Unity UIToolkit controls for runtime game UI. Use this skill for building reusable
  custom VisualElements, custom USS properties, Vector API rendering, and BaseField controls.
  Trigger when: user mentions "custom control", "custom element", "custom VisualElement", "pie chart",
  "radial progress", "custom slider", "toggle switch", "UxmlFactory", "UxmlTraits", "UxmlAttribute",
  "generateVisualContent", "Painter2D", "Vector API", "BaseField", or needs a UI control that doesn't
  exist in the built-in set. Consult uitoolkit-design-system for USS variable patterns.
---

# UIToolkit Custom Controls

How to create reusable custom VisualElements for Unity 6 runtime game UI.

## Basic Custom Control

```csharp
using UnityEngine;
using UnityEngine.UIElements;

public class HealthBar : VisualElement
{
    // USS class names following BEM convention
    public static readonly new string ussClassName = "health-bar";
    public static readonly string ussFilledClassName = "health-bar__filled";
    public static readonly string ussLabelClassName = "health-bar__label";

    // UXML Factory (required to use in UXML)
    public new class UxmlFactory : UxmlFactory<HealthBar, UxmlTraits> { }
    public new class UxmlTraits : VisualElement.UxmlTraits { }

    VisualElement m_Filled;
    Label m_Label;
    float m_Value;

    public float value
    {
        get => m_Value;
        set
        {
            m_Value = Mathf.Clamp01(value);
            m_Filled.style.width = Length.Percent(m_Value * 100f);
            m_Label.text = $"{Mathf.RoundToInt(m_Value * 100)}%";
        }
    }

    public HealthBar()
    {
        AddToClassList(ussClassName);

        m_Filled = new VisualElement();
        m_Filled.AddToClassList(ussFilledClassName);
        Add(m_Filled);

        m_Label = new Label();
        m_Label.AddToClassList(ussLabelClassName);
        Add(m_Label);

        value = 1f;
    }
}
```

## Custom UXML Attributes

### Legacy Approach (UxmlTraits)

```csharp
public class MyElement : VisualElement
{
    public new class UxmlFactory : UxmlFactory<MyElement, UxmlTraits> { }

    public new class UxmlTraits : VisualElement.UxmlTraits
    {
        UxmlStringAttributeDescription m_String =
            new UxmlStringAttributeDescription { name = "my-string", defaultValue = "default" };
        UxmlIntAttributeDescription m_Int =
            new UxmlIntAttributeDescription { name = "my-int", defaultValue = 2 };
        UxmlFloatAttributeDescription m_Float =
            new UxmlFloatAttributeDescription { name = "progress" };

        public override void Init(VisualElement ve, IUxmlAttributes bag, CreationContext cc)
        {
            base.Init(ve, bag, cc);
            var el = ve as MyElement;
            el.myString = m_String.GetValueFromBag(bag, cc);
            el.myInt = m_Int.GetValueFromBag(bag, cc);
            el.progress = m_Float.GetValueFromBag(bag, cc);
        }
    }

    public string myString { get; set; }
    public int myInt { get; set; }
    public float progress { get; set; }
}
```

Usage in UXML:
```xml
<MyElement my-string="hello" my-int="5" progress="75.0" />
```

### Modern Approach (UxmlAttribute — Unity 6)

```csharp
// Simpler in Unity 6+
[UxmlElement]
public partial class MyElement : VisualElement
{
    [UxmlAttribute]
    public string myString { get; set; } = "default";

    [UxmlAttribute]
    public int myInt { get; set; } = 2;
}
```

The `[UxmlElement]` + `[UxmlAttribute]` approach is cleaner but requires Unity 6. The `UxmlFactory`/`UxmlTraits` approach works in all versions.

## BaseField — Custom Value Controls

For controls that hold a value (like sliders, toggles, input fields), extend `BaseField<T>`:

```csharp
using UnityEngine.UIElements;

public class SlideToggle : BaseField<bool>
{
    public new class UxmlFactory : UxmlFactory<SlideToggle, UxmlTraits> { }
    public new class UxmlTraits : BaseFieldTraits<bool, UxmlBoolAttributeDescription> { }

    public static readonly new string ussClassName = "slide-toggle";
    public static readonly new string inputUssClassName = "slide-toggle__input";
    public static readonly string inputKnobUssClassName = "slide-toggle__input-knob";
    public static readonly string inputCheckedUssClassName = "slide-toggle__input--checked";

    VisualElement m_Input;
    VisualElement m_Knob;

    public SlideToggle() : this(null) { }

    public SlideToggle(string label) : base(label, new())
    {
        AddToClassList(ussClassName);

        // Get BaseField's input container and style it
        m_Input = this.Q(className: BaseField<bool>.inputUssClassName);
        m_Input.AddToClassList(inputUssClassName);
        Add(m_Input);

        // Create the sliding knob
        m_Knob = new();
        m_Knob.AddToClassList(inputKnobUssClassName);
        m_Input.Add(m_Knob);

        // Handle click, keyboard, and gamepad input
        RegisterCallback<ClickEvent>(evt =>
        {
            value = !value;
            evt.StopPropagation();
        });

        // NavigationSubmitEvent handles gamepad/keyboard at runtime
        RegisterCallback<NavigationSubmitEvent>(evt =>
        {
            value = !value;
            evt.StopPropagation();
        });
    }

    // Update visuals when value changes
    public override void SetValueWithoutNotify(bool newValue)
    {
        base.SetValueWithoutNotify(newValue);
        m_Input.EnableInClassList(inputCheckedUssClassName, newValue);
    }
}
```

### Why BaseField?
- Automatically handles `value` property with change events
- Works with data binding out of the box
- Has built-in label support
- Fires `ChangeEvent<T>` when value changes

## Custom USS Properties

Allow USS to configure custom control appearance:

```csharp
using UnityEngine;
using UnityEngine.UIElements;

public class RadialProgress : VisualElement
{
    // Declare custom USS properties
    static readonly CustomStyleProperty<Color> s_TrackColor =
        new CustomStyleProperty<Color>("--track-color");
    static readonly CustomStyleProperty<Color> s_ProgressColor =
        new CustomStyleProperty<Color>("--progress-color");

    Color m_TrackColor = Color.gray;
    Color m_ProgressColor = Color.green;

    public RadialProgress()
    {
        AddToClassList("radial-progress");

        // Listen for custom styles being resolved
        RegisterCallback<CustomStyleResolvedEvent>(evt =>
        {
            if (evt.customStyle.TryGetValue(s_TrackColor, out var trackColor))
                m_TrackColor = trackColor;
            if (evt.customStyle.TryGetValue(s_ProgressColor, out var progressColor))
                m_ProgressColor = progressColor;
            MarkDirtyRepaint();
        });

        generateVisualContent += OnGenerateVisualContent;
    }

    void OnGenerateVisualContent(MeshGenerationContext ctx)
    {
        // Use m_TrackColor and m_ProgressColor for rendering
    }
}
```

```css
/* Style the custom properties in USS */
.radial-progress {
    --track-color: rgb(130, 130, 130);
    --progress-color: rgb(46, 132, 24);
    width: 100px;
    height: 100px;
}
```

## Vector API Rendering (Painter2D)

For controls that need custom drawing (charts, gauges, shapes):

```csharp
public class PieChart : VisualElement
{
    float m_Value = 40f;

    public float value
    {
        get => m_Value;
        set { m_Value = value; MarkDirtyRepaint(); }
    }

    public PieChart()
    {
        generateVisualContent += DrawCanvas;
    }

    void DrawCanvas(MeshGenerationContext ctx)
    {
        var painter = ctx.painter2D;
        float radius = Mathf.Min(contentRect.width, contentRect.height) * 0.5f;
        var center = new Vector2(contentRect.width * 0.5f, contentRect.height * 0.5f);

        // Draw background circle
        painter.fillColor = new Color32(251, 120, 19, 255);
        painter.BeginPath();
        painter.Arc(center, radius, 0f, 360f);
        painter.Fill();

        // Draw value slice
        float angle = 360f * (m_Value / 100f);
        painter.fillColor = new Color32(182, 235, 122, 255);
        painter.BeginPath();
        painter.MoveTo(center);
        painter.Arc(center, radius, 0f, angle);
        painter.Fill();
    }
}
```

### Radial Progress with Painter2D (Stroked Arc)

```csharp
void GenerateVisualContent(MeshGenerationContext ctx)
{
    float width = contentRect.width;
    float height = contentRect.height;
    var center = new Vector2(width * 0.5f, height * 0.5f);

    var painter = ctx.painter2D;
    painter.lineWidth = 10f;
    painter.lineCap = LineCap.Butt;

    // Track (full circle)
    painter.strokeColor = m_TrackColor;
    painter.BeginPath();
    painter.Arc(center, width * 0.5f, 0f, 360f);
    painter.Stroke();

    // Progress arc
    painter.strokeColor = m_ProgressColor;
    painter.BeginPath();
    painter.Arc(center, width * 0.5f, -90f, 360f * (progress / 100f) - 90f);
    painter.Stroke();
}
```

## Using Custom Controls in UXML

```xml
<engine:UXML xmlns:engine="UnityEngine.UIElements">
    <Style src="RadialProgress.uss" />
    <!-- Use full namespace path -->
    <MyUILibrary.RadialProgress progress="87.1" />
    <MyUILibrary.SlideToggle label="Enable Sound" />
</engine:UXML>
```

## Runtime MonoBehaviour Pattern

```csharp
[RequireComponent(typeof(UIDocument))]
public class RadialProgressComponent : MonoBehaviour
{
    RadialProgress m_Progress;

    void Start()
    {
        var root = GetComponent<UIDocument>().rootVisualElement;
        m_Progress = new RadialProgress
        {
            style = { position = Position.Absolute, left = 20, top = 20, width = 200, height = 200 }
        };
        root.Add(m_Progress);
    }

    void Update()
    {
        m_Progress.progress = ((Mathf.Sin(Time.time) + 1f) / 2f) * 100f;
    }
}
```

## Common Mistakes

1. **Missing default constructor** — UXML instantiation requires a parameterless constructor
2. **Forgetting `MarkDirtyRepaint()`** — Custom rendering won't update without it
3. **Using `Resources.Load` in constructors** — Load USS via `<Style src="..."/>` in UXML instead when possible
4. **Not calling `base.SetValueWithoutNotify()`** — BaseField won't fire change events properly

## Reference Examples

For complete working examples, see `references/examples.md` in this skill directory.
It contains:
- SlideToggle (BaseField, BEM USS, transitions) - complete C#, USS, UXML
- PieChart (Painter2D fill) - C# + MonoBehaviour
- RadialProgress (Painter2D stroke + CustomStyleProperty) - C#, USS, MonoBehaviour
- ExampleElementCustomStyle (Custom USS properties with gradient) - C#, USS
- MyElement (Legacy UxmlTraits/UxmlFactory attributes) - C#
- ExampleField (BaseField with double value) - C#
