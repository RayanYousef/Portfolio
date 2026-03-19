---
name: uitoolkit-patterns
description: Advanced skill combining multiple Unity 6 UI Toolkit concepts to create common game UI recipes. Make sure to use this skill when asked to build complex screens like an "Inventory System", "Settings Menu", or "HUD". It references other skills to synthesize complete solutions using the Design System, Binding, Lists, and Layout.
---

# Unity 6 UI Toolkit UI Patterns & Recipes

This skill synthesizes the core UI Toolkit skills (`uitoolkit-design-system`, `uitoolkit-fundamentals`, `uitoolkit-binding`, `uitoolkit-lists`, `uitoolkit-layout`) into complete, production-ready game UI patterns.

## Trigger Conditions
- Use when requested to build an "Inventory UI", a "Settings Screen", or a complex "HUD".
- Use when asked how to combine data binding with lists and themes.
- Always assume the presence of a master `theme.tss` (Design System) when styling these patterns.

## 1. The Inventory Pattern (Lists + Binding + Layout)
An inventory screen typically requires a scrollable grid of items that update automatically when the underlying data changes.

### Key Components:
- **`ObservableList<T>`**: To notify the UI when items are added/removed.
- **`ListView` / Virtualization**: To handle hundreds of items efficiently.
- **`item-template`**: To automatically bind item data (`Name`, `Icon`, `Quantity`) to the visual representation.
- **`flex-wrap` & `ScrollView` (Alternative)**: If a true grid flow is needed without strict column/row virtualization.

### Implementation Checklist:
1. Define the `Item` class implementing `INotifyPropertyChanged`.
2. Define the `InventoryController` holding an `ObservableList<Item>`.
3. Create `InventoryItem.uxml` with `binding-path` attributes (e.g., `<ui:Label binding-path="Quantity" />`).
4. Create `InventoryScreen.uxml` with a `<ui:ListView item-template="InventoryItem.uxml" />`.
5. In C#, assign `root.dataSource = inventoryController` and `listView.bindingPath = "Items"`.

## 2. The Settings Menu Pattern (Navigation + Binding)
A settings menu usually involves tabs (Graphics, Audio, Gameplay) and various input controls bound to a central settings manager.

### Key Components:
- **Tabs (Navigation)**: Buttons that toggle `display: flex/none` on content containers.
- **Two-Way Binding**: `Toggle`, `SliderInt`, `DropdownField` bound to a `SettingsModel` (`INotifyPropertyChanged`).
- **Overlays (Absolute Layout)**: A popup to confirm "Apply Changes?" before saving.

### Implementation Checklist:
1. Create a `SettingsModel` with properties like `MasterVolume`, `Fullscreen`.
2. Build `SettingsMenu.uxml` with a `.tabs-container` (row layout) and `.content-container` (column layout).
3. Use `binding-path="MasterVolume"` on a `<ui:Slider>` inside the Audio tab container.
4. Use `binding-path="Fullscreen"` on a `<ui:Toggle>` inside the Graphics tab container.
5. In C#, set the `UIDocument` root `.dataSource` to the `SettingsModel` instance.

## 3. The HUD Pattern (Absolute Positioning + Animation)
A Heads-Up Display overlays the game world, often requiring elements anchored to screen corners and animated responses to game events (e.g., taking damage).

### Key Components:
- **Absolute Positioning**: Elements like health bars or minimaps must be `position: absolute` with explicit `top/bottom/left/right` values.
- **Custom Controls (Vector API)**: A circular health globe or radial progress bar.
- **Animation**: Health bar depletion using `experimental.animation.Scale()` or CSS `transition`.

### Implementation Checklist:
1. Set the root `.hud-container` to `width: 100%; height: 100%; position: absolute;`.
2. Anchor a `PlayerStats` panel using `position: absolute; bottom: var(--spacing-md); left: var(--spacing-md);`.
3. Bind a custom `RadialProgress` control's `progress` attribute to the player's health data.
4. When health changes, trigger a CSS class `.damage-flash` that transitions `background-color` to `var(--color-error)` and back.

## Best Practices & Synthesis Gotchas
- **Separation of Concerns**: Keep UXML for structure, USS for styling (using `--variables`), and C# for logic/binding setup. Do not mix them (e.g., avoid inline styles in UXML, avoid hardcoding colors in C#).
- **Single Data Source**: For complex screens like Settings or Inventory, try to have a single root data model assigned to `root.dataSource`, and let UI Toolkit's hierarchical binding handle the rest via `binding-path`.
- **Runtime Focus**: Remember, all these patterns are strictly for runtime UI. Never reference `EditorWindow` or `SerializedObject`.

## File References
- Explore `Assets/UIToolkit-Manual-Examples/` for specific atomic examples to combine into these patterns.
