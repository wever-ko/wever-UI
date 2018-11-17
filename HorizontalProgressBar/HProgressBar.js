/**
 * @author guyeoljeong
 * HProgressBar UI
 */
var HProgressBar = (function ()
{
  var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };

		/**
     * @private
     * @method
     * @param {ElementObject} elem
     * @param {Object} attrs
     */
    function __attrs (elem, attrs) {
      for (var a in attrs) {
        elem.setAttribute(a, attrs[a]);
      }
    }

    /**
     * @private
     * @method
     * @param {String} which
     * @param {Object} attrs
     */
    function createSVGElem(which, attrs) {
      var el = document.createElementNS('http://www.w3.org/2000/svg', which);
      __attrs(el, attrs);
      return el;
    }

    var defaults = {
    	width: 200,
    	height: 30,
      barRadius: 5,
    	progressColor: "#84cd99",
    	backgroundColor: "#e5e5e5",
      text: "50%",
      textColor: "#000000",
      textSize: 10,
    	value: 50         //percent value
    };

    function HProgressBar(opts) {
    	if (opts === void 0) { opts = {};}
    	this._opts = __assign({}, defaults, opts);
      return this;
    }

    HProgressBar.prototype.create = function (target) {
    	this.svg = createSVGElem('svg', {
        'xmlns': 'http://www.w3.org/2000/svg',
        'width': this._opts.width,
        'height': this._opts.height
      });

    	this.background = createSVGElem('rect', {
    		'width': this._opts.width,
    		'height': this._opts.height,
    		'fill': this._opts.backgroundColor
    	});

      this.progress = createSVGElem('rect', {
        'width': this._opts.width / 100 * this._opts.value,
        'height': this._opts.height,
        'fill': this._opts.progressColor,
        'rx': this._opts.barRadius,
        'ry': this._opts.barRadius
      });

      this.textField = createSVGElem('text', {
        'x': this._opts.value / 2,
        'y': this._opts.height / 2,
        'text-anchor': "middle",
        'alignment-baseline':"central",
        'font-size': this._opts.textSize,
        'fill': this._opts.textColor
      });

      this.textField.textContent = "";
    	target.appendChild(this.svg);
    	this.svg.appendChild(this.background);
      this.svg.appendChild(this.progress);
      this.svg.appendChild(this.textField);
      return this;
    }

    HProgressBar.prototype.val = function (value) {
      if (typeof value != "undefined") {
        var w = this._opts.width / 100 * value;
        this._opts.value = value;
        this.progress.setAttribute('width', w);
        this.text(value);
        return this;
      }
      else return this._opts.value;
    }

    HProgressBar.prototype.width = function (width) {
      if (typeof width != "undefined") {
        this._opts.width = width;
        this.svg.setAttribute('width', width);
        this.background.setAttribute('width', width);
        this.val(this._opts.value);
        return this;
      }
      else return this._opts.width;
    }

    HProgressBar.prototype.height = function (height) {
      if (typeof height != "undefined") {
        this._opts.height = height;
        this.svg.setAttribute('height', height);
        this.background.setAttribute('height', height);
        this.progress.setAttribute('height', height);
        this.val(this._opts.value);
        return this;
      }
      else return this._opts.height;
    }

    HProgressBar.prototype.progressColor = function (color) {
      if (typeof color != "undefined") {
        this._opts.progressColor = color;
        this.progress.setAttribute('fill', color);
        return this;
      }
      else return this._opts.progressColor;
    }

    HProgressBar.prototype.backgroundColor = function (color) {
      if (typeof color != "undefined") {
        this._opts.backgroundColor = color;
        this.background.setAttribute('fill', color);
        return this;
      }
      else return this._opts.backgroundColor;
    }

    HProgressBar.prototype.text = function (value) {
      if (typeof value != "undefined") {
        this.textField.textContent = value+"%";
        __attrs(this.textField, {'x': this._opts.width / 2, 'y': this._opts.height / 2});
        return this;
      }
      else return this.textField.textContent;
    }

    HProgressBar.prototype.radius = function (rad) {
      if (typeof rad != "undefined") {
        this._opts.barRadius = rad;
        __attrs(this.textField, {'rx': rad, 'ry': rad});
        return this;
      }
      else return this._opts.barRadius;
    }

    HProgressBar.prototype.textColor = function (color) {
      if (typeof color != "undefined") {
        this._opts.textColor = color;
        this.textField.setAttribute('fill', color);
        return this;
      }
      else return this._opts.textColor;
    }

    HProgressBar.prototype.textSize = function (size) {
      if (typeof size != "undefined") {
        this._opts.textSize = size;
        this.textField.setAttribute('font-size', size);
        return this;
      }
      else return this._opts.textSize;
    }
    return HProgressBar;

}());
