import './style.css'
import { shorthandDict, unitDict, borderRadiusUnitDict, blurUnitDict, letterSpacingUnitDict, fontWeightUnitDict, singleValueDict, propertylessDict, borderRadiusDict, cssAtRules, mediaQueryDict, viewportBreakpoints } from './dictionaries'
import * as util from './utilities'
import { inject } from '@vercel/analytics'
import { createAlert } from "./alerts"
import { createNotification } from "./notification"
import { tokenize } from './tokenize'
import { displayOutputWithSelectors } from './display'

inject() // 


const cssButton = document.getElementById('copycss')
const tailwindButton = document.getElementById('copytailwind')
const input = document.getElementById('input')

const numberRegex = /\d/
const zeroRegex = /0[a-zA-Z]*/
  
cssButton.addEventListener('click', () => {
  util.copy(inputEditor.getValue())
})

tailwindButton.addEventListener('click', () => {
  if (outputTailwind == '') {
    createNotification('Nothing was copied')
  }
  util.copy('all TailwindCSS directives', `${outputTailwind}`)
})

var inputEditor = CodeMirror.fromTextArea(input, {
  lineNumbers: true,
  mode: "css", 
  theme: "material-darker",
  lint: false,
  allowDropFileTypes: ['text/css'],
  lineWrapping: true,
  scrollbarStyle: "null",
  placeholder: 'Paste your CSS here',
})
let outputTailwind = ''
let outputTailwindJSON = ''
inputEditor.on('change', () => {
  const css = inputEditor.getValue()

  const cssJSON = tokenize(css)
  // console.log(cssJSON)
  outputTailwindJSON = formatTailwindArrayToDict(convertCSSJSONToTailwind(cssJSON))
  console.log(outputTailwindJSON)
  console.log(parseSelectors(outputTailwindJSON));
  displayOutputWithSelectors(outputTailwindJSON)
})
function parseSelectors(cssObject) {
    const parsedSelectors = {};

    Object.keys(cssObject).forEach(key => {
        let selector = key.trim();
        let prefix = "";

        // Check for @media and @supports rules
        const atRuleMatch = selector.match(/^(@media|@supports)\s*\(.*?\)\s+(.*)$/);
        if (atRuleMatch) {
            prefix = atRuleMatch[1] + selector.match(/\(.*?\)/)[0];
            selector = atRuleMatch[2].trim();
        }

        // Check for pseudo-elements (::) and pseudo-classes (:), remove them from selector
        const pseudoMatch = selector.match(/(:{1,2}[a-zA-Z-]+)$/);
        if (pseudoMatch) {
            prefix += (prefix ? " " : "") + pseudoMatch[0];
            selector = selector.replace(pseudoMatch[0], "").trim();
        }

        // Check for any attribute selectors in []
        const attributeMatch = selector.match(/(\[.*?\])$/);
        if (attributeMatch) {
            prefix += (prefix ? " " : "") + attributeMatch[0];
            selector = selector.replace(attributeMatch[0], "").trim();
        }

        // Add the parsed result to the new object
        parsedSelectors[key] = [selector, prefix];
    });

    return parsedSelectors;
}





function formatTailwindArrayToDict(tailwindArray) {
  let tailwindDict = {}
  tailwindArray.forEach((item) => {
    const [selector, classes] = Object.entries(item)[0]
    console.log(classes)
    const splitClasses = splitRules(classes)
    tailwindDict[selector] = splitClasses
  })
  // iterate over the tailwinddict 
  return tailwindDict
}

function splitRules(classes) {
  if (classes == undefined) return
  let returnArray = []
  classes.forEach((rule) => {
    if (!rule.includes(' ') || rule.includes('[')) {
      returnArray.push(rule)
      return
    }
    const rules = rule.split(' ')

    rules.forEach(rule => {
      returnArray.push(rule)
    })
  })
  return returnArray
}
 
function flattenCSSJSON(obj, prefix = '') {
  let result = [];
  
  for (const [key, value] of Object.entries(obj)) {
    let newKey;
    if (key.startsWith('&')) {
      newKey = prefix + key.slice(1);
    } else {
      newKey = prefix ? `${prefix} ${key}` : key;
    }
    
    if (typeof value === 'object' && value !== null) {
      if (Object.keys(value).some(k => typeof value[k] === 'object' && value[k] !== null)) {
        result = result.concat(flattenCSSJSON(value, newKey));
      } else {
        result.push({ [newKey]: value });
      }
    } else {
      if (result.length === 0 || Object.keys(result[result.length - 1])[0] !== prefix) {
        result.push({ [prefix]: {} });
      }
      result[result.length - 1][prefix][key] = value;
    }
  }
  
  return result;
}

