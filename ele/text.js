const {Html} = require("../nvhtml");

class Text extends Html {
    tag = '';
    type = 'text'
    attribs = { _text: '' }
}

function creat(forest,s) {
    let nd = forest.node(Text);
    nd.attribs._text = s;
    return(nd)
}

module.exports = {
    Text,
    creat,
}

