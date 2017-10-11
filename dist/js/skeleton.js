/**
 * skeleton.js
 * build at: Wed Oct 11 2017 16:50:46 GMT+0800 (中国标准时间)
 */
if (typeof jQuery === 'undefined') {throw new Error('jQuery is required')};
;(function($,window){

	var Skeleton=function(options){
		this.config={

		}
		this.options=$.extend(this.config,options||{})
	}

	Function.prototype.inherits = function(parent){
        var F = function () {};
        F.prototype = parent.prototype;
        var f = new F();

        for (var prop in this.prototype) f[prop] = this.prototype[prop];
        this.prototype = f;
        this.prototype.super = parent.prototype;
    };

	Skeleton.prototype={

	} 

	Skeleton.isMobile = false;
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		Skeleton.isMobile = true
	}

	window.Skeleton=Skeleton;
             
})(jQuery,window);
/* 
*total 所有数据数量
*current 当前页数
*middlePage 渲染的中间页数
*onChange 页码改变的回调
*/
; (function (Skeleton, $) {
	//实例化组件数	
	var index = 0;

	var Page = function (options) {

		var config = {
			elem: '',
			total: 360,
			current: 5,
			middlePage: 5,
			pageSize: 10,
			next: "下一页",
			prev: "上一页",
			first: "首页",
			last: "尾页",
			skip: true
		};

		index++;

		this.config = $.extend(config, options || {});

		this.elem = $(this.config.elem);

		this.renderPage();

		this.bindEvent();
	}

	var CLASS_ITEM = "page-item", CLASS_DOT = "page-dot", CLASS_ITEM_CURR = "page-item page-curr", CLASS_PREV = "page-prev",
		CLASS_NEXT = "page-next", CLASS_DISABLE = "page-disabled", CLASS_EDGE = "page-edge", CLASS_SKIP = "page-skip", CLASS_INPUT = "page-skip-input", CLASS_BUTTON = "page-skip-btn";

	Page.inherits(Skeleton);

	Page.prototype = {
		/* 计算页码，返回页码元素     */
		calculatePages: function () {
			var config = this.config,
				current = config.current,
				middlePage = config.middlePage,
				pageSize = config.pageSize,
				total = config.total,
				pages = Math.ceil(total / pageSize),
				viewPageStart = 0,
				viewPageEnd = 0,
				result = [],
				firstClass = CLASS_ITEM + ' ',
				lastClass = CLASS_ITEM + ' ';

			/*检测边界值  */
			if (current < middlePage) {
				viewPageStart = 1;
				viewPageEnd = middlePage;
			} else if (current >= pages - Math.ceil(middlePage / 2)) {
				viewPageStart = pages - middlePage;
				viewPageEnd = pages;
			} else {
				/* middlePage在中间 */
				viewPageStart = current - Math.floor(middlePage / 2);
				viewPageEnd = current + Math.floor(middlePage / 2);
				!(middlePage & 1) && viewPageEnd--;
			}
			/*limit viewPageEnd*/
			if (viewPageEnd > pages) {
				viewPageEnd = pages;
			} 
			/*show dot near start*/
			if (viewPageStart > 2) {
				firstClass += config.first ? CLASS_EDGE : '';
				result.push('<span class="' + firstClass + '"  key="1" >' + (config.first ? config.first : 1) + '</span>');
				result.push('<span class="' + CLASS_DOT + '">...</span>');
			}
			/*view of middle*/
			this.range(viewPageStart, viewPageEnd + 1).map(function (value, key) {
				result.push('<span   class="' + (value == current ? CLASS_ITEM_CURR : CLASS_ITEM) + (key == 0 ? ' ' + CLASS_EDGE : '') + '" key="' + value + '">' + value + '</span>');
			});

			/*show dot near end*/
			if (viewPageEnd != pages) {
				lastClass += config.last ? CLASS_EDGE : '';
				result.push('<span  class="' + CLASS_DOT + '">...</span>');
				result.push('<span class="' + lastClass + '"  key="' + pages + '">' + (config.last ? config.last : pages) + '</span>');
			}

			return result;
		},
		range: function (start, stop) {
			var start = start || 0, i, length = stop - start, range = Array(length);
			for (i = 0; i < length; i++ , start++) {
				range[i] = start;
			}
			return range;
		},
		bindEvent: function () {
			var that = this, config = this.config;

			that.elem.on("click", "." + CLASS_ITEM, function () {
				var target = this.getAttribute("key") * 1;
				that.jumpPage(target);
			})

			if (config.next) {
				that.elem.on("click", "." + CLASS_NEXT, function () {
					that.nextPage();
				})
			}

			if (config.prev) {
				that.elem.on("click", "." + CLASS_PREV, function () {
					that.prevPage();
				})
			}

			if(config.skip){
				that.elem.on("click","."+CLASS_BUTTON,function(){
					var target=that.elem.find(".page-skip-input").val()*1; 
					if(!target || target>that.getPages()){
						return;   
					}     
					that.jumpPage(target);           
				})
			} 
		},
		prevPage: function () {
			if (this.config.current <= 1) {
				return
			}
			this.config.current--;
			this.renderPage();
			this.handleChange();
		},
		nextPage: function () {
			var pages = this.getPages();
			if (this.config.current >= pages) {
				return
			}
			this.config.current++;
			this.renderPage();
			this.handleChange();
		},
		getPages: function () {
			return Math.ceil(this.config.total / this.config.pageSize);
		},
		jumpPage: function (target) {
			if (target == this.config.current) {
				return;
			}
			this.config.current = target;
			this.renderPage();
			this.handleChange();
		},
		renderPage: function () {
			var template = [],
				config = this.config,
				nextClass = CLASS_NEXT + ' ',
				prevClass = CLASS_PREV + ' ',
				current = config.current,
				pages = this.getPages();

			if (config.prev) {
				prevClass += current == 1 ? CLASS_DISABLE : '';
				template.push('<span  class="' + prevClass + '">' + config.prev + '</span>');
			}

			template = template.concat(this.calculatePages());

			if (config.next) {
				nextClass += current == pages ? CLASS_DISABLE : '';
				template.push('<span  class="' + nextClass + '">' + config.next + '</span>');
			}

			if (config.skip) {
				template.push(this.renderSkip());
			}

			this.elem.html(template.join(""));
		},
		renderSkip: function () {
			var temp = '',
				config = this.config;
			temp += '<span class="' + CLASS_SKIP + '">';
			temp += '<input type="number" min="1" class="' + CLASS_INPUT + '"/>';
			temp += '<button type="button" class="' + CLASS_BUTTON + '">跳转</button>';
			temp += '</span>';
			return [temp]
		},
		handleChange: function () {
			if (typeof this.config.onChange === "function") {
				this.config.onChange.call(this, {
					current: this.config.current,
					total: this.config.total,
					size: this.config.pageSize
				});
			}
		}
	}

	Skeleton.page = function (options) {
		return new Page(options)
	}

})(Skeleton, jQuery);






















