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
    function __attrs (elem, attrs)
    {
        for (var a in attrs)
        {
            elem.setAttribute(a, attrs[a]);
        }
    }

    /**
     * @private
     * @method
     * @param {String} which
     * @param {Object} attrs
     */
    function createSVGElem(which, attrs)
    {
        var el = document.createElementNS('http://www.w3.org/2000/svg', which);
        __attrs(el, attrs);
        return el;
    }

    var defaults = {
    	width: 100,
    	height: 10,
    	progressColor: "#000000",
    	remainColor: "#FF0000",
    	value: 50,
    	min: 0,
    	max: 100
    };

    function BarGauge(opts) {
    	if (opts === void 0) { opts = {};}
    	this._opts = __assign({}, defaults, opts);
    }

    BarGauge.prototype.create = function (target) {
    	this.svg = createSVGElem('svg',
    	{
    		'xmlns': 'http://www.w3.org/2000/svg',
            'width': this._opts.width,
            'height': this._opts.height
      });
    	this.remain = createSVGElem('rect',
    	{
    		'width': this._opts.width,
    		'height': this._opts.height,
    		'fill': this._opts.remainColor
    	});
        this.progress = createSVGElem('rect',
        {
            'width': this._opts.value,
            'height': this._opts.height,
            'fill': this._opts.progressColor
        })
    	target.appendChild(this.svg);
    	this.svg.appendChild(this.remain);
        this.svg.appendChild(this.progress);
    }
    return BarGauge;

}());
