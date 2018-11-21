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
     * @param {Number} p 설정할 퍼센티지 값
     * @param {Number} r 반경
     * @param {Number} x offset x 값
     * @param {Number} y offset y 값
     */
    function arcPath (p, r, x, y) {
        if (p >= 100) p = 99.99;
        var st = (-Math.PI / 2),
            e = st + (p / 100) * ((Math.PI / 2 * 3) - st);
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
     * 재 계산된 offset 반환
     * @param {Object} o offset 을 재 계산할 옵션
     * @returns {Number}
     */
    function offset (o)
    {
        return 50 - o.radius;
    }

    /**
     * @private
     * option(opts) 의 기본 값.
     */
    var defaults = 
    {
        lineColor: '#E63462', 
        lineWidth: 5,
        radius: 25,
        value: 0,
        textColor: '#ff0000',
        textSize: 12,
        showText: true,
        emptyLineColor: '#E0E0E0',
        emptyLineWidth: 5,
        text: null
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
     * @param {ElementObject} t 그래프를 생성할 타겟
     */
    CircleGauge.prototype.create = function (t)
    {
        var o = this._opts,
            ofs = offset(o);   
        
        this.svg = createSVGElem('svg', {'xmlns': 'http://www.w3.org/2000/svg', 'viewBox' : '0 0 100 100' });
        this.text = o.text;
        
        this._emptypath = createSVGElem('path', {
            'fill': 'transparent', 'stroke': o.emptyLineColor,
            'stroke-width': o.emptyLineWidth, 'd': arcPath(99.99, o.radius, ofs, ofs)
        }, this.svg);
       
        this._path = createSVGElem('path', { 
            'fill': 'transparent', 'stroke': o.lineColor,
            'stroke-width': o.lineWidth, 'd': arcPath(o.value, o.radius, ofs, ofs)
        }, this.svg);
  
        this._text = createSVGElem('text', {
            'fill': o.textColor, 
            'x': 50, 'y': 50 + o.textSize / 2,
            'text-anchor': 'middle', 'font-size': o.textSize
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
                        _this._path.setAttribute('d', arcPath(_this._opts.value, _this._opts.radius, ofs, ofs));
                        clearInterval(itv);
                        if( typeof cb === "function")
                        {
                            cb();
                        }
                    }
                    _this._path.setAttribute('d', arcPath(_this._opts.value, _this._opts.radius, ofs, ofs));
                   
                    if (typeof _this.text === "function")
                    {
                        _this.setText(_this.text(_this._opts.value));
                    }
                }, 1);
                return;
            }
            this._opts.value = p;
            
            if (typeof _this.text === "function")
            {
                 _this.setText(_this.text(_this._opts.value));
            }
            this._path.setAttribute('d', arcPath(this._opts.value, this._opts.radius, ofs, ofs));                 
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
    CircleGauge.prototype.setText = function (s)
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
                ofs = offset(o);
            this._text.setAttribute('font-size', s);
            __attrs(this._text, {'x':50, 'y':50 + o.textSize / 2});    
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
            ofs = offset(o);

        __attrs(this._path, {'stroke-width': o.lineWidth,'d': arcPath(o.value, o.radius, ofs, ofs)});
        __attrs(this._emptypath, {'stroke-width': o.emptyLineWidth,'d': arcPath(99.99, o.radius, ofs, ofs)});
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