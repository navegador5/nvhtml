const htmlparser2 = require("htmlparser2");
const Forest  = require("nv-data-tree-csp-forest");
const {_UiNode} = require("nv-data-tree-csp-node");

const ary_clu = require("nv-array-include");
const _match = ary_clu._match;

const {po_is_match}=require("nv-array-match");

const {unindent} = require("nv-facutil-basic");
const _empty_line_regex = /[ \t]+/g;


function _fmt(nd) {
    let s = nd.stringify().replace(/\r/g,"\n")
    let arr = s.split("\n");
    arr = arr.filter(r=>r.length>0)
    let narr = []
    for(let line of arr) {
        if(line.replace(_empty_line_regex,"").length!==0) {
            narr.push(line)
        }
    }
    s=narr.join("\n")
    s= unindent(s,nd.$depth_-1);
    return(s)
}

function _iter_text(nd) {
    let arr = nd.$sdfs_;
    arr = arr.filter(r=>r.type==='text');
    arr = arr.map(r=>"   ".repeat(r.$dist(nd))+r.attribs._text)
    arr = arr.filter(ln=>ln.replace(/[\r\n ]+/g,"").length>0)
    s=arr.join("\n")
    s=s.replace(/\r/g,"\n");
    s=s.replace(/[\n]+/g,"\n");
    return(s)
}

function _iter_tag(nd) {
    let sdfs = nd.$sdfs_;
    let depth = nd.$depth_;
    sdfs = sdfs.filter(r=>r.type!=='text')
    let lines = sdfs.map(r=>"    ".repeat(r.$depth_-depth)+r.tag)
    return(lines.join("\n"))
}

function _iter_attr(nd) {
    let sdfs = nd.$sdfs_;
    let depth = nd.$depth_;
    sdfs = sdfs.filter(r=>r.type!=='text');
    let lines = sdfs.map(
        r=>{
            s = "    ".repeat(r.$depth_-depth)+r.tag;
            let d = Object.assign({},r.attribs);
            let attrs = Object.entries(d).map(
                e=>{
                    let k,v;
                    k = /[ \t]/.test(e[0])?JSON.stringify(e[0]):e[0]
                    v = /[ \t]/.test(e[1])?JSON.stringify(e[1]):e[1]
                    return("    ".repeat(r.$depth_-depth+1) +'-'+k+' '+v)
                }
            );
            attrs.unshift(s)
            return(attrs)
        }
    )
    return(lines.flat().join("\n"))
}


function _iter_all(nd) {
    let sdfs = nd.$sdfs_;
    let depth = nd.$depth_;
    sdfs = sdfs.filter(
        r=>!(
            r.type==='text' &&
            r.attribs._text.replace(/[ \n\r\t]/g,"").length===0
        )
    );
    let lines = sdfs.map(
        r=>{
            let d = Object.assign({},r.attribs);
            let attrs = Object.entries(d).map(
                e=>{
                    let k,v;
                    if(e[0]!=='_text') {
                        k = /[ \t]/.test(e[0])?JSON.stringify(e[0]):e[0]
                        v = /[ \t]/.test(e[1])?JSON.stringify(e[1]):e[1]
                        return("    ".repeat(r.$depth_-depth+1) +'-'+k+' '+v)
                    } else {
                        k = e[0];
                        v = '`'+e[1]+'`'
                        return("    ".repeat(r.$depth_-depth) +k+' '+v)
                    }
                }
            );
            if(r.tag!=='') {
                let s = "    ".repeat(r.$depth_-depth)+r.tag;
                attrs.unshift(s);
            } else {}
            return(attrs)
        }
    );
    return(lines.flat().join("\n"))
}

function _rel_tpl(nd,rrt) {
    let g = nd.$gen_ance();
    let pl = [nd.tag]
    for(let nnd of g) {
        if(nnd!==rrt) {
            pl.unshift(nnd.tag)
        } else {
            break
        }
    }
    return(pl)
}



function _get_tpl_set(pls) {
    let st0 = new Set();
    let st1 = new Set();
    for(let pl of pls) {
        let s = JSON.stringify(pl);
        if(st0.has(s)) {
        } else {
            st0.add(s);
            st1.add(pl);
        }
    }
    return(st1)
}


function _rel_inclusive_ances(nd,rrt) {
    let g = nd.$gen_ance();
    let nds = [nd]
    for(let nnd of g) {
        if(nnd!==rrt) {
            nds.unshift(nnd)
        } else {
            break
        }
    }
    return(nds)
}


