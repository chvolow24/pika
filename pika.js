// Pika
// by Charlie Volow (charlie-volow.com)

function pika() {
    
    var templateParamRe = /{{ ([^ ]*) }}/g

    function objectParseAccess(object, accessString) {
	let delim = /[^.\[]+/g;
	let bracketed = /\[([^\[\]]+)\]/;
	let matches;
	let savedInd = -1;
	let currentObj = object;
	while ((matches = delim.exec(accessString)) !== null) {
	    let matchedText = matches[0];
	    let delimiter = accessString[savedInd];
	    if (delimiter === undefined || delimiter === '.') {
		currentObj = currentObj[matchedText];
	    } else if (delimiter === '[') {
		let subStr = accessString.slice(savedInd);
		let subscriptMatch = subStr.match(bracketed);
		let index = parseInt(subscriptMatch[1]);
		currentObj = currentObj[index];
	    }
	    savedInd = delim.lastIndex;
	}
	return currentObj;
    }

    function populateRest(obj) {
	let matches = [...document.body.innerHTML.matchAll(templateParamRe)];
	for (let m=0; m<matches.length; m++) {
	    let match = matches[m];
	    let replacement;
	    replacement = objectParseAccess(obj, matches[m][1]);
	    document.body.innerHTML = document.body.innerHTML.replace(match[0], replacement);
	}
    }

    function getOutermostForLoops(el) {
	let allLoops = el.getElementsByClassName("for-loop");
	let outermostLoops = [];

	for (let i = 0; i < allLoops.length; i++) {
            let loop = allLoops[i];
            let isNested = false;
            let parent = loop.parentElement;
            while (parent && parent != el) {
		if (parent.classList && parent.classList.contains("for-loop")) {
                    isNested = true;
                    break;
		}
		parent = parent.parentElement;
            }
            
            if (!isNested) {
		outermostLoops.push(loop);
            }
	}
	return outermostLoops;
    }
    
    function populateForLoop(data, el) {
	let addtlLoops = getOutermostForLoops(el);
	let savedInnerLoopContents = [];
	for (let i=0; i<addtlLoops.length; i++) {
	    savedInnerLoopContents.push(addtlLoops[i].innerHTML);
	    addtlLoops[i].innerHTML = "";
	}

	// let data = dataspace[el.getAttribute("iterable")];
	let matches = [...el.innerHTML.matchAll(templateParamRe)];
	let newInnerHTML = "";
	// let iterations = 0;
	let tagAdd = el.tagName;
	if (tagAdd === "DIV" || tagAdd === "SPAN") {
	    tagAdd = null;
	} else {
	    tagAdd = tagAdd.toLowerCase();
	}
	
	for (let i=0; i<data.length; i++) {
	    let cpy = el.innerHTML.slice(1);
	    for (let m=0; m<matches.length; m++) {
		let match = matches[m];
		let replacement = objectParseAccess(data[i], match[1]);
		cpy = cpy.replace(match[0], replacement);
	    }
	    if (tagAdd != null) {
		cpy = `<${tagAdd}>${cpy}</${tagAdd}>`;
	    }
	    newInnerHTML += cpy;
	}
	if (tagAdd != null) {
	    let parent = el.parentElement;
	    el.outerHTML = newInnerHTML;
	    el = parent;
	} else {
	    el.innerHTML = newInnerHTML;
	}

	addtlLoops = getOutermostForLoops(el);
	let cachedContentsIndex = 0;
	for (let i=0; i<addtlLoops.length; i++) {
	    addtlLoops[i].innerHTML = savedInnerLoopContents[cachedContentsIndex];
	    cachedContentsIndex++;
	    cachedContentsIndex%= savedInnerLoopContents.length;
	}
	addtlLoops = getOutermostForLoops(el);
	for (let i=0; i<addtlLoops.length; i++) {
	    let loop = addtlLoops[i];
	    let newData = data[i][loop.getAttribute("iterable")];
	    populateForLoop(newData, loop, el);
	}
    }

    let templateVarName = document.body.getAttribute("templateVar");
    
    let topObj;
    if (templateVarName === null) {
	topObj = window;
    } else {
	topObj = window[templateVarName];
    }
    let els = getOutermostForLoops(document, null);
    for (let i=0; i<els.length; i++) {
	el = els[i];
	populateForLoop(topObj[el.getAttribute("iterable")], el, null);
    }
    populateRest(topObj);
}
