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
     * @value
     * option( opts ) 의 기본 값.
     */
    var defaults = 
    {
        bgColor: '#EEF5DB',
        lineColor: '#E63462',
        lineWidth: 5,
        radius: 50,
        percentage: 0,
        textColor: '#000000',
        showText: true
    }

    /**
     * @public
     * @constructor
     * @param {Object} opts
     */
    function CirclularBar(opts)
    {
        if (opts === void 0) { opts = {}; }
        this.opts = __assign({}, defaults, opts);
    }

    /**
     * @public
     * @method
     * @param {ElementObject} target 그래프를 생성할 타깃
     */
    CirclularBar.prototype.create = function (target)
    {
        // Size of SVG
        var _svgSize = this.opts.radius * 2;
       
        // Create SVG
        this.svg = createSVGElem('svg',
        {
            'xmlns': 'http://www.w3.org/2000/svg',
            'width': _svgSize,
            'height': _svgSize
        });
        
        // Create Background Rect
        this.bg = createSVGElem('rect',
        {
            'fill': this.opts.bgColor,
            'width': '100%',
            'height': '100%'
        });
        this.svg.appendChild(this.bg);

        this.percentage = this.opts.percentage;
        this.start = (-Math.PI / 180 * 90);
        this.innerRadius = this.opts.radius - (this.opts.lineWidth / 2);
        this.end = this.start + (this.percentage / 100) * ((Math.PI / 180 * 270) - this.start);

        // Create Path
        this.path = createSVGElem('path',
        {
            'fill': 'transparent',
            'stroke': this.opts.lineColor,
            'stroke-width': this.opts.lineWidth,
            'd': arcPath(this.start, this.percentage, this.innerRadius, this.opts.radius)
        });
        this.svg.appendChild(this.path);

        this.text = createSVGElem('text',
        {
            'fill': this.opts.textColor,
             'x': _svgSize / 2,
             'y': _svgSize / 2 + 5,
             'text-anchor': 'middle',
             'font-size': 10
        });
        this.text.textContent = '' + this.percentage + '%';
        this.svg.appendChild(this.text);
        return this;
    }

    /**
     * @public
     * @method
     * 퍼센티지 값을 리턴합니다.
     * @return {Number} 퍼센티지 값.
     */
    CirclularBar.prototype.getPercentage = function ()
    {
        return this.opts.percentage;
    }

    /**
     * @public
     * @method
     * 퍼센티지 값을 세팅합니다.
     * @param {Number} percentage 세팅할 퍼센티지 값
     * @param {Boolean} animation 애니메이션 여부
     * @param {Number} mseconds 애니메이션이 수행 될 시간
     */
    CirclularBar.prototype.setPercentage = function (percentage, animation, mseconds)
    {
        var _this = this;
        if(animation)
        {
                var destPercentage = percentage;
                var inc = (destPercentage - this.percentage) / mseconds;

                var itv = setInterval(function()
                {
                    _this.percentage += inc;
                    _this.path.setAttribute('d', arcPath(_this.start, _this.percentage, _this.innerRadius, _this.opts.radius));
                    if(_this.percentage >= destPercentage)
                    {
                        _this.percentage = destPercentage;
                        clearInterval(itv);
                    }
                }, 1);

            return;
        }
        this.percentage = percentage;
        this.path.setAttribute('d', arcPath(this.start, this.percentage, this.innerRadius, this.opts.radius));           
    }

    return CirclularBar;

}());