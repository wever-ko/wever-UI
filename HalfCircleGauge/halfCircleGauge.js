/**
 * @author Yeon Ju An
 * HalfCircleGauge
 */
var HalfCircleGauge = (function ()
{
    /**
     * @private
     * @function
     * 기본 값, 옵션을 설정하기 위한 함수
     */
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
     * @param {ElementObject} elem 속성을 설정할 엘리먼트
     * @param {Object} attrs 설정할 속성
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
     * Create svg emelemt
     * @param {String} which 생성할 엘리먼트 종류(svg)
     * @param {Object} attrs 설정할 속성
     */
    function createSVGElem (which, attrs)
    {
        var el = document.createElementNS('http://www.w3.org/2000/svg', which);
        __attrs(el, attrs);
        return el;
    }

    /**
     * @private
     * @method
     * @param {Number} s
     * @param {Number} p
     * @param {Number} r
     * @param {Number} ox
     * @param {Number} oy
     */
    function arcPath (s, p, r, ox, oy)
    {
        var e =  (Math.PI) * p / 100;
        return [
            'M',
            ox,
            oy,
            'A',
            r, r, 0, 0,
            1,
            ox + r - r * Math.cos(e),
            oy - r * Math.sin(e)
        ].join(' ');
    }

    var defaults = 
    {
        bgColor: '#ffffff',
        lineColor: '#000000',
        lineWidth: 20,
        radius: 50,
        percentage: 30,
        showText: true,
        textColor: '#ff0000',
        textSize: 20,
        emptyLineColor: '#222222',
        emptyLineWidth: 20
    }

    /**
     * @public
     * @constructor
     * @param {Object} opts
     */
    function HalfCircleGauge (opts)
    {
        if (opts === void 0) { opts = {}; }
        this.opts = __assign({}, defaults, opts);
    }

    /**
     * @public
     * @method
     * @param {Element} target
     */
    HalfCircleGauge.prototype.create = function (target)
    {
        var sw = this._getw(),
            sh = this._geth(),
            o = this.opts;
        
        // Create SVG
        this.svg = createSVGElem('svg', { 'xmlns': 'http://www.w3.org/2000/svg', 'width': sw, 'height': sh});

        // Create bg
        this.bg = createSVGElem('rect', {'fill': o.bgColor, 'width': '100%', 'height': '100%'});
        this.svg.appendChild(this.bg);

        // Create empty line
        this.epath = createSVGElem('path', {
            'fill': 'transparent',
            'stroke': o.emptyLineColor,
            'stroke-width': o.emptyLineWidth,
            'd': arcPath(0, 100, o.radius, this._getoffx(), sh)
        });
        this.svg.appendChild(this.epath);


        // Create line
        this.path = createSVGElem('path', {
            'fill': 'transparent',
            'stroke': o.lineColor,
            'stroke-width': o.lineWidth,
            'd': arcPath(0, o.percentage, o.radius, this._getoffx(), sh)
        });
        this.svg.appendChild(this.path);

        // Create text
        this._text = createSVGElem('text', {
            'fill': o.textColor,
            'x': sw / 2,
            'y': sh,
            'text-anchor': 'middle',
            'font-size': o.textSize
        }); 
        this._text.textContent = "";
        this.svg.appendChild(this._text);

        target.appendChild(this.svg);

        return this;
    }

    /**
     * @public
     * @method
     * @param {Number} v
     */
    HalfCircleGauge.prototype.val = function (v)
    {
        if(typeof v !== "undefined")
        {
            this.opts.percentage = v;
            var o = this.opts;
            this.path.setAttribute('d', arcPath(0, o.percentage, o.radius, this._getoffx(), this._geth()));
            
            if(typeof this.step === "function")
            {
                this.step();
            }
        }

        return this.opts.percentage;
    }

    /**
     * @public
     * @method
     * @param {String} c
     */
    HalfCircleGauge.prototype.bgColor = function (c)
    {
        if(typeof c !== "undefined")
        {
            this.opts.bgColor = c;
            __attrs(this.bg, {'fill': c});
        }
        return this.opts.bgColor;
    }

    /**
     * @public
     * @method
     * @param {String} c
     */
    HalfCircleGauge.prototype.textColor = function (c)
    {
        if(typeof c !== "undefined")
        {
            this.opts.textColor = c;
            __attrs(this._text, {'fill': c});
        }
        return this.opts.textColor;
    }

    /**
     * @public
     * @method
     * @param {Number} c
     */
    HalfCircleGauge.prototype.textSize = function (s)
    {
        if(typeof s !== "undefined")
        {
            this.opts.textSize = s;
            __attrs(this._text, {'font-size': s});
        }
        return this.opts.textSize;
    }

    /**
     * @public
     * @method
     * @param {String} t
     */
    HalfCircleGauge.prototype.text = function (t)
    {
        if(typeof t !== "undefined")
        {
            this._text.textContent = t;
        }
        return this._text.textContent;
    }

    /**
     * @public
     * @method
     * @param {Number} r
     */
    HalfCircleGauge.prototype.radius = function (r)
    {
        if(typeof r !== "undefined")
        {
            this.opts.radius = parseFloat(r);
            this._resize();
        }
        return this.opts.radius;
    }

    /**
     * @public
     * @method
     * @param {Number} w
     */
    HalfCircleGauge.prototype.lineWidth = function (w)
    {
        if(typeof w !== "undefined")
        {
            this.opts.lineWidth = parseFloat(w);
            this._resize();
            this.path.setAttribute('stroke-width', w);
        }
        return this.opts.width;
    }

    /**
     * @public
     * @method
     * @param {String} c
     */
    HalfCircleGauge.prototype.lineColor = function (c)
    {
        if(typeof c !== "undefined")
        {
            this.opts.lineColor = c;
            __attrs(this.path, {'stroke': c});
        }
        return this.opts.lineColor;
    }

    /**
     * @public
     * @method
     * @param {Number} w
     */
    HalfCircleGauge.prototype.emptyLineWidth = function (w)
    {
        if(typeof w !== "undefined")
        {
            this.opts.emptyLineWidth = parseFloat(w);
            this._resize();
            this.epath.setAttribute('stroke-width', w);
        }
        return this.opts.emptyLineWidth;
    }

    /**
     * @public
     * @method
     * @param {String} c
     */
    HalfCircleGauge.prototype.emptyLineColor = function (c)
    {
        if(typeof c !== "undefined")
        {
            this.opts.emptyLineColor = c;
            __attrs(this.epath, {'stroke': c});
        }
        return this.opts.emptyLineColor;
    }

    /**
     * @public
     * @method
     * @return {Number}
     */
    HalfCircleGauge.prototype._getw = function ()
    {
        var o = this.opts;
        return (o.radius * 2 + (o.lineWidth > o.emptyLineWidth ? o.lineWidth : o.emptyLineWidth));
    }

    /**
     * @public
     * @method
     * @return {Number}
     */
    HalfCircleGauge.prototype._geth = function ()
    {
        var o = this.opts;
        return (o.radius + (o.lineWidth > o.emptyLineWidth ? o.lineWidth : o.emptyLineWidth) / 2);
    }

    /**
     * @public
     * @method
     * @return {Number}
     */
    HalfCircleGauge.prototype._getoffx = function ()
    {
        var o = this.opts;
        return ((o.lineWidth > o.emptyLineWidth ? o.lineWidth : o.emptyLineWidth)) / 2;    
    }

    /**
     * @public
     * @method
     */
    HalfCircleGauge.prototype._resize = function ()
    {
        var sw = this._getw(),
            sh = this._geth(),
            o = this.opts;
        __attrs(this.svg, {'width': sw, 'height': sh});
        __attrs(this._text, {'x' : sw / 2, 'y': sh});
        this.epath.setAttribute('d', arcPath(0, 100, o.radius, this._getoffx(), sh));
        this.path.setAttribute('d', arcPath(0, o.percentage, o.radius, this._getoffx(), sh));
        
      }

    return HalfCircleGauge;
}());