/**
 * @author Yeon Ju An
 * PieChart
 */
var PieChart = (function (global)
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

    function arcPath (total, start , end, radius, cx, cy, gap) {
        var p = (end - start) / (total);

        var et = (-Math.PI / 2) + (start / total) * (Math.PI * 2),
            st = (-Math.PI / 2) + (end / total) * (Math.PI * 2);
        return [
            'M',
            cx + (radius) * Math.cos(st),
            cy + (radius) * Math.sin(st),
            'A',
            radius , radius , 0,
            p > 0.5 ? 1 : 0,
            0,
            cx + (radius) * Math.cos(et),
            cy + (radius) * Math.sin(et)
        ].join(' ');
    }

    /**
     * @private
     * option(opts) 의 기본 값.
     */
    var defaults = 
    {
        lineColor: '#E63462', 
        lineWidth: 25,
        radius: 25,
        value: 0,
        textColor: '#ff0000',
        textSize: 12,
        emptyLineColor: '#E0E0E0',
        emptyLineWidth: 5,
        text: null,
        gap: 0.5
    }

/**
    data : 
    [
        {name : '', value : ''}
    ]
**/
    /**
     * @public
     * @constructor
     * @param {Object} opts
     */
    function PieChart (data, colors, opts)
    {
        if (opts === void 0) { opts = {}; }
        this.opts = __assign({}, defaults, opts);
        this.data = data;
        this.colors = colors;
        this.total = 0;
    }

    PieChart.prototype.create = function (target) {
        var o = this.opts;

        this.svg = createSVGElem('svg', { 'xmlns': 'http://www.w3.org/2000/svg', 'viewBox' : '0 0 100 100' });
       
        this.total = 0;
        var data = this.data;
        for (var i = 0, len = data.length; i < len; i++) this.total += data[i];
        
        var before = 0;
        this.paths = [];
        for (var i = 0, len = data.length; i < len; i++) {
            var c= this.colors[i];
            var path = createSVGElem('path', {
                'fill': 'transparent',
                'stroke':c,
                'stroke-width' : o.lineWidth,
                'd': arcPath(this.total, before, before + data[i], o.radius, 50, 50, 1)
                },
            this.svg);
            this.paths.push(path);
            before += data[i];
        }
        target.appendChild(this.svg);
        return this;
    };

    PieChart.prototype.resize = function (first_argument) {
        var o = this.opts;
        var total = this.total;
        var before = 0;
        var data = this.data;
        for (var i = 0, len = data.length; i < len; i ++) {
            __attrs(this.paths[i], {
                'stroke-width' :o.lineWidth, 
                'd': arcPath(total, before, before + data[i], o.radius, 50, 50, 1)
            });
            before += data[i];
        }
    };

    PieChart.prototype.radius = function (r) {
        if (typeof r !== "undefined")
        {
            this.opts.radius = r;
            this.resize();
            return this.opts.radius;
        }
        return this;
    };

    PieChart.prototype.lineWidth = function (w) {
        if (typeof w !== "undefined")
        {
            this.opts.lineWidth = w;
            this.resize();
        }
    };

    function color (i){
        var r = 100 / (i +1);
        var g = 150 / (i + 1);
        var b = 205 / (i + 1);
        return "rgb(" + r + "," + g + "," + b +")";
    }

    if (typeof module != 'undefined' && module.exports) {
        module.exports = PieChart;
    } else if (typeof define === 'function' && define.amd) {
        define([], function(){
            return PieChart;
        });
    } else {
        global.PieChart = PieChart;
    }

    return PieChart;
}(this.window || global));