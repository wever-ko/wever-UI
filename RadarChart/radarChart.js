/**
 * @author Yeon Ju An
 * RadarChar
 */
var RadarChart = (function ()
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

    function radarPath (radius, num, unit, division, value)
    {
        var path = [];
        var tradius = radius - unit * division;
        for ( var i = 0; i < num; i++)
        {
            var rad = (i / num) * Math.PI * 2;
            var M = "M";
                M += (radius + (value ? value : tradius) * Math.sin(rad));
                M += " ,";
                M += (radius - (value ? value : tradius) * Math.cos(rad)); 
            path.push(M);

            rad = ((i + 1) / num) * Math.PI * 2;
            var L = "L" + (radius + (value ? value : tradius) * Math.sin(rad)) + " ," + (radius - (value ? value : tradius) * Math.cos(rad)); 
            path.push(L);
        }
        return path.join(' ');
    }

    function valuePath (radius, num, data)
    {
        var path = [];
        var arr = Object.values(data);
        for( var i = 0; i < num; i++)
        {
            var rad = (i / num) * Math.PI * 2;
            var M = (radius + arr[i] * Math.sin(rad)) + " ," + (radius - arr[i] * Math.cos(rad));
            path.push(M); 
        }
        return path.join(' ');
    }

    function divPath (radius, num, i)
    {
        var path = [];
        path.push('M' + radius + ' ,' + radius);
        var rad = (i / num) * Math.PI * 2;
        path.push('L' + (radius + radius * Math.sin(rad)) + " ," + (radius - radius * Math.cos(rad)));
        return path.join(' ');
    }

    var defaults = 
    {
        radius: 10,
        bgColor: '#ffffff',
        lineColor: '#000000',
        inlineWidth: 1,
        outlineWidth: 2,
        division: 5
    }

    function RadarChart (data, opts)
    {
        if (opts === void 0) { opts = {}; }
        this.opts = __assign({}, defaults, opts);
    }

    RadarChart.prototype.create = function (target)
    {
        var o = this.opts;
        this.svg = createSVGElem('svg', {
            'xmlns': 'http://www.w3.org/2000/svg',
            'width': o.radius * 2,
            'height': o.radius * 2
        });
        target.appendChild(this.svg);

        this.bg = createSVGElem('rect', {'fill': o.bgColor, 'width': '100%', 'height': '100%' });
        this.svg.appendChild(this.bg);
        
        this.createLines({'a' : 100, 'b': 70, 'v' : 100, 'c' : 80, 'd' : 50, 'f' : 20});
        return this;
    }

    RadarChart.prototype.createLines = function (data)
    {
        var num = Object.keys(data).length,
            o = this.opts;

        this.data = data;
        this.lines = [];

        this.g = createSVGElem('g');
        for(var i = 0; i < num; i++)
        {
            var divline = createSVGElem('path', {
                'fill': 'transparent',
                'stroke': o.lineColor,
                'stroke-width': o.inlineWidth,
                'stroke-dasharray' : o.inlineWidth,
                'd': divPath(o.radius, num, i)
            });
            this.svg.appendChild(divline);
        }

        for( var i = 0; i < o.division; i++)
        {
            this.lines.push(
                createSVGElem('path', {
                    'fill': 'transparent',
                    'stroke': o.lineColor,
                    'stroke-width': i == 0 ? o.outlineWidth : o.inlineWidth,
                    'stroke-dasharray' : i == 0 ? 0 : o.inlineWidth,
                    'd': radarPath(o.radius, num, o.radius / o.division, i)
                }));
            this.svg.appendChild(this.lines[i]);
        }

        this.vlines = [];
        this.vline = createSVGElem('polygon', {
            'fill': 'red',
            'stroke': 'red',
            'stroke-width': o.outlineWidth,
            'points': valuePath(o.radius, num, data),
            'fill-rule': 'nonzero',
            "fill-opacity": "0.4"
        });
        this.svg.appendChild(this.vline);
    }



    return RadarChart;
}());