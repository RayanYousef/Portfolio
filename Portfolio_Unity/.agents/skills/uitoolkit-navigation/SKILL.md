---
name: uitoolkit-navigation
description: Core skill for building tab menus, popups, and runtime drag-and-drop interactions in Unity 6 UI Toolkit. Make sure to use this skill when asked to create navigable UI (like tabs), moving elements on screen with the mouse, or modal overlay popups. DO NOT use EditorWindow or Unity's DragAndDrop utility API for runtime UI.
---

# Unity 6 UI Toolkit Navigation & Interaction

This skill covers how to handle complex interactive elements at runtime: switching between tabs, displaying modal popups, and implementing drag-and-drop mechanics using raw pointer events.

## Trigger Conditions
- Use when requested to make a "Tabbed Menu" or switch between different views.
- Use when asked to create a "Popup", "Dialog", "Modal", or "Tooltip".
- Use when the prompt mentions "Dragging", "Dropping", or moving elements with the mouse/touch.

## 1. Tab Navigation (C# & UXML)
Tabs are essentially buttons that toggle the visibility (`DisplayStyle.Flex` vs `DisplayStyle.None`) of corresponding content containers.

### UXML Setup (`TabbedMenu.uxml`)
```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <ui:VisualElement class="tabs-container" style="flex-direction: row;">
        <ui:Button name="tab1" text="General" class="tab-button active-tab" />
        <ui:Button name="tab2" text="Graphics" class="tab-button" />
    </ui:VisualElement>

    <ui:VisualElement class="content-container">
        <ui:VisualElement name="content1" class="tab-content" style="display: flex;">
            <!-- General Settings... -->
        </ui:VisualElement>
        <ui:VisualElement name="content2" class="tab-content" style="display: none;">
            <!-- Graphics Settings... -->
        </ui:VisualElement>
    </ui:VisualElement>
</ui:UXML>
```

### C# Logic (`TabController.cs`)
```csharp
using UnityEngine;
using UnityEngine.UIElements;

public class TabController : MonoBehaviour
{
    private Button _tab1, _tab2;
    private VisualElement _content1, _content2;

    void OnEnable()
    {
        var root = GetComponent<UIDocument>().rootVisualElement;

        _tab1 = root.Q<Button>("tab1");
        _tab2 = root.Q<Button>("tab2");
        _content1 = root.Q<VisualElement>("content1");
        _content2 = root.Q<VisualElement>("content2");

        _tab1?.RegisterCallback<ClickEvent>(evt => SwitchTab(1));
        _tab2?.RegisterCallback<ClickEvent>(evt => SwitchTab(2));
    }

    private void SwitchTab(int index)
    {
        // Toggle visibility (display style)
        _content1.style.display = index == 1 ? DisplayStyle.Flex : DisplayStyle.None;
        _content2.style.display = index == 2 ? DisplayStyle.Flex : DisplayStyle.None;

        // Toggle visual active state (USS classes)
        if (index == 1)
        {
            _tab1.AddToClassList("active-tab");
            _tab2.RemoveFromClassList("active-tab");
        }
        else
        {
            _tab2.AddToClassList("active-tab");
            _tab1.RemoveFromClassList("active-tab");
        }
    }
}
```

## 2. Popup Windows (Absolute Overlays)
Popups should be elements positioned `absolute` (from `uitoolkit-layout`) within the root.
- Toggle visibility using `DisplayStyle.None`.
- Add a semi-transparent background to block underlying interactions (a "lightbox" effect).

```csharp
// Example method to show a popup
public void ShowPopup(string message)
{
    var overlay = root.Q<VisualElement>("popup-overlay");
    var label = root.Q<Label>("popup-message");

    label.text = message;
    overlay.style.display = DisplayStyle.Flex; // Show it
    overlay.BringToFront(); // Ensure it renders on top of everything else
}
```

## 3. Runtime Drag & Drop (Pointer Events)
Unity's built-in `DragAndDrop` utility is explicitly deprecated for runtime UI. You must use `PointerDownEvent`, `PointerMoveEvent`, and `PointerUpEvent` and capture the pointer.

### C# Logic (`DraggableElement.cs`)
```csharp
using UnityEngine;
using UnityEngine.UIElements;

public class DraggableElement : VisualElement
{
    private bool _isDragging;
    private Vector2 _startMousePos;
    private Vector2 _startElementPos;

    public DraggableElement()
    {
        RegisterCallback<PointerDownEvent>(OnPointerDown);
        RegisterCallback<PointerMoveEvent>(OnPointerMove);
        RegisterCallback<PointerUpEvent>(OnPointerUp);
        // Important: Position must be absolute to drag freely without breaking layout
        style.position = Position.Absolute;
    }

    private void OnPointerDown(PointerDownEvent evt)
    {
        _isDragging = true;
        _startMousePos = evt.position;
        _startElementPos = new Vector2(resolvedStyle.left, resolvedStyle.top);

        // Capture pointer so we keep receiving move events even if mouse leaves the element
        CapturePointer(evt.pointerId);
        BringToFront(); // Ensure it renders above other elements while dragging
        evt.StopPropagation();
    }

    private void OnPointerMove(PointerMoveEvent evt)
    {
        if (!_isDragging || !HasPointerCapture(evt.pointerId)) return;

        Vector2 delta = evt.position - _startMousePos;
        style.left = _startElementPos.x + delta.x;
        style.top = _startElementPos.y + delta.y;

        // Optional: Highlight drop targets underneath
        // VisualElement target = panel.Pick(evt.position);
    }

    private void OnPointerUp(PointerUpEvent evt)
    {
        if (!_isDragging || !HasPointerCapture(evt.pointerId)) return;

        _isDragging = false;
        ReleasePointer(evt.pointerId);

        // Optional: Check if dropped on a valid target
        // if (target != null && target.ClassListContains("drop-zone")) { ... }
    }
}
```

## Best Practices & Gotchas
- **Pointer Capture**: ALWAYS call `CapturePointer` on `PointerDownEvent` and `ReleasePointer` on `PointerUpEvent` to ensure reliable drag interactions, especially if the user moves the mouse quickly outside the element's bounds.
- **Absolute Position**: Dragged elements MUST be `position: absolute` (or use `translate` if keeping layout flow is desired, though `absolute` is easier for arbitrary placement).
- **Z-Index**: Use `BringToFront()` on the dragged element or popup to ensure it renders above its siblings.
- **Runtime Deprecation**: Never use `UnityEditor.DragAndDrop` or `EditorWindow` outside of the Unity Editor.

## File References
- Explore `Assets/UIToolkit-Manual-Examples/create-a-tabbed-menu-for-runtime/`
- Explore `Assets/UIToolkit-Manual-Examples/move-elements-at-runtime/`
- Explore `Assets/UIToolkit-Manual-Examples/create-a-popup-window/`
