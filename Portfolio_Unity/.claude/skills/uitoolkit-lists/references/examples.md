# UIToolkit Lists — Reference Examples

## Runtime ListView with Item Templates (Character Selection)

**CharacterData.cs**:
```csharp
using UnityEngine;

public enum ECharacterClass { Knight, Ranger, Wizard }

[CreateAssetMenu]
public class CharacterData : ScriptableObject
{
    public string CharacterName;
    public ECharacterClass Class;
    public Sprite PortraitImage;
}
```

**CharacterListController.cs**:
```csharp
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UIElements;

public class CharacterListController
{
    VisualTreeAsset m_ListEntryTemplate;
    ListView m_CharacterList;
    Label m_CharClassLabel;
    Label m_CharNameLabel;
    VisualElement m_CharPortrait;
    List<CharacterData> m_AllCharacters;

    public void InitializeCharacterList(VisualElement root, VisualTreeAsset listElementTemplate)
    {
        EnumerateAllCharacters();
        m_ListEntryTemplate = listElementTemplate;
        m_CharacterList = root.Q<ListView>("character-list");
        m_CharClassLabel = root.Q<Label>("character-class");
        m_CharNameLabel = root.Q<Label>("character-name");
        m_CharPortrait = root.Q<VisualElement>("character-portrait");
        FillCharacterList();
        m_CharacterList.selectionChanged += OnCharacterSelected;
    }

    void EnumerateAllCharacters()
    {
        m_AllCharacters = new List<CharacterData>();
        m_AllCharacters.AddRange(Resources.LoadAll<CharacterData>("Characters"));
    }

    void FillCharacterList()
    {
        m_CharacterList.makeItem = () =>
        {
            var newListEntry = m_ListEntryTemplate.Instantiate();
            var newListEntryLogic = new CharacterListEntryController();
            newListEntry.userData = newListEntryLogic;
            newListEntryLogic.SetVisualElement(newListEntry);
            return newListEntry;
        };
        m_CharacterList.bindItem = (item, index) =>
        {
            (item.userData as CharacterListEntryController)?.SetCharacterData(m_AllCharacters[index]);
        };
        m_CharacterList.fixedItemHeight = 45;
        m_CharacterList.itemsSource = m_AllCharacters;
    }

    void OnCharacterSelected(IEnumerable<object> selectedItems)
    {
        var selectedCharacter = m_CharacterList.selectedItem as CharacterData;
        if (selectedCharacter == null)
        {
            m_CharClassLabel.text = "";
            m_CharNameLabel.text = "";
            m_CharPortrait.style.backgroundImage = null;
            return;
        }
        m_CharClassLabel.text = selectedCharacter.Class.ToString();
        m_CharNameLabel.text = selectedCharacter.CharacterName;
        m_CharPortrait.style.backgroundImage = new StyleBackground(selectedCharacter.PortraitImage);
    }
}
```

**CharacterListEntryController.cs**:
```csharp
using UnityEngine.UIElements;

public class CharacterListEntryController
{
    Label m_NameLabel;

    public void SetVisualElement(VisualElement visualElement)
    {
        m_NameLabel = visualElement.Q<Label>("character-name");
    }

    public void SetCharacterData(CharacterData characterData)
    {
        m_NameLabel.text = characterData.CharacterName;
    }
}
```

**MainView.cs**:
```csharp
using UnityEngine;
using UnityEngine.UIElements;

public class MainView : MonoBehaviour
{
    [SerializeField] VisualTreeAsset m_ListEntryTemplate;

    void OnEnable()
    {
        var uiDocument = GetComponent<UIDocument>();
        var characterListController = new CharacterListController();
        characterListController.InitializeCharacterList(uiDocument.rootVisualElement, m_ListEntryTemplate);
    }
}
```

**ListEntry.uxml**:
```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" editor-extension-mode="False">
    <Style src="ListEntry.uss" />
    <ui:VisualElement name="list-entry">
        <ui:Label text="Label" name="character-name" />
    </ui:VisualElement>
</ui:UXML>
```

**MainView.uxml**:
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

## Simple ListView Variants

