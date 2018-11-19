/**
 * @author Yeon Ju An
 * CircleGauge
 */
var StarRating = (function ()
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

    function starPath (cx, cy, inr, outr, space)
    {
        var path = [];
        for (var i = 0; i < 10; i ++)
        {
            var rad = (Math.PI / 5 ) * i;
            var P = (cx + (((i % 2) == 0) ? outr : inr) * Math.sin(rad));
                P += " ,";
                P += (cy + (((i % 2) == 0) ? outr : inr) * Math.cos(rad));
            path.push(P);
        }
        return path.join(' ');
    }

    /**
     * @private
     * option(opts) 의 기본 값.
     */
    var defaults = 
    {
        bgColor: '#EEF5DB',
        num: 5,
        width: 200,
        height: 50,
        touch: true,
        lineWidth: 5,
        fillColor: '#f3af0e',
        unfillColor: 'transparent',
        fillLineColor: '#f3af0e',
        unfillLineColor: '#f3af0e',
        evenRadius: 5,
        oddRadius: 10,
        defualt: 0,
        padding: 5,
        interval: 10
    };

    /**
        
     */
    function onStarClick (t, id, num)
    {
        var _this = t;
        return function (e)
        {
            for(var i = 0; i < num; i++)
            {
                _this.stars[i].setAttribute('fill', (i <= id) ? _this.opts.fillColor : _this.opts.unfillColor);
            }
        }
    }

    /**
     * @public
     * @constructor
     * @param {Object} opts
     */
    function StarRating(opts)
    {
        if (opts === void 0) { opts = {}; }
        this.opts = __assign({}, defaults, opts);
    }

    /**
    */
    StarRating.prototype.create = function (target)
    {
        var o = this.opts;
        this.svg = createSVGElem('svg', { 'xmlns': 'http://www.w3.org/2000/svg', 'width': _getw(o), 'height': _geth(o), 'fill': 'red'});
        this.bg = createSVGElem('rect', {'width': '100%', 'height': '100%', 'fill':o.bgColor});
        this.svg.appendChild(this.bg);

        this.stars = [];
        var _this = this;
    
        for (var i = 0; i < o.num; i ++)
        {
            var star = createSVGElem('polygon', {'stroke': '#f3af0e', 'stroke-width' : 1, 'points' : starPath(_getcx(o, i), _getcy(o), o.oddRadius, o.evenRadius), 'fill': 'transparent'});
            star.addEventListener('click', onStarClick(_this, i, o.num));
            this.svg.appendChild(star);
            this.stars.push(star);
        }

        target.appendChild(this.svg);
        return this;
    }

    StarRating.prototype.redraw = function ()
    {
        var o = this.opts;
        for (var i = 0; i < o.num; i++)
        {
            __attrs(this.stars[i], {'points' : starPath(_getcx(o, i), _getcy(o), o.oddRadius, o.evenRadius)});
        }
        __attrs(this.svg, {'width': _getw(o), 'height': _geth(o)});
    }

    StarRating.prototype.evenRadius = function (r)
    {
        if (typeof r !== "undefined")
        {
            r = parseFloat(r);
            this.opts.evenRadius = r;
            this.redraw();
            return this;
        }
        return this.opts.evenRadius;
    }

    StarRating.prototype.oddRadius = function (r)
    {
        if (typeof r !== "undefined")
        {
            r = parseFloat(r);
            this.opts.oddRadius = r;
            this.redraw();
            return this;
        }
        return this.opts.oddRadius;
    }

    StarRating.prototype.interval = function (i)
    {
        if (typeof i !== "undefined")
        {
            i = parseFloat(i);
            this.opts.interval = i;
            this.redraw();
            return this;
        }
        return this.opts.interval;
    }

    StarRating.prototype.padding = function (p)
    {
        if (typeof p !== "undefined")
        {
            p = parseFloat(p);
            this.opts.padding = p;
            this.redraw();
        }
        return this.opts.padding;
    }

    StarRating.prototype.fillColor = function (c)
    {
        if (typeof c !== "undefined")
        {
            this.opts.fillColor = c;
        }
        return this.opts.fillColor;
    }

    StarRating.prototype.unfillColor = function (c)
    {
        if (typeof c !== "undefined")
        {
            this.opts.unfillColor = c;
        }
        return this.opts.unfillColor;
    }

    StarRating.prototype.fillLineColor = function (c)
    {
        if (typeof c !== "undefined")
        {
            this.opts.fillLineColor = c;
            for(var i = 0; i < this.opts.num; i++)
            {
                this.stars[i].setAttribute('stroke', c);
            }
            return this;
        }
        return this.opts.fillLineColor;
    }

    StarRating.prototype.unfillLineColor = function (c)
    {
        if (typeof c !== "undefined")
        {
            this.opts.unfillLineColor = c;
        }
        return this.opts.unfillLineColor;
    }

    StarRating.prototype.bgColor = function (c)
    {
        if (typeof c !== "undefined")
        {
            this.opts.bgColor = c;
            this.bg.setAttribute('fill', c);
        }
        return this.opts.bgColor;
    }

    function _getcx (o, i)
    {
        var b = _getb(o);
        return o.padding + b + b * i * 2 + o.interval * i;
    }

    function _getcy (o)
    {
        var b = _getb(o);
        return o.padding + b;
    }

    function _getw (o)
    {
        var b = _getb(o);
        return 2 * o.padding + o.num * b * 2 + (o.num - 1) * o.interval;
    }

    function _geth (o)
    {
        var b = _getb(o);
        return 2 * o.padding + 2 * b;
    }

    function _getb (o)
    {
        return (o.evenRadius > o.oddRadius ? o.evenRadius : o.oddRadius);
    }

    return StarRating;
}());