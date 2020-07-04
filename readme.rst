nvhtml
------
- html search with function filter

install
-------
- npm install nvhtml

usage
-----

    ::
    
        const {Html} = require('nvhtml')
        var html_str = `<html>123<link href="/static/build/styles/subscriptions.4182fa9e89f2.css" rel="stylesheet" type="text/css" /><body kk>body</body>333</html>`
        var root = new Html(html_str)
        var html = root.$fstch()
        var sdfs = html.$sdfs()
         
        > html
        <html>
            123
            <link href="/static/build/styles/subscriptions.4182fa9e89f2.css" rel="stylesheet" type="text/css">
            </link>
            <body kk>
                body
            </body>
            333
        </html>
        >

        > var children = html.$children()
        [
              123,
              <link href="/static/build/styles/subscriptions.4182fa9e89f2.css" rel="stylesheet" type="text/css">
              </link>,
              <body kk>
                  body
              </body>,
              333
        ]
        >                

        > var link = children[1]
        undefined
        > link
            <link href="/static/build/styles/subscriptions.4182fa9e89f2.css" rel="stylesheet" type="text/css">
            </link>
        >

        > link.tag
        'link'
        > link.attribs
        {
          href: '/static/build/styles/subscriptions.4182fa9e89f2.css',
          rel: 'stylesheet',
          type: 'text/css'
        }
        > link.type
        'ele'
        >

        var body = children[2]
        > var text_node_of_body = body.$fstch()
        undefined
        > text_node_of_body
                body
        >
        > text_node_of_body.type
        'text'
        > text_node_of_body.text
        'body'        
        > text_node_of_body.$parent()
            <body kk>
                body
            </body>
        >


        > sdfs.filter(
        ...     ele=> (
        .....       Object.entries(ele.attribs).length>2
        .....   )
        ... )
        [
              <link href="/static/build/styles/subscriptions.4182fa9e89f2.css" rel="stylesheet" type="text/css">
              </link>
        ]
        >        


NODE METHODS
------------

- \$add_lsib
- \$add_rsib
- \$ances
- \$ances_count
- \$append_child
- \$append_children
- \$breadth
- \$children
- \$children_count
- \$clone
- \$count
- \$depth
- \$deses
- \$disconn
- \$dlmost_des
- \$drmost_des
- \$dump
- \$dump2file
- \$edfs
- \$edfs_next
- \$edfs_prev
- \$fsibs
- \$fstch
- \$fstsib
- \$height
- \$insert_child
- \$is_fstch
- \$is_inited
- \$is_leaf
- \$is_lonely
- \$is_lstch
- \$is_root
- \$lcin
- \$lsib
- \$lsib_of_fst_ance_having_lsib
- \$lst_lyr_deses
- \$lstch
- \$lstsib
- \$luncle
- \$lyr
- \$offset
- \$parent
- \$prepend_child
- \$psibs
- \$rcin
- \$rm_all_children
- \$rm_fstch
- \$rm_lstch
- \$rm_some_children
- \$rm_which
- \$root
- \$rsib
- \$rsib_of_fst_ance_having_rsib
- \$runcle
- \$sdfs
- \$sdfs2mat
- \$sdfs_next
- \$sdfs_prev
- \$sdfs_repr
- \$sedfs
- \$sedfs_next
- \$sedfs_prev
- \$sedfs_repr
- \$sibs
- \$sibs_count
- \$sibseq
- \$some_ances
- \$some_children
- \$some_lyrs_deses
- \$some_sibs
- \$which_ance
- \$which_child
- \$which_lyr_deses
- \$which_sib
- \$width


TREE EXTRA METHODS
==================


APIS
====

    ::
        

