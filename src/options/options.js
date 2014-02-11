var op = {
	maxAccount: 12,
	_bindObjs:[],
	// _bind
	// id: the id of the element to bind
	// name: key in localStorage
	// attr: the attribute to bind
	// value: the default value of the attribute
	_bind: function(id, name, attr, value){
		op._bindObjs[id] = {name:name, attr:attr, value:value};			
		if(op._getConfig(name)==null){
			op._setConfig(name, value);
		}
	},		
	_getConfig: function(name){
		var defaultValue = arguments[1] ? arguments[1] : null;
		var value = localStorage.getItem(name);
		return value || defaultValue;
	},
	_setConfig: function(name, value){
		localStorage.setItem(name, value);
	},
	init: function(){
	
		for(var i=0;i<op.maxAccount;i++) {
			$("<div></div>").addClass("account-info")
				.append('<span class="account">{account}</span> <input type="text" class="input-name"/> ')
				.append('<span class="password">{password}</span> <input type="password" class="input-password" />')
				.appendTo("#switch-user");
			if(i==4) {
				$("<div><div>")
				.html('<a id="show-more" href="javascript:void(0)">More</a>').appendTo("#switch-user");
			}else if(i == op.maxAccount-1){
				$("<div><div>")
				.html('<a id="hide-more" href="javascript:void(0)">Less</a>').appendTo("#switch-user");
			}
		}
		
		op._bind("chk-hide-AD", "hideAD", "checked", "true");
		op._bind("chk-load-new-feeds", "autoLoadNewFeeds", "checked", "true");
		op._bind("input-appkey", "fromAppkey", "val", "");
		
		$("#select-fromApp").change(function(){
			$("#input-appkey").val($("#select-fromApp").val());
		});
		
		$(".account-info:gt(4)").hide();
		$("#hide-more").hide();
		
		$("#show-more").click(function(){
			$(".account-info:gt(4)").slideDown();
			$(this).hide();
			$("#hide-more").show();
		});
		
		$("#hide-more").click(function(){
			$(this).hide();
			$("#show-more").show();
			$(".account-info:gt(4)").hide();
		});
	},
	i18n: function(){
		$("#option-title").html(chrome.i18n.getMessage("optionsTitle"));
		$("#account-title").html(chrome.i18n.getMessage("optionsAccountTitle"));
		$(".account").html(chrome.i18n.getMessage("account") + ": ");
		$(".password").html(chrome.i18n.getMessage("password") + ": ");
		$("#others-title").html(chrome.i18n.getMessage("others"));
		$("#auto-load-new-feeds").html(chrome.i18n.getMessage("optionsAutoLoadNewFeeds"));
		$("#hide-ads").html(chrome.i18n.getMessage("optionsHideAds"));
		
		$("#fromApp").html(chrome.i18n.getMessage("fromApp"));
		$("#option-default").html(chrome.i18n.getMessage("default"));
		$("#option-custom").html(chrome.i18n.getMessage("custom"));
		
		$("#btn-save-options").val(chrome.i18n.getMessage("optionsSave"));
		$("#btn-reset-options").val(chrome.i18n.getMessage("optionsReset"));
	},
	refresh: function(){
		// refresh account
		for(var i = 0; i < op.maxAccount; i++){
			var name = localStorage.getItem("name" + i);
			var password = localStorage.getItem("password" + i);				
			$(".input-name:eq(" + i + ")").val(name);
			$(".input-password:eq(" + i + ")").val(password);
		}
		for(id in op._bindObjs){
			var obj=op._bindObjs[id];
			var value=op._getConfig(obj.name, obj.value);
			if(obj.attr=="val"){
				$("#" + id).val(value);
			}else if(obj.attr=="checked" && value=="false"){
				$("#" + id).removeAttr(obj.attr);
			}else{
				$("#" + id).attr(obj.attr, value);
			}
		}
		
		var appKey = op._getConfig("fromAppkey", "");
		
		console.log("appKey:" + appKey);
		
		$('#select-fromApp').val(appKey);
		
		/*
		$('#select-fromApp > option').each(function(){
            if ($(this).text() == appKey)
                $('#select-fromApp').val(appKey);
        });
		*/
	},
	save: function(){
		for(var i=0;i<op.maxAccount;i++){
			var name = $.trim($(".input-name:eq(" + i + ")").val());
			var password = $(".input-password:eq(" + i + ")").val();				
			localStorage.setItem("name" + i, name);
			localStorage.setItem("password" + i, password);
		}
		for(id in op._bindObjs){
			var obj=op._bindObjs[id];
			var value = $("#" + id).attr(obj.attr);
			if(obj.attr=="val"){
				value = $("#" + id).val();
			}
			localStorage.setItem(obj.name, value);				
		}			
	},
	reset: function(){
		var bgDom = chrome.extension.getBackgroundPage();
		for(id in op._bindObjs){
			var obj = op._bindObjs[id];				
			var value = bgDom.page._defaultConfig[obj.name];
			localStorage.setItem(obj.name, value);				
		}
	}
};	
				
$("#btn-save-options").click(function(){
	op.save();
	alert("saved");
});
	
$("#btn-reset-options").click(function(){
	op.reset();
	op.refresh();
	alert("reseted");
});
		
op.init();
op.i18n();
op.refresh();
