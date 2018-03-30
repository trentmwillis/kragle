# KragleElement

```html
<template id="my-element-template">
  <p>Hello, {{name}}!</p>
</template>
```

```javascript
class MyElement extends BoundElement {
  static get is() {
    return 'my-element';
  }

  constructor() {
    this.props.name = 'Trent';
  }
}
```
