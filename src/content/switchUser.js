function loginWeibo(name, password) {
    console.log('try to login weibo');

    var $inputName = $("input[name='username']");
    var $inputPassword = $("input[name='password']");
    var $submit = $('a[action-type="btn_submit"]');

    if(!$inputPassword.is(':visible') || ! $inputName.is(':visible')) {
        setTimeout(function(){
            loginWeibo(name, password)
        }, 50);
        return;
    }
    
    $(".inp.username").focus();
    Utils.fillInput($inputName, name);
    $(".inp.password").focus();
    Utils.fillInput($inputPassword, password);
    
    Utils.triggerClick($submit.get(0)); 
    
    chrome.extension.sendMessage({action: "removeCurAccount"});  
}

chrome.extension.sendMessage({action: "getCurAccount"}, function (account) {
    if(!account.name || account.name == "") return;
    console.log("enter switch user: loginname:" + account.name);
    
    setTimeout(function() {
        if (/weibo\.com\/login\.php/.test(window.location.href)){
            loginWeibo(account.name, account.password);
        } else {
            window.location.href = "http://weibo.com/login.php";
        }
    }, 50);
});
