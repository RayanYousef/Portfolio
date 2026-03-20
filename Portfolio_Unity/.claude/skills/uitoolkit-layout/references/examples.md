# UIToolkit Layout Examples

Complete working examples from the Unity UIToolkit manual examples project.

---

## Positioning Example

Demonstrates `relative` and `absolute` positioning in UIToolkit. Relative elements remain in the document flow but are offset from their normal position. Absolute elements are removed from flow and positioned relative to their nearest positioned ancestor.

### PositioningTest.uss

```css
.vs {
    height: 70px;
    width: 70px;
    margin-bottom: 2px;
    background-color: gray;
}

#relative{
    width: 70px;
    height: 70px;
    background-color: purple;
    left: 25px;
    margin-bottom: 2px;
    position:relative;
}

#absolutePositionElement{
    left: 25px;
    top: 25px;
    width: 70px;
    height: 70px;
    background-color: black;
    position: absolute;
}
```

### PositioningTest.uxml

```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" editor-extension-mode="False">
    <Style src="PositioningTest.uss" />
    <ui:VisualElement>
        <ui:VisualElement class="vs" />
        <ui:VisualElement class="vs" />
        <ui:Label text="Relative\nPos\n25, 0" name="relative" />
        <ui:VisualElement class="vs" />
        <ui:VisualElement class="vs" />
        <ui:Label text="Absolute\nPos\n25, 25" name="absolutePositionElement" />
    </ui:VisualElement>
</ui:UXML>
```

**Key takeaways:**
- `position: relative` offsets the element from its normal flow position using `left`/`top`
- `position: absolute` removes the element from flow entirely and positions it relative to its parent
- Both use `left` and `top` for offset, but the reference point differs

---

## ScrollView Wrapping Example

Shows how to make items wrap inside a ScrollView by targeting the internal `.unity-scroll-view__content-container` and setting `flex-direction: row` with `flex-wrap: wrap`.

### ScrollViewExample.uss

```css
Label {
    font-size: 20px;
    -unity-font-style: bold;
    color: rgb(68, 138, 255);
    white-space: normal;
}

#scroll-view-wrap-example .unity-scroll-view__content-container {
    flex-direction: row;
    flex-wrap: wrap;
}

Button {
    width: 50px;
    height: 50px;
}
```

### ScrollViewExample.uxml

```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" editor-extension-mode="True">
    <Style src="ScrollViewExample.uss" />
    <ui:ScrollView>
        <ui:VisualElement>
            <ui:Label text="ScrollView Wrapping Example" />
        </ui:VisualElement>
    </ui:ScrollView>
    <ui:ScrollView name="scroll-view-wrap-example" />
</ui:UXML>
```

**Key takeaways:**
- The ScrollView's internal content container must be targeted with `#name .unity-scroll-view__content-container`
- Setting `flex-direction: row` and `flex-wrap: wrap` on the content container creates a grid-like layout
- Buttons or items added to the named ScrollView will wrap into rows automatically

---

## Master-Detail Layout (Character List)

A sidebar + content layout pattern commonly used for list-detail views. A `ListView` on the left shows selectable items, and the right panel displays details about the selected item.

### MainView.uxml

```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" editor-extension-mode="False">
    <Style src="MainView.uss" />
    <ui:VisualElement name="background">
        <ui:VisualElement name="main-container">
            <ui:ListView focusable="true" name="character-list" />
            <ui:VisualElement name="right-container">
                <ui:VisualElement name="details-container">
                    <ui:VisualElement name="details">
                        <ui:VisualElement name="character-portrait" />
                    </ui:VisualElement>
                    <ui:Label text="Label" name="character-name" />
                    <ui:Label text="Label" name="character-class" />
                </ui:VisualElement>
            </ui:VisualElement>
        </ui:VisualElement>
    </ui:VisualElement>
</ui:UXML>
```

**Key takeaways:**
- The `main-container` uses `flex-direction: row` in its USS to place the list and details side by side
- `ListView` handles virtualized scrolling of list items
- The right container uses `flex-grow: 1` to fill remaining space after the fixed-width list

---

