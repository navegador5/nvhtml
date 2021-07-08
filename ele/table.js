
function table_to_json(tbl) {
    let d = {_tbl:[]}
    let children = tbl.$children_;
    let captions = children.filter(r=>r.tag==='caption');
    d._caption = captions.length>0?captions[captions.length-1].show_text(true):'';
    ////
    children = children.filter(r=>r.tag!=='caption');
    ////
    let trs = children.map(r=>r.$children_.filter(r=>r.tag==='tr')).flat();
    let theads = trs.filter(r=>r.$parent_.tag==='thead');
    let tbodys = trs.filter(r=>r.$parent_.tag==='tbody' || r.$parent_.tag==='table');
    let tfoots = trs.filter(r=>r.$parent_.tag==='tfoot');
    let arr = [].concat(theads,tbodys,tfoots);
    arr = arr.map(
        tr=>{
            let row = tr.$children_.filter(r=>r.tag==="th"||r.tag==="td")
            row = row.map(r=>{
                let d = Object.assign({},r.attribs);
                d._text = r.show_text(true);
                return(d)
            });
            return(row)
        }
    );
    d._tbl = arr;
    return(d)
}


module.exports = {
    table_to_json
}
