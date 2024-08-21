import { mediaQueryDict, viewportBreakpoints, pseudoClassesDict, pseudoElementsArray, ariaAttributesDict } from './dictionaries.js'
import * as util from './utilities.js'

export function parseSelectors(cssObject) {
    const parsedSelectors = {}   
    Object.keys(cssObject).forEach(key => {
      parsedSelectors[key] = calculateSelectorPrefixes(key)
      // console.log(`parsed selector: [${parsedSelectors[key]}]`)
    })
    let rerun = true
    // while (rerun) {

    // }
    Object.keys(parsedSelectors).forEach(key => {
      let selector = parsedSelectors[key][0]
      let prefix = parsedSelectors[key][1]
      const pseudoMatch = selector.match(/:{1,2}[a-zA-Z-]+(?:\s*>\s*\*)?$/)
      const attributeMatch = selector.match(/(\[.*?\])$/)
      // console.log(pseudoMatch, attributeMatch) 
      if (pseudoMatch != null) {
        console.log(selector, pseudoMatch[0])
        prefix = `${pseudoMatch[0]} ${prefix}`
        selector = selector.replace(pseudoMatch[0], "").trim()
      }
    
    
      if (attributeMatch != null) {
        prefix += `${attributeMatch[0]} ${prefix}`
        selector = selector.replace(attributeMatch[0], "").trim()
      }
    
      if (selector.includes("> *")) {
        prefix += `* ${prefix}`
        selector = selector.replace("> *", "").trim()
      }
    
      prefix = prefix.replace("> *", '*').trim()
      console.log("Selector: ", selector, "Prefix: ", prefix)
      parsedSelectors[key] = [selector, prefix]
    })
    return parsedSelectors
}

export function combineSelectorPrefixes(json, prefixes) {
  Object.keys(json).forEach(key => {
      // console.log(key)
      if (prefixes[key][1] != "") {
        const prefix = computePrefixes(prefixes[key][1])
        const selector = prefixes[key][0]
        const classes = json[key]
        classes.forEach((item, index) => {
          // console.log(prefix, item)
          classes[index] = prefix + item
        })

        if (json[selector] == undefined) {
          json[selector] = classes
        } else {
          json[selector].push(...classes)
        }
        // console.log("selector: ", `(${selector})`, "\nclasses: ", json[selector])
        delete json[key]
      }
  })

  return json
}

function calculateSelectorPrefixes(key) {
  function formatKeyToSelector(selector) {
    selector = selector.trim().replace(": ", ":")
    const unsupportedKeywords = ['not', 'or']
    unsupportedKeywords.forEach(keyword => {
      // if(selector.includes(`${keyword} `)) createAlert(`The keyword ${keyword}  is not supported yet`, 1)
    })
    const matches = selector.match(/\(.*?\)/g)
    if (matches) {
      matches.forEach(match => {
        selector = selector.replace(match, match.replace(/\s/g, ""))
      })
    }
    return selector
  }

  let selector = formatKeyToSelector(key)
  // console.log(key, selector)
  // find all the substrings of selector that are inside parentheses, and replace all the spaces in them with nothing
  

  let prefix = ""
  
  const atRuleMatch = selector.match(/(@media|@supports)/)
  // \s*\(.*?\)\s+(.*)$
  const pseudoMatch = selector.match(/:{1,2}[a-zA-Z-]+(?:\s*>\s*\*)?$/)
  const attributeMatch = selector.match(/(\[.*?\])$/)
  const pseudoFunctionMatch = selector.match(/:{1,2}[a-zA-Z-]+(\([^)]*\))?$/)

  // console.log(pseudoMatch)
  if (atRuleMatch) {
    const selectorMatch = selector.match(/(\(.*?\)|\s?(print|@media|@supports|and|not|or|all|screen|only|,)\s?)/)[1]
    ///(?:\([^)]*\)|\b(?:and|not|only|or|all|print|screen)\b|\s)+([\w\s.-]+)
    prefix += atRuleMatch[1] + selector.match(/(\(.*?\)|print)/g).join(',')
    selector = selector.replace(selectorMatch, "").replace(/\(.*\)/, "").replace(/print|@media|@supports|and|not|or|all|screen|only|,/, "").trim()
  }


  if (pseudoMatch) {
    prefix += (prefix ? " " : "") + pseudoMatch[0]
    selector = selector.replace(pseudoMatch[0], "").trim()
  }


  if (attributeMatch) {
    prefix += (prefix ? " " : "") + attributeMatch[0]
    selector = selector.replace(attributeMatch[0], "").trim()
  }

  if (selector.includes("> *")) {
    prefix += "*"
    selector = selector.replace("> *", "").trim()
  }

  prefix = prefix.replace("> *", '*').trim()
  return [selector, prefix]
}

