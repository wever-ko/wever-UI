# CircleGauge
 
### Constructor 
#### CircleGauge(options)
  > CircleGauge 객체를 생성한다.  
  > ```javascript 
  > var options = {
  >   lineWidth: 10,
  >   percentage: 70,
  >   radius: 50,
  >   lineColor: '#d500f9'
  > }
  > var circularBar = new CircleGauge(options);
  > ```
  >  ###### Parameters  
  > * `options` <sub><sup>Object</sub></sup> 
  >   * `bgColor` <sub><sup>String</sub></sup> <sub>: 배경색</sub>  
  >   * `lineColor` <sub><sup>String</sub></sup> <sub>: 퍼센티지 라인색</sub>
  >   * `lineWidth` <sub><sup>Number</sub></sup> <sub>: 퍼센티지 라인 굵기 </sub>
  >   * `radius` <sub><sup>Number</sub></sup> <sub>: 반경 </sub>
  >   * `percentage` <sub><sup>Number</sub></sup> <sub>: 퍼센티지 초기값 </sub>
  >   * `textColor` <sub><sup>String</sub></sup> <sub>: 내부 텍스트 값 </sub> 
  >   * `textSize` <sub><sup>Number</sub></sup> <sub>: 내부 텍스트 크기 </sub> 
  >   * `showText` <sub><sup>Boolean</sub></sup> <sub>: 내부 텍스트 표시여부 </sub>
  >  * `emptyLineWidth` <sub><sup>Number</sub></sup> <sub>: 빈공간 라인 굵기</sub>
  >   * `emptyLineColor` <sub><sup>String</sub></sup> <sub>: 빈공간 라인 색 </sub>
  >  ###### Returns  
  > * `CurcularBar` <sub><sup>Object</sub></sup> 
***  
### Methods 
#### create(target)
  > 타겟 컨테이너 안에 CircularBar를 생성한다.  
  > ```javascript
  > var target = document.getElementById('targetID');
  > var options = {
  >   lineWidth: 10,
  >   percentage: 70,
  >   radius: 50,
  >   lineColor: '#d500f9'
  > }
  > var circleGauge = new CircleGauge(optios).create(target);
  > ```
  >  ###### Parameters  
  > * `target` <sub><sup>Node</sub></sup>   
  >  ###### Returns  
  > * `CircleGauge` <sub><sup>Object</sub></sup>
  
#### val()
  > 현재 퍼센티지 값을 반환한다.   
  > ```javascript
  > circleGauge();
  > ```   
  >  ###### Returns  
  > * `percentage` <sub><sup>Number</sub></sup> 
  
#### val(percentage)
  > 현재 퍼센티지 값을 설정한다.(애니메이션 없음)   
  > ```javascript
  > circleGauge.val(20);
  > ```   
  >  ###### Parameters  
  > * `percentage` <sub><sup>Number</sub></sup>   
  >  ###### Returns  
  > * `percentage` <sub><sup>Number</sub></sup> 
  
#### val(percentage, animation, mseconds)
  > 현재 퍼센티지 값을 설정한다.(애니메이션 있음)   
  > ```javascript
  > circleGauge.val(20, true, 100);
  > ```   
  >  ###### Parameters  
  > * `percentage` <sub><sup>Number</sub></sup>   
  > * `animation` <sub><sup>Boolean</sub></sup>   
  > * `mseconds` <sub><sup>Number</sub></sup>   
  >  ###### Returns  
  > * `percentage` <sub><sup>Number</sub></sup> 

#### text()
  > 현재 내부 텍스트 값을 반환한다.   
  > ```javascript
  > circleGauge.text();
  > ```   
  >  ###### Returns  
  > * `text` <sub><sup>String</sub></sup> 
  
