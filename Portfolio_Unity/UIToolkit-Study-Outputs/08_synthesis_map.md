# Phase 2 Synthesis Map

## Overlaps and Dependencies
- **Styling Dependency**: All skills (`fundamentals`, `layout`, `binding`, `lists`, `custom-controls`, `navigation`, `styling-animation`) heavily rely on standardizing CSS. The `design-system` skill must be the foundational skill that establishes `TSS`, USS variables (`--variable-name`), typography, and spacing conventions.
- **Fundamentals vs Layout**: `fundamentals` covers the core UXML/UIDocument setup and Scene injection. `layout` builds on this by deeply exploring Flexbox, Absolute positioning, and ScrollView wrapping. `fundamentals` should explicitly reference `layout` for complex positioning.
- **Binding vs Lists**: Data binding (`binding` skill) is essential for data-driven `ListViews` (`lists` skill). The `lists` skill should assume basic knowledge of binding (`dataSource`, `binding-path`) and focus on collection-specific binding mechanisms like `item-template` or `makeItem`/`bindItem`.
- **Custom Controls vs Binding**: Custom controls often require the implementation of `INotifyValueChanged<T>` and `BaseField<T>` to hook into the runtime data binding system. `custom-controls` should explicitly highlight this intersection.

## Unity 6 Compatibility Concerns & Deprecations
- **Runtime vs Editor**: Editor APIs like `SerializedObject`, `SerializedProperty`, `EditorWindow`, and Unity's Editor `DragAndDrop` utility are explicitly deprecated for runtime UI. The skills must actively instruct the AI to avoid these.
  - *Data Binding*: Use `INotifyPropertyChanged` and `.dataSource`, NEVER `SerializedObject`.
  - *Drag & Drop*: Use pointer capture (`PointerDownEvent`, `PointerMoveEvent`, `PointerUpEvent`), NEVER Editor `DragAndDrop`.
- **UxmlTraits**: While `UxmlTraits` is the classic way to expose properties to UXML, Unity 6 introduces direct `[UxmlAttribute]` annotations on properties. Both are valid, but the attribute approach is newer and cleaner for C# 9+. The `custom-controls` skill should emphasize the `[UxmlAttribute]` pattern.
- **Animation**: The `experimental.animation` namespace or USS transitions (`transition-property`) are the standard. Never use `transform.position` or `GameObject` animations for UI Toolkit elements.

## Skill Boundaries
1. **uitoolkit-design-system (Foundation)**: Single source of truth for styles. Defines TSS, CSS variables (`:root`), naming conventions (kebab-case), color/typography/spacing scales.
2. **uitoolkit-fundamentals**: The entry point. Scene setup (`UIDocument`), simple UXML structure, basic C# querying (`root.Q<T>`), attaching USS.
3. **uitoolkit-layout**: Flexbox mechanics, relative vs absolute positioning, responsive design, ScrollView wrap configurations.
4. **uitoolkit-binding**: Runtime property binding, `INotifyPropertyChanged`, nested binding paths, custom data type converters.
5. **uitoolkit-lists**: `ListView`, `TreeView`, `MultiColumnListView`, virtualization concepts, `item-template`, dynamic collections (`ObservableList`).
6. **uitoolkit-custom-controls**: Subclassing `VisualElement`/`BaseField`, `[UxmlAttribute]`, Vector API (`MeshGenerationContext`), dynamic style loading.
7. **uitoolkit-navigation**: Tabbed menus, runtime drag-and-drop via pointer events, popup window overlays (z-index/hierarchy placement).
8. **uitoolkit-styling-animation**: USS transitions, transition events in C#, looping animations, text typewriter effects.
9. **uitoolkit-patterns (Optional Synthesis)**: High-level recipes combining the above (e.g., an Inventory screen using Lists, Binding, and Design System).

## Key Directives for Skill Creation
- **Trigger Conditions**: Every skill description must have a "pushy" trigger condition specifying exactly when the AI should use it (e.g., "Use this whenever asked to create a list, grid, or inventory UI...").
- **Inline Code**: Provide concrete UXML, USS, and C# snippets that adhere to the `design-system` variables (e.g., using `var(--color-primary)` instead of hardcoded colors).
- **File References**: Point to the specific folders inside `Assets/UIToolkit-Manual-Examples/` for further exploration if the AI needs deeper context.
- **Common Mistakes**: Every skill must have a "Gotchas / Common Mistakes" section addressing the deprecations and runtime-specific rules listed above.