function _inclusive_ances_match(nd,rrt,...conds) {
    let lngth = condfs.length;
    let ances = _rel_inclusive_ances(nd,rrt);
    for(let i=0;i<ances.length;i++) {
        if(po_is_match(ances.slice(i),conds)) {
            return(true)
        } else {}
    }
    return(false)
}


const {table_to_json} = require("./ele/table")


class Html extends _UiNode {
    tag=""
    type=""
    attribs={}
    ////
    stringify() {return(_creat_html_str(this))}
    show_html(rtrn=false) {
        let s = _fmt(this)
        if(rtrn) {return(s)} else {console.log(s)}
    }
    show_text(rtrn=false) {
        let s = _iter_text(this)
        if(rtrn) {return(s)} else {console.log(s)}
    }
    show_tag(rtrn=false)  {
        let s = _iter_tag(this)
        if(rtrn) {return(s)} else {console.log(s)}
    }
    show_attr(rtrn=false) {
        let s = _iter_attr(this)
        if(rtrn) {return(s)} else {console.log(s)}
    }
    show_all(rtrn=false)  {
        let s = _iter_all(this)
        if(rtrn) {return(s)} else {console.log(s)}
    }
    ////
    get tags_() {
        let sdfs = this.$sdfs_;
        let tags = sdfs.map(nd=>nd.tag);
        return(tags)
    }
    get attrs_() {
        let sdfs = this.$sdfs_;
        let attrs = sdfs.map(nd=>Object.assign({},nd.attribs));
        attrs.forEach(nd=>{delete nd._text});
        return(attrs)
    }
    get texts_() {
        let sdfs = this.$sdfs_;
        let texts = sdfs.map(nd=>nd.attribs._text);
        return(texts)
    }
    get types_() {
        let sdfs = this.$sdfs_;
        let typs = sdfs.map(nd=>nd.type);
        return(typs)
    }
    ////
    tag_filter(s) {
        let sdfs = this.$sdfs_;
        sdfs = sdfs.filter(nd=>{
            let tag = nd.tag;
            return(_match(tag,s,true))
        });
        return(sdfs)
    }
    attr_filter(k,v) {
        let sdfs = this.$sdfs_;
        sdfs = sdfs.filter(nd=>{
            let attrs = Object.assign({},nd.attribs);
            let flag = false;
            for(let key in attrs) {
                if(key !=='_text') {
                    if(_match(key,k,true) && _match(attrs[key],v,true)) {
                        flag=true;break;
                    } else{}
                } else {}
            }
            return(flag)
        });
        return(sdfs)
    }
    text_filter(txt) {
        let sdfs = this.$sdfs_;
        sdfs = sdfs.filter(nd=>{
            let flag = false;
            if(nd.type==='text') {
                return(_match(nd._text,txt,true))
            } else {}
            return(flag)
        });
        return(sdfs)
    }
    ////
    get tpl_() {return(this.$plances_.map(r=>r.tag))}
    get tpls_(){
        let sdfs = this.$sdfs_;
        return(sdfs.map(r=>r.tpl_))
    }
    ////
    start_with_path_filter(...args) {
        let sdfs = this.$sdfs_;
        let depth = nd.$depth_;
        sdfs = sdfs.filter(
            nd=>ary_clu.start_with(nd.tpl_.slice(depth+1),args,true)
        );
        return(sdfs)
    }
    end_with_path_filter(...args) {
        let sdfs = this.$sdfs_;
        sdfs = sdfs.filter(
            nd=>ary_clu.end_with(nd.tpl_,args,true)
        );
        return(sdfs)
    }
    strict_path_filter(...args) {
        let sdfs = this.$sdfs_;
        sdfs = sdfs.filter(
            nd=>ary_clu.strict_include(nd.tpl_,args,true)
        );
        return(sdfs)
    }
    loose_path_filter(...args) {
        let sdfs = this.$sdfs_;
        sdfs = sdfs.filter(
            nd=>ary_clu.loose_include(nd.tpl_,args,true)
        );
        return(sdfs)
    }
    ////
    filter(f) {
        let sdfs = this.$sdfs_;
        sdfs = sdfs.filter(nd=>f(nd));
        return(sdfs)
    }
    ////
    match_filter(...conds) {
        let sdfs = this.$sdfs_;
        sdfs = sdfs.filter(nd=>_inclusive_ances_match(nd,this,...conds));
        return(sdfs)
    }
    ////
    list_attrs(match_tag) {
        let sdfs = this.$sdfs_;
        let nds = sdfs.filter(r=>r.tag===match_tag);
        let attrs = nds.map(r=>r.attribs);
        let ks = attrs.map(r=>Object.keys(r));
        ks = ks.flat();
        ks = new Set(ks);
        let vs = attrs.map(r=>Object.values(r));
        vs = vs.flat();
        vs = new Set(vs);
        return({ks,vs})
    }
    ////
    list_chtags(match_tag) {
        let sdfs = this.$sdfs_;
        let nds = sdfs.filter(r=>r.tag===match_tag);
        let chs = nds.map(r=>r.$children_);
        chs = chs.flat();
        let st=new Set(chs.map(r=>r.tag))
        return(st)
    }
    ////
    list_ptags(match_tag) {
        let sdfs = this.$sdfs_;
        let nds = sdfs.filter(r=>r.tag===match_tag);
        let ps  = nds.map(r=>r.$parent_);
        let st=new Set(ps.map(r=>r.tag));
        return(st)
    }
    ////
    list_pls(match_tag,...args) {
        let sdfs = this.$sdfs_;
        let nds = sdfs.filter(r=>r.tag===match_tag);
        let pls = nds.map(nd=>_rel_tpl(nd,this));
        pls = pls.filter(pl=>ary_clu.loose_include(pl,args))
        let st = _get_tpl_set(pls);
        return(st)
    }
    ////
    list_strict_incld_pls(match_tag,...args) {
        let sdfs = this.$sdfs_;
        let nds = sdfs.filter(r=>r.tag===match_tag);
        let pls = nds.map(nd=>_rel_tpl(nd,this));
        pls = pls.filter(pl=>ary_clu.strict_include(pl,args))
        let st = _get_tpl_set(pls);
        return(st)
    }
    ////
    list_texts(match_tag) {
        let sdfs = this.$sdfs_;
        let nds = sdfs.filter(r=>r.tag===match_tag);
        let texts = nds.map(r=>r.show_text(true));
        return(new Set(texts))
    }
    ////
    get forms_()      {return(this.tag_filter("form"))}
    get form_jsons_() {return(this.forms_.map(r=>form_to_json(r)))}
    ////
    get as_()         {return(this.tag_filter("a"))}
    get ahrefs_()     {return(this.as_.map(r=>r.attribs.href))}
    ////
    get scripts_()         {return(this.tag_filter("script"))}
    get async_scripts_()   {return(this.scripts_.filter(r=>r.attribs.hasOwnProperty("async")))}
    get defer_scripts_()   {return(this.scripts_.filter(r=>r.attribs.hasOwnProperty("defer")))}
    get block_scripts_()   {return(this.scripts_.filter(r=>!r.attribs.hasOwnProperty("defer")&&r.attribs.hasOwnProperty("async")))}
    get script_srcs_()     {return(this.scripts_.map(r=>r.attribs.src).filter(r=>r!==undefined))}
    get script_texts_()    {return(this.scripts_.map(r=>r.show_text(true).trim()).filter(r=>r!==''))}
    get script_jsons_()    {
        let arr = this.scripts_;
        arr = arr.map(
            r=> ({
                _text:r.show_text(true),
                src:r.attribs.src,
                defer:r.attribs.defer,
                async:r.attribs.async,
                charset:r.attribs.charset,
                type:r.attribs.type
            })
        );
        return(arr)
    }
    ////
    get links_()            {return(this.tag_filter("link"))}
    get link_hrefs_()       {return(this.links_.map(r=>r.attribs.href).filter(r=>r!==undefined))}
    get css_links_()        {return(this.links_.filter(r=>r.attribs.type==='text/css' || r.attribs.rel==='stylesheet'))}
    get link_jsons_()    {
        let arr = this.links_;
        arr = arr.map(
            r=> ({
                src:r.attribs.src,
                href:r.attribs.href,
                hreflang:r.attribs.hreflang,
                media:r.attribs.media,
                rel:r.attribs.rel,
                sizes:r.attribs.sizes,
                type:r.attribs.type
            })
        );
        return(arr)
    }
    ////
    get styles_()           {return(this.tag_filter("style"))}
    get style_texts_()      {return(this.styles_.map(r=>r.show_text(true).trim()))}
    ////
    get metas_()             {return(this.tag_filter("meta"))}
    get http_equivs_()       {
        let arr = this.metas_;
        arr = arr.filter(r=>r.attribs.hasOwnProperty("http-equiv"));
        let d = {}
        arr.forEach(r=>{d[r.attribs["http-equiv"]]=r.attribs.content});
        return(d)
    }
    ////
    get selects_()          {return(this.tag_filter("select"))}
    get slct_jsons_()       {
        let arr = this.selects_;
        arr = arr.map(
            r=> {
                let d = Object.assign({},r.attribs);
                let opts = r.$children_.filter(r=>r.tag==='option').map(r=>{
                    let d = Object.assign({},r.attribs);
                    d._text = r.show_text(true).trim();
                    return(d)
                });
                d._options = opts;
                return(d)
            }
        );
        return(arr)
    }
    ////
    get tables_()            {return(this.tag_filter("table"))}
    get tbl_jsons_()         {
        let arr = this.tables_;
        return(arr.map(tbl=>table_to_json(tbl))) 
    }

}


