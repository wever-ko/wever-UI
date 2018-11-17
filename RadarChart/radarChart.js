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
        /*for ( var i = 0; i < num; i++)
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
        }*/
        for (var i = 0; i < num; i++)
        {
            var rad = (i / num) * Math.PI * 2;
            var M = (radius + (value ? value : tradius) * Math.sin(rad));
                M += " ,";
                M += (radius - (value ? value : tradius) * Math.cos(rad));
            path.push(M);
        }
        return path.join(' ');
    }

    function valuePath (radius, num, data, min, max)
    {
        var path = [],
            arr = Object.values(data);
        for( var i = 0; i < num; i++)
        {
            var rad = (i / num) * Math.PI * 2;
            var M = (radius + (radius * (arr[i] - min) / (max - min)) * Math.sin(rad));
                M += " ,";
                M += (radius - (radius * (arr[i] - min) / (max - min)) * Math.cos(rad));
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
        division: 5,
        max: 10,
        min: 0,
        axisWidth: 1,
        axisColor: '#5ca284',
        inlineWidth: 1,
        inlineColor: '#5ca284',
        outlineWidth: 2,
        outlineColor: '#5ca284',
        datalineColor: '#ff0000',
        datafillColor: '#FF0000'
    }

    function RadarChart (data, opts)
    {
        if (opts === void 0) { opts = {}; }
        this.opts = __assign({}, defaults, opts);
        this.data = data;
    }

    RadarChart.prototype.create = function (target)
    {
        var o = this.opts;
        var data = this.data;
        var num = Object.keys(data).length;
        console.log(num);
        // Create svg
        this.svg = createSVGElem('svg', {
            'xmlns': 'http://www.w3.org/2000/svg',
            'width': o.radius * 2,
            'height': o.radius * 2
        });
        target.appendChild(this.svg);

        // Create Bg
        this.bg = createSVGElem('rect', {'fill': o.bgColor, 'width': '100%', 'height': '100%' });
        this.svg.appendChild(this.bg);
        
        // Create Base Line
        this.axis = [];
        for (var i = 0; i < num; i++)
        {
            var _divline = createSVGElem('path', {
                'fill': 'transparent',
                'stroke': o.axisColor,
                'stroke-width': o.axisWidth,
                'stroke-dasharray' : o.axisWidth,
                'd': divPath(o.radius, num, i)
            });
            this.svg.appendChild(_divline);
            this.axis.push(_divline);
        }

        this.baseLines = [];
        for (var i = 0; i < o.division; i++)
        {
            var _baseline = createSVGElem('polygon', {
                    'fill': 'transparent',
                    'stroke': o.lineColor,
                    'stroke-width': i == 0 ? o.outlineWidth : o.inlineWidth,
                    'stroke-dasharray' : i == 0 ? 0 : o.inlineWidth,
                    'points': radarPath(o.radius, num, o.radius / o.division, i)
                });

            this.svg.appendChild(_baseline);
            this.baseLines.push(_baseline);
        }

        // Create Value lines
        this.vLine = createSVGElem('polygon', {
            'fill': 'red',
            'stroke': 'red',
            'stroke-width': o.outlineWidth,
            'points': valuePath(o.radius, num, data, o.min, o.max),
            'fill-rule': 'nonzero',
            "fill-opacity": "0.4"
        });
        this.svg.appendChild(this.vLine);

        return this;
    }

    RadarChart.prototype.redrawLines = function (data)
    {
        var divNum = Object.keys(data).length,
            o = this.opts;

        // 중앙 -> 바깥 선
        for (var i = 0; i < divNum; i++)
        {
            __attrs(this.axis[i], {'d': divPath(o.radius, divNum, i)});
        }

        // 나눔선
        for (var i = 0; i < o.division; i++)
        {
            __attrs(this.baseLines[i], {'points': radarPath(o.radius, divNum, o.radius / o.division, i)});
        }

        // 값 선
        __attrs(this.vLine, {'points': valuePath(o.radius, divNum, data, o.min, o.max)});
    }

    RadarChart.prototype.redrawTexts = function (data)
    {

    }

    RadarChart.prototype.radius = function (r)
    {
        if (typeof r !== "undefined")
        {
            r = parseFloat(r);
            this.opts.radius = r;
            this.resize();
        }
        return this.opts.radius;
    }

    RadarChart.prototype.resize = function ()
    {
        var o = this.opts;
        __attrs(this.svg, {'width': o.radius * 2, 'height': o.radius * 2});
        this.redrawLines(this.data);
    }

    RadarChart.prototype.inLineWidth = function (w)
    {
        if (typeof w !== "undefined")
        {
            this.opts.inlineWidth = w;
            for (var i = 1, len = this.baseLines.length; i < len; i++)
            {
                __attrs(this.baseLines[i], {'stroke-width': w, 'stroke-dasharray' : w});
            }
        }
        return  this.opts.inlineWidth;
    }

    RadarChart.prototype.outLineWidth = function (w)
    {
        if (typeof w !== "undefined")
        {
            this.opts.outlineWidth = w;
            __attrs(this.baseLines[0], {'stroke-width': w});
        }
        return this.opts.outlineWidth;
    }

    RadarChart.prototype.inLineColor = function (c)
    {
        if (typeof c !== "undefined")
        {
            this.opts.inlineColor = c;
            for (var i = 1, len = this.baseLines.length; i < len; i++)
            {
                __attrs(this.baseLines[i], {'stroke': c});
            }
        }
        return this.opts.inlineColor;
    }

    RadarChart.prototype.outLineColor = function (c)
    {
        if (typeof c !== "undefined")
        {
            this.opts.outlineColor = c;
            __attrs(this.baseLines[0], {'stroke': c});
        }
        return this.opts.outlineColor;
    }

    RadarChart.prototype.dataLineColor = function (c)
    {
        if (typeof c !== "undefined")
        {
            this.opts.datalineColor = c;
            __attrs(this.vLine, {'stroke': c});
        }
        return this.opts.datalineColor;
    }

    RadarChart.prototype.dataFillColor = function (c)
    {
        if (typeof c !== "undefined")
        {
            this.opts.datafillColor = c;
            __attrs(this.vLine, {'fill': c});
        }
        return this.opts.datafillColor;
    }

    RadarChart.prototype.axisWidth = function (w)
    {
        if (typeof w !== "undefined")
        {
            this.opts.axisWidth = w;
            for (var i = 0, len = this.axis.length; i < len; i++)
            {
                __attrs(this.axis[i], {'stroke-width': w, 'stroke-dasharray' : w});
            }            
        }
        return this.opts.axisWidth;
    }

    RadarChart.prototype.bgColor = function (c)
    {
        if (typeof c !== "undefined")
        {
            this.opts.bgColor = c;
            __attrs(this.bg, {'fill': c});
        }
        return this.opts.bgColor;
    }

    return RadarChart;
}());