; (function (Skeleton, $) {

	var index = 0;//实例化组件数	
	var ZIndex=9999;    

	var Modal = function (options) {
		var config = {
			content: '',
			shade: .1,
			skin: 'modal',
			width: "400px",
			height: "",
			title: "提示", 
			coexist:false,            
			ZIndex:false,
			button: ["取消", "确定"],
			onButton1: function (modal) { 
				this.close();
			},
			onButton2: function (modal) {
				this.close(); 
			},
			onLoad:function(modal){                                   
				console.log(this,modal) 
			}

		};
		this.config = $.extend(config, options || {});
		this.index = ++index;   

		
		if(!this.config.coexist){   
			this.closeAll();    
		}

		this.init();
	}

	Modal.inherits(Skeleton);

	Modal.prototype = {
		init: function () {
			var config = this.config; 

			this.create();
			this.setZIndex();                                                    
			this.position();
			this.bindEvent();
    
			if(typeof config.onLoad === "function"){
				config.onLoad.call(this,this.modal)                         
			}

			if (config.shade) {
				this.shade.show();
			}
			this.modal.show();

		},
		create: function () {
			var config = this.config, i, button = config.button, temp = "";

			if (config.shade) {
				temp += '<div class="sk-modal-shade modal-shade-' + this.index + '" key="' + this.index + '"></div>';
			}

			temp += '<div class="sk-modal sk-modal-' + this.index + ' ' + config.skin;
			if (config.width) {
				temp += '" style="width:' + config.width;
			}
			if (config.height) {
				temp += ';height:' + config.height;
			}
			temp += '" key="' + this.index + '">';

			temp += '<div class="modal-head">' + config.title + '<a href="javascript:;" class="modal-close"></a></div>';
			temp += '<div class="modal-body">' + config.content + '</div>';

			if (button && button.length > 0) {
				temp += '<div class="modal-footer">';
				for (i = 0; i < button.length; i++) {
					var key = i + 1;
					temp += '<button type="button" class="btn modal-btn modal-btn-"' + key + '" key="' + key + '">' + button[i] + '</button>';
				}
				temp += '</div>';
			}
			temp += '</div>';

			$('body').append($(temp));

			this.modal = $("body").find(".sk-modal-" + this.index);
			if (config.shade) {
				this.shade = $("body").find(".modal-shade-" + this.index);
			}

		},
		position: function () {
			var winWdith = $(window).width(),
				winHeight = $(window).height(),
				width = this.modal.outerWidth(),
				height = this.modal.outerHeight();

			var left = (winWdith - width) / 2, top = (winHeight - height) / 2;

			this.modal.css({ "left": left, "top": top });
		},
		setZIndex:function(){
			var config=this.config; 
			if(config.shade){
				this.shade.css({"z-index":ZIndex+index})
			}        
			this.modal.css({"z-index":++ZIndex+index})
		},
		close: function () {
			var that = this, config = this.config;
			that.modal.addClass("fadeOutZoom");
			if (config.shade) {
				that.shade.addClass("transparent");
			}
			setTimeout(function () {
				that.modal.remove()
				if (config.shade) {
					that.shade.remove();
				}
			}, 300);
			index--; 
			ZIndex--;   
		},
		closeAll:function(){ 
			$(".sk-modal-shade,.sk-modal").remove();
			index = 0;     
			ZIndex=9999;           
		},
		bindEvent: function () {
			var that = this, config = this.config, button = this.config.button;
			that.modal.on("click", ".modal-head .modal-close", function () {
				that.close();
			})

			if (button && button.length > 0) {    
				that.modal.find(".modal-btn").click(function () {
					var key=this.getAttribute("key");          
					for (var i = 1; i <= button.length; i++) {
						if (key==i && typeof config["onButton" + i] === "function") {
							config["onButton" + i ].call(that, that.modal)
						}
					}
				})
			}                                                

			$(window).resize(function(){
				that.position();   
			})
 
		}
	}

	Skeleton.modal = function (options) {
		return new Modal(options)
	}

})(Skeleton, jQuery);