**PlanetsWindow.cs** (base data class):
```csharp
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UIElements;

public class PlanetsWindow
{
    protected interface IPlanetOrGroup
    {
        public string name { get; }
        public bool populated { get; }
    }

    protected class Planet : IPlanetOrGroup
    {
        public string name { get; }
        public bool populated { get; }
        public Planet(string name, bool populated = false) { this.name = name; this.populated = populated; }
    }

    protected class PlanetGroup : IPlanetOrGroup
    {
        public string name { get; }
        public bool populated { get { foreach (var p in planets) if (p.populated) return true; return false; } }
        public readonly IReadOnlyList<Planet> planets;
        public PlanetGroup(string name, IReadOnlyList<Planet> planets) { this.name = name; this.planets = planets; }
    }

    protected static readonly List<PlanetGroup> planetGroups = new List<PlanetGroup>
    {
        new PlanetGroup("Inner Planets", new List<Planet> { new Planet("Mercury"), new Planet("Venus"), new Planet("Earth", true), new Planet("Mars") }),
        new PlanetGroup("Outer Planets", new List<Planet> { new Planet("Jupiter"), new Planet("Saturn"), new Planet("Uranus"), new Planet("Neptune") })
    };

    protected static IList<TreeViewItemData<IPlanetOrGroup>> treeRoots
    {
        get
        {
            int id = 0;
            var roots = new List<TreeViewItemData<IPlanetOrGroup>>();
            foreach (var group in planetGroups)
            {
                var children = new List<TreeViewItemData<IPlanetOrGroup>>();
                foreach (var planet in group.planets)
                    children.Add(new TreeViewItemData<IPlanetOrGroup>(id++, planet));
                roots.Add(new TreeViewItemData<IPlanetOrGroup>(id++, group, children));
            }
            return roots;
        }
    }
}
```

**MultiColumnListView setup** (C# pattern):
```csharp
var listView = rootVisualElement.Q<MultiColumnListView>();
listView.itemsSource = planets;
listView.columns["name"].makeCell = () => new Label();
listView.columns["populated"].makeCell = () => new Toggle();
listView.columns["name"].bindCell = (VisualElement element, int index) =>
    (element as Label).text = planets[index].name;
listView.columns["populated"].bindCell = (VisualElement element, int index) =>
    (element as Toggle).value = planets[index].populated;
```

**MultiColumnListView.uxml**:
```xml
<ui:MultiColumnListView fixed-item-height="20">
    <ui:Columns>
        <ui:Column name="name" title="Name" width="80" />
        <ui:Column name="populated" title="Populated?" width="80" />
    </ui:Columns>
</ui:MultiColumnListView>
```

**TreeView setup** (C# pattern):
```csharp
var treeView = rootVisualElement.Q<TreeView>();
treeView.SetRootItems(treeRoots);
treeView.makeItem = () => new Label();
treeView.bindItem = (VisualElement element, int index) =>
    (element as Label).text = treeView.GetItemDataForIndex<IPlanetOrGroup>(index).name;
```

## Custom ListView Item (HP Slider)

**CharacterInfoVisualElement** (C# programmatic item):
```csharp
public class CharacterInfoVisualElement : VisualElement
{
    public CharacterInfoVisualElement()
    {
        var root = new VisualElement();
        root.style.paddingTop = 3f;
        root.style.paddingBottom = 15f;
        root.style.paddingLeft = 3f;
        root.style.borderBottomColor = Color.gray;
        root.style.borderBottomWidth = 1f;

        var nameLabel = new Label() { name = "nameLabel" };
        nameLabel.style.fontSize = 14f;

        var hpContainer = new VisualElement();
        hpContainer.style.flexDirection = FlexDirection.Row;
        hpContainer.style.paddingLeft = 15f;
        hpContainer.style.paddingRight = 15f;
        hpContainer.Add(new Label("HP:"));

        var hpSlider = new SliderInt { name = "hp", lowValue = 0, highValue = 100 };
        hpSlider.style.flexGrow = 1f;
        hpContainer.Add(hpSlider);

        var hpColor = new VisualElement { name = "hpColor" };
        hpColor.style.height = 15f;
        hpColor.style.width = 15f;
        hpColor.style.marginRight = 5f;
        hpColor.style.marginLeft = 5f;
        hpContainer.Add(hpColor);

        root.Add(nameLabel);
        root.Add(hpContainer);
        Add(root);
    }
}
```
