(function (window) {
				//定义一个构造函数,将属性添加到构造函数上
				window.Slide =function (options) {
					
					//设置默认参数
					this._defaultParameter = {
						
						//容器
						dysBox:'.dys_box',
						
						//是否自动滚动
						autoScroll:false,
						
						//上一个
						prevBtn:'.l_btn',
						
						//下一个
						nextBtn:'.r_btn',
						
					};
					
					//将用户传进来的参数和默认的参数合并
					this.opt = Object.assign({}, this._defaultParameter, options);
					
					//获取容器
					this.dysBox = document.querySelector(this.opt.dysBox);
					
					//获取容器列表
					this.dysBoxList = this.dysBox.children[0];
					
					//获取列表项
					this.dysBoxListItem = this.dysBoxList.children;
					
					//获取左边按钮
					this.prevBtn = this.dysBox.querySelector(this.opt.prevBtn);
					
					//获取右边按钮
					this.nextBtn = this.dysBox.querySelector(this.opt.nextBtn);
					
					//将列表项再增加一倍
					this.dysBoxList.innerHTML = this.dysBoxList.innerHTML+this.dysBoxList.innerHTML;
					
					//获取列表项的宽度(包括padding+margin)
					this.dysBoxListItemOuterwidth = parseInt(this.getStyle(this.dysBoxListItem[0],'width')) + parseInt(this.getStyle(this.dysBoxListItem[0],'paddingRight')) + parseInt(this.getStyle(this.dysBoxListItem[0],'marginRight'));
					
					//获取列表项数
					this.dysBoxListItemLength = this.dysBoxListItem.length;
					
					//设置列表宽度
					this.dysBoxList.style.width = this.dysBoxListItemLength*this.dysBoxListItemOuterwidth+'px';
					
					//是否自动滚动
					this.autoScroll = this.opt.autoScroll;
					
					//运动计数
					this.num = 0;
					
					this.init();
					
				};
				
				//将方法添加到构造函数原型
				Slide.prototype = {
					
					//指向构造函数
					constructor:Slide,
					
					//初始化
					init: function () {
						
						this.bigImgScroll();
					},
					
					//获取dom元素计算属性的值
					getStyle: function (obj, attr) {
						return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj, false)[attr];
					},
					//移动框架
					movingFrame: function (obj,json,endFn) {
						
						var _this = this;
						//先关闭定时器,然后再开定时器,避免几个定时器同时开着,这样让运动乱套了
						clearInterval(obj.timer);
						
						//开启定时器
						obj.timer = setInterval(function(){
							//设置一个开关
							var bBtn = true;
							
							//循环属性
							for(var attr in json){
								
								//存一个属性的变量
								var iCur = 0;
								
								//处理属性是透明度的情况
								if(attr == 'opacity'){
									if(Math.round(parseFloat(_this.getStyle(obj,attr))*100)==0){
										iCur = Math.round(parseFloat(_this.getStyle(obj,attr))*100);
									}
									else{
										iCur = Math.round(parseFloat(_this.getStyle(obj,attr))*100) || 100;
									}	
								}
								else{
									//处理正常属性
									iCur = parseInt(_this.getStyle(obj,attr)) || 0;
								};
								
								//根据速度判断方向
								var iSpeed = (json[attr] - iCur)/8;
								
								//根据方向设置速度
								iSpeed = iSpeed >0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
								
								if(iCur!=json[attr]){
									bBtn = false;
								}
								
								//处理透明度
								if(attr == 'opacity'){
									obj.style.filter = 'alpha(opacity=' +(iCur + iSpeed)+ ')';
									obj.style.opacity = (iCur + iSpeed)/100;
								}
								else{
									obj.style[attr] = iCur + iSpeed + 'px';
								}
							}
							
							if(bBtn){
								clearInterval(obj.timer);
								if(endFn){
									endFn.call(obj);
								}
							}
						},30);
					},
					//大图滚动
					bigImgScroll: function () {
						
						var _this = this;
						
						//鼠标hover容器的时候自动滚动停止
						this.dysBox.onmouseenter = function () {
							clearInterval(_this.timer);
						};
						this.dysBox.onmouseleave = function () {
							_this.timer = setInterval(function () {
								
								_this.autoScrollFn();
								
							}, 1500);
						};
						//点击左边按钮
						this.prevBtn.onclick = function () {
							
							//刚加载完页面
							if (_this.num==0) {
								//瞬间让left变成一半，由于速度太快肉眼看不到
								_this.dysBoxList.style.left = -_this.dysBoxListItemLength/2*280+'px';
								//让num也变成长度一半
								_this.num=-_this.dysBoxListItemLength/2;
								
							}
							
							_this.num++;
							
							//开始运动
							_this.movingFrame(_this.dysBoxList, {'left':_this.num*280}, function () {
								
							});
							
						};
						
						//点击右边按钮
						this.nextBtn.onclick = function () {
							
							_this.autoScrollFn();
							
						};
						
						//自动滚动
						if (this.autoScroll) {
							
							this.timer = setInterval(function () {
								
								_this.autoScrollFn();
								
							}, 1500);
							
						}
					},
					//自动滚动方法
					autoScrollFn: function () {
						
						var _this = this;
						
						if (_this.num==-_this.dysBoxListItemLength/2) {
							
							//瞬间让left变成0，由于速度太快肉眼看不到
							_this.dysBoxList.style.left = 0;
							
							_this.num=0;
							
						}
						_this.num--;
						//开始运动
						_this.movingFrame(_this.dysBoxList, {'left':_this.num*280}, function () {
							
						});
					}
					
				
				};
				
			})(window);