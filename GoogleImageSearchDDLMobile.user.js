// ==UserScript==
// @name     Google Image Search Direct Download Mobile
// @version  1
// @grant    none
// @match 	 *://*.google.com/search*
// @require	 https://code.jquery.com/jquery-3.4.1.min.js
// @description Google doesn't want to let you download images directly. But you can just take a screenshot, so... why not just maintain the image quality?
// @namespace adamrgrey.com
// @license	 MIT
// ==/UserScript==

let wantedImage = $("img.isv-i[src]");
let contextLink = $("a.isv-d.isv-rl[ping]");
let contextLinkTextNode = contextLink.find(":not(iframe)").filter(function () { return $(this).html() === $(this).text(); });

contextLinkTextNode.text("direct");
contextLink.prop("href", wantedImage.prop("src"));