## Moving Elements at Runtime

Demonstrates dynamic UI positioning that follows game world objects. Elements are positioned using `style.translate` for performance, and `UsageHints.DynamicTransform` signals the layout engine to optimize for frequent updates.

### MovingNameTag.cs

Positions a UI name tag over a world-space transform, scaling it based on camera distance.

```csharp
using System;
using UnityEngine;
using UnityEngine.UIElements;

public class MovingNameTag : MonoBehaviour
{
    [SerializeField] VisualTreeAsset m_NameTagTemplate;
    [SerializeField] UIDocument m_BaseContainerDocument;
    [SerializeField] Transform m_UITransform;
    [SerializeField] float m_ScaleMultiplier;
    [SerializeField] float m_DistanceCullingRange;

    VisualElement m_Root;
    VisualElement m_BaseContainer;
    VisualElement m_NpcNameTag;
    Camera m_MainCamera;

    void Awake()
    {
        m_MainCamera = Camera.main;
        m_BaseContainer = m_BaseContainerDocument.rootVisualElement.Q<VisualElement>("BaseContainer");
        m_NpcNameTag = m_NameTagTemplate.Instantiate();
        m_NpcNameTag.usageHints = UsageHints.DynamicTransform;
        m_BaseContainer.Add(m_NpcNameTag);
        m_NpcNameTag.style.position = new StyleEnum<Position>(Position.Absolute);
    }

    void Update()
    {
        var cameraSpaceLocation = GetCameraSpaceLocation(m_UITransform);
        m_NpcNameTag.style.translate = new Translate(cameraSpaceLocation.x, cameraSpaceLocation.y);
        var distance = Vector3.Distance(m_UITransform.position, m_MainCamera.transform.position);
        var scale = 1 / distance * m_ScaleMultiplier;
        m_NpcNameTag.style.scale = new Scale(new Vector2(scale, scale));
        if (cameraSpaceLocation.z < 0 || distance > m_DistanceCullingRange)
            m_NpcNameTag.style.display = DisplayStyle.None;
        else
            m_NpcNameTag.style.display = DisplayStyle.Flex;
    }

    Vector3 GetCameraSpaceLocation(Transform objectTransform)
    {
        var containerSize = m_BaseContainer.layout.size;
        var screenPoint = m_MainCamera.WorldToViewportPoint(objectTransform.position);
        return new Vector3(screenPoint.x * containerSize.x, (1 - screenPoint.y) * containerSize.y, screenPoint.z);
    }
}
```

### NameTag.uss

```css
#NameTag {
    position: absolute;
    translate: -50% -50%;
    -unity-font-style: bold;
    color: rgb(181, 210, 248);
    -unity-text-outline-width: 1px;
    -unity-text-outline-color: rgb(11, 60, 123);
}
```

### NameTag.uxml

```xml
<engine:UXML xmlns:engine="UnityEngine.UIElements">
    <Style src="NameTag.uss" />
    <engine:Label text="NPC" name="NameTag" picking-mode="Ignore" />
</engine:UXML>
```

### SortElements.cs

Sorts visual elements by their scale value so closer (larger) elements render on top.

```csharp
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UIElements;

public class SortElements : MonoBehaviour
{
    [SerializeField] UIDocument m_MovingElements;
    VisualElement m_BaseContainer;

    void Start()
    {
        m_BaseContainer = m_MovingElements.rootVisualElement.Q<VisualElement>("BaseContainer");
    }

    void Update()
    {
        m_BaseContainer.Sort((x, y) =>
            x.style.scale.value.value.x.CompareTo(y.style.scale.value.value.x));
    }
}
```

**Key takeaways:**
- Use `UsageHints.DynamicTransform` for elements that move every frame
- Prefer `style.translate` over `style.left`/`style.top` for runtime movement (better performance)
- Use `style.scale` for distance-based scaling
- Use `style.display = DisplayStyle.None` to cull off-screen or distant elements
- `translate: -50% -50%` in USS centers the element on its position point
- `picking-mode="Ignore"` prevents the element from intercepting pointer events
- `VisualElement.Sort()` can reorder children for correct depth ordering
