const {Html} = require("../nvhtml");
const {Text} = require("./text");


class Var extends Html {
    tag = 'var';
    type = 'ele'
    attribs = {}
}

function creat(forest,s) {
    let nd = forest.node(Var);
    let ch = forest.node(Text);
    ch.attribs._text = s;
    nd.$append_child(ch);
    return(nd)
}

module.exports = {
    Var,
    creat,
}

