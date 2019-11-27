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

let contextLinkSelector = "a.isv-d.isv-rl[ping]";
function foundAContextLink(contextLink){
	let wantedImage = $("img.isv-i[src]");

	let contextLinkTextNode = $(contextLink).find(":not(iframe)").filter(function () { return $(this).html() === $(this).text() && $(this).text().length > 0; });
	contextLinkTextNode.text("direct");

	let linkNode = $(contextLinkTextNode);
	while(true){
		if(linkNode[0].tagName.toLowerCase() === "a"){
			break;
		}
		linkNode = linkNode.parent();
		if(linkNode.length === 0){
			console.error("couldn't find an anchor as a parent?");
			return;
		}
	}
	if(linkNode[0].tagName.toLowerCase() !== "a"){
		console.error("somehow didn't find an anchor as a parent?");
		return;
	}

	linkNode.prop("href", wantedImage.prop("src"));
	linkNode.prop("download", true);
}
function checkAndMessWith(node){
	if($(contextLinkSelector).is(node)){
		foundAContextLink(node);
	}
	$(node).find("*").toArray().forEach(function(subNode){
		if($(contextLinkSelector).is(subNode)){
			foundAContextLink(subNode);
		}
	});
}
function observeMutations(mutations){
	mutations.forEach(function(mutation){
		if(mutation.addedNodes.length > 0){
			mutation.addedNodes.forEach(function(addedNode){
				checkAndMessWith(addedNode);
			});
		}
		let contextLinkFound = $(contextLinkSelector)[0];
		if(mutation.target !== null
			&& $.contains(mutation.target, contextLinkFound)){
			checkAndMessWith(contextLinkFound);
		}
	});
}
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
const overallObserver = new MutationObserver(observeMutations);
overallObserver.observe(document, { childList: true, subtree: true, attributes: true });
