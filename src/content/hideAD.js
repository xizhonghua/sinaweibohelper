var config = {
    keywords : [],
    totoalBlocked : 0
};

function checkEnable(key, trueCallback) {
    chrome.extension.sendMessage({action: "getOption", key : key}, function (op) {
        var value = (op.value == "true");
        if(value && trueCallback) trueCallback();
    });
}

function hideRightModule(selector){
    $(selector).closest(".WB_right_module").remove();
}

function removeClosest(selector1, selector2) {
    $(selector1).closest(selector2).remove();
}

function hide() {
    checkEnable("adHotTopic", function() {
        hideRightModule("a[href*='huati.weibo.com']");
        
    });
    
    checkEnable("adInerest", function() {
        hideRightModule("a[href*='weibo.com/find']");
        hideRightModule("legend:contains('可能感兴趣的人')");
    });
    
    checkEnable("adHotWeibo", function() {
        hideRightModule("a[href*='hot.weibo.com']");
        hideRightModule("a:contains('热门微博')");
    });
    
    checkEnable("adApp", function() {
        $("#pl_leftnav_app").remove();
    });
    
    checkEnable('adTitle', function() {
        $(".title_area").remove();
        $(".input").css({"margin-top" : "-12px"});
    });
    
    checkEnable("adFindFriend", function() {
        removeClosest('img[src*="face_friend"]','.WB_feed_type');
    });
    
    checkEnable("adOthers", function() {
        hideRightModule("a:contains('会员专区')");
        hideRightModule("legend:contains('最新电影')");
        hideRightModule("legend:contains('公告栏')");
        hideRightModule("legend:contains('公告栏')");
        hideRightModule("legend:contains('人气图书')");
        hideRightModule("legend:contains('人气图书')");
        hideRightModule("legend:contains('热门歌曲')");
    });
        
    setTimeout(hide, 1000);
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
        config.totoalBlocked += blocked;
        var time = new Date().getTime();
        
        $("#weibohelper-hint").html("本次屏蔽" + blocked + "条微博，累计屏蔽" + config.totoalBlocked  + "条").attr("time", time).show(400);
        
        setTimeout(function() {
            if($("#weibohelper-hint").attr("time") == time) {
                $("#weibohelper-hint").hide();
            }
        }, 2000);
        
        chrome.extension.sendMessage({action: "increaseTotoalBlocked", value : blocked});
        
        updateTotalBlocked();
    }
    
    setTimeout(blockKeywords, 2000);
}


function updateTotalBlocked(callback) {
    chrome.extension.sendMessage({action: "getOption", key : "totalBlocked"}, function (op) {
        var totoalBlocked =  op.value;
        if(totoalBlocked == "" || totoalBlocked == null)
            totoalBlocked = 0;
        config.totoalBlocked = parseInt(totoalBlocked);   
        if(callback) callback();
    });
}

function init() {
   checkEnable("enableHideAD", function() {
        setTimeout(hide, 30);
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
    }).appendTo("body").hide();
    
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