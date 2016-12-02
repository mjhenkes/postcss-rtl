const rtlcss = require( 'rtlcss' )
const { isSelectorHasDir, addDirToSelectors } = require( './selectors' )

const isRuleAlreadyProcessed = rule =>
    !!rule.selector.match( /\[dir(=".+")?\]/ )

const getDirRule = ( rule, dir, addPrefixToSelector ) => {
    const next = rule.next()
    let selector = rule.selector

    selector = isSelectorHasDir( selector ) ? selector : addDirToSelectors( selector, dir, addPrefixToSelector )

    if ( rule.selector === selector ) {
        return rule
    } else if ( next && next.selector === selector ) {
        return next
    } else {
        return rule.cloneAfter( { selector } ).removeAll()
    }
}

const setRuleDir = ( rule, dir, addPrefixToSelector )=> {
    const { selector } = rule
    rule.selector = isSelectorHasDir( selector ) ? selector : addDirToSelectors( selector, dir, addPrefixToSelector )
}

const rtlifyRule = rule => {
    const rtlResult = rtlcss.process( rule, null, null )

    return ( rtlResult !== rule.toString() ) ? rtlResult : false
}

const processSrcRule = rule => {
    if ( rule.nodes.length === 0 ) {
        rule.remove()
    } else {
        setRuleDir( rule )
    }
}

module.exports = {
    isRuleAlreadyProcessed,
    getDirRule,
    setRuleDir,
    rtlifyRule,
    processSrcRule
}
