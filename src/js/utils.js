// utils
// xizhonghua 3/15/2011

var Utils = {
	triggerClick:function(element){		
        if(!element) {
            console.log("element does not exist!");
            return;
        }
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("click", true, true, window,
		0, 0, 0, 0, 0, false, false, false, false, 0, null);
		element.dispatchEvent( evt );
		console.log(element + ".click_triggered!");
	},
	shortenUrl:function(longUrl, callback) {
        console.log("shortenUrl longUrl = " + longUrl);
        $.ajax({
            data:{
                "longUrl": longUrl,
                "access_token": '8b99cc643a56ba4a9b14b9e8e3e3ba7f9112bdd4',
                "format" : "txt"
            },
            type: "GET",
            url: "https://api-ssl.bitly.com/v3/shorten",
            timeout: 20000,
            success: function(data) {                
                if(data){
					   callback(data);
				 } else{
                       callback("error");
				 }
            },
        });
	},
    fillInput: function ($ele, val){
        $ele.focus();
        Utils.triggerClick($ele.get(0));
        $ele.val(val);
    },
	getQueryStringByName:function(name){ 
		var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i")); 
		if(result == null || result.length < 1){ 
			return ""; 
		} 
		return result[1]; 
	} 
}

Storage.prototype.isItemTrue = function(key) {
    var value = this.getItem(key);
	return value == 'true';
}

jQuery.fn.loadAd = function() {
    return this.each(function(){
        $(this).load("http://xiaohuahua.org/wb/ad.html")
    });
};

jQuery.fn.loadDonation = function() {
    return this.each(function(){
        $(this).load("/donation.html");
    });
};