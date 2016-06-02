/*
 * 转盘游戏
 *
 * author: billchen(48838096@qq.com)
 * website: http://www.xhyo.com/
 * date: 2016.05.30
 *
 * 初始化参数说明
 * option {canvasId:"dial", //canvas id
 			duration: 500, //每一圈运行时长
 			rounds: 5, //运行圈数
 			length: 6, //奖品区间数量
 			degree: 0, //初始化角度
 			width: documentWidth*0.828, //canvas 宽度
 			height: documentWidth*0.828, //canvas 高度
 			image: "dial.png", //转盘UI背景图 雪碧图中，第一个位置是指针（要求是正方形），第二个位置是背景
 			onready: function() {}, //初始化完毕事件（图片加载完毕）
 			onroundend: function() {this.currentDuration = (1+.5)*this.currentDuration;}, //每一圈执行完毕
 			onend: function() {} //整个动画执行完毕
 			}
 * 对象属性说明
 * counter: 0 //已经完成的圈数
   ctx: CanvasRenderingContext2D //canvas context
   currentDuration: 0 //当前圈的执行时长
   degree: 0 //初始化角度
   duration: 500 //初始化每圈时长
   event: Object //事件 onready,onend,onroundend
   finishDegree: 初始化角度
   finishDegree:0 //结束角度
   height: 310.5 //canvas 高度
   image: img //转盘UI背景图
   index: 0 //当前指针指向区间
   length: 6 //区间个数（礼物个数）
   rounds: 5 //转动圈数
   state: 1 //状态，0,未初始化;1,初始化完毕;2,执行中
   width:310.5 //canvas 宽度
 *
 * 对象方法
 * start(index) //开始转动,index结束的区间（选）。不传参数，将开启无限模式
   stop(index) //手动停止, index结束的区间（选）
   reset() //重置
 */

