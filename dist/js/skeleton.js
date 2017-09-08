/**
 * skeleton.js
 * build at: Fri Sep 08 2017 16:37:26 GMT+0800 (中国标准时间)
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
			prev: "上一页"
		};


		this.config = $.extend(config, options || {});

		this.elem = $(this.config.elem);

		this.renderPage();

		this.bindEvent();
	}

	var CLASS_ITEM = "page-item", CLASS_DOT = "page-dot", CLASS_CURR = "page-item page-curr", CLASS_PREV = "page-prev", CLASS_NEXT = "page-next", CLASS_DISABLE = "page-disabled";

	Page.inherits(Skeleton);

	Page.prototype = {
		/* 计算页码，返回页码元素     */
		calculatePages: function () {
			var that = this;
			var config = that.config,
				current = config.current,
				middlePage = config.middlePage,
				pageSize = config.pageSize,
				total = config.total,
				pages = Math.ceil(total / pageSize),
				viewPageStart = 0,
				viewPageEnd = 0,
				resutl = [];

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
				resutl.push('<span class="' + CLASS_ITEM + '">1</span>');
				resutl.push('<span class="' + CLASS_DOT + '">...</span>');
			}
			/*view of middle*/
			that.range(viewPageStart, viewPageEnd + 1).map(function (index, key) {
				resutl.push('<span   class="' + (index == current ? CLASS_CURR : CLASS_ITEM) + '">' + index + '</span>');
			});

			/*show dot near end*/
			if (viewPageEnd != pages) {
				resutl.push('<span  class="' + CLASS_DOT + '">...</span>');
				resutl.push('<span  class="' + CLASS_ITEM + '">' + pages + '</span>');
			}

			return resutl;
		},
		range: function (start, stop) {
			var start = start || 0, i, length = stop - start, range = Array(length);
			for (i = 0; i < length; i++ , start++) {
				range[i] = start;
			}
			return range;
		},
		bindEvent: function () {
			var that = this;
			that.elem.on("click", "." + CLASS_ITEM, function () {
				var target = this.innerHTML * 1;
				that.jumpPage(target);
			})
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
			prev = this.config.prev,
			next = this.config.next,
			current = this.config.current,
			pages = this.config.pages;
   
			if (prev) {
				var prevClass = current == 1 ? CLASS_DISABLE : CLASS_PREV;
				template.push('<span  class="' + prevClass + '">' + prev + '</span>');
			}

			template = template.concat(this.calculatePages());

			if (next) {
				var nextClass = current == pages ? CLASS_DISABLE : CLASS_NEXT;
				template.push('<span  class="' + nextClass + '">' + next + '</span>');
			}
			
			this.elem.html(template.join(""));   
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

})(Skeleton, jQuery)






















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

})(Skeleton, jQuery)





















