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
    });
        
    setTimeout(hide, 1000);
}


checkEnable("enableHideAD", function() {
    console.log("hide ad enabled!");
    setTimeout(hide, 30);
});