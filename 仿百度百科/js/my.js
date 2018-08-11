function show(id,ee){
  var e=document.getElementById(id);
  var display=e.style.display;
  if (display=='block'){
    e.style.display="none";
    ee.children[0].className="icon icon-arrow-up";
  }else{
    e.style.display="block";
    ee.children[0].className="icon icon-arrow-down";
  }
}

function setOn(num){
  var e=document.getElementById("dl"+num);
  if (haveClass(e,"nav-on")){
    return;
  }
  for(var id = 1;id<=6;id++){
      e=document.getElementById("dl"+id);
      var c=e.children[0];
      if(id==num){
        e.className+=" nav-on";
        c.className="dt-on";
      }else{
        releaseOn(e,"nav-on");
        releaseOn(e.children[0],"dt-on")
      }
  }
  document.getElementsByClassName("nav-bar-wrapper")[0].style.overflow="visible";
}

function releaseOn(e,flag){
  var all=e.className.split(/\s+/);
  e.className="";
  for (var i in all){
    if (all[i]!=flag){
      e.className+=all[i]+" ";
    }
  }
}

function clearOn(num){
  for(var id = 1;id<=num;id++){
    var e=document.getElementById("dl"+id);
    releaseOn(e,"nav-on");
    releaseOn(e.children[0],"dt-on");
  }
  document.getElementsByClassName("nav-bar-wrapper")[0].style.overflow="hidden";
}

function haveClass(e,name){
  var all=e.className.split(' ');
  for (var c in all){
    if (all[c]==name){
      return true;
    }
  }
  return false;
}

function carouselPlay() {
  var imgs  = document.getElementById('list');
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  var box = document.getElementById('box');
  var buttons = document.getElementById('buttons');
  var timer;
  function animate(new_,old) {//这里的offset是当前图片的索引, 例如第一张, 第二张这样
    var offset = (old-new_)*268;
    startMove(imgs,offset,function(){});
  }
  function play() {
      timer = setInterval(function () {
        next.onclick()
      }, 3000)
  }
  play();
  function stop() {
      clearInterval(timer);
  }
  box.onmouseover = stop;//当鼠标停留在图片区域时停止滚动
  prev.onmouseover = stop;
  next.onmouseover = stop;
  buttons.onmouseover = stop;
  box.onmouseout = play;//当鼠标离开图片区域时开始滚动
  prev.onclick = function() {//左点击函数
      index--;
      if (index < 1) {//这里的目的主要在于可以使图片轮播形成完整的圆柱无缝衔接效果, 即当图片位于第一张, 点击左切换按钮时, 我们在上面html部分设置7张图片就起了作用, 现在将当前图片直接位置定位到第七张图片, 直接修改不用动画改变(参阅上面的html结构, 我们的第七章照片和第一张是一样的).
          index = 5;
      }
      buttonsShow();
      animate(index,index+1);
  }
  next.onclick = function() {//这个目的同上.
      index++;
      if (index > 5) {
          index = 1;
      }
      buttonsShow();
      animate(index,index-1);
  }


  // 以下为buttons
  var buttons = document.getElementById('buttons').getElementsByTagName('li');
  var index = 1;
  function buttonsShow() {//圆点样式显示, 给绑定一个class属性就成
      for (var i = 0; i < buttons.length; i++) {
          if (buttons[i].className == 'on') {
              buttons[i].className = '';
          }
      }
      buttons[index-1].className = 'on';
  }
  for (var i = 0; i < buttons.length; i++) {
          (function(j){//这里由于关系到闭包因此我们处理一下
              buttons[j].onmouseenter  = function () {
                  var clickIndex = parseInt(this.getAttribute('index'));
                  animate(clickIndex,index); //存放鼠标点击后的位置，用于小圆点的正常显示
                  index = clickIndex;
                  buttonsShow();
              }
          })(i);
      }
  }


  //平缓运动函数
  var target=0;
  function startMove(obj, changeData, func) {
      //我们将这个定时器绑到该元素上便于清除与管理
      clearInterval(obj.timer);
      var iCurValue = 0;
      var iSpeed = 0;
      var bStop;
      var mostRight=5*-268;
      var mostLeft=-268;
      var left_=parseInt(obj.style.left.replace("px",""));
      var mod=left_%268;

      if(mod!=0){
        obj.style.left=(parseInt(left_/268)+1)*268+"px";
      }
      obj.timer = window.setInterval(function () {
          bStop = false;//判断当前所有动作是否全部执行完毕
          var left=parseInt(obj.style.left.replace("px",""));
          if (target==0){
            target=left+changeData;
          }

          iCurValue = left;
          iSpeed = Math.ceil(changeData / 7);//缓冲运动效果 iSpeed);
          var next=iCurValue + iSpeed;
          var bool=changeData>0?next>=target:next <= target;
          if(bool) {
              bStop = true;
              if (changeData>0){
                target=target>mostLeft+1?mostRight:target;
              }else{
                target=target<mostRight?mostLeft:target;
              }
              obj.style['left'] = target + 'px';
          }else{
              obj.style['left'] = next + 'px';
          }

          if(bStop) {
              //整个动作执行完毕
              flag = 0;
              target=0;
              clearInterval(obj.timer);
              func();//当全部动作执行完毕之后, 执行回调函数.
          }
      }, 100);
  }

  //阻止浏览器默认行为触发的通用方法
  function stopDefault(e){
    //防止浏览器默认行为(W3C)
    if(e && e.preventDefault)  {
      e.preventDefault();
    }
    //IE中组织浏览器行为
    else{
       window.event.returnValue=fale;
      }
      return false;
  }

  var list;
  function slideScroll(ev){
    stopDefault(ev);
     var ev = ev||event;
     //.preventDefault();//阻止窗口默认的滚动事件
     var bool = false;
     //IE、chrome 向上：120，向下：-120
     if(ev.wheelDelta){
      bool= ev.wheelDelta > 0? true : false;
     }
     //firefox 向上：-3，向下：3
     else{
      bool= ev.detail < 0? true : false;
     }
     var old=parseInt(window.getComputedStyle(list)["top"]);
     var new_=0;
     if(bool){
       new_=old+10;
     }else{
       new_=old-10;
      }
      document.getElementsByClassName("go-down")[0].disable=false;
      document.getElementsByClassName("go-up")[0].disable=false;
      if(new_<-200){
        new_=-200;
        document.getElementsByClassName("go-down")[0].disable=true;
      }else if (new_>0){
        new_=0;
        document.getElementsByClassName("go-up")[0].disable=true;
      }

      list.style.top=new_+"px";
  };//兼容IE、chrome

  function scrollList(id){
    list = document.getElementById(id);
    //兼容firefox
    if(list.addEventListener){
     document.addEventListener("DOMMouseScroll", slideScroll, false);
    }
    document.onmousewheel =   slideScroll;
  }

