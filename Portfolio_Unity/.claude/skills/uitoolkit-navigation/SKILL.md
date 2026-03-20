---
name: uitoolkit-navigation
description: >
  Unity UIToolkit navigation, interaction, and input handling for runtime game UI. Use this skill for
  tabbed menus, popup overlays, drag-and-drop, runtime element manipulation, and input event handling.
  Trigger when: user mentions "tabs", "tabbed menu", "popup", "overlay", "modal", "drag and drop",
  "dragging", "move element", "tooltip", "context menu", "navigation", "focus", "gamepad input",
  "pointer events", or needs interactive UI behavior beyond simple button clicks.
---

# UIToolkit Navigation & Interaction

Patterns for building interactive runtime UI: tabs, popups, drag-and-drop, and event handling.

## Tabbed Menu (Runtime)

### UXML Structure
```xml
<engine:UXML xmlns:engine="UnityEngine.UIElements">
    <Style src="TabbedMenu.uss" />
    <engine:VisualElement>
        <engine:VisualElement name="tabs">
            <engine:Label name="InventoryTab" text="Inventory" class="tab currentlySelectedTab" />
            <engine:Label name="StatsTab" text="Stats" class="tab" />
            <engine:Label name="QuestsTab" text="Quests" class="tab" />
        </engine:VisualElement>
        <engine:VisualElement name="tabContent">
            <engine:VisualElement name="InventoryContent">
                <!-- Inventory content here -->
            </engine:VisualElement>
            <engine:VisualElement name="StatsContent" class="unselectedContent">
                <!-- Stats content here -->
            </engine:VisualElement>
            <engine:VisualElement name="QuestsContent" class="unselectedContent">
                <!-- Quests content here -->
            </engine:VisualElement>
        </engine:VisualElement>
    </engine:VisualElement>
</engine:UXML>
```

### Tab Controller (C#)
```csharp
using UnityEngine.UIElements;

public class TabbedMenuController
{
    const string tabClassName = "tab";
    const string currentlySelectedTabClassName = "currentlySelectedTab";
    const string unselectedContentClassName = "unselectedContent";
    const string tabNameSuffix = "Tab";
    const string contentNameSuffix = "Content";

    readonly VisualElement root;

    public TabbedMenuController(VisualElement root)
    {
        this.root = root;
    }

    public void RegisterTabCallbacks()
    {
        root.Query<Label>(className: tabClassName).ForEach(tab =>
            tab.RegisterCallback<ClickEvent>(TabOnClick));
    }

    void TabOnClick(ClickEvent evt)
    {
        var clickedTab = evt.currentTarget as Label;
        if (clickedTab.ClassListContains(currentlySelectedTabClassName))
            return;

        // Deselect all other tabs
        root.Query<Label>(className: tabClassName)
            .Where(tab => tab != clickedTab && tab.ClassListContains(currentlySelectedTabClassName))
            .ForEach(tab =>
            {
                tab.RemoveFromClassList(currentlySelectedTabClassName);
                FindContent(tab).AddToClassList(unselectedContentClassName);
            });

        // Select clicked tab
        clickedTab.AddToClassList(currentlySelectedTabClassName);
        FindContent(clickedTab).RemoveFromClassList(unselectedContentClassName);
    }

    VisualElement FindContent(Label tab)
    {
        string prefix = tab.name[..^tabNameSuffix.Length];
        return root.Q(prefix + contentNameSuffix);
    }
}
```

### Tab USS
```css
#tabs {
    flex-direction: row;
    background-color: rgb(229, 223, 223);
    -unity-font-style: bold;
    font-size: 14px;
}

.tab { flex-grow: 1; }
.currentlySelectedTab { background-color: rgb(173, 166, 166); }
.unselectedContent { display: none; }

#tabContent {
    background-color: rgb(255, 255, 255);
    flex-grow: 1;
}
```

### MonoBehaviour Wiring
```csharp
public class TabbedMenu : MonoBehaviour
{
    void OnEnable()
    {
        var root = GetComponent<UIDocument>().rootVisualElement;
        var controller = new TabbedMenuController(root);
        controller.RegisterTabCallbacks();
    }
}
```

## Popup / Overlay Pattern (Runtime)

For runtime popups, create an overlay element that covers the screen:

```csharp
public static class PopupHelper
{
    public static VisualElement ShowPopup(VisualElement parent, VisualElement content)
    {
        // Full-screen overlay to block input behind popup
        var overlay = new VisualElement();
        overlay.style.position = Position.Absolute;
        overlay.style.left = overlay.style.right = overlay.style.top = overlay.style.bottom = 0;
        overlay.style.backgroundColor = new Color(0, 0, 0, 0.5f);
        overlay.style.alignItems = Align.Center;
        overlay.style.justifyContent = Justify.Center;

        // Close on overlay click (not content click)
        overlay.RegisterCallback<ClickEvent>(evt =>
        {
            if (evt.target == overlay)
                overlay.RemoveFromHierarchy();
        });

        overlay.Add(content);
        parent.Add(overlay);
        return overlay;
    }
}
```

## Drag and Drop (Runtime)

### PointerManipulator Pattern

