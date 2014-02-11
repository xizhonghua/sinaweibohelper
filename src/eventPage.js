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
            }
          });
    }
}

chrome.contextMenus.onClicked.addListener(pageMenus._onClickHanlder);

messager.init();
pageMenus.init();