; (function (Skeleton, $) {

	var index = 0;//实例化组件数	

	var Tab = function (options) {
		var config = {
			elem:"",
			content:"",
			onChange:function(){   

			}
		};
		this.config = $.extend(config, options || {});
		this.index = ++index;
		this.elem = $(this.config.elem).eq(0);
		if(this.elem.length<1){
			return 
		}

		this.init();
	}

	Tab.inherits(Skeleton);

	var CLASS_SLIDER="tab-slider",CLASS_ITEM="tab-item",CLASS_ACTIVE="active",CONTENT_ITEM="content-item";
 
	Tab.prototype = {
		init:function(){
			var config=this.config,
			sliderWidth=this.getActiveItem().innerWidth();

			if(config.content){ 
				this.content=$(config.content); 
			} 

			this.elem.append('<li class="'+CLASS_SLIDER+'" style="width:'+sliderWidth+'px;"></li>');   
			this.bindEvent();
			this.getActiveItem().trigger("click"); 
		},
		bindEvent:function(){ 
			var that=this,slider=this.elem.find("."+CLASS_SLIDER);       
			that.elem.find("."+CLASS_ITEM).click(function(){ 
				var itemIndex=$(this).index();
				slider.width($(this).innerWidth()).offset($(this).offset())  
				$(this).addClass(CLASS_ACTIVE).siblings("."+CLASS_ITEM).removeClass(CLASS_ACTIVE);      

				if(that.content.length>0){       
					that.content.find("."+CONTENT_ITEM).eq(itemIndex).addClass(CLASS_ACTIVE).siblings("."+CONTENT_ITEM).removeClass(CLASS_ACTIVE);
				}

				if(typeof that.config.onChange ==="function"){
					that.config.onChange.call(this)
				}
			})                     
		},
		getActiveItem:function(){
			var that=this,
			items=that.elem.find("."+CLASS_ITEM),
			activeItem=items.eq(0);

			items.each(function(k,v){
				if($(this).hasClass(CLASS_ACTIVE)){
					activeItem=$(this);
				}
			});
			                                                                                                                     
			return activeItem; 
		} 
		 
	}

	Skeleton.tab = function (options) {
		return new Tab(options)
	}

})(Skeleton, jQuery);



