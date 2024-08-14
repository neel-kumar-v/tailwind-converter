import { mediaQueryDict, viewportBreakpoints, pseudoClassesDict, pseudoElementsArray, ariaAttributesDict } from './dictionaries.js'
export function parseSelectors(cssObject) {
    const parsedSelectors = {};

    function formatKeyToSelector(selector) {
      selector = selector.trim().replace(": ", ":");
      const unsupportedKeywords = ['not', 'or']
      unsupportedKeywords.forEach(keyword => {
        // if(selector.includes(`${keyword} `)) createAlert(`The keyword ${keyword}  is not supported yet`, 1)
      })
      const matches = selector.match(/\(.*?\)/g);
      if (matches) {
        matches.forEach(match => {
          selector = selector.replace(match, match.replace(/\s/g, ""));
        });
      }
      return selector
    }

    Object.keys(cssObject).forEach(key => {
      let selector = formatKeyToSelector(key);
      // find all the substrings of selector that are inside parentheses, and replace all the spaces in them with nothing
      

      let prefix = "";
      
      const atRuleMatch = selector.match(/^(@media|@supports)/);
      // \s*\(.*?\)\s+(.*)$
      const pseudoMatch = selector.match(/:{1,2}[a-zA-Z-]+(?:\s*>\s*\*)?$/);
      const attributeMatch = selector.match(/(\[.*?\])$/);
      const pseudoFunctionMatch = selector.match(/:{1,2}[a-zA-Z-]+(\([^)]*\))?$/)

      // console.log(pseudoMatch)
      if (atRuleMatch) {
        const selectorMatch = selector.match(/(?:\([^)]*\)|\b(?:and|not|only|or|all|print|screen)\b|\s)+([\w\s.]+)/)
        prefix = atRuleMatch[1] + selector.match(/(\(.*?\)|print)/g).join(',');
        selector = selectorMatch[1].trim();
        // console.log([selector, prefix])
      }


      if (pseudoMatch) {
        prefix += (prefix ? " " : "") + pseudoMatch[0];
        selector = selector.replace(pseudoMatch[0], "").trim();
      }


      if (attributeMatch) {
        prefix += (prefix ? " " : "") + attributeMatch[0];
        selector = selector.replace(attributeMatch[0], "").trim();
      }

      if (selector.includes("> *")) {
        prefix += "*";
        selector = selector.replace("> *", "").trim();
      }

      prefix = prefix.replace("> *", '*').trim()


      parsedSelectors[key] = [selector, prefix];
      // console.log(`parsed selector: [${parsedSelectors[key]}]`)
    });

    return parsedSelectors;
}

export function combineSelectorPrefixes(json, prefixes) {
  Object.keys(json).forEach(key => {
      // console.log(key)
      if (prefixes[key][1] != "") {
        const prefix = computePrefixes(prefixes[key][1]);
        const selector = prefixes[key][0];
        const classes = json[key];
        classes.forEach((item, index) => {
          classes[index] = prefix + item;
        })

        if (json[selector] == undefined) {
          json[selector] = classes;
        } else {
          json[selector].push(...classes);
        }
        // console.log("selector: ", `(${selector})`, "\nclasses: ", json[selector])
        delete json[key];
      }
  });

  return json;
}

function computePrefixes(prefixes) {
  let returnPrefixes = ''
  const splitPrefixes = prefixes.split(' ')

  splitPrefixes.forEach(prefix => {
    returnPrefixes += computePrefix(prefix)
  })
  return returnPrefixes
}

function computePrefix(prefix) {
  let returnPrefix = ''
  if (prefix.includes('*')) {
    returnPrefix += '*:'
    prefix = prefix.replace('*', '').trim();
  }
  if (prefix.includes('@media')) {
    prefix = prefix.replace('@media', '').replace('(', '').replace(')', '').trim()
    const mediaQueries = prefix.split(',').map(query => query.trim())
    let returnQueryPrefixes = ''
    mediaQueries.forEach(query => {
      const [queryPrefix, value] = query.split(':').map(item => item.trim())
      if (mediaQueryDict.hasOwnProperty(queryPrefix)) {
        returnQueryPrefixes += `${mediaQueryDict[queryPrefix]}`
      }
      if (value != undefined) {
        if(viewportBreakpoints.hasOwnProperty(value)) {
          returnQueryPrefixes += `${viewportBreakpoints[value]}`
        } else if (numberRegex.test(value)) {
          // console.log(prefix, value)
          if(prefix.includes('min')) returnQueryPrefixes += `min-w-[${value}]`
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
    else returnPrefix += `![&::${prefix}]:`
  } else if (prefix.includes(":")) {
    prefix = prefix.replace(':', '')
    if (pseudoClassesDict.hasOwnProperty(prefix)) returnPrefix += `${pseudoClassesDict[prefix]}:`
    else returnPrefix += `![&:${prefix}]:`
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