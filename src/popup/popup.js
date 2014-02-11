var pPopup = {
	$btnHome: $("#btn-home"),
	$btnAtMe: $("#btn-at-me"),
	$btnMessages: $("#btn-messages"),
	$btnShare: $("#btn-share"),
	$btnShorten: $("#btn-shorten"),
	$btnSwitch: $("#btn-switch"),
	$btnOption: $("#btn-option"),
    $extensionVersion: $("#extension-version"),
	i18n: function(){
		pPopup.$btnHome.html(chrome.i18n.getMessage("popupHome"));
		pPopup.$btnAtMe.html(chrome.i18n.getMessage("popupAtMe"));
		pPopup.$btnMessages.html(chrome.i18n.getMessage("popupMessages"));
		pPopup.$btnShare.html(chrome.i18n.getMessage("popupShare"));
		pPopup.$btnSwitch.html(chrome.i18n.getMessage("popupSwitchUser"));
		pPopup.$btnOption.html(chrome.i18n.getMessage("popupSettings"));
		pPopup.$btnShorten.html(chrome.i18n.getMessage("popupShorten"));
        pPopup.$extensionVersion.html("ver:" + chrome.app.getDetails().version);
	},
	init: function(){
		// home clicked
		pPopup.$btnHome.click(function(){
			chrome.tabs.create({url:"http://weibo.com"});
		});
		
		// at me clicked
		pPopup.$btnAtMe.click(function(){
			chrome.tabs.create({url:"http://weibo.com/atme"});
		});
		
		// messages clicked
		pPopup.$btnMessages.click(function(){
			chrome.tabs.create({url:"http://weibo.com/messages"});
		});
		
		// switch clicked
		pPopup.$btnSwitch.click(function(){
			location.href = "account.html";				
		});
		
		// share clicked
		pPopup.$btnShare.click(function(){
			chrome.tabs.getSelected(null, function(tab) {
				chrome.extension.sendMessage({action: "sharePage", tab: tab});	
			});
		});
		
		// shorten clicked
		pPopup.$btnShorten.click(function(){
			chrome.tabs.getSelected(null, function(tab) {										
				Utils.shortenUrl(tab.url, function(url) {
					location.href = "shorten.html?shortUrl=" + url;
				});
			});
		});
		
		// option clicked				
		pPopup.$btnOption.click(function(){
			chrome.tabs.create({url:chrome.extension.getURL("options/options.html")});
		});
	}
}
	
pPopup.init();
pPopup.i18n();
