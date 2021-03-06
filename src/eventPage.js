var weibo = {
    share: function(tab, selection, pic) {
        weibo._share(tab.title, selection, tab.url, pic);
    },
    _share: function(title, selection, URL, pic) {			
		var url = 'http://v.t.sina.com.cn/share/share.php?';			
		url += 'title=' + '【' + encodeURIComponent(title) + '】';
        if(selection) 
            url += encodeURIComponent(selection);
		if (pic)
            url += "&pic=" + encodeURIComponent(pic);
		url += "&url=" + encodeURIComponent(URL);
		
		var appKey = localStorage.getItem("fromAppkey") || "";
		
		if(appKey != ""){
			url += "&appkey=" + appKey;
		}
		
		var screenWidth = window.screen.width;
		var screenHeight = window.screen.height;
		var width = 610;
		var height = 580;
		var left = (screenWidth - width) / 2;
		var top = (screenHeight - height) / 2;				
		
		var win = window.open(url, '', 'left=' + left + ",top=" + top + ",width=" + width + ",height=" + height);			
	},
}

var pageMenus = {
    init: function() {
        pageMenus._createMenus();
    },

    _onClickHanlder: function(info, tab) {
        if(info.menuItemId == "sharePage"){
            weibo.share(tab, null, null)
        }else if(info.menuItemId == "shareSelection"){
            weibo.share(tab, info.selectionText, null)
        }else if(info.menuItemId == "shareImage"){
            weibo.share(tab, null, info.srcUrl)
        }
    },

    _createMenus: function() {
        chrome.contextMenus.create({
            "title" : chrome.i18n.getMessage("contextMenuSharePage"),
            "id" : "sharePage",
	        "contexts" : ["page"]
        });

        chrome.contextMenus.create({
            "title" : chrome.i18n.getMessage("contextMenuShareSelection"),
            "id" : "shareSelection",
	        "contexts" : ["selection"]
        });

        chrome.contextMenus.create({
            "title" : chrome.i18n.getMessage("contextMenuShareImage"),
            "id" : "shareImage",
	        "contexts" : ["image"]
        });
    }
}

var messager = {
    init: function() {
        chrome.extension.onMessage.addListener(
          function(request, sender, sendResponse){
            if (request.action == "getCurAccount"){
              sendResponse({
                name: localStorage.getItem("curAccount") || "",
                password: localStorage.getItem("curPassword") || ""
              });
            }else if(request.action == "setCurAccount"){
                localStorage.setItem("curAccount", request.name);
                localStorage.setItem("curPassword", request.password);
            }else if(request.action == "removeCurAccount"){
                localStorage.removeItem("curAccount");
                localStorage.removeItem("curPassword");
            }else if(request.action == "sharePage"){
                weibo.share(request.tab, null, null);
            }else if(request.action == "increaseTotalBlocked") {
                var increased = parseInt(request.value);
                var totalBlocked = localStorage.getItem("totalBlocked");
                if(totalBlocked == "" || totalBlocked == null){
                    totalBlocked = 0;
                } else {
                    totalBlocked = parseInt(totalBlocked);
                }
                totalBlocked += increased;
                localStorage.setItem("totalBlocked", totalBlocked);
            }else if(request.action == "increaseTotalAdBlocked") {
                var increased = parseInt(request.value);
                var totalAdBlocked = localStorage.getItem("totalAdBlocked");
                if(totalAdBlocked == "" || totalAdBlocked == null){
                    totalAdBlocked = 0;
                } else {
                    totalAdBlocked = parseInt(totalAdBlocked);
                }
                totalAdBlocked += increased;
                localStorage.setItem("totalAdBlocked", totalAdBlocked);
            }else if(request.action == "getOption") {
                sendResponse({
                    key : request.key,
                    value :  localStorage.getItem(request.key)
                });
            }
          });
    }
}

var defaultOptions = {
    enableHideAD : true,
    adHotTopic : false,
    adInterest : true,
    adHotWeibo : true,
    adApp : true,
    adTitle : true,
    adBizTips : true,
    adFindFriend : true,
    adOthers : true,
    fromAppkey : "",
    keywords : "",
    totalBlocked : 0,
    totalAdBlocked : 0
};

var options = {
    // check every default option value
    init : function() {
        for(var key in defaultOptions) {
            if(!localStorage.getItem(key) != undefined) continue;
            localStorage.setItem(key, defaultOptions[key]);
        }
    }
};

options.init();
messager.init();
pageMenus.init();

chrome.contextMenus.onClicked.addListener(pageMenus._onClickHanlder);





chrome.runtime.onInstalled.addListener(function(details) { 
    // install or update
    
    var showOptionPage = false;
    
    if(details.reason == "install") showOptionPage = true;
    else if(details.reason == "update") {
        var ver = chrome.app.getDetails().version;
	    if(localStorage.getItem("version") != ver) {
		    localStorage.setItem("version", ver);
		    var v = parseInt(ver.charAt(ver.length-1));
		    if (v % 2 == 0) //only show stable version
    		    showOptionPage = true;
		}
    }
    
    if(!showOptionPage) return;
    
    chrome.tabs.create({url: chrome.extension.getURL("options/options.html")});
});	




