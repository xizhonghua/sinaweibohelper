function fillInput($ele, val){
    $ele.focus();
    Utils.triggerClick($ele.get(0));
    $ele.val(val);
}

function loginUS(name, password) {
    var $a = $('a:contains("登入微博")');
    
    // already logged in?
    if($a.length != 0) {
        Utils.triggerClick($a.get(0));
    
        var $inputName = $("input[id*='account-']");
        var $inputPassword = $("input[id*='password-']");
        fillInput($inputName, name);
        fillInput($inputPassword, password);
        var $submit = $('.weibo-logindialog-submit');
        Utils.triggerClick($submit.get(0));
        
        chrome.extension.sendMessage({action: "removeCurAccount"});
    }
    
    setTimeout(function() {
        window.location.href = "http://weibo.com";
    }, 2000);
}

function loginHK(name, password) {
    var $i = $('.btnWeiboLogin');
    
    if($i.length != 0) {
        Utils.triggerClick($i.get(0));
        var $inputName = $('.uname.inp');
        var $inputPassword = $('.pw.inp');
        var $submit = $('.btnSubmit');
         
        fillInput($inputName, name);
        fillInput($inputPassword, password);
        Utils.triggerClick($submit.get(0)); 
        
        chrome.extension.sendMessage({action: "removeCurAccount"});  
    }
    
     setTimeout(function() {
        window.location.href = "http://weibo.com";
    }, 2000);
}

function loginWeibo(name, password) {
    var $inputName = $("input[name='username']");
    var $inputPassword = $("input[name='password']");
    var $submit = $('a[action-type="btn_submit"]');
    
    $(".inp.username").focus();
    fillInput($inputName, name);
    $(".inp.password").focus();
    fillInput($inputPassword, password);
    
    Utils.triggerClick($submit.get(0)); 
    
    chrome.extension.sendMessage({action: "removeCurAccount"});  
}

chrome.extension.sendMessage({action: "getCurAccount"}, function (account) {
    if(!account.name || account.name == "") return;
    console.log("enter switch user: loginname:" + account.name);
    
    //$(".weibo-logindialog-content").show();
    
    setTimeout(function() {
        // if (/us\.weibo\.com/.test(window.location.href)) {
//             loginUS(account.name, account.password);
//         }
//         else 
        if (/weibo\.com\/login\.php/.test(window.location.href)){
            loginWeibo(account.name, account.password);
        } else {
            window.location.href = "http://weibo.com/login.php";
        }
    }, 2000);
});