function convertCSSJSONToTailwind(cssObject) {
  const flattenedCSS = cssObject.flatMap(obj => flattenCSSJSON(obj));
  
  return flattenedCSS.map(item => {
    const [selector, styles] = Object.entries(item)[0];
    const tailwindClasses = [];
    
    for (const [key, value] of Object.entries(styles)) {
      if (typeof value === 'string') {
        const tailwindRule = computeTailwindRule(key, value);
        tailwindClasses.push(tailwindRule);
      }
    }
    
    // Only return the object if it has any Tailwind classes
    return tailwindClasses.length > 0 ? { [selector]: tailwindClasses } : null;
  }).filter(item => item !== null); // Remove any null items from the result
}

function computeTailwindRule(property, value, prefixes="") {


  function formatRule(rule) {
    const returnRule = `${prefixes}${isNegative}${rule}`.trim()
    // console.log(returnRule)
    return returnRule
  }

  function formatArrayRules(rules) {
    // concat the elements of the array into a string
    return formatRule(rules.join(' '))
  }

  if(property == 'filter' || property == 'backdrop-filter') return formatArrayRules(parseFilterRule(property, value)) // Case #1: The filter and backdrop-filter properties all have many different values based on their functions

  if(property == "transform") return formatArrayRules(parseTransformRule(value)) // Case #2: The transform property has many different values based on their functions

  const unconvertedValue = value
  if (value.includes(`"`)) console.log(value)
  value = util.convertUnits(value)

  if (valueIsNegative(value)) value = util.convertUnits(value).replace('[-', '[');

  const valueIsShorthand = (value != undefined && value.split(' ') != undefined && value.split(' ') != null) && value.split(' ').length > 1  // If the value is shorthand and the property is shorthandable
  if (shorthandDict.hasOwnProperty(property) && valueIsShorthand) return formatArrayRules(convertShorthandToTailwind(property, value));

  if (singleValueDict.hasOwnProperty(property) && !valueIsShorthand) {
    if (value == '') return appendToStylesList(`${singleValueDict[property]}`)
    else return formatRule(`${singleValueDict[property]}-${value}`) // Applies to most styles: margin, padding, border-width, border-radius, etc
  }
  
  if (propertylessDict.hasOwnProperty(property)) return formatRule(convertPropertylessToTailwind(property, value)) // Applies to display, position, visibility, etc 
 

  if (borderRadiusDict.hasOwnProperty(property)) {
    value = util.translateConvertedToIrregular(borderRadiusUnitDict, value)
    return formatRule(`${borderRadiusDict[property]}-${value}`)
  }

  // if(completeProperty) return appendToStylesList(`![${property}: ${value}]`)

  let rule = parseEdgeCases(property, value, unconvertedValue)
  // console.log(rule)

  if (rule != undefined && rule.length > 0) return formatArrayRules(rule)

  
}

