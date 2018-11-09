/**
 * @author guyeoljeong
 * BarGauge UI
 */
var BarGauge = (function ()
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
    	progressColor: "#84cd99",
    	backgroundColor: "#e5e5e5",
        text: "%",
    	value: 50         //percent value
    };

    function BarGauge(opts) {
    	if (opts === void 0) { opts = {};}
    	this._opts = __assign({}, defaults, opts);
    }

    BarGauge.prototype.create = function (target) {
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
            'width': this._opts.value,
            'height': this._opts.height,
            'fill': this._opts.progressColor
        });
    	target.appendChild(this.svg);
    	this.svg.appendChild(this.background);
        this.svg.appendChild(this.progress);
    }


    BarGauge.prototype.val = function (value) {
        if (typeof value != "undefined") {
            var w = this._opts.width / 100 * value;
            this.progress.setAttribute('width', w);
        }
        return this._opts.value;
    }

    BarGauge.prototype.width = function (width) {
        if (typeof width != "undefined") {
            this._opts.width = width;
            this.svg.setAttribute('width', width);
            this.background.setAttribute('width', width);
            this.val(this._opts.value);
        }
        return this._opts.width;
    }

    BarGauge.prototype.height = function (height) {
        if (typeof height != "undefined") {
            this._opts.height = height;
            this.svg.setAttribute('height', height);
            this.background.setAttribute('height', height);
            this.progress.setAttribute('height', height);
        }
        return this._opts.height;
    }

    BarGauge.prototype.progressColor = function (color) {
        if (typeof color != "undefined") {
            this._opts.progressColor = color;
            this.progress.setAttribute('fill', color);
        }
        return this._opts.progressColor;
    }

    BarGauge.prototype.backgroundColor = function (color) {
        if (typeof color != "undefined") {
            this._opts.backgroundColor = color;
            this.background.setAttribute('fill', color);
        }
    }


    return BarGauge;

}());