;
(function(window){
 	"use strict"
	var prefixs = ['webkit', 'moz', 'ms', 'o']; //浏览器前缀
	var requestAnimationFrame, cancelAnimationFrame;
	if (!window.requestAnimationFrame) {
		for (var i = 0; i < prefixs.length; i++) {
			if (window[prefixs[i] + 'RequestAnimationFrame']) {
				requestAnimationFrame = window[prefixs[i] + 'RequestAnimationFrame'];
				cancelAnimationFrame = window[prefixs[i] + 'CancelAnimationFrame'];
				break;
			}
		}
		if(!window.requestAnimationFrame) {
			requestAnimationFrame = function(fn) {
				window.setTimeout(fn,1000/60);
			}
			cancelAnimationFrame = window.clearTimeout;
		}
	} else {
		requestAnimationFrame = window.requestAnimationFrame;
		cancelAnimationFrame = window.cancelAnimationFrame;
	}
/*
 * @param object option
 */
function Dial(option) {
	var canvas = null,
		_this = this;

	if(!option.length || !option.image)
		return;
	if(option.canvasId) {
		canvas = document.getElementById(option.canvasId);
	}
	if(!canvas)
		throw new Exception('no canvas.');

	// console.log(option);
	this.width = canvas.width = option.width || document.documentElement.clientWidth;
	this.height = canvas.height = option.height || document.documentElement.clientWidth;
	this.duration = option.duration || 2000; //每一圈执行（初始化）
	this.rounds = option.rounds || 3; //运行圈数
	this.length = parseInt(option.length, 10); //区间个数
	this.startDegree = option.degree || 0; //起始角度
	canvas.style.cssText = 'background-image:url('+option.image+'); background-size:auto 100%; background-repeat:no-repeat; background-position:100% top;';

	// 设置高宽度和获取context
	this.ctx = canvas.getContext('2d');
	this.ctx.translate(this.width/2, this.height/2);
	this.state = 0;
	//设置event
	this.event = {};
	if(typeof option.onready == 'function')
		this.event.onready = option.onready.bind(this);
	if(typeof option.onroundend == 'function')
		this.event.onroundend = option.onroundend.bind(this);
	if(typeof option.onend == 'function')
		this.event.onend = option.onend.bind(this);
	/*if(typeof option.onstart == 'function')
		this.event.onstart = option.onstart.bind(this);
	if(typeof option.onprogress == 'function')
		this.event.onprogress = option.onprogress.bind(this);*/

	// 加载图片
	this.image = new Image();
	this.image.onload = function (e) {
		// 判断图片是否准备就绪
		if(_this.event.onready)
			_this.event.onready();
		
		_this.reset();
	};
	this.image.src = option.image;
};
Dial.prototype.reset = function() {
	this.state = 1; //运行状态 0:未初始化,1:正常状态(初始化完毕),2:运行中(转动中),3:准备停止(调用stop方法)
	if(this.animationId)
		window.cancelAnimationFrame(this.animationId);
	//重置属性
	this.degree = this.startDegree;
	this.index = 0; //当前区间
	this.finishDegree = -1; //结束角度
	this.counter = 0; //
	this.animationId = 0; //定时器id
	// 画背景和指针
	var x = -this.width/2, y = -this.height/2;
	try {
		this.ctx.clearRect(x, y, this.width, this.height);
		// 画背景
		//this.ctx.drawImage(this.image, this.image.width/2, 0, this.image.width/2, this.image.height, x, y, this.width, this.height);
		// 画指针
		this.ctx.drawImage(this.image, 0, 0, this.image.height, this.image.height, x, y, this.width, this.height);
	} catch(e) {
		alert(e.message)
	}
};
Dial.prototype.start = function(index) {
	if(this.state !== 1) {
		//非正常状态 返回 (未初始化或者运行中)
		return;
	}
	this.state = 2;

	// console.log('start');
	var _this = this,
		x = -this.width/2, //开始x坐标
		y = -this.height/2, //开始y坐标
		startTime = Date.now(); //每圈开始时间

	if(index != undefined) {
		//计算结束角度
		this.finishDegree = this.rounds + (index%this.length +.5)/this.length;
		//console.log('this.finishDegree', this.finishDegree)
	} else {
		this.finishDegree = -1;
	}

	this.counter = 0; //当前是第几圈
	this.currentDuration = this.duration; //每一圈执行时长

	function draw() {
		var time = Date.now(),
			degree = (time-startTime)/_this.currentDuration,
			isEnd = false;

		if(degree >= 1) {
			//单圈结束条件
			_this.counter++;
			startTime = time;
			degree = _this.degree += 1;

			if(_this.event.onroundend)
				_this.event.onroundend();
			//console.log('end1', degree , this.finishDegree, _this.index, index);
		} else
			degree = _this.degree + degree;

		if(_this.finishDegree> -1 && degree >= _this.finishDegree) {
			// 动画结束条件
			_this.state = 1;
			isEnd = true;
			degree = _this.degree = _this.finishDegree%1;
			//console.log('end2', degree , this.finishDegree, _this.index, index);
		} else
			degree = degree%1;

		_this.index = Math.floor(degree*_this.length);
		// 开始画指针
		_this.ctx.save();
		_this.ctx.clearRect(x, y, _this.width, _this.height);
		//_this.ctx.drawImage(_this.image, _this.image.width/2, 0, _this.image.width/2, _this.image.height, x, y, _this.width, _this.height);
		_this.ctx.rotate(degree*Math.PI*2);
		_this.ctx.drawImage(_this.image, 0, 0, _this.image.height, _this.image.height, x, y, _this.width, _this.height);
		_this.ctx.restore();

		// console.log(rounds , _this.rounds , degree , this.finishDegree);
		if(!isEnd)
			_this.animationId = window.requestAnimationFrame(draw);
		else
			_this.event.onend();
	};
	draw();
};
Dial.prototype.stop = function(index) {
	if(this.state !== 2) {
		//非运行状态 返回
		return;
	}

	this.state = 3;
	if(index != undefined) {
		//计算结束角度
		this.finishDegree = this.counter + this.rounds + (index%this.length +.5)/this.length;
	} else {
		this.finishDegree = (this.index +.5)/this.length;
	}
};

window.dial = function(option) {
	return new Dial(option);
};

})(window);