function parseEdgeCases(property, value, unconvertedValue) {
  let returnStyles = []
    // * EDGE CASES
  switch (property) {
    // * SINGLE VALUES WITH UNITS
    // * BORDER CORNER RADIUS
    // * STYLES THAT NEED REVERTED UNITS
    case 'text-decoration-thickness':
      if(numberRegex.test(value)) value = util.revertUnits(unitDict, value).replace('px', '')
      returnStyles.push(`decoration-${value}`)
      break;
    case 'text-underline-offset':
      if(numberRegex.test(value)) value = util.revertUnits(unitDict, value)
      returnStyles.push(`underline-offset-${value}`)
      break;
    case 'outline-width':
      if(numberRegex.test(value)) value = util.revertUnits(unitDict, value)
      returnStyles.push(`outline-${value.replace('px', '')}`)
      break;
    case 'outline-offset':
      if(numberRegex.test(value)) value = util.revertUnits(unitDict, value)
      returnStyles.push(`outline-offset-${value.replace('px', '')}`)
      break;
    case 'letter-spacing':
      value = value.replace('[', '').replace(']', '')
      returnStyles.push(`tracking-${util.irregularConvertUnits(letterSpacingUnitDict, value)}`)

    // * SHORTHANDABLE VALUES EDGE CASES
    
      break;
    case 'border-radius':
      let borderRadiuses = value.split(' ')
      returnStyles = []
      for(let i = 0; i < borderRadiuses.length; i++) {
        borderRadiuses[i] = util.translateConvertedToIrregular(borderRadiusUnitDict, borderRadiuses[i])
      }
      if (borderRadiuses.length === 1) {
        returnStyles.push(`rounded-${borderRadiuses[0]}`.replace('-/', ''))
      } else if (borderRadiuses.length === 2) {
        returnStyles.push(`rounded-tl-${borderRadiuses[0]}`.replace('-/', ''))
        returnStyles.push(`rounded-br-${borderRadiuses[0]}`.replace('-/', ''))
        returnStyles.push(`rounded-tr-${borderRadiuses[1]}`.replace('-/', ''))
        returnStyles.push(`rounded-bl-${borderRadiuses[1]}`.replace('-/', ''))
      } else if (borderRadiuses.length === 3) { 
        returnStyles.push(`rounded-tl-${borderRadiuses[0]}`.replace('-/', ''))
        returnStyles.push(`rounded-tr-${borderRadiuses[1]}`.replace('-/', ''))
        returnStyles.push(`rounded-bl-${borderRadiuses[1]}`.replace('-/', ''))
        returnStyles.push(`rounded-br-${borderRadiuses[2]}`.replace('-/', ''))
      } else if (borderRadiuses.length === 4) {
        returnStyles.push(`rounded-tl-${borderRadiuses[0]}`.replace('-/', ''))
        returnStyles.push(`rounded-tr-${borderRadiuses[1]}`.replace('-/', ''))
        returnStyles.push(`rounded-br-${borderRadiuses[2]}`.replace('-/', ''))
        returnStyles.push(`rounded-bl-${borderRadiuses[3]}`.replace('-/', ''))
      }
      returnStyles.push(returnStyles)
      break;

    case 'inset':
      const values = value.split(' ')
      returnStyles = []
      if (values.length === 1) {
        returnStyles.push(`inset-${values[0]}`)
      } else if (values.length === 2) {
        returnStyles.push(`inset-y-${values[0]}`)
        returnStyles.push(`inset-x-${values[1]}`)
      } else if (values.length === 3) {
        returnStyles.push(`top-${values[0]}`)
        returnStyles.push(`inset-x-${values[1]}`)
        returnStyles.push(`bottom-${values[2]}`)
      } else if (values.length === 4) {
        returnStyles.push(`top-${values[0]}`)
        returnStyles.push(`right-${values[1]}`)
        returnStyles.push(`bottom-${values[2]}`)
        returnStyles.push(`left-${values[3]}`)
      }
      returnStyles.push(returnStyles)
      break;

    // * NUMBER NO UNIT
    case 'order':
      if(value == '0') returnStyles.push(`order-none`)
      else returnStyles.push(`order-${value}`)
      break;
    case 'opacity':
      returnStyles.push(`opacity-${value * 100}`)
        break;
    case 'aspect-ratio':
      if(value.includes('1 / 1')) returnStyles.push(`aspect-square`)
      if(value.includes('16 / 9')) returnStyles.push(`aspect-video`)
      else returnStyles.push(`aspect-${value}`)
      break;
    case 'font-weight':
      returnStyles.push(`font-${util.irregularConvertUnits(fontWeightUnitDict, value)}`)
        break;
    case 'flex-grow':
      if(value.includes('1')) returnStyles.push(`grow`)
      else returnStyles.push(`grow-0`)
      break;
    case 'flex-shrink':
      if(value.includes('1')) returnStyles.push(`shrink`)
      else returnStyles.push(`shrink-0`)
      break;
    
    // * WORDS
    case 'isolate':
      if(value.includes('isolate')) returnStyles.push(`isolate`)
      else returnStyles.push(`isolation-${value}`)
      break
    case 'flex-direction': 
      returnStyles.push(`flex-${value}`.replace('column', 'col'))
      break
  
    // TODO: Flex
  
    case 'grid-auto-flow': 
      returnStyles.push(`grid-flow-${value}`.replace(' ', '-').replace('column', 'col'))
      break;
    case 'font-style': 
      if(value.includes('italic')) returnStyles.push(`italic`)
      else if(value.includes('normal')) returnStyles.push(`not-italic`)
      break;
    case 'text-transform':
      if(value.includes('none')) returnStyles.push(`normal-case`)
      else returnStyles.push(`${value}`)
      break;
     case 'overflow-wrap':
      if(value.include('break-word')) returnStyles.push(`break-words`)
      else returnStyles.push(`${value}`)
      break;
    case 'word-break':
      if(value.includes('keep-all')) returnStyles.push(`break-keep`)
      else returnStyles.push(`whitespace-pre-${value}`)
      break;
    case 'content':
      returnStyles.push(`content-[${value}]`)
      break;
    // case 'transform-origin':
    //   returnStyles.push(`origin-${value}`.replace(' ', '-'))
    case 'resize':
      if(value.includes('vertical')) returnStyles.push(`resize-y`)
      else if(value.includes('horizontal')) returnStyles.push(`resize-x`)
      else if(value.includes('both')) returnStyles.push(`resize`)
      else returnStyles.push(`resize-${value}`)
      break;
    case 'scroll-snap-align':
      if(value.includes('none')) returnStyles.push(`snap-align-none`)
      else returnStyles.push(`snap-${value}`)
      break;
    case 'scroll-snap-type':
      return []
      break

    default:
      returnStyles.push(`![${property}: ${unconvertedValue}]`)
  } 
  return returnStyles
}
// ! Old Code
// ! Old Code
// ! Old Code