function releaseScroll(){
  document.removeEventListener('DOMMouseScroll', slideScroll, false);
  document.onmousewheel=undefined;
}

  $(function() {
    $("#side-catalog").hide();
  });

  var preTop=500;
  var currTop=0;
  $(function () {
    $(window).scroll(function(){
      var winHeight=$(window).height();
      currTop=$(window).scrollTop();
      if(currTop<preTop){
        $("#side-catalog").fadeOut(200);
      }else if (currTop>600){
        $("#side-catalog").fadeIn(500);
      }else{
        $("#side-catalog").fadeOut(500);
      }

      for (var i=1;i<20;i++) {
          var elmObj = $("#title-"+i);
          //!(滚动条离顶部的距离>元素在当前视图的顶部相对偏移+元素外部高度)&&!(滚动条离顶部的距离<元素在当前视图的顶部相对偏移-window对象高度/2)
          if (!(currTop > elmObj.offset().top + elmObj.outerHeight()) && !(currTop < elmObj.offset().top - winHeight/2)) {
                $("#catalog-arrow").css("top",(i-1)*27);
                return;
          }
      }
    });

  });

  function addClass(target,className){
    var all=target.className.split(/\s+/);
    if (all.length==0){
      target.className=className;
      return;
    }
    for (var i in all){
      if (all[i]==className){
        return;
      }
    }
    target.className+=" "+className;
  }

  function removeClass(target,className){
    var all=target.className.split(/\s+/);
    target.className=all[0];
    delete all[0];
    for (var i in all){
      if (all[i]!=className){
        target.className+=" "+all[i];
      }
    }
  }

  function showAndHide(show,hide,root){
    var showE=document.getElementsByClassName(show)[0];
    var hideE=document.getElementsByClassName(hide)[0];
    var rootE=document.getElementsByClassName(root)[0];

    showE.style.display="block";
    hideE.style.display="none";
    if(show=="collected")
      addClass(rootE,"dropdown-box-hover");
    else{
      removeClass(rootE,"dropdown-box-hover");
    }
  }

  function love(e){
    if (haveClass(e,"loved")){
      removeClass(e,"loved");
      addClass(e,"unloved");
    }else{
      removeClass(e,"unloved");
      addClass(e,"loved");
    }
  }
