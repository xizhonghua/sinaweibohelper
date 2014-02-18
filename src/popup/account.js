$("#accounts").hide();
$("#no-account").hide();

var count = 0;
for(var i=0;i<12;i++){
	var name = localStorage.getItem("name" + i) || "";
	var password = localStorage.getItem("password" + i) || "";		
	if(name != "" && password != ""){
		count ++;
		$("<div class='account'></div>").attr("accountIndex", i)
			.html("<a href='javascript:void(0);'>" + name + "</a>").appendTo("#accounts").click(function(){
				var accountIndex = $(this).attr("accountIndex");		
				var name = localStorage.getItem("name" + accountIndex) || "";
				var password = localStorage.getItem("password" + accountIndex) || "";
				chrome.extension.sendMessage({action:"setCurAccount", name: name, password: password});
				chrome.tabs.create({url:"http://weibo.com/logout.php?backurl=/"});
		});
	}
}	

$("#add-account").html(chrome.i18n.getMessage("popupAddAccount")).click(function(){
	chrome.tabs.create({url:chrome.extension.getURL("options/options.html")});
});
	

if(count>0){
	$("#accounts").show();		
}else{
	$("#no-account").show();
}


$("#ad").loadAd();