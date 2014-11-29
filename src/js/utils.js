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
        $.ajax({
            data: JSON.stringify({
                "longUrl": longUrl,
                "key": "AIzaSyDXmb0WHAAlKfVfus46ctr4jOYwgibctM0"
            }),
            type: "POST",
            url: "https://www.googleapis.com/urlshortener/v1/url",
            timeout: 20000,
            contentType: "application/json",
            dataType: 'json',
            success: function(data) {
                if(data.id){
					   callback(data.id);
				 }else{
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