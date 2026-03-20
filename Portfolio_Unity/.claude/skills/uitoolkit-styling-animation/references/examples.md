# UIToolkit Styling & Animation - Reference Examples

## Basic Transition (Hover)

**TransitionExample.uss**:
```css
.custom-label {
    font-size: 20px;
    -unity-font-style: bold;
    color: rgb(68, 138, 255);
}

Label:hover {
    scale: 1.1 1;
    rotate: 10deg;
}

Label {
    transition-duration: 3s;
}
```

**TransitionExample.uxml**:
```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" editor-extension-mode="False">
    <Style src="TransitionExample.uss" />
    <ui:Label text="Hello World! From UXML" />
    <ui:Label text="Hello World! With Style" class="custom-label" />
</ui:UXML>
```

**TransitionExample.cs** (C# transition setup):
```csharp
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UIElements;

// Demonstrates setting transitions in C# and simulating :hover with pointer events
public class TransitionExampleSetup
{
    VisualElement cSharpLabel;
    Rotate defaultRotate;
    Scale defaultScale;

    public void Setup(VisualElement root)
    {
        cSharpLabel = new Label("Hello World! From C#");
        root.Add(cSharpLabel);
        cSharpLabel.style.transitionDuration = new List<TimeValue> { new TimeValue(3) };
        defaultRotate = cSharpLabel.resolvedStyle.rotate;
        defaultScale = cSharpLabel.resolvedStyle.scale;
        cSharpLabel.RegisterCallback<PointerOverEvent>(evt =>
            SetHover(evt.currentTarget as VisualElement, true));
        cSharpLabel.RegisterCallback<PointerOutEvent>(evt =>
            SetHover(evt.currentTarget as VisualElement, false));
    }

    void SetHover(VisualElement label, bool hover)
    {
        label.style.rotate = hover ? new(Angle.Degrees(10)) : defaultRotate;
        label.style.scale = hover ? new Vector2(1.1f, 1) : defaultScale;
    }
}
```

## Transition Events

**TransitionEventsExample.uss**:
```css
.click-me {
    width: 250px;
    height: 50px;
    font-size: 40px;
    -unity-font-style: bold-and-italic;
    margin: 30px;
}

.color-changer {
    margin: 10px;
    width: 150px;
    height: 150px;
    border-width: 10px;
    border-radius: 75px;
    background-color: rgb(0, 31, 138);
    transition: background-color 3s ease-in-out 1s;
}

.main-container {
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    background-color: rgb(60, 60, 60);
}

.color-transition {
    background-color: rgb(177, 221, 111);
}
```

**TransitionEventsExample.cs** (event handling pattern):
```csharp
using UnityEngine;
using UnityEngine.UIElements;

// Shows how to listen for all four transition lifecycle events
public class TransitionEventsSetup
{
    public void Setup(VisualElement root)
    {
        var button = root.Q<Button>(className: "click-me");
        var colorChanger = root.Q<VisualElement>(className: "color-changer");

        button.RegisterCallback<ClickEvent>(_ =>
            colorChanger.ToggleInClassList("color-transition"));

        colorChanger.RegisterCallback<TransitionRunEvent>(evt =>
            Debug.Log("TransitionRunEvent"));
        colorChanger.RegisterCallback<TransitionStartEvent>(evt =>
            Debug.Log("TransitionStartEvent"));
        colorChanger.RegisterCallback<TransitionEndEvent>(evt =>
            Debug.Log("TransitionEndEvent"));
        colorChanger.RegisterCallback<TransitionCancelEvent>(evt =>
            Debug.Log("TransitionCancelEvent"));
    }
}
```

## Looping Animations

**LoopingExample.uss**:
```css
#yoyo-label {
    transition-duration: 3s;
}
.text-style {
    font-size: 20px;
    flex-grow: 0;
    margin: 20px;
}
.enlarge-scale-a2b {
    scale: 1.5 1.5;
    transition-duration: 3s;
}
.enlarge-scale-yoyo {
    scale: 1.5 1.5;
}
#container {
    flex-grow: 1;
    justify-content: space-around;
    align-items: center;
}
```

**LoopingExample.uxml**:
```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" editor-extension-mode="False">
    <Style src="LoopingExample.uss" />
    <ui:VisualElement name="container">
        <ui:VisualElement>
            <ui:Label text="Yo-yo Transition" name="yoyo-label" class="text-style" />
        </ui:VisualElement>
        <ui:VisualElement>
            <ui:Label text="A-to-B Transition" name="a2b-label" class="text-style"/>
        </ui:VisualElement>
    </ui:VisualElement>
</ui:UXML>
```

**LoopingExample.cs**:
```csharp
using UnityEngine;
using UnityEngine.UIElements;

public class LoopingAnimationSetup
{
    Label _yoyoLabel;
    Label _a2bLabel;

    public void Setup(VisualElement root)
    {
        SetupYoyo(root);
        SetupA2B(root);
    }

    // Yo-yo: toggles class on TransitionEnd, creating A->B->A->B loop
    void SetupYoyo(VisualElement root)
    {
        _yoyoLabel = root.Q<Label>(name: "yoyo-label");
        _yoyoLabel.RegisterCallback<TransitionEndEvent>(evt =>
            _yoyoLabel.ToggleInClassList("enlarge-scale-yoyo"));
        root.schedule.Execute(() =>
            _yoyoLabel.ToggleInClassList("enlarge-scale-yoyo")).StartingIn(100);
    }

    // A-to-B: removes class then re-adds after delay, always playing forward
    void SetupA2B(VisualElement root)
    {
        _a2bLabel = root.Q<Label>(name: "a2b-label");
        _a2bLabel.RegisterCallback<TransitionEndEvent>(evt =>
        {
            _a2bLabel.RemoveFromClassList("enlarge-scale-a2b");
            _a2bLabel.schedule.Execute(() =>
                _a2bLabel.AddToClassList("enlarge-scale-a2b")).StartingIn(10);
        });
        _a2bLabel.schedule.Execute(() =>
            _a2bLabel.AddToClassList("enlarge-scale-a2b")).StartingIn(100);
    }
}
```

## Text Animation (Per-Glyph)

**TextAnimation.cs**:
```csharp
using UnityEngine;
using UnityEngine.UIElements;
using TextElement = UnityEngine.UIElements.TextElement;

public class TextAnimationSetup
{
    Label label;
    float animationDuration = 10f;
    float elapsed = 0f;
    IVisualElementScheduledItem animationJob;
    bool isTextVisible = true;

    public void Setup(VisualElement root)
    {
        var container = new VisualElement
        {
            style = { flexGrow = 1, top = 0, bottom = 0, right = 0, left = 0 },
            focusable = true
        };
        label = new Label("Hello World!")
        {
            style = { flexGrow = 1, fontSize = 24, unityTextAlign = TextAnchor.MiddleCenter }
        };
        container.Add(label);
        root.Add(container);

        root.RegisterCallback<KeyDownEvent>(evt =>
        {
            if (evt.keyCode != KeyCode.Space || animationJob.isActive) return;
            elapsed = 0f;
            animationJob.Resume();
            isTextVisible = !isTextVisible;
        }, TrickleDown.TrickleDown);

        label.PostProcessTextVertices += OnPostProcessTextVertices;
        animationJob = label.schedule.Execute(() =>
        {
            elapsed += Time.deltaTime;
            if (elapsed >= animationDuration) { elapsed = animationDuration; animationJob.Pause(); }
            label.MarkDirtyRepaint();
        }).Every(1000 / 60);
        animationJob.Pause();
    }

    void OnPostProcessTextVertices(TextElement.GlyphsEnumerable glyphs)
    {
        int glyphsToToggle = (int)(elapsed * glyphs.Count / animationDuration);
        int toggled = 0;
        foreach (TextElement.Glyph glyph in glyphs)
        {
            if (toggled++ >= glyphsToToggle) break;
            var verts = glyph.vertices;
            for (int i = 0; i < verts.Length; i++)
            {
                var v = verts[i];
                var tint = v.tint;
                tint.a = isTextVisible ? (byte)255 : (byte)0;
                v.tint = tint;
                verts[i] = v;
            }
        }
    }
}
```

## Link Tags

**LinkTag.uss**:
```css
Label { font-size: 75px; }
.link-cursor { cursor: link; }
```

**LinkTag.uxml**:
```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" editor-extension-mode="True">
    <Style src="LinkTag.uss" />
    <ui:Label enable-rich-text="true" selectable="true" class="link"
        text="Link to &lt;link=&quot;1&quot;&gt;&lt;color=#40a0ff&gt;&lt;u&gt;Unity&lt;/u&gt;&lt;/color&gt;&lt;/link&gt;&#10;Link to &lt;link=&quot;2&quot;&gt;&lt;color=#40a0ff&gt;&lt;u&gt;UITK Discussions&lt;/u&gt;&lt;/color&gt;&lt;/link&gt;!" />
</ui:UXML>
```

**LinkTag.cs**:
```csharp
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UIElements;

public class LinkTagSetup
{
    Dictionary<int, string> m_UrlLookup = new()
    {
        { 1, "https://www.google.com/" },
        { 2, "https://discussions.unity.com/" }
    };

    public void Setup(VisualElement root)
    {
        var linkLabel = root.Q<Label>(className: "link");
        linkLabel.RegisterCallback<PointerUpLinkTagEvent>(evt =>
        {
            var linkID = int.Parse(evt.linkID);
            if (m_UrlLookup.TryGetValue(linkID, out var url))
                Application.OpenURL(url);
        });
        linkLabel.RegisterCallback<PointerOverLinkTagEvent>(_ =>
            linkLabel.AddToClassList("link-cursor"));
        linkLabel.RegisterCallback<PointerOutLinkTagEvent>(_ =>
            linkLabel.RemoveFromClassList("link-cursor"));
    }
}
```

## Custom Filter (Swirl Shader Effect)

**SwirlFilterExample.uss**:
```css
.outside {
    flex-grow: 1;
    position: absolute;
    height: 207px;
    width: 234px;
    top: 46px;
    left: 27px;
    background-color: rgb(255, 0, 0);
}

.inside {
    flex-grow: 1;
    position: absolute;
    height: 75px;
    width: 100px;
    top: 46px;
    left: 27px;
    background-color: rgb(0, 255, 247);
}

.filterEffect {
    filter: filter("SwirlFilter/SwirlFilterFunction.asset" 58.9 2.3);
}
```
