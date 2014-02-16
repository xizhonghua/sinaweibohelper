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
		var v = op._getConfig(name);
		if(v==null || v=="undefined"){
			op._setConfig(name, value);
		}
	},		
	_getConfig: function(name){
		var defaultValue = arguments[1] ? arguments[1] : null;
		var value = localStorage.getItem(name);
		if(value == "true") value = true;
		if(value == "false") value = false;
		if(value == null) return defaultValue
		return  value;
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
		
		// bind ads
		op._bind("chk-enable-hide-AD", "enableHideAD", "checked", "true");
		op._bind("chk-ad-hot-topic", "adHotTopic", "checked", "false");
		op._bind("chk-ad-interest", "adInerest", "checked", "true");
		op._bind("chk-ad-hot-weibo", "adHotWeibo", "checked", "true");
		op._bind("chk-ad-app", "adApp", "checked", "true");
        op._bind("chk-ad-title", "adTitle", "checked", "true");
        op._bind("chk-ad-find-friend", "adFindFriend", "checked", "true");
		op._bind("chk-ad-hot-music", "adOthers", "checked", "true");
		
		
		// others
		op._bind("chk-load-new-feeds", "autoLoadNewFeeds", "checked", "true");
		op._bind("input-appkey", "fromAppkey", "val", "");
		
		//========================================
		
		$("#chk-enable-hide-AD").change(function(){
		    var enableHideAD = $(this).prop("checked");
		    $(".inner-check > input").each(function(index, val){
		        if(!enableHideAD) {
		            $(this).attr("disabled", true);
		        }else{
		            $(this).removeAttr("disabled");
		        }
		    });
		   // op.save();
		});
		
		// save on checkbox changed
		$("input[id^='chk-'").change(function(){
		    op.save();
		});
		
		
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
	    var ver = " Ver: " + chrome.app.getDetails().version;
		$("#option-title").html(chrome.i18n.getMessage("optionsTitle") + ver);
		$("#account-title").html(chrome.i18n.getMessage("optionsAccountTitle"));
		$(".account").html(chrome.i18n.getMessage("account") + ": ");
		$(".password").html(chrome.i18n.getMessage("password") + ": ");
		$("#others-title").html(chrome.i18n.getMessage("others"));
		$("#auto-load-new-feeds").html(chrome.i18n.getMessage("optionsAutoLoadNewFeeds"));
		
		$("#hide-ads").html(chrome.i18n.getMessage("optionsHideAds"));
		$("#enable-hide-ads").html(chrome.i18n.getMessage("optionsEnableHideAds"));
		
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
			}else if(obj.attr=="checked") {
				$("#" + id).prop(obj.attr, value);
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
        $("#chk-enable-hide-AD").change();
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
			} else if(obj.attr=="checked") {
			    value = $("#" + id).prop(obj.attr);
			}
			localStorage.setItem(obj.name, value);				
		}			
	},
	reset: function(){
	//	var bgDom = chrome.extension.getBackgroundPage();
		for(id in op._bindObjs){
			var obj = op._bindObjs[id];				
			//var value = bgDom.page._defaultConfig[obj.name];
			localStorage.setItem(obj.name, obj.value);				
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
