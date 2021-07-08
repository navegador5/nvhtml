const {Html} = require("../nvhtml");

function form_to_json(form) {
    let sdfs = form.$sdfs_;
    let method = form.attribs.method;
    let action = form.attribs.action;
    let inputs = form.tag_filter("input");
    inputs = inputs.map(r=>[r.attribs.name,r.attribs.value]);
    return({
        method,
        action,
        inputs
    })
}


class Form extends Html {
    tag = 'form';
    type = 'ele'
    attribs = {method:undefined,action:undefined}
    json() {return(form_to_json(this))}
}

function creat(forest,action,method='POST') {
    let nd = forest.node(Form);
    nd.attribs.action = action;
    nd.attribs.method = method;
    return(nd)
}

module.exports = {
    Form,
    creat,
    form_to_json,
}

