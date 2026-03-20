---
name: uitoolkit-lists
description: Core skill for building lists, grids, and collections in Unity 6 UI Toolkit. Make sure to use this skill when asked to create an inventory, a scrollable list of items, a tree view, or a multi-column table. Focuses on ListView virtualization and item templates. Relies on 'uitoolkit-binding' for data updates.
---

# Unity 6 UI Toolkit Lists & Collections

This skill covers how to efficiently display collections of data using `ListView`, `TreeView`, and `MultiColumnListView`. These controls use **virtualization** to reuse visual elements, making them performant even with thousands of items.

## Trigger Conditions
- Use when asked to display a dynamic list of items (e.g., an inventory, high scores).
- Use when requested to create a grid or table of data.
- Use when the prompt mentions `ListView`, `TreeView`, `MultiColumnListView`, `ObservableList`, `makeItem`, or `bindItem`.

## 1. ListView Fundamentals (C# Setup)
The classic way to set up a `ListView` involves defining how items are created (`makeItem`), bound (`bindItem`), and providing the data (`itemsSource`).

```csharp
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UIElements;

public class InventoryController : MonoBehaviour
{
    private List<string> _items = new List<string> { "Sword", "Shield", "Potion" };

    void Start()
    {
        var root = GetComponent<UIDocument>().rootVisualElement;
        var listView = root.Q<ListView>("inventory-list");

        // 1. Assign Data
        listView.itemsSource = _items;

        // 2. Make Item: Create the visual element hierarchy for ONE item.
        listView.makeItem = () => new Label();

        // 3. Bind Item: Map data from the source list to the visual element.
        listView.bindItem = (element, index) =>
        {
            var label = element as Label;
            label.text = _items[index];
            // Apply styles based on design system
            label.AddToClassList("inventory-item");
            label.AddToClassList("body-text");
        };

        // Optional: Fixed item height improves performance significantly.
        listView.fixedItemHeight = 40;
    }
}
```

## 2. Runtime Binding ListView (Unity 6 Pattern)
Unity 6 allows direct binding of collections without writing `makeItem`/`bindItem` if you use `item-template` in UXML and the Runtime Data Binding system (`dataSource`).

### UXML Setup (`Main.uxml`)
```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" xmlns:uie="UnityEditor.UIElements">
    <!-- Link the template. This handles makeItem automatically. -->
    <ui:ListView name="inventory-list" item-template="InventoryItem.uxml" class="inventory-container" />
</ui:UXML>
```

### Item Template (`InventoryItem.uxml`)
The template handles `bindItem` automatically using `binding-path`. The root of this template becomes the bound element.
```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" xmlns:uie="UnityEditor.UIElements">
    <ui:VisualElement class="item-row">
        <!-- Binds to the 'Name' property of the item object -->
        <ui:Label binding-path="Name" class="body-text" />
        <!-- Binds to the 'Quantity' property -->
        <ui:Label binding-path="Quantity" class="caption-text text-muted" />
    </ui:VisualElement>
</ui:UXML>
```

### C# Setup (Binding the Collection)
```csharp
public class InventoryData
{
    // The collection must be bindable
    public List<Item> Items { get; set; } = new List<Item>();
}

public class Item : INotifyPropertyChanged { /* ... properties like Name, Quantity ... */ }

// In MonoBehaviour Start:
var listView = root.Q<ListView>("inventory-list");
var inventory = new InventoryData();

// The visual tree's data source provides the collection binding
listView.bindingPath = "Items";
root.dataSource = inventory;
```

## 3. Observable Lists
If your collection changes (items added/removed) and you want the `ListView` to update automatically without manually calling `listView.RefreshItems()`, use `ObservableList<T>`.

```csharp
using UnityEngine.UIElements;

public class PlayerInventory
{
    public ObservableList<Item> Items { get; set; } = new ObservableList<Item>();
}
```

## 4. TreeView Patterns
`TreeView` is for hierarchical data. You must define a way to get roots and children.
- You can build the hierarchy manually by creating `TreeViewItemData<T>` nodes and setting `treeView.SetRootItems()`.
- Virtualization works similarly to `ListView` (`makeItem`, `bindItem`).

## 5. MultiColumnListView
Use `MultiColumnListView` for grid/table layouts. Define columns in C# or UXML.
Each column can specify its own `makeCell` and `bindCell` methods.

## Best Practices & Gotchas
- **Virtualization Performance**: Always use `fixedItemHeight` if possible. If items have variable heights, virtualization is less efficient.
- **`makeItem` Cleanliness**: Do not put event listeners or heavy initialization inside `bindItem`. Do that in `makeItem`. `bindItem` is called frequently during scrolling.
- **Dynamic Updates**: If you modify the *contents* of a standard `List<T>`, the `ListView` won't know unless you call `.RefreshItems()`. If you replace the list entirely, or use `ObservableList<T>`, the UI updates automatically.
- **Grids**: To create a multi-column grid that wraps, you can use a normal `VisualElement` with a `ScrollView` and `flex-wrap: wrap` (see `uitoolkit-layout`), but it won't be virtualized. If you need virtualization for a grid, `ListView` only scrolls vertically or horizontally by default.

## File References
- Explore `Assets/UIToolkit-Manual-Examples/create-listview-runtime-ui/`
- Explore `Assets/UIToolkit-Manual-Examples/runtime-binding-listview/`
