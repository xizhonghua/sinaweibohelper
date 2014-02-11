function fillInput($ele, val){
    Utils.triggerClick($ele.get(0));
    $ele.val(val);
}

chrome.extension.sendMessage({action: "getCurAccount"}, function (account) {
    if(!account.name || account.name == "") return;
    console.log("enter switch user: loginname:" + account.name);
    $(".enter_psw").hide();
    fillInput($("input[name='loginname']"), account.name);
    fillInput($("input[name='username']"), account.name);
    fillInput($("input[name='password']"), account.password);
    Utils.triggerClick($("a.W_btn_d").get(0));
    Utils.triggerClick($("a.W_btn_g").get(0));
    Utils.triggerClick($("span:contains('登录')").parent().get(0));
    chrome.extension.sendMessage({action: "removeCurAccount"});
});