function parseOutput(cssString) {
    // Remove @apply and extra spaces
    const cleanedCss = cssString.replace(/@apply\s+/g, '').trim() // Remove the @apply and any extra spaces
  
    let jsonResult = {};
    
    
    const cssRules = cleanedCss.trim().split('}').filter(rule => rule.trim().length > 0).map(str => str.trim()) // cssrules is an
    // console.log(cleanedCss)
    
    cssRules.forEach(rule => {
      // find duplicate rules
      
      // Extract the selector and the class definitions
      const [selector, classes] = rule.split('{').map(part => part.trim())
      
      let classArray = classes.split(/(?<!:)\s+/)
      if (classArray == undefined) classArray = [classes]
      classArray = classArray.filter(className => className.length > 0);
      if(jsonResult[selector] != undefined) {
        // add the new classes to the old classes, do not remove the old classes
        jsonResult[selector].push(...classArray)
      } else {
        jsonResult[selector] = classArray
      }

    });
  jsonResult = resolveDuplicates(jsonResult)
  // console.log(jsonResult)
  return jsonResult;
}

function markDuplicates(arr) {
  let prefixMap = {}
  let result = []
  let duplicateCount = 0

  // Build the prefix map
  let index = 0
  arr.forEach((item, index) => {
    let prefix = item.slice(0, item.lastIndexOf('-'))
    if(prefix.indexOf('-') == 0) {
        prefix = prefix.substring(prefix.indexOf('-') + 1)
      }
    if (prefixMap[prefix]) {
      prefixMap[prefix].push(index)
    } else {
      prefixMap[prefix] = [index]
      index++
    }
  })
  // console.table(prefixMap)

  result = Object.keys(prefixMap).forEach((prefix) => {
    if(prefixMap[prefix].length > 1) {
      for(let i = 0; i < prefixMap[prefix].length; i++) {
        
        let arrIndex = prefixMap[prefix][i]
        arr[prefixMap[prefix][i]] = `${duplicateCount}?${arr[prefixMap[prefix][i]]}`
      }
      duplicateCount++
    } 
  })


  return arr
}


function resolveDuplicates(json) {
  Object.keys(json).forEach((selector) => {
    const classes = json[selector]

    // Resolving direct duplicates
    const uniqueClasses = [...new Set(classes)]
    json[selector] = uniqueClasses

    
    json[selector] = markDuplicates(json[selector])
    // console.log(json[selector])
  })
  return json
}

function convertLinearWithAvailableValues(propertyName, value, availableValues, backdrop) {
  if(availableValues.includes(Number(value))) return `${backdrop}${propertyName}-${value * 100}` // If the newValue is a number tailwind has a builtin number for, then use it multiplied by 100
  else return `${backdrop}${property}-[${value}]` // Else use a arbitrary value
}

function convertRotationWithAvailableValues(propertyName, value, availableValues, backdrop) {
  value = value.replace('deg', '')  // Remove the deg from the value for parsing
  if(availableValues.includes(Number(value))) return `${backdrop}${propertyName}-${value}` // If the newValue is a number tailwind has a builtin number for, then use it
  else return `${backdrop}${propertyName}-[${value}deg]` // Else use a arbitrary value and add deg back to it 
}

function convertPercentageScaledWithAvailableValues(propertyName, value, backdrop) {
  if(value.includes('100%')) return `${backdrop}${propertyName}` // If the value is 100%, then just use the property name
  else if(zeroRegex.test(value)) return `${backdrop}${propertyName}-0` // If the value is 0, then just use the property name with a 0
  else return `${backdrop}${propertyName}-[${value}]` // Else use the property name with the value in brackets
}

function parseFilterRule(property, value) {
  const filterValues = value.replace(/\)(?=[a-zA-Z])/g, ')) ').split(') ').map(s => s.trim()) // Split the values by the space, after ensuring there are spaces between the functions
  const backdrop = (property == 'backdrop-filter') ? 'backdrop-' : ''
  let returnStyles = []
  for(let i = 0; i < filterValues.length; i++) {
    if(filterValues[i] == undefined || filterValues[i] == '') {
      returnStyles.push(`${backdrop}filter-none`)
      continue
    }

    let [property, value] = filterValues[i].split('(').map(s => s.trim())
    value = value.replace(')', '')

    switch(property) {
      case 'blur':
        returnStyles.push(`${backdrop}blur-${util.irregularConvertUnits(blurUnitDict, value)}`)
        break
      case 'brightness':
        returnStyles.push(convertLinearWithAvailableValues('brightness', value, [0, 0.5, 0.75, 0.9, 0.95, 1, 1.05, 1.1, 1.25, 1.5, 2], backdrop))
        break
      case 'contrast':
        returnStyles.push(convertLinearWithAvailableValues('contrast', value, [0, 0.5, 0.75, 1, 1.25, 1.5, 2], backdrop))
        break
      case 'grayscale':
        returnStyles.push(convertPercentageScaledWithAvailableValues('grayscale', value, backdrop))
        break
      case 'hue-rotate':
        returnStyles.push(convertRotationWithAvailableValues('hue-rotate', value, [0, 15, 30, 60, 90, 180], backdrop))
        break
      case 'invert':
        returnStyles.push(convertPercentageScaledWithAvailableValues('invert', value, backdrop))
        break
      case 'saturate':
        returnStyles.push(convertLinearWithAvailableValues('saturate', value, [0, 0.5, 1, 1.5, 2], backdrop))
        break
      case 'sepia':
        returnStyles.push(convertPercentageScaledWithAvailableValues('sepia', value, backdrop))
        break
      default:
        // createNotification(`(${property}: ${value}) could not be converted`, 1)
        returnStyles.push(`!(${property}: ${value})`)
        break
    }
  }
  return returnStyles
}

