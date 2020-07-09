const {Html} = require('nvhtml')
const fs = require("fs");
function rfile(fn) {
    let txt = fs.readFileSync(fn);
    return(txt)
}


var rt_txt = rfile('tst.html')
var rt = new Html(html_txt)



function slct_eles_with_id(rt){
    let sdfs = rt.$sdfs()
    let slcted = sdfs.filter(ele=>ele.attribs.id!==undefined)
    return(slcted)
}

function slct_eles_without_id(rt){
    let sdfs = rt.$sdfs()
    let slcted = sdfs.filter(ele=>ele.attribs.id===undefined)
    return(slcted)
}

function slct_all_ids(rt) {
    let sdfs = rt.$sdfs()
    let slcted = sdfs.filter(ele=>ele.attribs.id!==undefined)
    return(slcted.map(r=>r.attribs.id))
}

function slct_via_id_when_strict_matching(rt,id){
    let sdfs = rt.$sdfs()
    let slcted = sdfs.filter(ele=>ele.attribs.id===id)
    return(slcted)
}

var eles = slct_via_id_when_strict_matching(rt,'readme')
var eles_with_id = slct_when_id_exist(rt)
var eles_without_id = slct_when_id_exist(rt)
var all_ids = slct_all_ids(rt)

function slct_all_clses(rt) {
    let sdfs = rt.$sdfs()
    let slcted = sdfs.filter(ele=>ele.attribs.class!==undefined)
    return(slcted.map(r=>r.attribs.class))
}

var all_clses = slct_all_clses(rt)

function slct_all_tags(rt) {
    let sdfs = rt.$sdfs()
    let slcted = sdfs.filter(ele=>ele.tag)
    return(slcted.map(r=>r.tag))
}

var all_tags = slct_all_tags(rt)


function slct_all_imgs(rt) {
    let sdfs = rt.$sdfs()
    let slcted = sdfs.filter(ele=>ele.tag ==='img')
    return(slcted)
}

function slct_all_img_srcs(rt) {
    let sdfs = rt.$sdfs()
    let slcted = sdfs.filter(ele=>(ele.tag ==='img' && ele.attribs.src))
    return(slcted.map(r=>r.attribs.src))
}

var all_imgs = slct_all_imgs(rt)
var all_img_srcs = slct_all_img_srcs(rt)

function slct_all_as(rt) {
    let sdfs = rt.$sdfs()
    let slcted = sdfs.filter(ele=>ele.tag ==='a')
    return(slcted)
}

function slct_all_a_hrefs(rt) {
    let sdfs = rt.$sdfs()
    let slcted = sdfs.filter(ele=>(ele.tag ==='a' && ele.attribs.href))
    return(slcted.map(r=>r.attribs.href))
}

var all_as = slct_all_as(rt)
var all_a_hrefs = slct_all_a_hrefs(rt)

function slct_all_scripts(rt) {
    let sdfs = rt.$sdfs()
    let slcted = sdfs.filter(ele=>ele.tag ==='script')
    return(slcted)
}

function slct_all_script_srcs(rt) {
    let sdfs = rt.$sdfs()
    let slcted = sdfs.filter(ele=>(ele.tag ==='script' && ele.attribs.src))
    return(slcted.map(r=>r.attribs.src))
}

function slct_all_script_data_srcs(rt) {
    let sdfs = rt.$sdfs()
    let slcted = sdfs.filter(ele=>(ele.tag ==='script' && ele.attribs['data-src']))
    return(slcted.map(r=>r.attribs['data-src']))
}

function slct_all_script_texts(rt) {
    let sdfs = rt.$sdfs()
    let slcted = sdfs.filter(ele=>(ele.tag ==='script' && ele.text && ele.text.trim()))
    return(slcted.map(r=>r.text))
}

var all_scripts = slct_all_scripts(rt)
var all_script_srcs = slct_all_script_srcs(rt)
var all_script_data_srcs = slct_all_script_data_srcs(rt)
var all_script_texts = slct_all_script_texts(rt)


function slct_all_links(rt) {
    let sdfs = rt.$sdfs()
    let slcted = sdfs.filter(ele=>ele.tag ==='link')
    return(slcted)
}

function slct_all_stylesheet_links(rt) {
    let sdfs = rt.$sdfs()
    let slcted = sdfs.filter(ele=>(ele.tag ==='link' && ele.attribs.rel==='stylesheet' ))
    return(slcted)
}

function slct_all_stylesheet_link_hrefs(rt) {
    let sdfs = rt.$sdfs()
    let slcted = sdfs.filter(ele=>(ele.tag ==='link' && ele.attribs.rel==='stylesheet' ))
    return(slcted.map(r=>r.attribs.href))
}

var all_links = slct_all_links(rt)
var all_stylesheet_links = slct_all_stylesheet_links(rt)
var all_stylesheet_link_hrefs = slct_all_stylesheet_link_hrefs(rt)