```csharp
using UnityEngine;
using UnityEngine.UIElements;

public class DragManipulator : PointerManipulator
{
    Vector2 m_StartPosition;
    Vector3 m_PointerStart;
    bool m_Active;

    public DragManipulator(VisualElement target)
    {
        this.target = target;
    }

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

    void OnPointerDown(PointerDownEvent evt)
    {
        m_StartPosition = target.transform.position;
        m_PointerStart = evt.position;
        target.CapturePointer(evt.pointerId);  // Capture for reliable tracking
        m_Active = true;
    }

    void OnPointerMove(PointerMoveEvent evt)
    {
        if (!m_Active || !target.HasPointerCapture(evt.pointerId))
            return;

        Vector3 delta = evt.position - m_PointerStart;
        target.transform.position = new Vector2(
            m_StartPosition.x + delta.x,
            m_StartPosition.y + delta.y);
    }

    void OnPointerUp(PointerUpEvent evt)
    {
        if (!m_Active || !target.HasPointerCapture(evt.pointerId))
            return;

        target.ReleasePointer(evt.pointerId);
        m_Active = false;

        // Optional: snap to nearest slot
        SnapToSlot();
    }

    void SnapToSlot()
    {
        // Find overlapping slots and snap
        var root = target.panel.visualTree;
        var slots = root.Query<VisualElement>(className: "slot").ToList();

        VisualElement closest = null;
        float bestDist = float.MaxValue;

        foreach (var slot in slots)
        {
            if (!target.worldBound.Overlaps(slot.worldBound)) continue;
            var dist = (slot.worldBound.center - target.worldBound.center).sqrMagnitude;
            if (dist < bestDist) { bestDist = dist; closest = slot; }
        }

        if (closest != null)
        {
            var pos = closest.parent.LocalToWorld(closest.layout.position);
            var localPos = target.parent.WorldToLocal(pos);
            target.transform.position = localPos;
        }
        else
        {
            target.transform.position = m_StartPosition;  // Snap back
        }
    }
}
```

### Applying the Manipulator
```csharp
var draggable = root.Q<VisualElement>("draggable-item");
draggable.AddManipulator(new DragManipulator(draggable));
```

## Moving Elements at Runtime (World-Space UI)

For UI that follows game objects (name tags, health bars):

```csharp
public class WorldSpaceUI : MonoBehaviour
{
    [SerializeField] VisualTreeAsset m_NameTagTemplate;
    [SerializeField] UIDocument m_UIDocument;
    [SerializeField] Transform m_Target;

    VisualElement m_Tag;
    Camera m_Camera;

    void Start()
    {
        m_Camera = Camera.main;
        var container = m_UIDocument.rootVisualElement.Q("BaseContainer");

        m_Tag = m_NameTagTemplate.Instantiate();
        m_Tag.usageHints = UsageHints.DynamicTransform;  // Optimize for movement
        m_Tag.style.position = Position.Absolute;
        container.Add(m_Tag);
    }

    void Update()
    {
        var screenPos = m_Camera.WorldToViewportPoint(m_Target.position);
        var containerSize = m_UIDocument.rootVisualElement.Q("BaseContainer").layout.size;

        if (screenPos.z > 0)  // In front of camera
        {
            m_Tag.style.translate = new Translate(
                screenPos.x * containerSize.x,
                (1 - screenPos.y) * containerSize.y);
            m_Tag.style.display = DisplayStyle.Flex;

            // Scale based on distance
            float dist = Vector3.Distance(m_Target.position, m_Camera.transform.position);
            float scale = 1f / dist * 100f;
            m_Tag.style.scale = new Scale(new Vector2(scale, scale));
        }
        else
        {
            m_Tag.style.display = DisplayStyle.None;
        }
    }
}
```

## Event System Patterns

### Event Propagation
```csharp
// BubbleUp (default) — event goes from target up to root
element.RegisterCallback<ClickEvent>(handler);

// TrickleDown — event goes from root down to target
element.RegisterCallback<KeyDownEvent>(handler, TrickleDown.TrickleDown);

// Stop propagation
element.RegisterCallback<ClickEvent>(evt => {
    evt.StopPropagation();  // Prevent further handling
});
```

### Pointer Capture
For reliable drag tracking, capture the pointer so events continue even if the pointer
leaves the element:

```csharp
element.CapturePointer(evt.pointerId);      // Start capture
element.HasPointerCapture(evt.pointerId);    // Check
element.ReleasePointer(evt.pointerId);       // Release
```

### Toggle / Visibility Patterns
```csharp
// Show/hide with display (removes from layout)
element.style.display = DisplayStyle.None;   // Hidden
element.style.display = DisplayStyle.Flex;   // Visible

// Show/hide with visibility (keeps layout space)
element.style.visibility = Visibility.Hidden;
element.style.visibility = Visibility.Visible;

// Enable/disable interaction
element.SetEnabled(false);  // Grayed out, no input
element.SetEnabled(true);

// Visible property (shorthand for display)
element.visible = false;  // Same as display = None
```

## Reference Examples

For complete working examples, see `references/examples.md` in this skill directory.
It contains:
- Complete tabbed menu system (controller, MonoBehaviour, USS, UXML)
- PointerManipulator drag-and-drop with slot snapping (full C#, USS, UXML)
- Drop area with visual feedback USS