function _creat_parser(parent) {
    let parser = new htmlparser2.Parser(
        {
            onopentag(tag, attribs) {
                let nd = parent.$append_child()
                nd.tag = tag
                nd.attribs = attribs
                nd.type = 'ele'
                parent = nd
            },
            ontext(text) {
                let nd = parent.$append_child()
                nd.tag = ''
                nd.attribs = {'_text':text}
                nd.type = 'text'
                parent = nd.$parent_
            },
            onclosetag(tag) {
                parent = parent.$parent_
            }
        },
        { decodeEntities: true ,recognizeSelfClosing:true}
    );
    return(parser)
}







function _creat_attrib_kvstr(entry) {
    let k = entry[0]
    let v = entry[1]
    if(v===null) {
        return(k+'='+'null')
    } else if(v===true) {
        return(k+'='+'true')
    } else if(v===false) {
        return(k+'='+'false')
    } else if(v===undefined){
        return(k+'='+'undefined')
    } else {
        if(v.length>0){
            return(k+'="'+v+'"')
        } else {
            return(k)
        }
    }
}

function _creat_attrib_str(nd) {
    let entries = Object.entries(nd.attribs)
    entries = entries.map(entry=>_creat_attrib_kvstr(entry))
    return(entries.join(' '))
}


function _creat_stag(nd) {
    if(nd.type==='root') {return('<@root@>')}
    let depth=nd.$depth_;
    let indent= (depth>0)?'    '.repeat(depth-1):''
    if(nd.type === 'text') {
        return(indent+nd.attribs._text)
    } else {
        let s = nd.tag+' '+_creat_attrib_str(nd)
        s=s.trim()
        return(indent+'<'+s+'>')
    }
}

