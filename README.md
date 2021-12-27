# Canvas VU meter

## How to use

[`vu-example.html`](./vu-example.html) has a more complete example of how to modify other stylings (background color, height, ...).

```html
<html>
<head>
  <script src="./vu-meter.js"></script>
  <link rel="stylesheet" href="./vu-meter.css">
  <script>
    const vu = new VUMeter({
      gradientStart: '#75b831',
      gradientMiddle: '#f2921b',
      gradientEnd: '#c11e0f',
      barSpeed: 2, // how fast the bar moves when the volume changes
      tickerSpeed: 4, // how fast the ticker falls down
      tickerHeight: 2,
      tickerColor: 'black',
      refreshRate: 60, // how often the canvas is redrawn
    });
    vu.start();

    // volumes can be retrieved with an HTTP request
    setInterval(() => {
      vu.volumes = vu.volumes.map(() => Math.random());
    }, 100);
  </script>
  <style>
    .container {
      display: inline-flex;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="vu-scale"></div>
    <div class="vu-bar-container"></div>
    <div class="vu-bar-container"></div>
    <div class="vu-bar-container"></div>
    <div class="vu-bar-container"></div>
  </div>
</body>
</html>

```
