var url = Utils.getQueryStringByName("shortUrl");
$("#shorten-url").val(url).focus().click().select();

$("#ad").loadAd();