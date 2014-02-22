var config = {
    keywords : [],
    totalBlocked : 0,
    totalAdBlocked : 0
};

jQuery.fn.hideEx = function(hideOnly) {
    var totalAdBlocked = 0;
    var rtn = this.each(function(){
        var $ele = $(this).filter( ":visible" );
        if($ele.length == 0) return;
        
        totalAdBlocked += $ele.length;
        
        if(!hideOnly) {
            $ele.remove() 
        } else {
            $ele.hide();
        }
    });
    
    if(totalAdBlocked>0) {
        chrome.extension.sendMessage({action: "increaseTotalAdBlocked", value : totalAdBlocked});
    }
    
    return rtn;
};

function checkEnable(key, trueCallback) {
    chrome.extension.sendMessage({action: "getOption", key : key}, function (op) {
        var value = (op.value == "true");
        if(value && trueCallback) trueCallback();
    });
}

function hideRightModule(selector){
    $(selector).closest(".WB_right_module").hideEx();
}

function hideClosest(selector1, selector2) {
    $(selector1).closest(selector2).hideEx();
}

function hideAll() {
    checkEnable("adHotTopic", function() {
        hideRightModule("a[href*='huati.weibo.com']");
        
    });
    
    checkEnable("adInterest", function() {
        hideRightModule("a[href*='weibo.com/find']");
        hideRightModule("legend:contains('可能感兴趣的人')", false);
    });
    
    checkEnable("adHotWeibo", function() {
        hideRightModule("a[href*='hot.weibo.com']");
        hideRightModule("a:contains('热门微博')", false);
    });
    
    checkEnable("adApp", function() {
        $("#pl_leftnav_app").hideEx();
    });
    
    checkEnable('adTitle', function() {
        $(".title_area").remove();
        $(".input").css({"margin-top" : "-12px"});
    });
    
    checkEnable("adFindFriend", function() {
        hideClosest('img[src*="face_friend"]','.WB_feed_type');
    });
    
    checkEnable("adBizTips", function() {
        $("#pl_content_biztips").hideEx(false); 
    });
    
    checkEnable("adOthers", function() {
        hideRightModule("a:contains('会员专区')", false);
        hideRightModule("legend:contains('最新电影')", false);
        hideRightModule("legend:contains('公告栏')", false);
        hideRightModule("legend:contains('公告栏')", false);
        hideRightModule("legend:contains('人气图书')", false);
        hideRightModule("legend:contains('人气图书')", false);
        hideRightModule("legend:contains('热门歌曲')", false);
        
        // 2/21/2014 added
        hideRightModule("legend:contains('热门商品推荐')", false);
        hideRightModule("iframe[id*='ad']");
        
       
        $("div[ad-data*='ads_bottom']").hideEx();
    });
        
    setTimeout(hideAll, 1000);
}


function blockKeywords () {
    //console.log("keywords = " + config.keywords);
    var blocked = 0;
    
    $(".WB_feed_type").each(function(index, val){
        var txt = $(this).text();
        var found = false;
        for(var i=0;i<config.keywords.length;i++)
            if(txt.indexOf(config.keywords[i]) != -1) {
                found = true;
                break;
            }
        if(found) {
            blocked++;
            $(this).remove();
        }
    });
    
    if(blocked > 0)
    {
        config.totalBlocked += blocked;
        var time = new Date().getTime();
        
        $("#weibohelper-hint").html("本次屏蔽" + blocked + "条微博，累计屏蔽" + config.totalBlocked  + "条").attr("time", time).show(400);
        
        setTimeout(function() {
            if($("#weibohelper-hint").attr("time") == time) {
                $("#weibohelper-hint").hideEx();
            }
        }, 2000);
        
        chrome.extension.sendMessage({action: "increaseTotalBlocked", value : blocked});
        
        updateTotalBlocked();
    }
    
    setTimeout(blockKeywords, 2000);
}


function updateTotalBlocked(callback) {
    chrome.extension.sendMessage({action: "getOption", key : "totalBlocked"}, function (op) {
        var totalBlocked =  op.value;
        if(totalBlocked == "" || totalBlocked == null)
            totalBlocked = 0;
        config.totalBlocked = parseInt(totalBlocked);   
        if(callback) callback();
    });
}

function init() {
   checkEnable("enableHideAD", function() {
        setTimeout(hideAll, 30);
    });
    
    $("<div></div>").attr("id","weibohelper-hint").css({
        "position" : "fixed",
        "top": "4px",
        "right": "50%",
      	"background": "#F7FABB",
  	    "padding":"10px",
      	"border-radius":"10px",
      	"color":"#333",
      	"z-index": "10000"
    }).appendTo("body").hideEx();
    
  updateTotalBlocked(function() {
        chrome.extension.sendMessage({action: "getOption", key : "keywords"}, function (op) {
            var kws = op.value.split(",");
            for(var i=0;i<kws.length;i++)
                if(kws[i] && kws[i].length > 0) config.keywords.push(kws[i]);
            if(config.keywords.length>0)
                blockKeywords();
        }); 
    });
}


init();