/**
 * @author Yeon Ju An
 * CircleGauge
 */
var CircleGauge = (function ()
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
     * @function
     * @param {Number} start 시작 radial 값
     * @param {Number} percentage 설정할 퍼센티지 값
     * @param {Number} radius 반경
     * @param {Number} x offset x 값
     * @param {Number} y offset y 값
     */
    function arcPath (start, percentage, radius, x, y) {
        if (percentage >= 100) percentage = 99.9;
        var end = start + (percentage / 100) * ((Math.PI / 180 * 270) - start);
        
        return [    
                'M',
                radius + x + radius * Math.cos(start),
                radius + y + radius * Math.sin(start),
                'A',
                radius, radius, 0,
                percentage > 50 ? 1 : 0,
                1,
                radius + x + radius * Math.cos(end),
                radius + y + radius * Math.sin(end)
            ].join(' ');
    }

    /**
     * @private
     * @function
     * 재 계산된 svg 크기 반환
     * @param {Object} opts svg 크기를 재 계산할 옵션
     * @returns {Number}
     */
    function svgsz (opts)
    {
      return opts.radius * 2 + ((opts.lineWidth > opts.emptyLineWidth) ? (opts.lineWidth) : (opts.emptyLineWidth));     
    }

    /**
     * @private
     * @function
     * 재 계산된 offset 반환
     * @param {Object} opts offset 을 재 계산할 옵션
     * @returns {Number}
     */
    function offset (opts)
    {
        return (((opts.lineWidth > opts.emptyLineWidth) ? (opts.lineWidth) : (opts.emptyLineWidth))) / 2;
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
        emptyLineColor: '#E0E0E0',
        emptyLineWidth: 5
    }

    /**
     * @public
     * @constructor
     * @param {Object} opts
     */
    function CircleGauge(opts)
    {
        if (opts === void 0) { opts = {}; }
        this._opts = __assign({}, defaults, opts);
    }

    /**
     * @public
     * @method
     * 그래프 생성
     * @param {ElementObject} target 그래프를 생성할 타겟
     */
    CircleGauge.prototype.create = function (target)
    {
        var opts = this._opts;

        // Size of SVG
        var svgSize = svgsz(opts);
       
        // Create SVG
        this.svg = createSVGElem('svg',{
            'xmlns': 'http://www.w3.org/2000/svg',
            'width': svgSize,
            'height': svgSize
        });
        
        // Create Background Rect
        this._bg = createSVGElem('rect',
        {
            'fill': opts.bgColor,
            'width': '100%',
            'height': '100%'
        });
        this.svg.appendChild(this._bg);

        this._start = (-Math.PI / 180 * 90);
        this._end = this._start + (opts.percentage / 100) * ((Math.PI / 180 * 270) - this._start);

        // Create Empty Path
        this._emptypath = createSVGElem('path',
        {
            'fill': 'transparent',
            'stroke': opts.emptyLineColor,
            'stroke-width': opts.emptyLineWidth,
            'd': arcPath(this._start, 99.99, opts.radius, opts.emptyLineWidth / 2, opts.emptyLineWidth / 2)
        });
        this.svg.appendChild(this._emptypath);

        // Create Path
        this._path = createSVGElem('path',
        {
            'fill': 'transparent',
            'stroke': opts.lineColor,
            'stroke-width': opts.lineWidth,
            'd': arcPath(this._start, opts.percentage, opts.radius, opts.lineWidth / 2, opts.lineWidth / 2)
        });
        this.svg.appendChild(this._path);

        // Create Path
        this._text = createSVGElem('text',
        {
            'fill': opts.textColor,
             'x': svgSize / 2,
             'y': svgSize / 2 + opts.textSize / 2,
             'text-anchor': 'middle',
             'font-size': opts.textSize
        });

        this.svg.appendChild(this._text);

        target.appendChild(this.svg);
        return this;
    }

    /**
     * @public
     * @method
     * 퍼센티지 값 설정 / 반환
     * @param {Number} percentage 설정할 퍼센티지 값
     * @param {Boolean} animation 애니메이션 여부
     * @param {Number} mseconds 에니메이션을 실행시킬 시간
     * @return {Number}
     */
    CircleGauge.prototype.val = function (percentage, anim, mseconds)
    {
        if (typeof percentage !== "undefined")
        {
            var opts = this._opts;
            var _this = this;
            percentage = parseFloat(percentage);
            var ofs = offset(opts);

            if (anim)
            {
                var destPercentage = percentage,
                    unit = (destPercentage - opts.percentage) / mseconds;

                var itv = setInterval(function ()
                {
                    _this._opts.percentage += unit;
                    if (Math.abs(_this._percentage - destPercentage) <= (2 * Math.abs(unit)))
                    {
                        _this._opts.percentage = destPercentage;
                        clearInterval(itv);
                    }
                    _this._path.setAttribute('d', arcPath(_this._start, _this._opts.percentage, _this._opts.radius, _this._opts.radius));
                   
                    if (typeof _this.step === "function")
                    {
                        _this.step();
                    }
                }, 1);
                return;
            }
            this._opts.percentage = percentage;
            
            if (typeof _this.step === "function")
            {
                _this.step();
            }
            this._path.setAttribute('d', arcPath(this._start, this._opts.percentage, this._opts.radius, ofs, ofs));                 
        }

        return this._opts.percentage;
    }

    /**
     * @public
     * @method
     * 텍스트 내용을 설정한다.
     * @param {String} str 설정할 text 값
     * @return {String}
     */
    CircleGauge.prototype.text = function (str)
    {
        if(typeof str !== "undefined")
        {
            this._text.textContent = str;
        }
        return this._text.textContent;
    }

    /**
     * @public
     * @method
     * 텍스트 색상 설정한다.
     * @param {String} color 설정할 색상값
     * @return {String}
     */
    CircleGauge.prototype.textColor = function (color)
    {
        if(typeof color !== undefined)
        {
            this._opts.textColor = color;
            this._text.setAttribute('fill', color);
        }
        return this._opts.textColor;
    }

    /**
     * @public
     * @method
     * 텍스트 크기를 설정한다.
     * @param {Number | String} size 설정할 크기값
     * @return {Number | String}
     */
    CircleGauge.prototype.textSize = function (size)
    {
        if(typeof size !== "undefined")
        {
            this._opts.textSize = size;
            var opts = this._opts,
                ofs = offset(opts),
                svgSize = svgsz(opts);
            this._text.setAttribute('font-size', size);
            __attrs(this._text, {'x': svgSize / 2,'y': svgSize / 2 + opts.textSize / 2});           
        }
        return this._opts.textSize;
    }

    /**
     * @public
     * @method
     * 퍼센티지를 나타내는 라인의 굵기를 설정한다.
     * @param {Number} width 설정할 크기값
     * @return {Number | String}
     */
    CircleGauge.prototype.lineWidth = function (width)
    {
        if(typeof width !== "undefined")
        {
            this._opts.lineWidth = parseFloat(width);
            this.resize();
        }
        return this._opts.lineWidth;
    }
    
    /**
     * @public
     * @method
     * 퍼센티지를 나타내는 라인의 색상을 설정한다.
     * @param {String} color 설정할 색상값
     * @return {Number | String}
     */
    CircleGauge.prototype.lineColor = function (color)
    {
        if(typeof color !== "undefined")
        {
            this._opts.lineColor = color;
            this._path.setAttribute('stroke', color);           
        }
        return this._opts.lineColor;
    } 

    /**
     * @public
     * @method
     * 퍼센티지 이외 부분의 굵기를 설정한다.
     * @param {Number} width 설정할 굵기 값
     * @return {Number}
     */
    CircleGauge.prototype.emptyLineWidth = function (width)
    {
        if(typeof width !== "undefined")
        {
            this._opts.emptyLineWidth = parseFloat(width);
            this.resize();           
        }
        return this._opts.emptyLineWidth;
    }

    /**
     * @public
     * @method
     * 퍼센티지 이외 부분의 색상을 설정한다.
     * @param {String} color 설정할 색상 값
     * @return {String}
     */
    CircleGauge.prototype.emptyLineColor = function (color)
    {   
        if(typeof color !== "undefined")
        {
            this._opts.emptyLineColor = color;
            this._emptypath.setAttribute('stroke', color);
        }
        return this._opts.emptyLineColor;
    }       

    /**
     * @public
     * @method
     * 배경 색을 설정한다.
     * @param {String} color 설정할 색상 값
     * @return {String}
     */
    CircleGauge.prototype.bgColor = function (color)
    {
        if(typeof color !== "undefined")
        {
            this._opts.bgColor = color;
            __attrs(this._bg, {fill : color});
        }
        return this._opts.bgColor;
    }

    /**
     * @public
     * @method
     * 반경을 설정한다.
     * @param {Number} radius 설정할 반경
     * @return {Number}
     */
    CircleGauge.prototype.radius = function (radius)
    {
        if(typeof radius !== "undefined")
        {
            this._opts.radius = parseFloat(radius);
            this.resize();            
        }
        return this._opts.radius;
    }

    /**
     * @private
     * @method
     * 크기 재조정
     */
    CircleGauge.prototype.resize = function ()
    {
        var opts = this._opts,
            ofs = offset(opts),
            svgSize = svgsz(opts);

        __attrs(this.svg, {'width': svgSize, 'height': svgSize});
        __attrs(this._path, {'stroke-width': opts.lineWidth,'d': arcPath(this._start, opts.percentage, opts.radius, ofs, ofs)});
        __attrs(this._emptypath, {'stroke-width': opts.emptyLineWidth,'d': arcPath(this._start, 99.99, opts.radius, ofs, ofs)});
        __attrs(this._text, {'x': svgSize / 2,'y': svgSize / 2 + opts.textSize / 2});
    }

    return CircleGauge;
}());