function _creat_etag(nd) {
    let depth=nd.$depth_
    let indent= (depth>0)?'    '.repeat(depth-1):''
    if(nd.type === 'text') {
        return('')
    } else {
        return(indent+'</'+nd.tag+'>')
    }
}


function _creat_html_str(nd) {
    let sedfs = nd.$sedfs_
    let html_str = ''
    for(let i=0;i<sedfs.length;i++) {
        let [nd,flag] = sedfs[i]
        let s =''
        if(flag==='open') {
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



function _init_rt(forest) {
    let parent = forest.node(Html);
    parent.tag = '@root@'
    parent.type = 'root'
    parent.attribs = {}
    return(parent)
}


function parse_from_str(html_str,forest,max_size=1000000) {
    forest = forest??new Forest(max_size);
    let parent = _init_rt(forest);
    let parser = _creat_parser(parent);
    parser.write(html_str);
    parser.end();
    //parent.$state = 'close';
    return([parent,forest])
}


function parse_from_file(fn,forest,max_size=1000000) {
    const fs = require("fs");
    let html_str = fs.readFileSync(fn);
    html_str = html_str.toString();
    return(parse_from_str(html_str,forest,max_size))
}




module.exports = {
    ////
    _creat_stag,
    _creat_attrib_str,
    _creat_etag,
    parse_from_str,
    parse_from_file,
    Html,
    ////
    _get_tpl_set,
    _rel_tpl,
    _rel_inclusive_ances,
    _inclusive_ances_match,
}

module.exports.text = require("./ele/text");
module.exports.var  = require("./ele/var");
module.exports.a    = require("./ele/a");
module.exports.form = require("./ele/form");

const {form_to_json} = require("./ele/form");
