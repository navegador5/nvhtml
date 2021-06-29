const {Html} = require('../nvhtml')
const fs = require("fs");
function rfile(fn) {
    let txt = fs.readFileSync(fn);
    return(txt)
}

var html_txt = rfile('./html').toString()
var html = new Html(html_txt)
var sdfs = html.$sdfs()
sdfs = sdfs.filter(ele=>ele.attribs.class==="element" && ele.tag==="dl")

function dcd_one(x) {
    let ary = x.$children()
    let d = {}
    let k = ""
    let v = []
    let tag = ary[0].$children()[0].attribs.id.split(':')[0].replace("the-","").replace("-element","");
    for(let r of ary) {
        if(r.tag === "dt") {
            if(k!=="") { d[k] = v;}
            k = r.$children()[0].attribs.id.split(':')[1];
            k = k.replace("concept-element-","")
            v = []
        } else {
            v.push(r)
            /*
            let des = r.$sdfs().filter(r=>r.type==='text')
            let s = des.map(r=>r.text).join("$")
            v = v + "@" + s
            */
        }
    }
    return([tag,d])
}

entries = sdfs.map(r=>dcd_one(r))

var d = Object.fromEntries(entries)

for(let k in d) {
    let v = d[k];
    for(let k in v) {
        if(k!=="attributes") {
            let s = []
            for(let r of v[k]) {
                let des = r.$sdfs().filter(r=>r.type==='text');
                let txt = des.map(r=>r.text).join(" ");
                s.push(txt)
            }
            v[k] = s
        }
    }
}

delete d['customs-core-concepts']

for(let k in d) {
    let v = d[k];
    for(let k in v) {
        if(k==="attributes") {
            let s = []
            for(let r of v[k]) {
                let des = r.$sdfs().filter(r=>r.tag==='a');
                des = des.filter(r=>r.attribs.href.includes("attr-")||r.attribs.href.includes("#global-attributes"))
                let ns = des.map(r=>r.attribs.href)
                ns = ns.map(r=>r.replace("-attributes",""))
                ns = ns.map(r=>r.split("-"))
                ns = ns.map(r=>r.slice(2).join("-"))
                s = s.concat(ns)
            }
            v[k] = s
        }
    }
}

var e2 = Object.entries(d)
e2 = e2.map(e=>[e[0],e[1].attributes])
e2 = e2.map(e=>[e[0],e[1].filter(r=>r.length>0)])

var dd = Object.fromEntries(e2)
delete dd['h1,-h2,-h3,-h4,-h5,-and-h6s']
dd.h1 = []
dd.h2 = []
dd.h3 = []
dd.h4 = []
dd.h5 = []
dd.h6 = []

delete dd['sub-and-sups']
dd['sub'] = [ ]
dd['sup'] =  []
var x = e2.map(r=>r[1])
x = x.flat()





