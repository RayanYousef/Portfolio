# UIToolkit Custom Controls - Reference Examples

Complete working examples from the Unity UIToolkit manual.

---

## SlideToggle - Complete BaseField Example

A toggle switch control that extends `BaseField<bool>` with animated knob, BEM-convention USS, and full input handling (click, keyboard, gamepad).

### SlideToggle.cs

```csharp
using UnityEngine;
using UnityEngine.UIElements;

namespace MyUILibrary
{
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
            m_Input = this.Q(className: BaseField<bool>.inputUssClassName);
            m_Input.AddToClassList(inputUssClassName);
            Add(m_Input);
            m_Knob = new();
            m_Knob.AddToClassList(inputKnobUssClassName);
            m_Input.Add(m_Knob);

            RegisterCallback<ClickEvent>(evt => { value = !value; evt.StopPropagation(); });
            RegisterCallback<NavigationSubmitEvent>(evt => { value = !value; evt.StopPropagation(); });
            RegisterCallback<KeyDownEvent>(evt =>
            {
                if (panel?.contextType == ContextType.Player) return;
                if (evt.keyCode == KeyCode.KeypadEnter || evt.keyCode == KeyCode.Return || evt.keyCode == KeyCode.Space)
                { value = !value; evt.StopPropagation(); }
            });
        }

        public override void SetValueWithoutNotify(bool newValue)
        {
            base.SetValueWithoutNotify(newValue);
            m_Input.EnableInClassList(inputCheckedUssClassName, newValue);
        }
    }
}
```

### SlideToggle.uss

```css
.slide-toggle__input {
    background-color: var(--unity-colors-slider_groove-background);
    max-width: 25px;
    border-radius: 8px;
    overflow: visible;
    border-width: 1px;
    border-color: var(--unity-colors-slider_thumb-border);
    max-height: 16px;
    margin-top: 10px;
    transition-property: background-color;
    transition-duration: 0.5s;
}

.slide-toggle__input-knob {
    height: 16px;
    width: 16px;
    background-color: var(--unity-colors-slider_thumb-background);
    position: absolute;
    border-radius: 25px;
    top: -1px;
    transition-property: translate, background-color;
    transition-duration: 0.5s, 0.5s;
    translate: -1px 0;
    border-width: 1px;
    border-color: var(--unity-colors-slider_thumb-border);
}

.slide-toggle__input--checked {
    background-color: rgb(0, 156, 10);
}

.slide-toggle__input--checked > .slide-toggle__input-knob {
    translate: 8px 0;
}

.slide-toggle:focus .slide-toggle__input-knob {
    border-width: 1px;
    border-color: var(--unity-colors-input_field-border-focus);
}
```

### SlideToggleUsage.uxml

```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" editor-extension-mode="False">
    <Style src="SlideToggle.uss" />
    <MyUILibrary.SlideToggle label="My Toggle" />
</ui:UXML>
```

---

## PieChart - Painter2D Fill Example

A simple pie chart using the Vector API `Fill()` method to draw colored slices.

### PieChart.cs

```csharp
using UnityEngine;
using UnityEngine.UIElements;

public class PieChart : VisualElement
{
    float m_Radius = 100.0f;
    float m_Value = 40.0f;

    public float value { get => m_Value; set { m_Value = value; MarkDirtyRepaint(); } }

    public PieChart() { generateVisualContent += DrawCanvas; }

    void DrawCanvas(MeshGenerationContext ctx)
    {
        var painter = ctx.painter2D;
        var percentages = new float[] { m_Value, 100 - m_Value };
        var colors = new Color32[] { new Color32(182,235,122,255), new Color32(251,120,19,255) };
        float angle = 0.0f;
        float anglePct = 0.0f;
        int k = 0;
        foreach (var pct in percentages)
        {
            anglePct += 360.0f * (pct / 100);
            painter.fillColor = colors[k++];
            painter.BeginPath();
            painter.MoveTo(new Vector2(m_Radius, m_Radius));
            painter.Arc(new Vector2(m_Radius, m_Radius), m_Radius, angle, anglePct);
            painter.Fill();
            angle = anglePct;
        }
    }
}
```