; (function (Skeleton, $) {

	var index = 0;//实例化组件数	

	var Ripple = function (options) {
		var config = {
			elem: ""
		};
		this.config = $.extend(config, options || {});
		this.index = ++index;
		this.elem = $(this.config.elem);
		if (this.elem.length < 1) {
			return
		}

		this.init();
	};

	var CLASS_RIPPLE = "sk-ripple",CLASS_WRAP="ripple-wrap";

	Ripple.inherits(Skeleton);


	Ripple.prototype = {
		init: function () {
			this.bindEvent();                
		},
		bindEvent: function () {
			var that = this; 
			that.elem.click(function (e) {  
				var e = e || window.event;  
				that.render(e,$(this));
			}) 
		},
		render:function(e,self){ 
			var that=this,      
				coord=that.getCoordinate(e),
				diameter=Math.max(self.innerWidth(),self.innerHeight()),
				ripple =$('<span class="' + CLASS_RIPPLE+'"></span>'); 
			
				ripple.css({ 
					width:diameter+'px', 
					height:diameter+'px'
				}); 
				
				var x = coord.x - self.offset().left - ripple.width() / 2,
				y = coord.y - self.offset().top - ripple.height() / 2;
 
				ripple.css({
					top: y + 'px',
					left: x + 'px' 
				});

				self.addClass(CLASS_WRAP).append(ripple);  


				ripple.addClass("ripple-animate");    


				ripple.one('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function() {
                    $(this).remove(); 
                });                                        
		},                                                                                                         
		getCoordinate: function (e) {                    
			var docElem=scrollTop=document.documentElement,docBody=document.body,
				scrollTop=docElem.scrollTop||docBody.scrollTop,
				scrollLeft=docElem.scrollLeft||docBody.scrollLeft,
				clientTop=docElem.clientTop||docBody.clientTop,
				clientLeft=docElem.clientLeft||docBody.clientLeft;     

			var pageX=e.pageX?e.pageX:e.clientX +scrollLeft-clientLeft,
				pageY=e.pageY?e.pageY:e.clientY +scrollTop-clientTop;

			return {            
				x:pageX,   
				y:pageY 
			}
		} 
	}

	Skeleton.ripple = function (options) {
		return new Ripple(options)
	}

})(Skeleton, jQuery);



