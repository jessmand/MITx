var words = { "name": "flare", "children": []};

function checkForTag(tagName) {
    for (var i=0; i<words.children.length;i++) {
        if (words.children[i].name == tagName) {
            return true;
        }
    }
    return false;
}

function checkForWord(tagName,word) {
    var i;
    for (i=0; i<words.children.length; i++) {
        if (words.children[i].name == tagName) {
            for (var j=0; j<words.children[i].children.length;j++) {
                if (words.children[i].children[j].name == word) {
                    return [i,j];
                }
            }
            break;
        }
    }
    return [i];
}

function parseTaggedWord(taggedWord) {
    var index = taggedWord.indexOf("_");
    var word = taggedWord.substring(0,index);
    var tagName = taggedWord.substring(index);
    if (!checkForTag(tagName)) {
        words.children.push({"name":tagName, "children":[{"name":word, "size":1}]});
    } else {
        var indices = checkForWord(tagName,word);
        if (indices.length == 1) {
            words.children[indices[0]].children.push({"name":word, "size":1});;
        } else {
            words.children[indices[0]].children[indices[1]].size += 1;
        }
    }
}
function parseTaggedText(text) {
    text = text.toLowerCase().split(" ");
    text.forEach(parseTaggedWord);
}
