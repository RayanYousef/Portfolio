# UIToolkit Navigation & Interaction - Reference Examples

## Tabbed Menu (Complete Runtime Example)

### TabbedMenu-style.uss

```css
#tabs {
    flex-direction: row;
    background-color: rgb(229, 223, 223);
    -unity-font-style: bold;
    font-size: 14px;
}
.tab { flex-grow: 1; }
.currentlySelectedTab { background-color: rgb(173, 166, 166); }
#tabContent { background-color: rgb(255, 255, 255); font-size: 20px; }
.unselectedContent { display: none; }
```

### TabbedMenu-template.uxml

```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" editor-extension-mode="False">
    <Style src="TabbedMenu-style.uss" />
    <ui:VisualElement>
        <ui:VisualElement name="tabs">
            <ui:Label name="LondonTab" text="London" class="tab currentlySelectedTab" />
            <ui:Label name="ParisTab" text="Paris" class="tab" />
            <ui:Label name="OttawaTab" text="Ottawa" class="tab" />
        </ui:VisualElement>
        <ui:VisualElement name="tabContent">
            <ui:Label text="London is the capital city of England" name="LondonContent" />
            <ui:Label text="Paris is the capital of France" name="ParisContent" class="unselectedContent" />
            <ui:Label text="Ottawa is the capital of Canada" name="OttawaContent" class="unselectedContent" />
        </ui:VisualElement>
    </ui:VisualElement>
</ui:UXML>
```

### TabbedMenu.cs (MonoBehaviour)

```csharp
using UnityEngine;
using UnityEngine.UIElements;

public class TabbedMenu : MonoBehaviour
{
    private TabbedMenuController controller;
    private void OnEnable()
    {
        UIDocument menu = GetComponent<UIDocument>();
        VisualElement root = menu.rootVisualElement;
        controller = new(root);
        controller.RegisterTabCallbacks();
    }
}
```

### TabbedMenuController.cs

```csharp
using UnityEngine.UIElements;

public class TabbedMenuController
{
    private const string tabClassName = "tab";
    private const string currentlySelectedTabClassName = "currentlySelectedTab";
    private const string unselectedContentClassName = "unselectedContent";
    private const string tabNameSuffix = "Tab";
    private const string contentNameSuffix = "Content";
    private readonly VisualElement root;

    public TabbedMenuController(in VisualElement root) { this.root = root; }

    public void RegisterTabCallbacks()
    {
        UQueryBuilder<Label> tabs = GetAllTabs();
        tabs.ForEach(tab => tab.RegisterCallback<ClickEvent>(TabOnClick));
    }

    private void TabOnClick(ClickEvent evt)
    {
        Label clickedTab = evt.currentTarget as Label;
        if (!TabIsCurrentlySelected(clickedTab))
        {
            GetAllTabs().Where(tab => tab != clickedTab && TabIsCurrentlySelected(tab)).ForEach(UnselectTab);
            SelectTab(clickedTab);
        }
    }

    private static bool TabIsCurrentlySelected(in Label tab) => tab.ClassListContains(currentlySelectedTabClassName);
    private UQueryBuilder<Label> GetAllTabs() => root.Query<Label>(className: tabClassName);

    private void SelectTab(in Label tab)
    {
        tab.AddToClassList(currentlySelectedTabClassName);
        FindContent(tab).RemoveFromClassList(unselectedContentClassName);
    }

    private void UnselectTab(Label tab)
    {
        tab.RemoveFromClassList(currentlySelectedTabClassName);
        FindContent(tab).AddToClassList(unselectedContentClassName);
    }

    private static string GenerateContentName(in Label tab) =>
        tab.name.Substring(0, tab.name.Length - tabNameSuffix.Length) + contentNameSuffix;

    private VisualElement FindContent(in Label tab) => root.Q(GenerateContentName(tab));
}
```

## Drag and Drop (PointerManipulator)

### DragAndDropManipulator.cs