; (function (Skeleton, $) {

	var index = 0;//实例化组件数	

	var Timepicker = function (options) {
		var config = {
			elem: "",
			width: "200",
			height: "200",
			stroke: "#88b04b",
			strokeBg: "rgba(230, 230, 230,0.3)",
			onChange: function () {

			}
		};
		this.config = $.extend(config, options || {});
		this.index = ++index;
		this.elem = $(this.config.elem).eq(0);
		this.am = true;
		if (this.elem.length < 1) {
			return
		}

		this.init();
	}

	Timepicker.inherits(Skeleton);

	var CLASS_CIRCLE_BG = 'sk-circle-bg', CLASS_CIRCLE_INNER = 'sk-circle-inner', CLASS_DRAG_WRAP = 'sk-drag-wrap',
		CLASS_DRAG_POINT = 'sk-drag-point', CLASS_TIME = 'sk-time-text';

	var isMobile = false;
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		isMobile = true
	}

	Timepicker.prototype = {
		init: function () {
			var config = this.config,
				stroke = config.stroke,
				strokeBg = config.strokeBg,
				cx = config.width / 2,
				cy = config.height / 2,
				r = (Math.min(config.width, config.height) - 10) / 2,
				dasharray = 2 * Math.PI * r;

			var temp = '<svg id="timepickerSvg' + this.index + '" width="' + config.width + '" height="' + config.height + '">';
			temp += '<circle class="' + CLASS_CIRCLE_BG + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke="' + strokeBg + '" stroke-width="4" fill="transparent" />';
			temp += '<circle class="' + CLASS_CIRCLE_INNER + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke="' + stroke + '" stroke-width="4" fill="transparent" stroke-dasharray="' + dasharray + '" stroke-dashoffset="0"></circle>'
			temp += '</svg>';
			temp += '<div class="' + CLASS_TIME + '"></div>';
			temp += '<div  class="' + CLASS_DRAG_WRAP + '"><span  class="' + CLASS_DRAG_POINT + '"></span></div>';

			this.elem.css({ 'width': config.width + 'px', 'height': config.height + 'px' }).append(temp);
			this.dragWrap = this.elem.find('.' + CLASS_DRAG_WRAP);

			var	p =7/12;   

			//initialise                 
			this.setTransition(1);
			this.draw(p.toFixed(2));
			this.time=this.translateTime(p);         
			this.elem.find('.'+CLASS_TIME).html(this.time);  

			this.bindEvent();
			
		},
		draw: function (percent) {  
			var innerCircle = this.elem.find('.' + CLASS_CIRCLE_INNER);
			if (percent < 0 || isNaN(percent)) { percent = 0 }
			if (percent > 1) { percent = 1 }

			var girth = innerCircle.attr('r') * Math.PI * 2;
			var offset = girth * (1 - percent);

			innerCircle.css('stroke-dasharray', girth);
			innerCircle.css('stroke-dashoffset', offset);
			//标识点        
			this.dragWrap.css('transform', 'rotate(' + percent * 360 + 'deg)');
		},
		bindEvent: function () {
			var that = this,
				dragWrap = this.dragWrap,
				dragTarget = dragWrap.find('.' + CLASS_DRAG_POINT);

			//personal computer 
			if (!isMobile) {
				dragTarget.on("mousedown", function () {
					dragWrap.on("mousemove.timepickerdrag", that.handleDragStart.bind(that))
				})
				$(document).on("mouseup", function () {
					dragWrap.off("mousemove.timepickerdrag");
					that.scrollEnd();
				})
				dragWrap.on("click", that.handleDragStart.bind(that))
			}

			//mobile 
			dragTarget.on("touchmove", that.handleDragStart.bind(that));
			dragTarget.on("touchend", that.scrollEnd);
			dragWrap.on("touchstart", that.handleDragStart.bind(that));

		},
		scrollStart: function () {
			$('body').addClass("sk-scrolling")
		},
		scrollEnd: function () {
			$('body').removeClass("sk-scrolling")
		},
		handleDragStart: function (e) {
			var that = this;
			var evt = e || window.event, move, radian, percent;
			var radius = that.dragWrap.outerHeight() / 2 || 110;
			var isClick = evt.type === "click" || evt.type === "touchstart";
			var scrollTop = document.documentElement.scrollTop || window.pageYOfset || document.body.scrollTop;
			var scrollLeft = document.documentElement.scrollLeft || window.pageXOfset || document.body.scrollLeft;
			var center = {
				x: that.elem.offset().left + that.elem.outerWidth() / 2 - scrollLeft,
				y: that.elem.offset().top + that.elem.outerHeight() / 2 - scrollTop
			};


			if (isMobile && evt.originalEvent.touches) {
				move = evt.originalEvent.touches.length > 0 ? evt.originalEvent.touches[0] : evt.originalEvent.touches
			} else {
				move = evt
			}

			if (!isClick && isMobile) {    
				that.scrollStart()
			}

			//相对于中心点的坐标,右手系，x轴位于12点方向
			var y = center.x - move.clientX,
				x = center.y - move.clientY,
				currentSquare = x * x + y * y,
				realSquare = radius * radius
			//点击环形区域才有效 
			if (isClick && (currentSquare < realSquare * 0.81) || (currentSquare > realSquare * 1.21)) {
				return
			}

			//顺时针方向为正
			if (x === 0) {
				radian = y < 0 ? Math.PI / 2 : -Math.PI / 2
			} else {
				radian = Math.atan(y / x)
				//不同象限处理
				if (x > 0 && y > 0) {
					radian = 2 * Math.PI - radian
				} else if (x > 0 && y <= 0) {
					radian = -radian
				} else if (x < 0) {
					radian = Math.PI - radian
				}
			}

			percent = radian / (2 * Math.PI)

			// console.log(x+"   "+y+" percent: "+percent)
			if (isClick) {
				that.setTransition(0.3)
			} else {
				that.removeTransition()
			}

			that.draw(percent)
			// //过了零点，改变am
			if (that.checkZeroDirection(percent, that.lastPercent) != 0) {
				that.am = !that.am
			}

			that.time=that.translateTime(percent);
			that.elem.find('.'+CLASS_TIME).html(that.time);    

			that.lastPercent = percent
		},
		checkZeroDirection: function (end, start) {
			var end = end || 0, start = start || 0;
			if (end >= 0 && end <= 0.2 && start < 1 && start >= 0.8) {
				return 1
			} else if (start > 0 && start <= 0.2 && end <= 1 && end > 0.8) {
				return -1
			} else {
				return 0
			}
		}
		,
		translateTime: function (percent) {
			var t = percent * 12,
				h = this.am ? Math.floor(t) : Math.floor(t) + 12,
				m = Math.floor(t % 1 * 60)

			m = m < 10 ? '0' + m : m
			h = h < 10 ? '0' + h : h
			return h + ":" + m
		},
		removeTransition: function () {
			var innerCircle = this.elem.find('.' + CLASS_CIRCLE_INNER);
			this.dragWrap.css('transition', 'none');
			innerCircle.css('transition', 'none');
		},
		setTransition: function (d) {
			var innerCircle = this.elem.find('.' + CLASS_CIRCLE_INNER);
			var duration = d || 1;                                        
			this.dragWrap.css('transition', duration + 's ease-in-out');
			innerCircle.css('transition', duration + 's ease-in-out');
		}
	}
	Skeleton.timepicker = function (options) {   
		return new Timepicker(options)
	}

})(Skeleton, jQuery);