function convertShorthandToTailwind(property, value) {
  const shorthandValues = util.shorthand(value.split(' '), shorthandDict[property]) // Split the values by space and parse the shorthand notation
  let styles = []
  for (let i = 0; i < shorthandValues.length; i++) {
    styles.push(`${shorthandValues[i]}`) // Push each value to the styles array
  }
  return styles
}

function convertPropertylessToTailwind(property, value) {
  // Edge cases where the value is not the same as the tailwind class
  if (property == 'display' && value == 'none') return `hidden`
  else if (property == 'visibility' && value == 'hidden') return `invisible`
  else if (property == 'font-variant-numeric' && value == 'normal') return `normal-nums`
  else if (property == 'text-decoration-line' && value == 'none') return `no-underline`
  else if (property == 'overflow-wrap' && value == 'break-word') return `break-words`
  else if (property == 'text-transform' && value == 'none') return `normal-case`
  else return `${value}`
}

let isNegative = '';

function removeNegative(value) {
  return value.replace('[-', '').replace(']', '')
}

function parseTransformRule(value) {
  const transformValues = value.replace(/\)(?=[a-zA-Z])/g, ')) ').split(') ').map(s => s.trim()) // Split the values by the space, after ensuring there are spaces between the functions
  let returnStyles = []
  for(let i = 0; i < transformValues.length; i++) {
    if(transformValues[i] == undefined || transformValues[i] == '') continue

    let [property, value] = transformValues[i].split('(').map(s => s.trim())
    value = value.replace(')', '')


    switch(property) {
      case 'translateX':
        value = util.convertUnits(value)
        if (valueIsNegative(value)) value = util.convertUnits(value.replace('[-', '').replace(']', ''))
        returnStyles.push(`translate-x-${value}`)
        break
      case 'translateY':
        value = util.convertUnits(value)
        if (valueIsNegative(value)) value = util.convertUnits(value.replace('[-', '').replace(']', ''))
        returnStyles.push(`translate-y-${value}`)
        break
      case 'rotate':
        returnStyles.push(convertRotationWithAvailableValues('rotate', value, [0, 1, 2, 3, 6, 12, 45, 90, 180], ''))
        break
      case 'scale':
        returnStyles.push(convertLinearWithAvailableValues('scale', value, [0, 0.5, 0.75, 0.9, 0.95, 1, 1.05, 1.1, 1.25, 1.5], ''))
        break
      case 'scaleX':
        returnStyles.push(convertLinearWithAvailableValues('scale-x', value, [0, 0.5, 0.75, 0.9, 0.95, 1, 1.05, 1.1, 1.25, 1.5], ''))
        break
      case 'scaleY':
        returnStyles.push(convertLinearWithAvailableValues('scale-y', value, [0, 0.5, 0.75, 0.9, 0.95, 1, 1.05, 1.1, 1.25, 1.5], ''))
        break
      case 'skewX':
        returnStyles.push(convertRotationWithAvailableValues('skew-x', value, [0, 1, 2, 3, 6, 12], ''))
        break
      case 'skewY':
        returnStyles.push(convertRotationWithAvailableValues('skew-y', value, [0, 1, 2, 3, 6, 12], ''))
        break
      case 'translate':
        let split = value.split(', ')
        let [translateX, translateY, translateZ] = [util.convertUnits(split[0]), util.convertUnits(split[1]), split[2]]
        let returnStylesTranslate = []

        if (valueIsNegative(translateX)) translateX = util.convertUnits(translateX.replace('[-', '').replace(']', ''))
        returnStylesTranslate.push(`translate-x-${translateX}`)

        if (valueIsNegative(translateY)) translateY = util.convertUnits(translateY.replace('[-', '').replace(']', ''))
        returnStylesTranslate.push(`translate-y-${translateY}`)

        returnStylesTranslate.push(`transform-[translateZ(${translateZ.replace(/\s/g, '_')})]`)
        returnStyles.push(...returnStylesTranslate) 
        break
      default:
        // createNotification(`${property}: ${value} could not be converted cleanly`, '1')
        returnStyles.push(`transform-[${property}(${value.replace(/\s/g, '_')})]`)
        break
      
    }
  }
  return returnStyles
}

