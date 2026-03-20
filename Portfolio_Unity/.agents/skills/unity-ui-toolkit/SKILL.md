---
name: unity-ui-toolkit
description: >
  Generate Unity UI Toolkit interfaces (UXML, USS, C#). Use when users ask to create
  UI screens, menus, HUDs, panels, editor windows, custom controls, or any Unity UI
  using UI Toolkit. Handles runtime UI (UIDocument + MonoBehaviour) and editor UI
  (EditorWindow, CustomEditor). TRIGGER when: user mentions UI Toolkit, UXML, USS,
  Unity UI, game menu, HUD, settings screen, inventory, dialog, panel, editor window,
  custom inspector, or asks to create/build/design any UI for Unity. Also trigger when
  user asks to style Unity UI, create a custom control, add transitions, or build any
  visual interface for a Unity project — even if they don't say "UI Toolkit" explicitly.
---

# Unity UI Toolkit UI Generator

Generate production-ready Unity UI Toolkit interfaces: UXML (structure), USS (styling), and C# (behavior).

UI Toolkit is Unity's recommended UI system. It works like web development: UXML is HTML, USS is CSS, C# is JavaScript. Layout uses Yoga Flexbox (default direction: **column**, not row).

## Reference Files

This skill uses progressive disclosure. Read reference files as needed:

| File | When to Read |
|------|-------------|
| `references/uxml.md` | Building UXML structure — elements, templates, data binding, naming |
| `references/uss.md` | Styling — selectors, properties, variables, transitions, gotchas |
| `references/csharp.md` | C# behavior — controllers, events, ListView, custom controls, drag-and-drop |
| `references/examples.md` | Full working examples from Unity's official manual — tab menu, character list, custom controls |

Read the relevant reference file(s) before generating code. For a typical UI task, you'll need all four.

---

## Step 1: Gather Requirements

Before generating code, clarify what's needed using AskUserQuestion. Skip questions the user already answered.

**Question 1 — Context:**
"Is this UI for runtime (in-game) or Unity Editor?"
- **Runtime** — UIDocument + MonoBehaviour (menus, HUDs, settings, inventories, dialogs)
- **Editor window** — EditorWindow with CreateGUI()
- **Custom Inspector** — CustomEditor with CreateInspectorGUI()

**Question 2 — UI Type** (runtime only):
"What type of UI are you building?"
- **Full screen** (main menu, settings, inventory, character select)
- **Overlay/HUD** (health bar, score, minimap — uses `picking-mode="Ignore"`)
- **Popup/Dialog** (confirmation, alert, tooltip — absolute-positioned overlay)
- **Panel/Widget** (chat window, leaderboard, shop item)

**Question 3** (only if relevant):
- "Do you need scrollable lists (ListView)?" — triggers ListView pattern
- "Any transitions/animations?" — triggers USS transition patterns
- "Color theme preference?" — customizes USS variables

---

## Step 2: Generate Files

Always produce **three files** per UI component:

1. **`ComponentName.uxml`** — Structure and layout
2. **`ComponentName.uss`** — Styling (linked from UXML via `<Style src="..." />`)
3. **`ComponentName.cs`** — Behavior / controller

### File Placement
```
Assets/
  UI/
    Screens/        # Full-screen UIs (menus, settings)
    Components/     # Reusable pieces (health bar, slot)
    Styles/         # Shared USS (variables, common classes)
    Scripts/        # C# controllers
  Editor/           # Editor windows and inspectors (if applicable)
```

### UXML Root Templates

**Runtime:**
```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" editor-extension-mode="False">
    <Style src="ComponentName.uss" />
    <ui:VisualElement name="root" class="root">
        <!-- Content -->
    </ui:VisualElement>
</ui:UXML>
```

**Editor:**
```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" xmlns:uie="UnityEditor.UIElements" editor-extension-mode="True">
    <Style src="ComponentName.uss" />
    <ui:VisualElement name="root" class="root">
        <!-- Content -->
    </ui:VisualElement>
</ui:UXML>
```

### USS Variables Template

Start every USS file with a theme variables block for consistency:
```css
:root {
    --color-primary: rgb(52, 152, 219);
    --color-bg: rgba(20, 20, 30, 0.95);
    --color-text: rgb(236, 240, 241);
    --font-md: 16px;
    --spacing-md: 8px;
    --radius: 4px;
}
```

### C# Controller Templates

**Runtime (MonoBehaviour + UIDocument):**
```csharp
using UnityEngine;
using UnityEngine.UIElements;

public class ComponentNameController : MonoBehaviour
{
    void OnEnable()
    {
        var root = GetComponent<UIDocument>().rootVisualElement;
        // Query elements, register events
    }

    void OnDisable()
    {
        // ALWAYS unregister events here
    }
}
```

**Editor Window:**
```csharp
using UnityEditor;
using UnityEngine;
using UnityEngine.UIElements;

public class MyToolWindow : EditorWindow
{
    [MenuItem("Window/My Tool")]
    public static void ShowWindow() => GetWindow<MyToolWindow>("My Tool");

    [SerializeField] private VisualTreeAsset m_UXML;

    public void CreateGUI()
    {
        m_UXML.CloneTree(rootVisualElement);
        // Query and setup
    }
}
```

---

## Step 3: Quality Checklist

Verify before delivering:

**UXML:**
- Correct namespace and `editor-extension-mode` (True for editor, False for runtime)
- All queryable elements have `name` attributes (kebab-case: `btn-play`, `lbl-score`)
- Style sheet linked with `<Style src="..." />`
- Classes use BEM convention: `block`, `block__element`, `block__element--modifier`

**USS:**
- Uses CSS variables for colors/fonts/spacing (theming-ready)
- Hover/active/focus states on interactive elements
- Transitions on state changes (`transition: background-color 0.2s ease-out`)
- No unsupported features (no `calc()`, `grid`, `@keyframes`, `::before/::after`, `media queries`, `box-shadow`)
- Only `px` and `%` units (no `em`, `rem`, `vw`, `vh`)
- Remember: default flex-direction is **column** (not row)

**C#:**
- Events registered in `OnEnable()`, unregistered in `OnDisable()`
- Correct base class (MonoBehaviour for runtime, EditorWindow for editor)
- Query elements in `OnEnable()` (not `Awake()` — rootVisualElement may not be ready)

**HUD-specific:**
- `picking-mode="Ignore"` on overlay containers (so they don't block game input)

**ListView-specific:**
- Use `makeItem`/`bindItem` pattern (never manual Add in a loop)
- Set `fixedItemHeight` when items are same height (performance)

---

## Step 4: Performance

Apply these when relevant — no need to mention them all to the user:

- **ListView** for any list of 10+ items (virtualization reuses elements)
- **`display: none`** to hide elements (not Remove/Add — avoids rebuild)
- **`picking-mode="Ignore"`** on decorative elements that shouldn't receive input
- **`UsageHints.DynamicTransform`** on elements moved every frame via `style.translate`
- **USS classes over inline styles** — USS is cached globally; inline styles are per-element
- **Minimize tree depth** — flatten unnecessary wrapper VisualElements
- **Sprite Atlas** — combine UI sprites for better draw-call batching

---

## Common Patterns Quick Reference

| Pattern | UXML Key | USS Key | C# Key |
|---------|----------|---------|--------|
| **Tab Menu** | Label tabs + content panels | `.currentlySelectedTab`, `.unselectedContent { display: none }` | Click toggles classes |
| **ListView** | `<ui:ListView>` | Item styling | `makeItem`/`bindItem`/`selectionChanged` |
| **Dialog** | Absolute overlay + centered box | `position: absolute; background-color: rgba(0,0,0,0.6)` | Create dynamically, add to root |
| **HUD** | `picking-mode="Ignore"` root | Absolute positioning, transparent bg | Update in `Update()` loop |
| **Settings** | ScrollView + Foldouts + Sliders/Toggles | Section spacing | Load/save PlayerPrefs |
| **Inventory** | `flex-wrap: wrap; flex-direction: row` | Fixed slot size, margin for gaps | Drag-and-drop with PointerManipulator |
| **Custom Control** | Custom namespace element | BEM classes, USS variables | `VisualElement` subclass + `UxmlFactory` |

For full working examples of each pattern, read `references/examples.md`.