; (function (Skeleton, $) {

	var index=0;//实例化组件数	

	var Select = function (options) {
		var config = {
			elem: '',
			index: ''
		};
		this.config = $.extend(config, options || {});
		this.elem = $(this.config.elem).eq(0);
		this.index = ++index;
		this.init();    
	}

	Select.inherits(Skeleton);

	var CLASS_LIST="sk-select-list",CLASS_STATUS="select-status",CLASS_ACTIVE="opened",CLASS_TEXT="selected-text";
	
	
	Select.prototype = { 
		init: function () { 
			this.buildTemplate();
			this.bindEvent();
			this.setDefaultOpt();
		},
		
		getDefaultOpt:function(){
			var that = this,defaultOpt={};
			this.elem.find("option").each(function (k, opt) {
				if ($(opt).attr("selected") !== undefined) { 
					defaultOpt.value = opt.innerHTML;
					defaultOpt.index=that.selectedIndex = k;      
					return 
				} 
			});
			return defaultOpt;    
		},

		setDefaultOpt:function(){
			var selectedIndex=this.getDefaultOpt.index;
			if (selectedIndex !== undefined) {       
				this.selectList.find(".option").eq(selectedIndex).trigger("click");
			}
		},   

		buildTemplate:function(){
			var that = this,defaultOpt=this.getDefaultOpt();
			var template = '<div class="'+ CLASS_LIST + '" index="' + that.index + '">', optionsHtml = '';
			that.elem.find("option").each(function (k, opt) {
				var text = $(opt).html() || '';
				optionsHtml += '<li class="option" >' + text + '</li>';
			});
			template += '<span class="'+CLASS_STATUS+'"><span class="'+CLASS_TEXT+'">' + defaultOpt.value + '</span><i class="icon"></i></span>';
			template += '<ul class="options">';
			template += optionsHtml + '</ul></div>';
			
			that.elem.hide().after(template); 
			
			that.setSelectList();     
		},

		setSelectList:function(){
			this.selectList=this.elem.siblings("."+CLASS_LIST);
		},

		bindEvent: function () {
			var that = this, elem = that.elem;

			var selectList = this.selectList;
			selectList.find("."+CLASS_STATUS).on("click", function (event) {
				var that = this, index = $("this").attr("index");
				//关闭其他下拉选择组件
				$("."+CLASS_LIST).each(function (k, v) {
					if (k != index) {
						$(v).removeClass(CLASS_ACTIVE)
					}
				});
				//点击其他区域关闭此组件
				(function documentHandler() {
					$(document).one('click', function (event) {
						var e = event || window.event;
						if ($(e.target).closest("."+CLASS_STATUS)[0] === that) {
							documentHandler();   
							return;
						}
						selectList.removeClass(CLASS_ACTIVE);
					})
				})();  

				selectList.toggleClass(CLASS_ACTIVE);
			});
			selectList.find(".option").on("click", function () {
				var optionIndex = $(this).index();
				elem.attr({
					"data-value": $(this).attr("data-value"),
					"data-text": $(this).text()
				});
				//设置表单selected项，并触发change事件   
				elem.find("option").eq(optionIndex).attr("selected", true).siblings("option").removeAttr("selected");
				elem.trigger("change");
				selectList.find(".option").removeClass("selected");
				selectList.removeClass(CLASS_ACTIVE).find("."+CLASS_TEXT).text($(this).text());
				$(this).addClass("selected");
			});
			
		}
	}

	Skeleton.select = function (options) {
		return new Select(options)
	}

})(Skeleton, jQuery);





