function valueIsNegative(value) {
  if(value != undefined && value.startsWith('[-')) {
    // console.log(`value ${value} is negative`)
    isNegative = '-'
    return true
  } else {
    // console.log(`value ${value} is positive`)
    isNegative = ''
    return false
  }
  
}
function handleMediaQueries(mediaQuery) {
  mediaQuery = mediaQuery.replace('media', '').trim()
  console.log(mediaQuery)
  let mediaQueryValues = mediaQuery.split(',').map(s => s.trim())
  if(mediaQueryValues == undefined) mediaQueryValues = [mediaQuery]
  let returnPrefixes = ''
  for(let i = 0; i < mediaQueryValues.length; i++) {
    mediaQueryValues[i] = mediaQueryValues[i].replace('(', '').replace(')', '')
    let [prefix, value] = mediaQueryValues[i].split(':').map(s => s.trim())
    if(mediaQueryDict.hasOwnProperty(prefix)) {
      returnPrefixes += `${mediaQueryDict[prefix]}`
    }
    if(value == undefined) continue
    if(viewportBreakpoints.hasOwnProperty(value)) {
      returnPrefixes += `${viewportBreakpoints[value]}`
    } else if (numberRegex.test(value)) {
      console.log(prefix, value)
      if(prefix.includes('min')) returnPrefixes += `min-w-[${value}]`
      else returnPrefixes += `[${value}]`
    } else {
      returnPrefixes += `${value}`
    }
    returnPrefixes = returnPrefixes.replace(' ', '') 

    returnPrefixes += ':'
  }
  return returnPrefixes
}

