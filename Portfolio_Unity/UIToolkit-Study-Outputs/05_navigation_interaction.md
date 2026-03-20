# Navigation & Interaction Patterns

## Tab Navigation Patterns
- Use radio buttons grouped by `RadioButtonGroup` or custom `VisualElement` setup with `Button`.
- Create a container for tab headers and another for tab content.
- Example structure:
```xml
<ui:VisualElement class="tabs-container">
    <ui:Button name="tab1" text="Tab 1" />
    <ui:Button name="tab2" text="Tab 2" />
</ui:VisualElement>
<ui:VisualElement class="content-container">
    <ui:VisualElement name="content1" />
    <ui:VisualElement name="content2" style="display: none;" />
</ui:VisualElement>
```
- In C#: Register `ClickEvent` to toggle the `display` style property between `DisplayStyle.Flex` and `DisplayStyle.None`.
```csharp
var tab1 = root.Q<Button>("tab1");
var content1 = root.Q<VisualElement>("content1");
var content2 = root.Q<VisualElement>("content2");
tab1.RegisterCallback<ClickEvent>(evt => {
    content1.style.display = DisplayStyle.Flex;
    content2.style.display = DisplayStyle.None;
});
```

## Moving Elements at Runtime
- For runtime interactions (e.g., dragging an item), register pointer events: `PointerDownEvent`, `PointerMoveEvent`, `PointerUpEvent`.
- Capture the pointer to ensure the element receives all move events even if the pointer leaves its bounds:
```csharp
element.RegisterCallback<PointerDownEvent>(evt => {
    element.CapturePointer(evt.pointerId);
    // Track initial position
});
element.RegisterCallback<PointerMoveEvent>(evt => {
    if (element.HasPointerCapture(evt.pointerId)) {
        // Update element.style.left and element.style.top based on delta
    }
});
element.RegisterCallback<PointerUpEvent>(evt => {
    element.ReleasePointer(evt.pointerId);
});
```

## Popup Windows & Overlays
- Popups should be elements positioned `absolute` within the `UIDocument` root, typically filling the screen (100% width/height) with a semi-transparent background to block underlying interaction.
- Toggle visibility using `DisplayStyle.Flex`/`DisplayStyle.None` or `visibility: hidden`.
- Use a higher `z-index` (if supported) or ensure the popup is the last element in the UXML hierarchy so it renders on top.
```xml
<ui:VisualElement class="popup-overlay" style="position: absolute; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);">
    <ui:VisualElement class="popup-content">
        <ui:Label text="Are you sure?" />
        <ui:Button text="Yes" />
        <ui:Button text="No" />
    </ui:VisualElement>
</ui:VisualElement>
```

## Drag and Drop (Runtime Applicable)
- Unity's `DragAndDrop` utility is primarily for the Editor.
- For runtime drag-and-drop, you must implement custom logic using Pointer events (as shown in "Moving Elements").
- Determine drop targets by checking intersections (`worldBound.Contains(evt.position)` on potential targets) during `PointerUpEvent`.
- Visually indicate valid drop targets using hover states or dynamic USS class toggles during `PointerMoveEvent`.

## Gotchas and Best Practices
- Never use `EditorWindow` or `DragAndDrop` API for runtime UI.
- Use `CapturePointer` for reliable drag interactions.
- Consider touch input (`TouchEvent`) alongside `PointerEvent` if the game targets mobile devices, though `PointerEvent` generally handles both.
- Use `BringToFront()` to ensure a dragged element is rendered above others.
