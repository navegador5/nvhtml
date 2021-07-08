const {Html} = require("../nvhtml");
const {Text} = require("./text");

class A extends Html {
    tag = 'a';
    type = 'ele'
    attribs = {href:''}
}

function creat(forest,href,s) {
    let nd = forest.node(A);
    nd.attribs.href = href??'';
    if(s!==undefined) {
        let ch = forest.node(Text);
        ch.attribs._text = s;
        nd.$append_child(ch);
    }
    return(nd)
}

module.exports = {
    A,
    creat,
}

