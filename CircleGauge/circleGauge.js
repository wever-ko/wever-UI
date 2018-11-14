/**
 * @author Yeon Ju An
 * CircleGauge
 */
var CircleGauge = (function (global)
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
     * @param {ElementObject} e 속성을 설정할 엘리먼트
     * @param {Object} atrs 설정할 속성
     */
    function __attrs (e, atrs)
    {
        for (var a in atrs)
        {
            e.setAttribute(a, atrs[a]);
        }
    }

    /**
     * @private
     * @method
     * Create svg emelemt
     * @param {String} which 생성할 엘리먼트 종류(svg)
     * @param {Object} attrs 설정할 속성
     * @param {Object} to 
     */
    function createSVGElem (which, attrs, to)
    {
        var el = document.createElementNS('http://www.w3.org/2000/svg', which);
        __attrs(el, attrs);
        if (to !== void 0)
            to.appendChild(el);
        return el;
    }

    /**
     * @private
     * @function
     * @param {Number} st 시작 radial 값
     * @param {Number} p 설정할 퍼센티지 값
     * @param {Number} r 반경
     * @param {Number} x offset x 값
     * @param {Number} y offset y 값
     */
    function arcPath (st, p, r, x, y) {
        if (p >= 100) p = 99.99;
        var e = st + (p / 100) * ((Math.PI / 2 * 3) - st);
        
        return [    
                'M',
                r + x + r * Math.cos(st),
                r + y + r * Math.sin(st),
                'A',
                r, r, 0,
                p > 50 ? 1 : 0,
                1,
                r + x + r * Math.cos(e),
                r + y + r * Math.sin(e)
            ].join(' ');
    }

    /**
     * @private
     * @function
     * 재 계산된 svg 크기 반환
     * @param {Object} o svg 크기를 재 계산할 옵션
     * @returns {Number}
     */
    function svgsz (o)
    {
      return o.radius * 2 + ((o.lineWidth > o.emptyLineWidth) ? (o.lineWidth) : (o.emptyLineWidth));     
    }

    /**
     * @private
     * @function
     * 재 계산된 offset 반환
     * @param {Object} o offset 을 재 계산할 옵션
     * @returns {Number}
     */
    function offset (o)
    {
        return (((o.lineWidth > o.emptyLineWidth) ? (o.lineWidth) : (o.emptyLineWidth))) / 2;
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
        value: 0,
        textColor: '#ff0000',
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
    function CircleGauge (opts)
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
    CircleGauge.prototype.create = function (t)
    {
        var o = this._opts;

        // Size of SVG
        var sz = svgsz(o);
       
        // Create SVG
        this.svg = createSVGElem('svg',{
            'xmlns': 'http://www.w3.org/2000/svg',
            'width': sz,
            'height': sz
        });
        
        // Create Background Rect
        this._bg = createSVGElem('rect',
        {
            'fill': o.bgColor,
            'width': '100%',
            'height': '100%'
        }, this.svg);
    
        this._start = (-Math.PI / 2);
        this._end = this._start + (o.value / 100) * ((Math.PI / 2 * 3) - this._start);

        // Create Empty Path
        this._emptypath = createSVGElem('path',
        {
            'fill': 'transparent',
            'stroke': o.emptyLineColor,
            'stroke-width': o.emptyLineWidth,
            'd': arcPath(this._start, 99.99, o.radius, o.emptyLineWidth / 2, o.emptyLineWidth / 2)
        }, this.svg);
       // this.svg.appendChild(this._emptypath);

        // Create Path
        this._path = createSVGElem('path',
        {
            'fill': 'transparent',
            'stroke': o.lineColor,
            'stroke-width': o.lineWidth,
            'd': arcPath(this._start, o.value, o.radius, o.lineWidth / 2, o.lineWidth / 2)
        }, this.svg);
     
        // Create Path
        this._text = createSVGElem('text',
        {
            'fill': o.textColor,
             'x': sz / 2,
             'y': sz / 2 + o.textSize / 2,
             'text-anchor': 'middle',
             'font-size': o.textSize
        }, this.svg);

        t.appendChild(this.svg);
        return this;
    }

    /**
     * @public
     * @method
     * 퍼센티지 값 설정 / 반환
     * @param {Number} value 설정할 퍼센티지 값
     * @param {Boolean} animation 애니메이션 여부
     * @param {Number} mseconds 에니메이션을 실행시킬 시간
     * @param {Function} cb 애니메이션 끝 콜백 함수
     * @return {Number}
     */
    CircleGauge.prototype.val = function (p, anim, msec, cb)
    {
        if (typeof p !== "undefined")
        {
            var opts = this._opts,
                _this = this;
            p = parseFloat(p);
            var ofs = offset(opts);

            if (anim)
            {
                var dv = p,
                    unit = (dv - opts.value) / msec;

                var itv = setInterval(function ()
                {
                    _this._opts.value += unit;
                    if (Math.abs(_this._opts.value - dv) <= (2 * Math.abs(unit)))
                    {
                        _this._opts.value = dv;
                        _this._path.setAttribute('d', arcPath(_this._start, _this._opts.value, _this._opts.radius, ofs, ofs));
                        clearInterval(itv);
                        if( typeof cb === "function")
                        {
                            cb();
                        }
                    }
                    _this._path.setAttribute('d', arcPath(_this._start, _this._opts.value, _this._opts.radius, ofs, ofs));
                   
                    if (typeof _this.step === "function")
                    {
                        _this.step();
                    }
                }, 1);
                return;
            }
            this._opts.value = p;
            
            if (typeof _this.step === "function")
            {
                _this.step();
            }
            this._path.setAttribute('d', arcPath(this._start, this._opts.value, this._opts.radius, ofs, ofs));                 
        }

        return this._opts.value;
    }

    /**
     * @public
     * @method
     * 텍스트 내용을 설정한다.
     * @param {String} str 설정할 text 값
     * @return {String}
     */
    CircleGauge.prototype.text = function (s)
    {
        if(s !== void 0)
        {
            this._text.textContent = s;
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
    CircleGauge.prototype.textColor = function (c)
    {
        if(typeof c !== "undefined")
        {
            this._opts.textColor = c;
            this._text.setAttribute('fill', c);
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
    CircleGauge.prototype.textSize = function (s)
    {
        if(typeof s !== "undefined")
        {
            this._opts.textSize = s;
            var o = this._opts,
                ofs = offset(o),
                sz = svgsz(o);
            this._text.setAttribute('font-size', s);
            __attrs(this._text, {'x': sz / 2,'y': sz / 2 + o.textSize / 2});           
        }
        return this._opts.textSize;
    }

    /**
     * @public
     * @method
     * 퍼센티지를 나타내는 라인의 굵기를 설정한다.
     * @param {Number} w 설정할 크기값
     * @return {Number | String}
     */
    CircleGauge.prototype.lineWidth = function (w)
    {
        if(typeof w !== "undefined")
        {
            this._opts.lineWidth = parseFloat(w);
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
    CircleGauge.prototype.lineColor = function (c)
    {
        if(typeof c !== "undefined")
        {
            this._opts.lineColor = c;
            this._path.setAttribute('stroke', c);           
        }
        return this._opts.lineColor;
    } 

    /**
     * @public
     * @method
     * 퍼센티지 이외 부분의 굵기를 설정한다.
     * @param {Number} width 설정할 굵기 값
     * @return {Number} 현재 width 반환
     */
    CircleGauge.prototype.emptyLineWidth = function (w)
    {
        if(typeof w !== "undefined")
        {
            this._opts.emptyLineWidth = parseFloat(w);
            this.resize();           
        }
        return this._opts.emptyLineWidth;
    }

    /**
     * @public
     * @method
     * 퍼센티지 이외 부분의 색상을 설정한다.
     * @param {String} color 설정할 색상 값
     * @return {String} 현재 이외 부분 color 반환
     */
    CircleGauge.prototype.emptyLineColor = function (c)
    {   
        if(typeof c !== "undefined")
        {
            this._opts.emptyLineColor = c;
            this._emptypath.setAttribute('stroke', c);
        }
        return this._opts.emptyLineColor;
    }       

    /**
     * @public
     * @method
     * 배경 색을 설정한다.
     * @param {String} color 설정할 색상 값
     * @return {String} 현재 color 반환
     */
    CircleGauge.prototype.bgColor = function (c)
    {
        if(typeof c !== "undefined")
        {
            this._opts.bgColor = c;
            __attrs(this._bg, {fill : c});
        }
        return this._opts.bgColor;
    }

    /**
     * @public
     * @method
     * 반경을 설정한다.
     * @param {Number} radius 설정할 반경
     * @return {Number} 현재 radius 반환
     */
    CircleGauge.prototype.radius = function (r)
    {
        if(typeof r !== "undefined")
        {
            this._opts.radius = parseFloat(r);
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
        var o = this._opts,
            ofs = offset(o),
            sz = svgsz(o);

        __attrs(this.svg, {'width': sz, 'height': sz});
        __attrs(this._path, {'stroke-width': o.lineWidth,'d': arcPath(this._start, o.value, o.radius, ofs, ofs)});
        __attrs(this._emptypath, {'stroke-width': o.emptyLineWidth,'d': arcPath(this._start, 99.99, o.radius, ofs, ofs)});
        __attrs(this._text, {'x': sz / 2,'y': (sz + o.textSize) / 2});
    }

    if (typeof module != 'undefined' && module.exports) {
        module.exports = CircleGauge;
    } else if (typeof define === 'function' && define.amd) {
        define([], function(){
            return CircleGauge;
        });
    } else {
        global.CircleGauge = CircleGauge;
    }

    return CircleGauge;
}(this.window || global));