function computePrefixes(prefixes) {
  let returnPrefixes = ''
  const splitPrefixes = prefixes.split(' ')
  // console.log(splitPrefixes)
  splitPrefixes.forEach(prefix => {
    returnPrefixes += computePrefix(prefix)
  })
  return returnPrefixes
}

function computePrefix(prefix) {
  let returnPrefix = ''
  if (prefix.includes('*')) {
    returnPrefix += '*:'
    prefix = prefix.replace('*', '').trim()
  }
  if (prefix.includes('@media')) {
    prefix = prefix.replace('@media', '').replace('(', '').replace(')', '').trim()
    const mediaQueries = prefix.split(',').map(query => query.trim())
    let returnQueryPrefixes = ''
    mediaQueries.forEach(query => {
      let [queryPrefix, value] = query.replace('(', '').replace(')', '').trim().split(':').map(item => item.trim())
      if (mediaQueryDict.hasOwnProperty(queryPrefix)) {
        returnQueryPrefixes += `${mediaQueryDict[queryPrefix]}`
      }
      if (value != undefined) {
        value = value.replace('(', '').replace(')', '').trim()
        if(viewportBreakpoints.hasOwnProperty(value)) {
          returnQueryPrefixes += `${viewportBreakpoints[value]}`
        } else if (util.numberRegex.test(value)) {
          // console.log(prefix, value)
          if(prefix.includes('min')) returnQueryPrefixes += `max-[${value}]`
          else returnQueryPrefixes += `[${value}]`
        } else {
          returnQueryPrefixes += `${value}`
        }
        returnQueryPrefixes = returnQueryPrefixes.replace(' ', '') 

        // The onl edge case where the css prop-value does not match the tailwind prefix
        if (returnQueryPrefixes.includes('no-preference')) returnQueryPrefixes = returnQueryPrefixes.replace('no-preference', 'safe')
        returnQueryPrefixes += ':'
      }
    })
    returnPrefix += `${returnQueryPrefixes}`
  } else if (prefix.includes('@supports')) {
    // console.log(prefix)
    prefix = prefix.replace('@supports', '').replace('(', '').replace(')', '').trim()
    const supportQueries = prefix.split(',').map(query => query.replace('(', '').replace(')', '').trim())
    let returnSupportPrefixes = ''
    supportQueries.forEach(query => {
      const [queryPrefix, value] = query.split(':').map(item => item.trim())
      returnSupportPrefixes += `supports-[${queryPrefix}:${value}]:`
    })
    returnPrefix += `${returnSupportPrefixes}`
  }
  else if (prefix.includes("::")) {
    prefix = prefix.replace('::', '')
    if (pseudoElementsArray.includes(prefix)) returnPrefix += `${prefix}:`
    else returnPrefix += `![&::${prefix.replace(' ', '_')}]:`
  } else if (prefix.includes(":")) {
    prefix = prefix.replace(':', '')
    if (pseudoClassesDict.hasOwnProperty(prefix)) returnPrefix += `${pseudoClassesDict[prefix]}:`
    else returnPrefix += `![&:${prefix.replace(' ', '_')}]:`
  }
  
  if (prefix.includes("[")) {
    prefix = prefix.replace('[', '').replace(']', '')

    if (prefix.includes('aria')) {
      let returnAriaPrefix = 'aria-'

      if (ariaAttributesDict.hasOwnProperty(prefix.split("=")[0].trim()) && prefix.includes('true')) returnAriaPrefix += `${ariaAttributesDict[prefix.split("=")[0].replace(/"/g, '').trim()]}:` 
      else returnAriaPrefix += `[${prefix.split('-')[1].replace(/"/g, '').trim()}]:`

      returnPrefix += returnAriaPrefix
    }
    if (prefix.includes('dir')) returnPrefix += `${prefix.replace('dir="', '').replace('"', '')}:`
    if (prefix.includes('open')) returnPrefix += 'open:'
    if (prefix.includes('data')) returnPrefix += `[${prefix.split('-')[1].replace(/"/g, '').trim()}]:`
    
  }
  // console.log(returnPrefix)
  return returnPrefix
}