const htmlparser2 = require("htmlparser2");
const ndcls = require('ndtreejs').ndcls
const {Tree} = require('ndtreejs').ndcls
const util = require('util');


function _creat_parser(parent) {
    let parser = new htmlparser2.Parser(
        {
            onopentag(tag, attribs) {
                let parent_state = parent.$state
                if(parent_state === 'open') {
                    let nd = new Html()
                    nd = parent.$append_child(nd)
                    nd.tag = tag
                    nd.attribs = attribs
                    nd.type = 'ele'
                    nd.$state = 'open'
                    parent = nd
                } else {
                    console.log('impossible open',tag,'parent',parent.tag)
                }
            },
            ontext(text) {
                let parent_state = parent.$state
                if(parent_state === 'open') {
                    let nd = new Html()
                    nd = parent.$append_child(nd)
                    nd.tag = ''
                    nd.attribs = {}
                    nd.type = 'text'
                    nd.text = text
                    nd.$state = 'close'
                    parent = nd.$parent()
                } else {
                    console.log('impossible open text',text,'parent',parent.tag)
                }
            },
            onclosetag(tag) {
                let parent_state = parent.$state
                if(parent_state === 'open') {
                    parent.$state = 'close'
                    parent = parent.$parent()
                } else {
                   console.log('impossible close',tag,'parent',parent.tag)
                }
            }
        },
        { decodeEntities: true ,recognizeSelfClosing:true}
    );
    return(parser)
}





class Html extends Tree {
    constructor(html_str) {
        super();
        if(html_str===undefined) {
        } else {
            _html_str_to_tree(html_str,this)
        }
    }
    [util.inspect.custom]() {
        let html_str = _creat_html_str(this)
        return(html_str)
    }
}






function _clear_parse_state(nd) {
    let sdfs = nd.$sdfs()
    sdfs.forEach(
        nd=>{
            delete nd.$state
        }
    )
    return(nd)
}


function _creat_attrib_kvstr(entry) {
    let k = entry[0]
    let v = entry[1]
    if(v.length>0){
        return(k+'="'+v+'"')
    } else {
        return(k)
    }
}

function _creat_attrib_str(nd) {
    let entries = Object.entries(nd.attribs)
    entries = entries.map(entry=>_creat_attrib_kvstr(entry))
    return(entries.join(' '))
}


function _creat_stag(nd) {
    if(nd.type==='root') {return('<@root@>')}
    let depth=nd.$depth()
    let indent= (depth>0)?'    '.repeat(depth-1):''
    if(nd.type === 'text') {
        return(indent+nd.text)
    } else {
        let s = nd.tag+' '+_creat_attrib_str(nd)
        s=s.trim()
        return(indent+'<'+s+'>')
    }
}

function _creat_etag(nd) {
    if(nd.type==='root') {return('</@root@>')}
    let depth=nd.$depth()
    let indent= (depth>0)?'    '.repeat(depth-1):''
    if(nd.type === 'text') {
        return('')
    } else {
        return(indent+'</'+nd.tag+'>')
    }
}


function _creat_html_str(nd) {
    let sedfs = nd.$sedfs()
    let html_str = ''
    for(let i=0;i<sedfs.length;i++) {
        let nd = sedfs[i]
        let cond = (nd.$open_at === i)
        let s =''
        if(cond) {
            s = _creat_stag(nd) + '\n'
        } else {
            s = _creat_etag(nd)
            if(nd.type === 'text') {
            } else {
                s = s + '\n'
            }
        }
        html_str = html_str + s 
    }
    html_str = html_str.substr(0,html_str.length-1)
    return(html_str)
}


function _html_str_to_tree(html_str,html) {
    let parent = html;
    parent.tag = 'root'
    parent.type = 'root'
    parent.attribs = {}
    parent.$state = 'open';
    let parser = _creat_parser(parent);
    parser.write(html_str);
    parser.end();
    parent.$state = 'close';
    _clear_parse_state(parent);
}



export {
    Html
}

