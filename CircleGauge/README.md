# CircleGauge

## Preview
![](./docs/exgif.gif)
## Usage 

html
```html
<script src="path/to/circleGauge.js"></script>
<div id = 'target'></div>
```
javascript
```javascript
var target = document.getElementById('target');
var circularBar = new CircleGauge().create(target);
```
with requireJs
```javascript
	require(['../circleGauge.js'], function (Gage) {
	
		var target = document.getElementById('test');
		var circularBar = new Gage().create(target);
	});
```

## Examples
[CircleGauge Examples](https://yeonjuan.github.io/ygui/circlegauge.html)
## Docs
[CircleGauge API docs](./DOC.md)