```csharp
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UIElements;

public class DragAndDropManipulator : PointerManipulator
{
    public DragAndDropManipulator(VisualElement target) { this.target = target; root = target.parent; }

    protected override void RegisterCallbacksOnTarget()
    {
        target.RegisterCallback<PointerDownEvent>(PointerDownHandler);
        target.RegisterCallback<PointerMoveEvent>(PointerMoveHandler);
        target.RegisterCallback<PointerUpEvent>(PointerUpHandler);
        target.RegisterCallback<PointerCaptureOutEvent>(PointerCaptureOutHandler);
    }

    protected override void UnregisterCallbacksFromTarget()
    {
        target.UnregisterCallback<PointerDownEvent>(PointerDownHandler);
        target.UnregisterCallback<PointerMoveEvent>(PointerMoveHandler);
        target.UnregisterCallback<PointerUpEvent>(PointerUpHandler);
        target.UnregisterCallback<PointerCaptureOutEvent>(PointerCaptureOutHandler);
    }

    private Vector2 targetStartPosition { get; set; }
    private Vector3 pointerStartPosition { get; set; }
    private bool enabled { get; set; }
    private VisualElement root { get; }

    private void PointerDownHandler(PointerDownEvent evt)
    {
        targetStartPosition = target.transform.position;
        pointerStartPosition = evt.position;
        target.CapturePointer(evt.pointerId);
        enabled = true;
    }

    private void PointerMoveHandler(PointerMoveEvent evt)
    {
        if (enabled && target.HasPointerCapture(evt.pointerId))
        {
            Vector3 pointerDelta = evt.position - pointerStartPosition;
            target.transform.position = new Vector2(
                Mathf.Clamp(targetStartPosition.x + pointerDelta.x, 0, target.panel.visualTree.worldBound.width),
                Mathf.Clamp(targetStartPosition.y + pointerDelta.y, 0, target.panel.visualTree.worldBound.height));
        }
    }

    private void PointerUpHandler(PointerUpEvent evt)
    {
        if (enabled && target.HasPointerCapture(evt.pointerId))
            target.ReleasePointer(evt.pointerId);
    }

    private void PointerCaptureOutHandler(PointerCaptureOutEvent evt)
    {
        if (enabled)
        {
            VisualElement slotsContainer = root.Q<VisualElement>("slots");
            UQueryBuilder<VisualElement> allSlots = slotsContainer.Query<VisualElement>(className: "slot");
            UQueryBuilder<VisualElement> overlappingSlots = allSlots.Where(OverlapsTarget);
            VisualElement closestOverlappingSlot = FindClosestSlot(overlappingSlots);
            Vector3 closestPos = Vector3.zero;
            if (closestOverlappingSlot != null)
            {
                closestPos = RootSpaceOfSlot(closestOverlappingSlot);
                closestPos = new Vector2(closestPos.x - 5, closestPos.y - 5);
            }
            target.transform.position = closestOverlappingSlot != null ? closestPos : targetStartPosition;
            enabled = false;
        }
    }

    private bool OverlapsTarget(VisualElement slot) => target.worldBound.Overlaps(slot.worldBound);

    private VisualElement FindClosestSlot(UQueryBuilder<VisualElement> slots)
    {
        List<VisualElement> slotsList = slots.ToList();
        float bestDistanceSq = float.MaxValue;
        VisualElement closest = null;
        foreach (VisualElement slot in slotsList)
        {
            Vector3 displacement = RootSpaceOfSlot(slot) - target.transform.position;
            float distanceSq = displacement.sqrMagnitude;
            if (distanceSq < bestDistanceSq) { bestDistanceSq = distanceSq; closest = slot; }
        }
        return closest;
    }

    private Vector3 RootSpaceOfSlot(VisualElement slot)
    {
        Vector2 slotWorldSpace = slot.parent.LocalToWorld(slot.layout.position);
        return root.WorldToLocal(slotWorldSpace);
    }
}
```

### DragAndDropWindow.uss

```css
.slot {
    width: 80px;
    height: 80px;
    margin: 5px;
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
}
.slot_row { flex-direction: row; }
.object {
    width: 50px;
    height: 50px;
    position: absolute;
    left: 20px;
    top: 20px;
    border-radius: 30px;
    background-color: rgb(0, 0, 0);
}
```

### DragAndDropWindow.uxml

```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" editor-extension-mode="False">
    <Style src="DragAndDropWindow.uss" />
    <ui:VisualElement name="slots">
        <ui:VisualElement name="slot_row1" class="slot_row">
            <ui:VisualElement name="slot1" class="slot" />
            <ui:VisualElement name="slot2" class="slot" />
        </ui:VisualElement>
        <ui:VisualElement name="slot_row2" class="slot_row">
            <ui:VisualElement name="slot1" class="slot" />
            <ui:VisualElement name="slot2" class="slot" />
        </ui:VisualElement>
    </ui:VisualElement>
    <ui:VisualElement name="object" class="object" />
</ui:UXML>
```

## Drop Area with Visual Feedback

### DragAndDrop.uss

```css
.drop-area {
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    margin: 10px;
    padding: 5px;
    background-color: rgba(112, 128, 144, 255);
    border-color: rgba(211, 211, 211, 255);
    border-width: 2px;
    border-radius: 20px;
}
.drop-area--dropping {
    opacity: 0.4;
    background-color: rgba(0, 100, 0, 255);
}
```
