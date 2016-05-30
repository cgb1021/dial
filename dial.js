/*
 * 转盘游戏
 *
 * author: billchen(48838096@qq.com)
 * website: http://www.xhyo.com/
 * date: 2016.05.30
 *
 * require util.js
 */

(function(window){
// "use strict"
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
	this.duration = option.duration || 2000; //每一圈执行时间
	this.durationStep = option.durationStep || 0; //每一圈时间增加和减少量
	this.round = option.round || 3; //运行圈数
	this.length = parseInt(option.length, 10); //区间个数
	this.degree = option.degree || 0; //起始角度
	// 设置高宽度和获取context
	this.ctx = canvas.getContext('2d');
	this.ctx.translate(this.width/2, this.height/2);

	// 加载图片
	this.image = new Image();
	this.image.onload = function imgOnload(e) {
		// 判断图片是否准备就绪
		if(typeof option.onready == 'function')
			option.onready();
		
		_this.reset();
		option = null;
	};
	this.image.src = option.image;
}
Dial.prototype.reset = function() {
	this.index = 0; //当前指针所指的区间index，相对于length
	this.state = 1; //运行状态.0:未初始化,1:初始化完毕,2:运行中
	// 画背景和指针
	var x = -this.width/2, y = -this.height/2;
	try {
		// 画背景
		this.ctx.drawImage(this.image, 0, 0, this.image.width/2, this.image.height, x, y, this.width, this.height);
		// 画指针
		this.ctx.drawImage(this.image, this.image.width/2, 0, this.image.width/2, this.image.height, x, y, this.width, this.height);
	} catch(e) {
		alert(e.message)
	}
	
}
Dial.prototype.start = function(index) {
	if(this.state == 2) {
		return;
	}
	// console.log('start');
	var _this = this,
		count = 1,
		x = -this.width/2,
		y = -this.height/2,
		startTime = Date.now(),
		roundDuration = this.duration,
		degree = 0;

	this.state = 2;

	function draw() {
		var time = Date.now();

		// console.log(count, _this.round, index, _this.index)
		if((count == _this.round && index === _this.index) || _this.state == 1) {
			// 动画结束条件
			_this.state = 1;
			_this.degree = degree;
			// console.log(_this.degree);
			return;
		}

		degree = (time-startTime)/roundDuration;
		if(degree >= 1) {
			startTime = time;
			roundDuration = (1+count*_this.durationStep)*_this.duration;
			count++;
			degree = degree-1;
			// console.log(count,roundDuration)
		}
		degree = (_this.degree+degree)%1;
		_this.index = Math.floor(degree*_this.length);
		// 开始画指针
		_this.ctx.save();
		_this.ctx.clearRect(x, y, _this.width, _this.height);
		_this.ctx.drawImage(_this.image, 0, 0, _this.image.width/2, _this.image.height, x, y, _this.width, _this.height);
		_this.ctx.rotate(degree*Math.PI*2);
		_this.ctx.drawImage(_this.image, _this.image.width/2, 0, _this.image.width/2, _this.image.height, x, y, _this.width, _this.height);
		_this.ctx.restore();
		window.requestAnimationFrame(arguments.callee);
	}
	draw();
};
Dial.prototype.stop = function() {
	this.state = 1;
}
window.dial = function(option) {
	return new Dial(option);
}
})(window);