#### text(str)
  > 현재 내부 텍스트 값을 설정한다.   
  > ```javascript
  > circleGauge.text(circularBar.val() + "%");
  > ```   
  >  ###### Parameters  
  > * `str` <sub><sup>String</sub></sup>     
  >  ###### Returns  
  > * `text` <sub><sup>String</sub></sup>
  
  #### textColor()
  > 현재 내부 텍스트 색을 반환한다.
  > ```javascript
  > circleGauge.textColor();
  > ```
  >  ###### Returns
  > * `color` <sub><sup>String</sub></sup>
  
  #### textColor(color)
  > 현재 내부 텍스트 색을 설정한다.
  > ```javascript
  > circleGauge.textColor('#ff0000');
  > ```
  >  ###### Parameters
  > * `color` <sub><sup>String</sub></sup>
  >  ###### Returns
  > * `color` <sub><sup>String</sub></sup>
  
  #### textSize()
  > 현재 내부 텍스트 크기를 반환한다.
  > ```javascript
  > circleGauge.textSize();
  > ```
  
  #### textSize(size)
  > 현재 내부 텍스트 크기를 설정한다.
  > ```javascript
  > circleGauge.textSize(20);
  > ```
  
  #### lineWidth()
  > 퍼센티지를 나타내는 선의 굵기를 반환한다.
  > ```javascript
  > circleGauge.lineWidth();
  > ```
  >  ###### Returns
  > * `width` <sub><sup>Number</sub></sup>
  
  #### lineWidth(width)
  > 퍼센티지를 나타내는 선의 굵기를 설정한다.
  > ```javascript
  > circleGauge.lineWidth(20);
  > ```
  >  ###### Parameters
  > * `width` <sub><sup>Number</sub></sup>
  >  ###### Returns
  > * `width` <sub><sup>Number</sub></sup>
  
  #### lineColor()
  > 퍼센티지를 나타내는 선의 색상을 반환한다.
  > ```javascript
  > circleGauge.lineColor();
  > ```
  >  ###### Returns
  > * `color` <sub><sup>String</sub></sup>
  
  #### lineColor(color)
  > 퍼센티지를 나타내는 선의 색상을 설정한다.
  > ```javascript
  > circleGauge.lineColor('#ff0000');
  > ```
  >  ###### Parameters
  > * `color` <sub><sup>String</sub></sup>
  >  ###### Returns
  > * `color` <sub><sup>String</sub></sup>
  
  #### emptyLineWidth()
  > 퍼센티지의 나머지 부분의 굵기를 반환한다.
  > ```javascript
  > circleGauge.emptyLineWidth();
  > ```
  >  ###### Returns
  > * `width` <sub><sup>Number</sub></sup>
  
  #### emptyLineWidth(width)
  > 퍼센티지의 나머지 부분의 굵기를 설정한다.
  > ```javascript
  > circleGauge.emptyLineWidth(20);
  > ```
  >  ###### Parameters
  > * `width` <sub><sup>Number</sub></sup>
  >  ###### Returns
  > * `width` <sub><sup>Number</sub></sup>
  
  #### emptyLineColor()
  > 퍼센티지의 나머지 부분의 색상을 반환한다.
  > ```javascript
  > circleGauge.emptyLineColor();
  > ```
  >  ###### Returns
  > * `color` <sub><sup>String</sub></sup>
  
  #### emptyLineColor(color)
  > 퍼센티지의 나머지 부분의 색상을 설정한다.
  > ```javascript
  > circleGauge.emptyLineColor('#ff0000');
  > ```
  >  ###### Parameters
  > * `color` <sub><sup>String</sub></sup>
  >  ###### Returns
  > * `color` <sub><sup>String</sub></sup>
  
  #### bgColor()
  > 현재 내부 텍스트 색을 반환한다.
  > ```javascript
  > circleGauge.bgColor();
  > ```
  >  ###### Returns
  > * `color` <sub><sup>String</sub></sup>
  
  #### bgColor(color)
  > 현재 내부 텍스트 색을 설정한다.
  > ```javascript
  > circleGauge.bgColor('#ff0000');
  > ```
  >  ###### Parameters
  > * `color` <sub><sup>String</sub></sup>
  >  ###### Returns
  > * `color` <sub><sup>String</sub></sup>

#### radius()
> 반경 값을 반환한다.
> ```javascript
> circleGauge.radius();
> ```
>  ###### Returns
> * `radius` <sub><sup>Number</sub></sup>

#### radius(rad)
> 반경 값을 설정, 반환한다.
> ```javascript
> circleGauge.radius(10);
> ```
>  ###### Parameters
> * `rad` <sub><sup>Number</sub></sup>
>  ###### Returns
> * `radius` <sub><sup>Number</sub></sup>
