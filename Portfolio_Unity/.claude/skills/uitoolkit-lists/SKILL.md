---
name: uitoolkit-lists
description: >
  Unity UIToolkit ListView, TreeView, and MultiColumn controls for runtime game UI. Use this skill
  for scrollable lists, data-driven item lists, inventory grids, tree hierarchies, tables, or any
  repeating item pattern. Trigger when: user mentions "ListView", "TreeView", "list", "inventory",
  "item list", "table", "MultiColumnListView", "data list", "scrollable items", "makeItem", "bindItem",
  "itemsSource", or needs to display collections of data. Consult uitoolkit-binding for data source setup.
---

# UIToolkit Lists & Collections

ListView, TreeView, and MultiColumn controls for displaying collections of data efficiently
with built-in virtualization (only visible items are rendered).

## ListView — The Core Pattern

### Minimal Setup (C# Only)

```csharp
public class SimpleListUI : MonoBehaviour
{
    void OnEnable()
    {
        var root = GetComponent<UIDocument>().rootVisualElement;
        var listView = root.Q<ListView>("my-list");

        // Data
        var items = new List<string> { "Sword", "Shield", "Potion" };

        // Three required callbacks:
        listView.itemsSource = items;                        // 1. Data source
        listView.makeItem = () => new Label();               // 2. Create visual for each item
        listView.bindItem = (element, index) =>              // 3. Bind data to visual
            (element as Label).text = items[index];
        listView.fixedItemHeight = 20;                       // Height for virtualization
    }
}
```

### UXML Declaration

```xml
<engine:ListView name="my-list" focusable="true" fixed-item-height="20" />
```

Or with more options:
```xml
<engine:ListView
    name="item-list"
    focusable="true"
    fixed-item-height="45"
    selection-type="Single"
    show-border="true"
    reorderable="true"
    reorder-mode="Animated"
    show-add-remove-footer="false"
    virtualization-method="FixedHeight"
/>
```

## ListView with Item Templates (Rich Items)

For complex items, use a separate UXML template:

### Item Template (ListEntry.uxml)
```xml
<engine:UXML xmlns:engine="UnityEngine.UIElements">
    <Style src="ListEntry.uss" />
    <engine:VisualElement name="list-entry">
        <engine:Label name="character-name" />
    </engine:VisualElement>
</engine:UXML>
```

### Item Controller Pattern
```csharp
public class CharacterListEntryController
{
    Label m_NameLabel;

    public void SetVisualElement(VisualElement visualElement)
    {
        m_NameLabel = visualElement.Q<Label>("character-name");
    }

    public void SetCharacterData(CharacterData data)
    {
        m_NameLabel.text = data.CharacterName;
    }
}
```

### Main Controller
```csharp
public class CharacterListController
{
    VisualTreeAsset m_ListEntryTemplate;
    ListView m_CharacterList;
    List<CharacterData> m_AllCharacters;

    public void Initialize(VisualElement root, VisualTreeAsset template)
    {
        m_ListEntryTemplate = template;
        m_CharacterList = root.Q<ListView>("character-list");

        m_CharacterList.makeItem = () =>
        {
            var entry = m_ListEntryTemplate.Instantiate();
            var controller = new CharacterListEntryController();
            entry.userData = controller;
            controller.SetVisualElement(entry);
            return entry;
        };

        m_CharacterList.bindItem = (item, index) =>
        {
            (item.userData as CharacterListEntryController)
                ?.SetCharacterData(m_AllCharacters[index]);
        };

        m_CharacterList.fixedItemHeight = 45;
        m_CharacterList.itemsSource = m_AllCharacters;

        // Selection callback
        m_CharacterList.selectionChanged += OnSelectionChanged;
    }

    void OnSelectionChanged(IEnumerable<object> selectedItems)
    {
        var selected = m_CharacterList.selectedItem as CharacterData;
        if (selected == null) return;
        // Update detail view...
    }
}
```

### MonoBehaviour Wiring
```csharp
public class MainView : MonoBehaviour
{
    [SerializeField] VisualTreeAsset m_ListEntryTemplate;

    void OnEnable()
    {
        var root = GetComponent<UIDocument>().rootVisualElement;
        var controller = new CharacterListController();
        controller.Initialize(root, m_ListEntryTemplate);
    }
}
```

## ListView with Runtime Binding (Unity 6)

Bind a list directly in UXML using the runtime binding system:

### Item Template (ListViewItem.uxml)
```xml
<engine:UXML xmlns:engine="UnityEngine.UIElements">
    <engine:VisualElement style="flex-direction: row;">
        <engine:Toggle>
            <Bindings>
                <engine:DataBinding property="value" data-source-path="enabled" binding-mode="TwoWay"/>
            </Bindings>
        </engine:Toggle>
        <engine:TextField>
            <Bindings>
                <engine:DataBinding property="value" data-source-path="name" binding-mode="TwoWay"/>
            </Bindings>
        </engine:TextField>
    </engine:VisualElement>
</engine:UXML>
```

### Main UXML
```xml
<engine:ListView
    binding-source-selection-mode="AutoAssign"
    item-template="ListViewItem.uxml"
    data-source="MyDataAsset.asset"
    show-foldout-header="true"
    virtualization-method="DynamicHeight"
    reorderable="true"
    show-add-remove-footer="true">
    <Bindings>
        <engine:DataBinding property="itemsSource" data-source-path="items"/>
    </Bindings>
</engine:ListView>
```

`binding-source-selection-mode="AutoAssign"` automatically sets each item's data source to the
corresponding list element — no C# `bindItem` callback needed.

## TreeView

For hierarchical data:

```csharp
void SetupTreeView(VisualElement root)
{
    var treeView = root.Q<TreeView>();

    // Build hierarchical data using TreeViewItemData<T>
    var treeData = new List<TreeViewItemData<MyItem>>();
    int id = 0;

    var children = new List<TreeViewItemData<MyItem>>
    {
        new TreeViewItemData<MyItem>(id++, new MyItem("Child 1")),
        new TreeViewItemData<MyItem>(id++, new MyItem("Child 2")),
    };

    treeData.Add(new TreeViewItemData<MyItem>(id++, new MyItem("Parent"), children));

    treeView.SetRootItems(treeData);
    treeView.makeItem = () => new Label();
    treeView.bindItem = (element, index) =>
        (element as Label).text = treeView.GetItemDataForIndex<MyItem>(index).Name;
}
```

```xml
<engine:TreeView fixed-item-height="20" />
```

## MultiColumnListView (Tables)

```xml
<engine:MultiColumnListView fixed-item-height="20">
    <engine:Columns>
        <engine:Column name="name" title="Name" width="120" />
        <engine:Column name="level" title="Level" width="60" />
        <engine:Column name="class" title="Class" width="80" />
    </engine:Columns>
</engine:MultiColumnListView>
```

```csharp
var listView = root.Q<MultiColumnListView>();
listView.itemsSource = characters;

listView.columns["name"].makeCell = () => new Label();
listView.columns["name"].bindCell = (element, index) =>
    (element as Label).text = characters[index].Name;

listView.columns["level"].makeCell = () => new Label();
listView.columns["level"].bindCell = (element, index) =>
    (element as Label).text = characters[index].Level.ToString();
```

## MultiColumnTreeView

Same as MultiColumnListView but with hierarchical data:

```csharp
var treeView = root.Q<MultiColumnTreeView>();
treeView.SetRootItems(treeRoots);

treeView.columns["name"].makeCell = () => new Label();
treeView.columns["name"].bindCell = (element, index) =>
    (element as Label).text = treeView.GetItemDataForIndex<MyData>(index).Name;
```

## Selection Handling

```csharp
// Single selection
listView.selectionType = SelectionType.Single;
listView.selectionChanged += items =>
{
    var selected = listView.selectedItem as MyData;
};

// Multiple selection
listView.selectionType = SelectionType.Multiple;
listView.selectionChanged += items =>
{
    foreach (var item in items) { /* process */ }
};

// Programmatic selection
listView.selectedIndex = 0;
listView.ClearSelection();
```

## Dynamic List Updates

```csharp
// After modifying the data source:
items.Add(newItem);
listView.RefreshItems();  // Rebuilds visible items

// Or rebuild entirely:
listView.itemsSource = newList;
listView.Rebuild();
```

## Virtualization Methods

| Method | Use When |
|--------|----------|
| `FixedHeight` | All items are the same height (faster) |
| `DynamicHeight` | Items have varying heights (slower but flexible) |

## Common Mistakes

1. **Forgetting `fixedItemHeight`** — Without this, virtualization can't calculate scroll range
2. **Not calling `RefreshItems()`** — After modifying data, the list won't update automatically
3. **Modifying the visual element in `makeItem`** based on data — Use `bindItem` for data-dependent changes
4. **Creating new list instances** — Reuse the same list reference; changing `itemsSource` to a new list
   requires calling `Rebuild()`

## Reference Examples

For complete working examples, see `references/examples.md` in this skill directory.
It contains:
- Full character selection UI (ListView with item templates, controller pattern, UXML, USS)
- TreeView and MultiColumnListView setup patterns
- Custom ListView items with interactive controls (HP slider example)
- Runtime binding ListView example