### PieChartComponent.cs (Runtime usage)

```csharp
[RequireComponent(typeof(UIDocument))]
public class PieChartComponent : MonoBehaviour
{
    PieChart m_PieChart;
    void Start()
    {
        m_PieChart = new PieChart();
        GetComponent<UIDocument>().rootVisualElement.Add(m_PieChart);
    }
}
```

---

## RadialProgress - Painter2D Stroke + Custom USS Properties

A radial progress indicator using stroked arcs and custom USS properties for theming.

### RadialProgress.cs (Vector API version)

```csharp
using UnityEngine;
using UnityEngine.UIElements;

namespace MyUILibrary.RadialProgressVectorApi
{
    public class RadialProgress : VisualElement
    {
        public new class UxmlTraits : VisualElement.UxmlTraits
        {
            UxmlFloatAttributeDescription m_ProgressAttribute = new() { name = "progress" };
            public override void Init(VisualElement ve, IUxmlAttributes bag, CreationContext cc)
            {
                base.Init(ve, bag, cc);
                (ve as RadialProgress).progress = m_ProgressAttribute.GetValueFromBag(bag, cc);
            }
        }

        public new class UxmlFactory : UxmlFactory<RadialProgress, UxmlTraits> { }
        public static readonly string ussClassName = "radial-progress";
        public static readonly string ussLabelClassName = "radial-progress__label";

        static CustomStyleProperty<Color> s_TrackColor = new("--track-color");
        static CustomStyleProperty<Color> s_ProgressColor = new("--progress-color");

        Color m_TrackColor = Color.gray;
        Color m_ProgressColor = Color.red;
        Label m_Label;
        float m_Progress;

        public float progress
        {
            get => m_Progress;
            set { m_Progress = value; m_Label.text = Mathf.Clamp(Mathf.Round(value), 0, 100) + "%"; MarkDirtyRepaint(); }
        }

        public RadialProgress()
        {
            m_Label = new Label();
            m_Label.AddToClassList(ussLabelClassName);
            Add(m_Label);
            AddToClassList(ussClassName);
            RegisterCallback<CustomStyleResolvedEvent>(evt =>
            {
                bool repaint = false;
                if (evt.customStyle.TryGetValue(s_ProgressColor, out m_ProgressColor)) repaint = true;
                if (evt.customStyle.TryGetValue(s_TrackColor, out m_TrackColor)) repaint = true;
                if (repaint) MarkDirtyRepaint();
            });
            generateVisualContent += GenerateVisualContent;
            progress = 0.0f;
        }

        void GenerateVisualContent(MeshGenerationContext context)
        {
            float width = contentRect.width;
            float height = contentRect.height;
            var painter = context.painter2D;
            painter.lineWidth = 10.0f;
            painter.lineCap = LineCap.Butt;

            painter.strokeColor = m_TrackColor;
            painter.BeginPath();
            painter.Arc(new Vector2(width * 0.5f, height * 0.5f), width * 0.5f, 0.0f, 360.0f);
            painter.Stroke();

            painter.strokeColor = m_ProgressColor;
            painter.BeginPath();
            painter.Arc(new Vector2(width * 0.5f, height * 0.5f), width * 0.5f, -90.0f, 360.0f * (progress / 100.0f) - 90.0f);
            painter.Stroke();
        }
    }
}
```

### RadialProgress.uss

```css
.radial-progress {
    min-width: 26px;
    min-height: 20px;
    --track-color: rgb(130, 130, 130);
    --progress-color: rgb(46, 132, 24);
    --percentage-color: white;
    margin: 5px;
    flex-direction: row;
    justify-content: center;
    width: 100px;
    height: 100px;
}

.radial-progress__label {
    -unity-text-align: middle-left;
    color: var(--percentage-color);
}
```

### RadialProgressComponent.cs (Runtime)

