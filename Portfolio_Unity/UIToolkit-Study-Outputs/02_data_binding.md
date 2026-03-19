# Runtime Data Binding Patterns

## Property Binding (Runtime)
- Data binding allows properties of C# objects to be synchronized with properties of visual elements.
- The `INotifyPropertyChanged` interface must be implemented for two-way bindings where the object notifies the UI.
- Setting up a `DataSource`:
  ```csharp
  var element = root.Q<Label>("my-label");
  element.dataSource = new MyData { Name = "Binding Target" };
  ```

## Setting a Binding Path
- Binding paths define which property of the `dataSource` a visual element property should bind to.
- Via UXML:
  ```xml
  <ui:Label binding-path="Name" />
  ```
- Via C#:
  ```csharp
  element.SetBinding("text", new DataBinding
  {
      dataSourcePath = new PropertyPath("Name")
  });
  ```
- When using `binding-path`, VisualElements automatically know which property they correspond to if it matches their expected primary property (e.g., `text` for a `TextField`).

## Nested Properties and Multi-Property Binding
- Use dot notation for nested properties.
  ```csharp
  element.dataSourcePath = new PropertyPath("Stats.Health");
  ```
- To bind multiple properties on a single element (e.g. `value` and `label`), configure explicit `DataBinding` objects for each in C#.

## Custom Data Types & Converters
- Binding complex objects requires creating a custom `BindingConverter` to convert between the data type and the UI property type.
- Example: Convert an `int` back and forth to a `string` for a `TextField`.
  ```csharp
  public class IntToStringConverter : BindingConverter<int, string>
  {
      public override bool TryConvert(ref int value, out string result)
      {
          result = value.ToString();
          return true;
      }
      public override bool TryConvertBack(ref string value, out int result)
      {
          return int.TryParse(value, out result);
      }
  }
  ```
- Then use it during bind setup: `binding.converter = new IntToStringConverter();`

## Gotchas and Best Practices
- Binding applies hierarchically. An element inherits `dataSource` from its parent unless overridden.
- Avoid editor-specific SerializedObject/SerializedProperty binding logic when targeting runtime UI. Only use `INotifyPropertyChanged` and `dataSource`.
