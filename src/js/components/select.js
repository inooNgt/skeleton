; (function (Skeleton, $) {

	var index = 0;//实例化组件数	

	var Select = function (options) {
		var config = {
			elem: '', 				//select 元素
			index: '', 				//实例化组件序号
			onChange: function () {  //回调函数

			}
		};
		this.config = $.extend(config, options || {});
		this.elem = $(this.config.elem).eq(0);
		this.index = ++index;
		this.init();
	}

	Select.inherits(Skeleton);

	var CLASS_LIST = "sk-select-list", CLASS_STATUS = "select-status", CLASS_ACTIVE = "opened", CLASS_TEXT = "selected-text", CLASS_FADEINUP = "fadeInUp_SK";


	Select.prototype = {
		init: function () {
			this.buildTemplate();
			this.bindEvent();
			this.setDefaultOpt();
		},

		getDefaultOpt: function () {
			var that = this, defaultOpt = {};
			this.elem.find("option").each(function (k, opt) {
				if ($(opt).attr("selected") !== undefined) {
					defaultOpt.value = opt.innerHTML;
					defaultOpt.index = that.selectedIndex = k;
					return
				}
			});

			return defaultOpt;
		},

		setDefaultOpt: function () {
			var selectedIndex = this.getDefaultOpt().index;
			if (selectedIndex !== undefined) {
				this.setOption(this.selectList.find(".option").eq(selectedIndex));
			}
		},

		buildTemplate: function () {
			var that = this, defaultOpt = this.getDefaultOpt();
			var template = '<div class="' + CLASS_LIST + '" index="' + that.index + '">', optionsHtml = '';
			that.elem.find("option").each(function (k, opt) {
				var text = $(opt).html() || '';
				optionsHtml += '<li class="option" >' + text + '</li>';
			});
			template += '<span class="' + CLASS_STATUS + '"><span class="' + CLASS_TEXT + '">' + defaultOpt.value + '</span><i class="icon"></i></span>';
			template += '<ul class="options" style="display:none;">';
			template += optionsHtml + '</ul></div>';

			that.elem.hide().after(template);

			that.setSelectList();
		},

		setSelectList: function () {
			this.selectList = this.elem.siblings("." + CLASS_LIST);
		},

		bindEvent: function () {
			var that = this, elem = that.elem;

			var selectList = this.selectList;
			selectList.find("." + CLASS_STATUS).on("click", function (event) {
				var that = this, index = $("this").attr("index");
				//关闭其他下拉选择组件   
				$("." + CLASS_LIST).each(function (k, v) {
					if (k != index) {
						$(v).removeClass(CLASS_ACTIVE)
					}
				});
				//点击其他区域关闭此组件
				(function documentHandler() {
					$(document).one('click', function (event) {
						var e = event || window.event;
						if ($(e.target).closest("." + CLASS_STATUS)[0] === that) {
							documentHandler();
							return;
						}
						selectList.removeClass(CLASS_ACTIVE);
						selectList.find(".options").removeClass(CLASS_FADEINUP);
					})
				})();

				selectList.toggleClass(CLASS_ACTIVE);
				selectList.find(".options").toggleClass(CLASS_FADEINUP);
			});
			
			selectList.find(".option").on("click", function () {
				that.setOption($(this));
			})
		},
		setOption: function (target) {
			var that = this,
				config = this.config,
				elem = this.elem,
				selectList = this.selectList;
			var	optionIndex = target.index();
			var optionElem=elem.find("option").eq(optionIndex);

			target.addClass("selected").siblings(".option").removeClass("selected");

			selectList.removeClass(CLASS_ACTIVE).find("." + CLASS_TEXT).text(target.text());

			//设置select状态，并触发change事件   
			optionElem.attr("selected", true).siblings("option").removeAttr("selected");

			if (typeof config.onChange === "function"){
				config.onChange.call(that,optionElem)
			}else{
				elem.trigger("change")
			}
		}
	}

	Skeleton.select = function (options) {
		return new Select(options)
	}

})(Skeleton, jQuery);




















