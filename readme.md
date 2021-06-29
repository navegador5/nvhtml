nvhtml
======

-   html search with function filter

install
=======

-   npm install nvhtml

usage
=====
    
    const {parse_from_file} = require('nvhtml');

example
---------

    var [rt,forest] = parse_from_file("./RAW/index.html")
    var sdfs = rt.$sdfs_;

    var prods = sdfs.filter(r=>r.tag==='emu-production')
    var nd = prods[0]


### show

            > nd.show_tag()
            emu-production
                emu-nt
                    a
                emu-geq
                emu-rhs
                    emu-t
                    emu-t
                    emu-nt
                        a
                    emu-t
                    emu-nt
                        a
            
            
            > nd.show_attr()
            emu-production
                -name WhileStatement
                -id prod-grammar-notation-WhileStatement
                emu-nt
                    a
                        -href #prod-grammar-notation-WhileStatement
                emu-geq
                emu-rhs
                    -a 92j78-b5
                    emu-t
                    emu-t
                    emu-nt
                        -id _ref_11974
                        a
                            -href #prod-Expression
                    emu-t
                    emu-nt
                        -id _ref_11975
                        a
                            -href #prod-Statement
            
            > nd.show_text()
                     WhileStatement
                  :
                     while
                     (
                        Expression
                     )
                        Statement
            
            
            
            > nd.show_all()
            
            emu-production
                -name WhileStatement
                -id prod-grammar-notation-WhileStatement
                emu-nt
                    a
                        -href #prod-grammar-notation-WhileStatement
                        _text `WhileStatement`
                emu-geq
                    _text `:`
                emu-rhs
                    -a 92j78-b5
                    emu-t
                        _text `while`
                    emu-t
                        _text `(`
                    emu-nt
                        -id _ref_11974
                        a
                            -href #prod-Expression
                            _text `Expression`
                    emu-t
                        _text `)`
                    emu-nt
                        -id _ref_11975
                        a
                            -href #prod-Statement
                            _text `Statement`
            
            
            > nd.show_html()
            
            <emu-production name="WhileStatement" id="prod-grammar-notation-WhileStatement">
                <emu-nt>
                    <a href="#prod-grammar-notation-WhileStatement">
                        WhileStatement
                    </a>
                </emu-nt>
                <emu-geq>
                    :
                </emu-geq>
                <emu-rhs a="92j78-b5">
                    <emu-t>
                        while
                    </emu-t>
                    <emu-t>
                        (
                    </emu-t>
                    <emu-nt id="_ref_11974">
                        <a href="#prod-Expression">
                            Expression
                        </a>
                    </emu-nt>
                    <emu-t>
                        )
                    </emu-t>
                    <emu-nt id="_ref_11975">
                        <a href="#prod-Statement">
                            Statement
                        </a>
                    </emu-nt>
                </emu-rhs>
            </emu-production>
            undefined
            >



### filter

    nd.tag_filter(/emu/).map(r=>r.tag)
    nd.tag_filter("emu-production")
    nd.tag_filter((tag)=>tag.includes('-t')||tag.includes('-nt'))

    nd.attr_filter(/ref/,/#/)

    nd.start_with_path_filter('emu-rhs','emu-nt')
    nd.end_with_path_filter('emu-nt','a')

    nd.strict_path_filter('emu-nt','a')


    nd.tpl_
    nd.tpls_


    nd.tags_
    nd.attrs_
    nd.texts_
    nd.types_

