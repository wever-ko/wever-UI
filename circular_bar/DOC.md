# Circular Percentage Bar
 
### Constructor 
#### CirclularBar(options)
  > CircularBar 객체를 생성한다.  
  > ```javascript 
  > var options = {
  >   lineWidth: 10,
  >   percentage: 70,
  >   radius: 50,
  >   lineColor: '#d500f9'
  > }
  > var circularBar = new CircularBar(options);
  > ```
  >  ###### Parameters  
  > * `options` <sub><sup>Object</sub></sup> 
  >   * `bgColor` <sub><sup>String</sub></sup> <sub>: 배경색</sub>  
  >   * `lineColor` <sub><sup>String</sub></sup> <sub>: 라인색</sub>  
  >   * `lineWidth` <sub><sup>Number</sub></sup> <sub>: 라인 굵기 </sub>
  >   * `radius` <sub><sup>Number</sub></sup> <sub>: 반경 </sub>
  >   * `percentage` <sub><sup>Number</sub></sup> <sub>: 초기값 </sub>  
  >   * `textColor` <sub><sup>String</sub></sup> <sub>: 내부 텍스트 값 </sub> 
  >   * `textSize` <sub><sup>Number</sub></sup> <sub>: 내부 텍스트 크기 </sub> 
  >   * `showText` <sub><sup>Boolean</sub></sup> <sub>: 내부 텍스트 표시여부 </sub> 
  >   * `emptyLineColor` <sub><sup>String</sub></sup> <sub>: 라인 색 </sub>
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
  > var circularBar = new CurcularBar(optios).create(target);
  > ```
  >  ###### Parameters  
  > * `target` <sub><sup>Node</sub></sup>   
  >  ###### Returns  
  > * `CurcularBar` <sub><sup>Object</sub></sup> 
#### val()
  > 현재 퍼센티지 값을 반환한다.   
  > ```javascript
  > circularBar.val();
  > ```   
  >  ###### Returns  
  > * `percentage` <sub><sup>Number</sub></sup> 
  
#### val(percentage)
  > 현재 퍼센티지 값을 설정한다.(애니메이션 없음)   
  > ```javascript
  > circularBar.val(20);
  > ```   
  >  ###### Parameters  
  > * `percentage` <sub><sup>Number</sub></sup>   
  >  ###### Returns  
  > * `percentage` <sub><sup>Number</sub></sup> 
  
#### val(percentage, animation, mseconds)
  > 현재 퍼센티지 값을 설정한다.(애니메이션 있음)   
  > ```javascript
  > circularBar.val(20, true, 100);
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
  > circularBar.text();
  > ```   
  >  ###### Returns  
  > * `text` <sub><sup>String</sub></sup> 
  
#### text(str)
  > 현재 내부 텍스트 값을 설정한다.   
  > ```javascript
  > circularBar.text(circularBar.val() + "%");
  > ```   
  >  ###### Parameters  
  > * `str` <sub><sup>String</sub></sup>     
  >  ###### Returns  
  > * `text` <sub><sup>String</sub></sup> 