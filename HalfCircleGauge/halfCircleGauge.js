/**
 * @author Yeon Ju An
 * HalfCircleGauge
 */
var HalfCircleGauge = (function (global)
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
     * @param {Number} p 퍼센티지 값
     * @param {Number} r 반지름값 (radius)
     * @param {Number} ox 기준값 X (offset X)
     * @param {Number} oy 기준값 Y (offset Y)
     */
    function arcPath (p, r, ox, oy)
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
        value: 30,
        showText: true,
        textColor: '#ff0000',
        textSize: 20,
        emptyLineColor: '#222222',
        emptyLineWidth: 20
    }

    /**
     * @public
     * @constructor
     * @param {Object} opts 옵션
     */
    function HalfCircleGauge (opts)
    {
        if (opts === void 0) { opts = {}; }
        this.opts = __assign({}, defaults, opts);
    }

    /**
     * @public
     * @method
     * @param {Element} target svg를 생성할 타겟
     */
    HalfCircleGauge.prototype.create = function (target)
    {
        var sw = this._getw(),
            sh = this._geth(),
            o = this.opts;
        
        // Create SVG
        this.svg = createSVGElem('svg', {'xmlns': 'http://www.w3.org/2000/svg', 'width': sw, 'height': sh});

        // Create bg
        this.bg = createSVGElem('rect', {'fill': o.bgColor, 'width': '100%', 'height': '100%'});
        this.svg.appendChild(this.bg);

        // Create empty line
        this.epath = createSVGElem('path', {
            'fill': 'transparent',
            'stroke': o.emptyLineColor,
            'stroke-width': o.emptyLineWidth,
            'd': arcPath(100, o.radius, this._getoffx(), sh)
        });
        this.svg.appendChild(this.epath);

        // Create line
        this.path = createSVGElem('path', {
            'fill': 'transparent',
            'stroke': o.lineColor,
            'stroke-width': o.lineWidth,
            'd': arcPath(o.value, o.radius, this._getoffx(), sh)
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
     * @param {Number} v 설정할 퍼센티지 값
     * @param {Boolean} anim 애니메이션 여부
     * @param {Number} msec 애니메이션 수행시간
     * @param {Function} cb 애니메이션 끝에 발생하는 콜백
     * @return {Number} 현재 설정된 퍼센티지 값 반환
     * 현재 퍼센티지값 설정
     */
    HalfCircleGauge.prototype.val = function (v, anim, msec, cb)
    {
        if(typeof v !== "undefined")
        {
            var opts = this.opts,
                _this = this;
            v = parseFloat(v);
            var dv = v;
            if (anim)
            {
                var unit = (dv - opts.value) / msec;

                var itv = setInterval( function () 
                {
                    _this.opts.value += unit;
                    if( Math.abs(_this.opts.value - dv) <= (2 * Math.abs(unit)))
                    {
                        _this.opts.value = dv;
                        clearInterval(itv);
                        if( typeof cb === "function")
                        {
                            cb();
                        }
                    }
                    _this.path.setAttribute('d',  arcPath(_this.opts.value, _this.opts.radius, _this._getoffx(), _this._geth()));
                    
                    if(typeof _this.step === "function")
                    {
                        _this.step();
                    }

                }, 1);
                return this.opts.value;
            }
            this.opts.value = dv;
            this.path.setAttribute('d', arcPath(this.opts.value, this.opts.radius, this._getoffx(), this._geth()));
           
            if(typeof this.step === "function")
            {
                this.step();
            }
        }

        return this.opts.value;
    }

    /**
     * @public
     * @method
     * @param {String} c 설정할 배경 색상
     * @return {String} 현재 설정된 배경 색상
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
     * @param {String} c 설정할 내부 텍스트 색상
     * @return {String} 현재 설정된 내부 텍스트 색상
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
     * @param {Number} s 설정할 내부 텍스트 크기
     * @param {Number} 현재 설정된 내부 텍스트 크기
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
     * @param {String} t 설정할 내부 텍스트값
     * @param {String} 현재 설정된 내부 텍스트값
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
     * @param {Number} r 설정할 반지름 크기
     * @return {Number} 현재 설정된 반지름 크기
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
     * @param {Number} w 설정할 퍼센티지 굵기
     * @return {Number} 현재 설정된 퍼센티지 굵기
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
     * @param {String} c 설정할 퍼센티지 색상
     * @return {String} 현재 설정된 퍼센티지 색상
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
     * @param {Number} w 설정할 빈공간 굵기
     * @return {Number} 현재 설정된 빈공간 굵기
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
     * @param {String} c 설정할 빈공간 색상 값
     * @return {String} 현재 설정된 색상 값
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
     * @return {Number} 옵션에 맞는 width
     */
    HalfCircleGauge.prototype._getw = function ()
    {
        var o = this.opts;
        return (o.radius * 2 + (o.lineWidth > o.emptyLineWidth ? o.lineWidth : o.emptyLineWidth));
    }

    /**
     * @public
     * @method
     * @return {Number} 옵션에 맞는 height
     */
    HalfCircleGauge.prototype._geth = function ()
    {
        var o = this.opts;
        return (o.radius + (o.lineWidth > o.emptyLineWidth ? o.lineWidth : o.emptyLineWidth) / 2);
    }

    /**
     * @public
     * @method
     * @return {Number} 옵션에 맞는 offset X
     */
    HalfCircleGauge.prototype._getoffx = function ()
    {
        var o = this.opts;
        return ((o.lineWidth > o.emptyLineWidth ? o.lineWidth : o.emptyLineWidth)) / 2;    
    }

    /**
     * @public
     * @method
     * 옵션에 맞게 크기 재 조정
     */
    HalfCircleGauge.prototype._resize = function ()
    {
        var sw = this._getw(),
            sh = this._geth(),
            o = this.opts;
        __attrs(this.svg, {'width': sw, 'height': sh});
        __attrs(this._text, {'x' : sw / 2, 'y': sh});
        this.epath.setAttribute('d', arcPath(100, o.radius, this._getoffx(), sh));
        this.path.setAttribute('d', arcPath(o.value, o.radius, this._getoffx(), sh));
    }

    if (typeof module != 'undefined' && module.exports) {
        module.exports = HalfCircleGauge;
    } else if (typeof define === 'function' && define.amd) {
        define([], function(){
            return HalfCircleGauge;
        });
    } else {
        global.HalfCircleGauge = HalfCircleGauge;
    }
    
    return HalfCircleGauge;
}(this.window || global));