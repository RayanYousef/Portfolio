# Lists & Collections UI Patterns

## ListView Fundamentals
- `ListView` displays a scrollable list of items, efficiently reusing visual elements to maintain performance with large lists (virtualization).
- Set `itemsSource` to an `IList` implementation (e.g., `List<T>`, `ObservableList<T>`).
- Implement `makeItem` to instantiate the visual element for an item.
- Implement `bindItem` to assign the data to the visual element for that specific item.

```csharp
var listView = root.Q<ListView>("my-list");
listView.itemsSource = myDataList;
listView.makeItem = () => new Label();
listView.bindItem = (element, i) => (element as Label).text = myDataList[i].Name;
listView.selectionType = SelectionType.Single;
```

## Runtime Binding ListView
- With `itemsSource` and `makeItem`/`bindItem`, you can bind to lists.
- If using the new Runtime Data Binding (Unity 6), `ListView` can be bound directly to a collection without writing `makeItem`/`bindItem` if it uses a template.
- Assign an `itemTemplate` in UXML.
```xml
<ui:ListView item-template="path/to/item.uxml" />
```
- In C#: `listView.bindingPath = "MyItems";` and let the visual tree's data source handle it automatically.

## Binding without ListView
- Sometimes you want a static list of items (e.g., a short list of tags) without scroll virtualization.
- Use `Repeater` or simply generate elements in C# and add them to a standard container `VisualElement` with flex-wrap.
- When generating elements dynamically in a container without virtualization, be cautious of performance with large collections.

## TreeView Patterns
- `TreeView` organizes hierarchical data.
- Setup requires a way to fetch roots and children (e.g., implementing `TreeViewItemData` or building the hierarchy with `makeItem`, `bindItem`).
- Similar virtualization mechanism to `ListView`.

## MultiColumnListView Patterns
- Use `MultiColumnListView` for grid-like data with columns and headers.
- Define `Columns` in UXML or C#.
- Each column can have its own `makeCell` and `bindCell` methods.
- Column definitions configure sorting, resizing, and minimum/maximum widths.

## Best Practices
- Always use `ListView` for long or dynamic collections.
- Provide fixed element heights (or `fixedItemHeight`) for `ListView` if performance is critical or items don't have a reliable auto height.
- Leverage `ObservableList<T>` to trigger automatic UI updates when items are added/removed.
