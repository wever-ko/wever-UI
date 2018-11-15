/**
 * @author guyeoljeong
 * VProgressBar UI
 */
var VProgressBar = (function ()
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
    	width: 30,
    	height: 200,
        barRadius: 5,
    	progressColor: "#84cd99",
    	backgroundColor: "#e5e5e5",
        text: "50%",
        textColor: "#000000",
        textSize: 10,
    	value: 0         //percent value
    };

    function VProgressBar(opts) {
    	if (opts === void 0) { opts = {};}
    	this._opts = __assign({}, defaults, opts);
    }

    VProgressBar.prototype.create = function (target) {
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
            'width': this._opts.width,
            'height': this._opts.height / 100 * this._opts.value,
            'fill': this._opts.progressColor,
            'y': this._opts.height - this._opts.height / 100 * this._opts.value,
            'rx': this._opts.barRadius,
            'ry': this._opts.barRadius
        });
        this.textField = createSVGElem('text', {
            'x': this._opts.value/2,
            'y': this._opts.height/2,
            'text-anchor': "middle",
            'alignment-baseline':"central",
            'font-size': this._opts.textSize,
            'color': this._opts.textColor
        });
        this.textField.textContent = "";
    	target.appendChild(this.svg);
    	this.svg.appendChild(this.background);
        this.svg.appendChild(this.progress);
        this.svg.appendChild(this.textField);
    }


    VProgressBar.prototype.val = function (value) {
        if (typeof value != "undefined") {
            var h = this._opts.height / 100 * value;
            this._opts.value = value;
            this.progress.setAttribute('height', h);
            this.progress.setAttribute('y', this._opts.height - h);
            this.text(value);
        }
        return this._opts.value;
    }

    VProgressBar.prototype.width = function (width) {
        if (typeof width != "undefined") {
            this._opts.width = width;
            this.svg.setAttribute('width', width);
            this.background.setAttribute('width', width);
            this.progress.setAttribute('width', width);
            this.val(this._opts.value);
        }
        return this._opts.width;
    }

    VProgressBar.prototype.height = function (height) {
        if (typeof height != "undefined") {
            this._opts.height = height;
            this.svg.setAttribute('height', height);
            this.background.setAttribute('height', height);
            this.val(this._opts.value);
        }
        return this._opts.height;
    }

    VProgressBar.prototype.progressColor = function (color) {
        if (typeof color != "undefined") {
            this._opts.progressColor = color;
            this.progress.setAttribute('fill', color);
        }
        return this._opts.progressColor;
    }

    VProgressBar.prototype.backgroundColor = function (color) {
        if (typeof color != "undefined") {
            this._opts.backgroundColor = color;
            this.background.setAttribute('fill', color);
        }
        return this._opts.backgroundColor;
    }

    VProgressBar.prototype.text = function (value) {
        if (typeof value != "undefined") {
            //console.log(this._opts.value);
            this.textField.textContent = value+"%";
             __attrs(this.textField, {'x': this._opts.width / 2, 'y': this._opts.height / 2});
        }
        return this.textField.textContent;
    }

    VProgressBar.prototype.radius = function (rad) {
        if (typeof rad != "undefined") {
            this._opts.barRadius = rad;
            __attrs(this.progress, {'rx': rad, 'ry': rad});
        }
        return this._opts.barRadius;
    }

    VProgressBar.prototype.textColor = function (color) {
        if (typeof color != "undefined") {
            this._opts.textColor = color;
            this.textField.setAttribute('color', color);
        }
        return this._opts.textColor;
    }

    VProgressBar.prototype.textSize = function (size) {
        if (typeof size != "undefined") {
            this._opts.textSize = size;
            this.textField.setAttribute('font-size', size);
        }
        return this._opts.textSize;
    }

    return VProgressBar;

}());