```csharp
[RequireComponent(typeof(UIDocument))]
public class RadialProgressComponent : MonoBehaviour
{
    MyUILibrary.RadialProgressVectorApi.RadialProgress m_RadialProgress;

    void Start()
    {
        var root = GetComponent<UIDocument>().rootVisualElement;
        m_RadialProgress = new() { style = { position = Position.Absolute, left = 20, top = 20, width = 200, height = 200 } };
        root.Add(m_RadialProgress);
    }

    void Update()
    {
        m_RadialProgress.progress = ((Mathf.Sin(Time.time) + 1.0f) / 2.0f) * 60.0f + 10.0f;
    }
}
```

---

## Custom Style Properties - Gradient Example

Demonstrates using `CustomStyleProperty` to read custom USS values and generate a gradient texture.

### ExampleElementCustomStyle.cs

```csharp
using UnityEngine;
using UnityEngine.UIElements;

public class ExampleElementCustomStyle : VisualElement
{
    public new class UxmlFactory : UxmlFactory<ExampleElementCustomStyle, UxmlTraits> { }
    public new class UxmlTraits : VisualElement.UxmlTraits { }

    static readonly CustomStyleProperty<Color> S_GradientFrom = new("--gradient-from");
    static readonly CustomStyleProperty<Color> S_GradientTo = new("--gradient-to");

    Texture2D m_Texture2D;
    Image m_Image;

    public ExampleElementCustomStyle()
    {
        m_Texture2D = new Texture2D(100, 100);
        m_Image = new Image { image = m_Texture2D };
        Add(m_Image);
        RegisterCallback<CustomStyleResolvedEvent>(evt =>
        {
            if (evt.customStyle.TryGetValue(S_GradientFrom, out var from)
                && evt.customStyle.TryGetValue(S_GradientTo, out var to))
            {
                for (int i = 0; i < m_Texture2D.width; ++i)
                {
                    Color color = Color.Lerp(from, to, i / (float)m_Texture2D.width);
                    for (int j = 0; j < m_Texture2D.height; ++j)
                        m_Texture2D.SetPixel(i, j, color);
                }
                m_Texture2D.Apply();
                m_Image.MarkDirtyRepaint();
            }
        });
    }
}
```

### ExampleElementCustomStyle.uss

```css
ExampleElementCustomStyle {
    --gradient-from: red;
    --gradient-to: yellow;
}
```

---

## Custom UXML Attributes (Legacy)

Demonstrates the `UxmlTraits`/`UxmlFactory` pattern for exposing custom attributes in UXML.

### MyElement.cs

```csharp
using UnityEngine;
using UnityEngine.UIElements;

class MyElement : VisualElement
{
    public new class UxmlFactory : UxmlFactory<MyElement, UxmlTraits> { }

    public new class UxmlTraits : VisualElement.UxmlTraits
    {
        UxmlStringAttributeDescription m_String = new() { name = "my-string", defaultValue = "default_value" };
        UxmlIntAttributeDescription m_Int = new() { name = "my-int", defaultValue = 2 };

        public override void Init(VisualElement ve, IUxmlAttributes bag, CreationContext cc)
        {
            base.Init(ve, bag, cc);
            var ate = ve as MyElement;
            ate.myString = m_String.GetValueFromBag(bag, cc);
            ate.myInt = m_Int.GetValueFromBag(bag, cc);
        }
    }

    public string myString { get; set; }
    public int myInt { get; set; }
}
```

---

## BaseField Example

A minimal `BaseField<double>` example showing the simplest way to create a value-holding control.

### ExampleField.cs

```csharp
using UnityEngine.UIElements;

public class ExampleField : BaseField<double>
{
    public new class UxmlFactory : UxmlFactory<ExampleField, BaseFieldTraits<double, UxmlDoubleAttributeDescription>> { }

    Label m_Input;

    public ExampleField() : this(null) { }

    public ExampleField(string label) : base(label, new Label())
    {
        m_Input = this.Q<Label>(className: inputUssClassName);
    }

    public override void SetValueWithoutNotify(double newValue)
    {
        base.SetValueWithoutNotify(newValue);
        m_Input.text = value.ToString("N");
    }
}
```
