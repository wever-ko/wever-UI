/**
 * @author Yeon Ju An
 * Circular percentage bar 
 */
var CircularBar = (function ()
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

    /**
     * @private
     * @method
     * @param {Number} start
     * @param {Number} percentage
     * @param {Number} innerRadius
     * @param {Number} radius
     */
    function arcPath(start, percentage, innerRadius, radius) {
        if(percentage >= 100) percentage = 99.9;
        var end = start + (percentage / 100) * ((Math.PI / 180 * 270) - start);
        
        return [
                'M',
                radius + innerRadius * Math.cos(start),
                radius + innerRadius * Math.sin(start),
                'A',
                innerRadius, innerRadius, 0,
                percentage > 50 ? 1 : 0,
                1,
                radius + innerRadius * Math.cos(end),
                radius + innerRadius * Math.sin(end)
            ].join(' ');
    }

    /**
     * @private
     * option(opts) 의 기본 값.
     */
    var defaults = 
    {
        bgColor: '#EEF5DB',
        lineColor: '#E63462', 
        lineWidth: 5,
        radius: 50,
        percentage: 0,
        textColor: '#000000',
        textSize: 12,
        showText: true,
        emptyLineColor : '#E0E0E0'
    }

    /**
     * @public
     * @constructor
     * @param {Object} opts
     */
    function CircularBar(opts)
    {
        if (opts === void 0) { opts = {}; }
        this._opts = __assign({}, defaults, opts);
    }

    /**
     * @public
     * @method
     * @param {ElementObject} target 그래프를 생성할 타깃
     */
    CircularBar.prototype.create = function (target)
    {
        // Size of SVG
        var svgSize = this._opts.radius * 2;
       
        // Create SVG
        this.svg = createSVGElem('svg',
        {
            'xmlns': 'http://www.w3.org/2000/svg',
            'width': svgSize,
            'height': svgSize
        });
        
        // Create Background Rect
        this._bg = createSVGElem('rect',
        {
            'fill': this._opts.bgColor,
            'width': '100%',
            'height': '100%'
        });
        this.svg.appendChild(this._bg);

        this._percentage = this._opts.percentage;
        this._start = (-Math.PI / 180 * 90);
        this._innerRadius = this._opts.radius - (this._opts.lineWidth / 2);
        this._end = this.start + (this._percentage / 100) * ((Math.PI / 180 * 270) - this._start);

        // Create Empty Path
        this._emptypath = createSVGElem('path',
        {
            'fill': 'transparent',
            'stroke': this._opts.emptyLineColor,
            'stroke-width': this._opts.lineWidth,
            'd': arcPath(this._start, 99.99, this._innerRadius, this._opts.radius)
        });
        this.svg.appendChild(this._emptypath);

        // Create Path
        this._path = createSVGElem('path',
        {
            'fill': 'transparent',
            'stroke': this._opts.lineColor,
            'stroke-width': this._opts.lineWidth,
            'd': arcPath(this._start, this._percentage, this._innerRadius, this._opts.radius)
        });
        this.svg.appendChild(this._path);

        // Create Path
        this._text = createSVGElem('text',
        {
            'fill': this._opts.textColor,
             'x': svgSize / 2,
             'y': svgSize / 2 + this._opts.textSize / 2,
             'text-anchor': 'middle',
             'font-size': this._opts.textSize
        });

        this.svg.appendChild(this._text);
        return this;
    }

    CircularBar.prototype.val = function (percentage, anim, mseconds)
    {
        percentage = parseFloat(percentage);
        var _this = this;

        if (typeof percentage !== "undefined")
        {

            if (anim)
            {
                var destPercentage = percentage,
                    unit = (destPercentage - this._percentage) / mseconds;

                var itv = setInterval(function ()
                {
                    _this._percentage += unit;
                    if(Math.abs(_this._percentage - destPercentage) <= (2 * Math.abs(unit)))
                    {
                        _this._percentage = destPercentage;
                        clearInterval(itv);
                    }
                    _this._path.setAttribute('d', arcPath(_this._start, _this._percentage, _this._innerRadius, _this._opts.radius));
                   
                    if(typeof _this.step === "function")
                    {
                        _this.step();
                    }
                }, 1);
                return;
            }
            this._percentage = percentage;
            this._path.setAttribute('d', arcPath(this._start, this._percentage, this._innerRadius, this._opts.radius));                 
        }

        return this._percentage;
    }
    
    /**
     * @public
     * @method
     */
    CircularBar.prototype.text = function (str)
    {
        if(typeof str !== "undefined")
        {
            this._text.textContent = str;
        }
        return this._text.textContent;
    }

    return CircularBar;

}());