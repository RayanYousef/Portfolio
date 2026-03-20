# Fundamentals & Layout Patterns

## UXML Structure & UIDocument Setup
- `UIDocument` component must be attached to a GameObject in the scene.
- Load the UXML file by assigning it to the `UIDocument.visualTreeAsset` or instantiating it via C#:
  ```csharp
  var uiDocument = GetComponent<UIDocument>();
  var root = uiDocument.rootVisualElement;
  ```

## Positioning Patterns (Absolute vs Relative)
- Elements are positioned `relative` by default in UIToolkit's Flexbox-based layout.
- Use `position: absolute;` in USS to take an element out of the flow and position it relative to its parent container using `top`, `bottom`, `left`, `right`.
- **USS Example**:
  ```css
  .absolute-element {
      position: absolute;
      top: 10px;
      right: 10px;
  }
  ```

## ScrollView Patterns
- To make a `ScrollView` wrap its content, set its container to use flex-wrap.
- Example UXML for ScrollView with flex wrap:
  ```xml
  <ui:ScrollView class="wrap-scrollview">
      <ui:VisualElement class="item"/>
      <ui:VisualElement class="item"/>
  </ui:ScrollView>
  ```
- Example USS:
  ```css
  .wrap-scrollview .unity-scroll-view__content-container {
      flex-direction: row;
      flex-wrap: wrap;
  }
  ```

## Flexbox Fundamentals
- **`flex-direction`**: `column` (default) vs `row`.
- **`flex-grow`**: Use `flex-grow: 1` to make an element fill available space.
- **`align-items`**: `flex-start`, `center`, `flex-end`, `stretch`.
- **`justify-content`**: `flex-start`, `center`, `flex-end`, `space-between`, `space-around`.

## Best Practices
- Keep UXML files small and modular.
- Avoid heavily nested VisualElements to improve performance.
- Use classes for styling rather than inline styles where possible.