function handleSupportQueries(supportQuery) {
  supportQuery = supportQuery.replace('supports', '').trim()
  let supportQueryValues = supportQuery.split('and').map(s => s.trim())
  let returnPrefixes = ''
  for(let i = 0; i < supportQueryValues.length; i++) {
    supportQueryValues[i] = supportQueryValues[i].replace('(', '').replace(')', '')
    // let [prefix, value] = supportQueryValues[i].split(':').map(s => s.trim())
    // console.log(prefix, value)
    returnPrefixes += `supports-[${supportQueryValues[i].replace(/\s+/g, '')}]:`
  
  }
  return returnPrefixes
}
let insideAtRule = false
let insideCSSRule = false
let prefixes = ''
let line = 0;
function convertPVPairToTailwind(stylesList, style) {
  line++
  let debugStringBuilder = `Line ${line}: \n`

  function appendToStylesList(value, forChip=true) {
    if(insideCSSRule || insideAtRule || (value != undefined && value.includes(`}`))) {
      let insideCSSRuleInsideAtRule = insideAtRule && insideCSSRule
      if(value.includes(`}`)) {
        if(insideCSSRuleInsideAtRule) insideCSSRule = false
        else if (insideAtRule) {
          insideAtRule = false
          prefixes = ''
        }
        else if (insideCSSRule) insideCSSRule = false
        else prefixes = ''
      }
      else if (Array.isArray(value)) {
        for(let i = 0; i < value.length; i++) {
          stylesList.push(`${prefixes}${isNegative}${value[i]}`)
        }
      }
      else {
        if(forChip) stylesList.push(`${prefixes}${isNegative}${value}`)
        else stylesList.push(`${value}`)
      }

    } else {
      // createAlert(`The value ${value} was not inside a CSS rule and was not converted to TailwindCSS`)
    }
    // console.log(`${debugStringBuilder}`)
    
    return stylesList
  }

  if(style.includes('{') || style.includes('@')) {
    // if(insideCSSRule) createAlert('Error: Nested CSS rules are not supported yet')
    debugStringBuilder += `${style} was the beginning of a CSS rule\n`
    // console.log(debugStringBuilder)
    insideCSSRule = true
    if(style.includes('@')) {
      debugStringBuilder += `${style} was specifically the beginning of a CSS at-rule\n`
      style = style.replace('@', '').replace('(', '').replace(')', '').replace('{', '').replace('}', '').trim()
      if(cssAtRules.includes(style)) {
        createAlert(`Error: TailwindCSS does not support the @${style.replace('{', '')} at-rule. This rule will not be converted`)
      }
      if (style.includes('media')) {
        insideCSSRule = false
        insideAtRule = true
        // createAlert('Error: media queries are not supported yet')
        prefixes += handleMediaQueries(style)
      } 
      if (style.includes('supports')) {
        prefixes += handleSupportQueries(style)
      }
      // TODO: Add support for other at-rules
      if (style.includes('keyframes')) {
        createAlert('Error: keyframes are not supported yet')
      } 
      if (style.includes('font-face')) {
        createAlert('Error: font-face is not supported yet')
      }
      // console.log(debugStringBuilder)
      return stylesList
    }
    return appendToStylesList(`${style} @apply`, false) // If its the style declaration: list it out and enter a new line
  } else if(style.includes('}')) {
    debugStringBuilder += `${style} was the end of a CSS rule\n`
    return appendToStylesList(`}`, false) // If it is the ending bracket: enter past the styles place the bracket, then enter another new line
  } else {
    debugStringBuilder += `${style} was not a special line \n`
  }


  let [property, value] = style.split(':').map(s => s.trim()) // Split up the properties and the styles
  debugStringBuilder += `property: ${property}, value: ${value}\n`
  let completeProperty = false
  
  if(property.includes('/*')) return stylesList // If it is a comment, ignore it
  if(value != undefined) {
    value = value.replace(';', '') // Get rid of the semicolon
    completeProperty = true
  }

  
  if(property == 'filter' || property == 'backdrop-filter') return appendToStylesList(parseFilterRule(property, value))  // Case #1: The filter and backdrop-filter properties all have many different values based on their functions
  
  if(property == "transform") return appendToStylesList(parseTransformRule(value)) // Case #2: The transform property has many different values based on their functions
  
  value = util.convertUnits(value)
  
  // console.log(value)
  if (valueIsNegative(value)) value = util.convertUnits(value.replace('[-', '').replace(']', '')).replace('[-', '[')
    
    
  let returnStyles = []
    // * EDGE CASES
  switch (property) {
    // * SINGLE VALUES WITH UNITS
    // * BORDER CORNER RADIUS
    // * STYLES THAT NEED REVERTED UNITS
    case 'text-decoration-thickness':
      if(numberRegex.test(value)) value = util.revertUnits(unitDict, value).replace('px', '')
      return appendToStylesList(`decoration-${value}`)
    case 'text-underline-offset':
      if(numberRegex.test(value)) value = util.revertUnits(unitDict, value)
      return appendToStylesList(`underline-offset-${value}`)
    case 'outline-width':
      if(numberRegex.test(value)) value = util.revertUnits(unitDict, value)
      return appendToStylesList(`outline-${value.replace('px', '')}`)
    case 'outline-offset':
      if(numberRegex.test(value)) value = util.revertUnits(unitDict, value)
      return appendToStylesList(`outline-offset-${value.replace('px', '')}`)
    case 'letter-spacing':
      value = value.replace('[', '').replace(']', '')
      return appendToStylesList(`tracking-${util.irregularConvertUnits(letterSpacingUnitDict, value)}`)

    // * SHORTHANDABLE VALUES EDGE CASES
    
    case 'border-radius':
      let borderRadiuses = value.split(' ')
      returnStyles = []
      for(let i = 0; i < borderRadiuses.length; i++) {
        borderRadiuses[i] = util.translateConvertedToIrregular(borderRadiusUnitDict, borderRadiuses[i])
      }
      if (borderRadiuses.length === 1) {
        returnStyles.push(`rounded-${borderRadiuses[0]}`.replace('-/', ''))
      } else if (borderRadiuses.length === 2) {
        returnStyles.push(`rounded-tl-${borderRadiuses[0]}`.replace('-/', ''))
        returnStyles.push(`rounded-br-${borderRadiuses[0]}`.replace('-/', ''))
        returnStyles.push(`rounded-tr-${borderRadiuses[1]}`.replace('-/', ''))
        returnStyles.push(`rounded-bl-${borderRadiuses[1]}`.replace('-/', ''))
      } else if (borderRadiuses.length === 3) { 
        returnStyles.push(`rounded-tl-${borderRadiuses[0]}`.replace('-/', ''))
        returnStyles.push(`rounded-tr-${borderRadiuses[1]}`.replace('-/', ''))
        returnStyles.push(`rounded-bl-${borderRadiuses[1]}`.replace('-/', ''))
        returnStyles.push(`rounded-br-${borderRadiuses[2]}`.replace('-/', ''))
      } else if (borderRadiuses.length === 4) {
        returnStyles.push(`rounded-tl-${borderRadiuses[0]}`.replace('-/', ''))
        returnStyles.push(`rounded-tr-${borderRadiuses[1]}`.replace('-/', ''))
        returnStyles.push(`rounded-br-${borderRadiuses[2]}`.replace('-/', ''))
        returnStyles.push(`rounded-bl-${borderRadiuses[3]}`.replace('-/', ''))
      }
      return appendToStylesList(returnStyles)

    case 'inset':
      const values = value.split(' ')
      returnStyles = []
      if (values.length === 1) {
        returnStyles.push(`inset-${values[0]}`)
      } else if (values.length === 2) {
        returnStyles.push(`inset-y-${values[0]}`)
        returnStyles.push(`inset-x-${values[1]}`)
      } else if (values.length === 3) {
        returnStyles.push(`top-${values[0]}`)
        returnStyles.push(`inset-x-${values[1]}`)
        returnStyles.push(`bottom-${values[2]}`)
      } else if (values.length === 4) {
        returnStyles.push(`top-${values[0]}`)
        returnStyles.push(`right-${values[1]}`)
        returnStyles.push(`bottom-${values[2]}`)
        returnStyles.push(`left-${values[3]}`)
      }
      return appendToStylesList(returnStyles)

    // * NUMBER NO UNIT
    case 'order':
      if(value == '0') return appendToStylesList(`order-none`)
      else return appendToStylesList(`order-${value}`)
    case 'opacity':
      return appendToStylesList(`opacity-${value * 100}`)
    case 'aspect-ratio':
      if(value.includes('1 / 1')) return appendToStylesList(`aspect-square`)
      if(value.includes('16 / 9')) return appendToStylesList(`aspect-video`)
      else return appendToStylesList(`aspect-${value}`)
    case 'font-weight':
      return appendToStylesList(`font-${util.irregularConvertUnits(fontWeightUnitDict, value)}`)
    case 'flex-grow':
      if(value.includes('1')) return appendToStylesList(`grow`)
      else return appendToStylesList(`grow-0`)
    case 'flex-shrink':
      if(value.includes('1')) return appendToStylesList(`shrink`)
      else return appendToStylesList(`shrink-0`)
    
    // * WORDS
    case 'isolate':
      if(value.includes('isolate')) return appendToStylesList(`isolate`)
      else return appendToStylesList(`isolation-${value}`)
      break
    case 'flex-direction': return appendToStylesList(`flex-${value}`.replace('column', 'col'))
  
    // TODO: Flex
    case 'grid-auto-flow': return appendToStylesList(`grid-flow-${value}`.replace(' ', '-').replace('column', 'col'))
    
    case 'font-style': 
      if(value.includes('italic')) return appendToStylesList(`italic`)
      else if(value.includes('normal')) return appendToStylesList(`not-italic`)
    case 'text-transform':
      if(value.includes('none')) return appendToStylesList(`normal-case`)
      else return appendToStylesList(`${value}`)
     case 'overflow-wrap':
      if(value.include('break-word')) return appendToStylesList(`break-words`)
      else return appendToStylesList(`${value}`)
    case 'word-break':
      if(value.includes('keep-all')) return appendToStylesList(`break-keep`)
      else return appendToStylesList(`whitespace-pre-${value}`)
    case 'content':
      return appendToStylesList(`content-[${value}]`)
    // case 'transform-origin':
    //   return appendToStylesList(`origin-${value}`.replace(' ', '-'))
    case 'resize':
      if(value.includes('vertical')) return appendToStylesList(`resize-y`)
      else if(value.includes('horizontal')) return appendToStylesList(`resize-x`)
      else if(value.includes('both')) return appendToStylesList(`resize`)
      else return appendToStylesList(`resize-${value}`)
    case 'scroll-snap-align':
      if(value.includes('none')) return appendToStylesList(`snap-align-none`)
      else return appendToStylesList(`snap-${value}`)
    case 'scroll-snap-type':
      return stylesList

    // default:
    //   return appendToStylesList(`![${property}: ${value}]`)
  } 
  
  const valueIsShorthand = (value != undefined && value.split(' ') != undefined && value.split(' ') != null) && value.split(' ').length > 1  // If the value is shorthand and the property is shorthandable
  if (shorthandDict.hasOwnProperty(property) && valueIsShorthand) return appendToStylesList(convertShorthandToTailwind(property, value));

  if (singleValueDict.hasOwnProperty(property) && !valueIsShorthand) {
    if (value == '') return appendToStylesList(`${singleValueDict[property]}`)
    else return appendToStylesList(`${singleValueDict[property]}-${value}`) // Applies to most styles: margin, padding, border-width, border-radius, etc
  }
  
  if (propertylessDict.hasOwnProperty(property)) return appendToStylesList(convertPropertylessToTailwind(property, value)) // Applies to display, position, visibility, etc 
 

  if (borderRadiusDict.hasOwnProperty(property)) {
    value = util.translateConvertedToIrregular(borderRadiusUnitDict, value)
    return appendToStylesList(`${borderRadiusDict[property]}-${value}`)
  }

  if(completeProperty) return appendToStylesList(`![${property}: ${value}]`)
  
  
}


function convertCSSToPVPair(css) {
  line = 0
  const styles = css.split('\n') // Split styles by line
    .filter(style => style.trim() !== '') // Remove empty lines
    .map(style => style.trim()) // Trim leading/trailing spaces
    .reduce((stylesList, style) => convertPVPairToTailwind(stylesList, style), [])
  // console.table(styles)
  return styles.join(' ')
}




