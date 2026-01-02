import { 
  shorthandDict, 
  unitDict, 
  borderRadiusUnitDict, 
  blurUnitDict, 
  letterSpacingUnitDict, 
  fontWeightUnitDict, 
  singleValueDict, 
  propertylessDict, 
  borderRadiusDict, 
  spacingUnitDict, 
  lengthUnitSet, 
  fontSizeUnitDict, 
  fontStretchUnitDict, 
  perspectiveUnitDict, 
  tailwindColors 
} from './dictionaries'
import * as util from './utilities'

export function formatTailwindArrayToDict(tailwindArray) {
  let tailwindDict = {}
  tailwindArray.forEach((item) => {
    let [selector, classes] = Object.entries(item)[0]
    const splitClasses = splitRules(classes)
    tailwindDict[selector] = (tailwindDict[selector] || []).concat(splitClasses)
  })
  return tailwindDict
}

function splitRules(classes) {
  if (classes == undefined) return
  let returnArray = []
  classes.forEach((rule) => {
    rule = rule.replace('[[', '[').replace(']]', ']')
    if (!rule.includes(' ') && (rule.includes('[') && !rule.includes('] '))) {
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
  let result = []
  
  for (const [key, value] of Object.entries(obj)) {
    let newKey
    if (key.startsWith('&')) {
      newKey = prefix + key.slice(1)
    } else {
      newKey = prefix ? `${prefix} ${key}` : key
    }
    
    if (typeof value === 'object' && value !== null) {
      if (Object.keys(value).some(k => typeof value[k] === 'object' && value[k] !== null)) {
        result = result.concat(flattenCSSJSON(value, newKey))
      } else {
        result.push({ [newKey]: value })
      }
    } else {
      if (result.length === 0 || Object.keys(result[result.length - 1])[0] !== prefix) {
        result.push({ [prefix]: {} })
      }
      result[result.length - 1][prefix][key] = value
    }
  }
  
  return result
}

export function convertCSSJSONToTailwind(cssObject) {
  const flattenedCSS = cssObject.flatMap(obj => flattenCSSJSON(obj))
  
  return flattenedCSS.map(item => {
    const [selector, styles] = Object.entries(item)[0]
    const tailwindClasses = []
    
    for (const [key, value] of Object.entries(styles)) {
      if (typeof value === 'string') {
        const tailwindRule = computeTailwindRule(key, value)
        tailwindClasses.push(tailwindRule)
      }
    }
    
    // Only return the object if it has any Tailwind classes
    return tailwindClasses.length > 0 ? { [selector]: tailwindClasses } : null
  }).filter(item => item !== null) // Remove any null items from the result
}

let isNegative = ''
let arbitraryValue = ''
function computeTailwindRule(property, value, prefixes="") {
  // Reset isNegative at the start of each rule computation
  isNegative = ''

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

  // Make a case for handling different types of gradients
  const unconvertedValue = value
  arbitraryValue = util.replaceSpacesWithUnderscores(unconvertedValue)
  const functionRegex = /repeat|calc|minmax|var\(/
  const hasFunctionSyntax = value.includes('(') && functionRegex.test(value)
  const valueIsShorthand = (value != undefined && value.split(' ') != undefined && value.split(' ') != null) && value.split(' ').length > 1  // If the value is shorthand and the property is shorthandable
  if (shorthandDict.hasOwnProperty(property) && valueIsShorthand) {
    return formatArrayRules(convertShorthandToTailwind(property, unconvertedValue))
  }
  value = handleNegative(util.convertUnits(value))
  // Re-check valueIsShorthand after conversion (the converted value might be a single value now)
  const convertedValueIsShorthand = (value != undefined && value.split(' ') != undefined && value.split(' ') != null) && value.split(' ').length > 1
  if (singleValueDict.hasOwnProperty(property) && (!convertedValueIsShorthand || util.otherColorRegex.test(value))) {
    // console.log(singleValueDict[property], value)
    if (lengthUnitSet.has(property) && spacingUnitDict[value] != undefined) return formatRule(`${singleValueDict[property]}-${spacingUnitDict[value]}`)
    if (value == '') return appendToStylesList(`${singleValueDict[property]}`)
    return formatRule(`${singleValueDict[property]}-${value}`) // Applies to most styles: margin, padding, border-width, border-radius, etc
  }
  
  if (propertylessDict.hasOwnProperty(property)) return formatRule(convertPropertylessToTailwind(property, value)) // Applies to display, position, visibility, etc 
 
  if (borderRadiusDict.hasOwnProperty(property)) {
    value = util.translateConvertedToIrregular(borderRadiusUnitDict, value)
    return formatRule(`${borderRadiusDict[property]}-${value}`)
  }

  // if(completeProperty) return appendToStylesList(`![${property}: ${value}]`)

  let rule = parseEdgeCases(property, value, unconvertedValue)
  if (rule != undefined && rule.length > 0) return formatArrayRules(rule)
  
}

function handleNegative(value) {
  if (valueIsNegative(value)){
    // Handle bracket format [-1]
    if (value.startsWith('[-')) {
      value = value.replace('[-', '').replace(']', '')
    }
    // Strip the negative sign from the value itself since isNegative is already set
    // This handles both [-1] format (after bracket removal) and -1 format
    if (value.trim().startsWith('-')) {
      value = value.trim().substring(1)
    }
    value = util.convertUnits(value)
  } else {
    // Reset isNegative if value is not negative
    isNegative = ''
  }
  return value
}

function parseEdgeCases(property, value, unconvertedValue) {
  let returnStyles = []
  // * EDGE CASES
  switch (property) {
    // * SINGLE VALUES WITH UNITS
    // * BORDER CORNER RADIUS
    // * STYLES THAT NEED REVERTED UNITS
    case 'text-decoration-thickness':
      if(unconvertedValue.includes('px')) returnStyles.push(`decoration-${Math.abs(Number(unconvertedValue.replace('px', '')))}`)
      else if(util.unitRegex.test(unconvertedValue)) returnStyles.push(`decoration-[${unconvertedValue}]`)
      else returnStyles.push(`decoration-${value}`)
      break
    case 'text-underline-offset':
      if(unconvertedValue.includes('px')) returnStyles.push(`underline-offset-${Math.abs(Number(unconvertedValue.replace('px', '')))}`)
      else if(util.unitRegex.test(unconvertedValue)) returnStyles.push(`underline-offset-[${unconvertedValue}]`)
      else returnStyles.push(`underline-offset-${value}`)
      break
    case 'outline-width':
      if(unconvertedValue.includes('px')) returnStyles.push(`outline-${Math.abs(Number(unconvertedValue.replace('px', '')))}`)
      else if(value.includes('(')) returnStyles.push(`outline-${util.handleNamedVariable(value, 'length')}`)
      else returnStyles.push(`outline-[${value}]`)
      break
    case 'stroke-width':
      if(util.numberRegex.test(unconvertedValue)) returnStyles.push(`stroke-${Math.abs(Number(unconvertedValue.replace('px', '')))}`)
      else if(value.includes('(')) returnStyles.push(`stroke-${util.handleNamedVariable(value, 'length')}`)
      else returnStyles.push(`stroke-[${value}]`)
      break
    case 'outline-offset':
      if(unconvertedValue.includes('px')) returnStyles.push(`outline-offset-${Math.abs(Number(unconvertedValue.replace('px', '')))}`)
      else if(value.includes('(')) returnStyles.push(`outline-offset-${util.handleNamedVariable(value, 'length')}`)
      else returnStyles.push(`outline-offset-[${value}]`)
      break
    case 'letter-spacing':
      value = value.replace('[', '').replace(']', '')
      returnStyles.push(`tracking-${util.irregularConvertUnits(letterSpacingUnitDict, value)}`)
      break
    case 'font-family':
      if(util.sansSerifRegex.test(value)) returnStyles.push(`font-sans`)
      else if(util.serifRegex.test(value)) returnStyles.push(`font-serif`)
      else if(util.monospaceRegex.test(value)) returnStyles.push(`font-mono`)
      else if (value.includes('(')) returnStyles.push(util.handleNamedVariable(value, 'font-family'))
      else returnStyles.push(`font-${value}`)
      break
    case 'font-size':
      if(util.unitRegex.test(unconvertedValue) && fontSizeUnitDict[unconvertedValue] != undefined) returnStyles.push(`text-${fontSizeUnitDict[unconvertedValue]}`)
      else if (value.includes('(')) returnStyles.push(util.handleNamedVariable(value, 'length'))
      else returnStyles.push(`text-${value}`)
      break
    case 'font-style':
      if(value.includes('italic')) returnStyles.push(`italic`)
      else if(value.includes('normal')) returnStyles.push(`not-italic`)
      break
    case 'line-height':
      if (unconvertedValue == '1') returnStyles.push(`leading-none`)
      else if (util.unitRegex.test(unconvertedValue)) returnStyles.push(`leading-[${unconvertedValue}]`)
      else returnStyles.push(`leading-${value}`)
      break
    // * SHORTHANDABLE VALUES EDGE CASES
    case 'border-radius':
      let borderRadiuses = value.split(' ')
      returnStyles = []
      for(let i = 0; i < borderRadiuses.length; i++) {
        borderRadiuses[i] = util.translateConvertedToIrregular(borderRadiusUnitDict, borderRadiuses[i])
                                                              .replace('-/', '').replace('[100%]', 'full')
      }
      if (borderRadiuses.length === 1) {
        returnStyles.push(`rounded-${borderRadiuses[0]}`)
      } else if (borderRadiuses.length === 2) {
        returnStyles.push(`rounded-tl-${borderRadiuses[0]}`)
        returnStyles.push(`rounded-br-${borderRadiuses[0]}`)
        returnStyles.push(`rounded-tr-${borderRadiuses[1]}`)
        returnStyles.push(`rounded-bl-${borderRadiuses[1]}`)
      } else if (borderRadiuses.length === 3) { 
        returnStyles.push(`rounded-tl-${borderRadiuses[0]}`)
        returnStyles.push(`rounded-tr-${borderRadiuses[1]}`)
        returnStyles.push(`rounded-bl-${borderRadiuses[1]}`)
        returnStyles.push(`rounded-br-${borderRadiuses[2]}`)
      } else if (borderRadiuses.length === 4) {
        returnStyles.push(`rounded-tl-${borderRadiuses[0]}`)
        returnStyles.push(`rounded-tr-${borderRadiuses[1]}`)
        returnStyles.push(`rounded-br-${borderRadiuses[2]}`)
        returnStyles.push(`rounded-bl-${borderRadiuses[3]}`)
      }
      returnStyles.push(returnStyles)
      break
    case 'size':
      let sizes = value.split(' ')
      for(let i = 0; i < sizes.length; i++) {
        sizes[i] = i == 0 && spacingUnitDict[sizes[i]] != undefined ? spacingUnitDict[sizes[i]] : util.convertUnits(sizes[i])
      }
      if (sizes.length === 1) {
        returnStyles.push(`size-${sizes[0]}`)
      } else if (sizes.length === 2) {
        returnStyles.push(`w-${sizes[0]}`)
        returnStyles.push(`h-${sizes[1]}`)
      }
      returnStyles.push(returnStyles)
      break
    // * NUMBER NO UNIT
    case '--tw-divide-x-reverse':
      if (value == '1') returnStyles.push(`divide-x-reverse`)
      else returnStyles.push(`![${property}:${arbitraryValue}]`)
      break
    case '--tw-divide-y-reverse':
      if (value == '1') returnStyles.push(`divide-y-reverse`)
      else returnStyles.push(`![${property}:${arbitraryValue}]`)
      break
    case '--tw-scroll-snap-strictness':
      if(value == 'mandatory') returnStyles.push(`snap-mandatory`)
      else if(value == 'proximity') returnStyles.push(`snap-proximity`)
      else returnStyles.push(`![${property}:${arbitraryValue}]`)
      break
    case 'order':
      if(value == '0') returnStyles.push(`order-none`)
      else if (parseInt(unconvertedValue) < -99) {
        isNegative = ''
        returnStyles.push(`order-last`)
      }
      else if (parseInt(value) > 99) returnStyles.push(`order-first`)
      else if (util.unitRegex.test(unconvertedValue)) returnStyles.push(`order-[${unconvertedValue}]`)
      else returnStyles.push(`order-${value}`)
      break
    case 'opacity':
      if (unconvertedValue.includes('%')) returnStyles.push(`opacity-${unconvertedValue.replace('%', '')}`)
      else if(value.includes('(')) returnStyles.push(`opacity-${value}`)
      else returnStyles.push(`opacity-${value * 100}`)
      break
    case 'aspect-ratio':
      if(value.includes('1 / 1')) returnStyles.push(`aspect-square`)
      if(value.includes('16 / 9')) returnStyles.push(`aspect-video`)
      else returnStyles.push(`aspect-${value}`)
      break
    case 'font-weight':
      if (util.numberRegex.test(value)) returnStyles.push(`font-${util.irregularConvertUnits(fontWeightUnitDict, value)}`)
      else returnStyles.push(`font-${value}`)
      break
    case 'font-stretch':
      if (unconvertedValue.includes('%') && fontStretchUnitDict[unconvertedValue] != undefined) returnStyles.push(`font-stretch-${fontStretchUnitDict[unconvertedValue]}`)
      else if (unconvertedValue.includes('%')) returnStyles.push(`font-stretch-${unconvertedValue}`)
      else returnStyles.push(`font-stretch-${value}`)
      break
    case 'flex-grow':
      if(value.includes('1')) returnStyles.push(`grow`)
      else if(util.unitRegex.test(unconvertedValue)) returnStyles.push(`grow-[${unconvertedValue}]`)
      else returnStyles.push(`grow-${value}`)
      break
    case 'flex-shrink':
      if(value.includes('1')) returnStyles.push(`shrink`)
      else if(util.unitRegex.test(unconvertedValue)) returnStyles.push(`shrink-[${unconvertedValue}]`)
      else returnStyles.push(`shrink-${value}`)
      break
    case 'columns':
      if(unconvertedValue.includes('auto')) returnStyles.push(`columns-auto`)
      else if(util.unitRegex.test(unconvertedValue)) returnStyles.push(`columns-${util.translateConvertedToIrregular(spacingUnitDict, unconvertedValue)}`)
      else returnStyles.push(`columns-${value}`)
      break
    case 'flex-basis':
      if(unconvertedValue.includes('auto')) returnStyles.push(`basis-auto`)
      else if (util.unitRegex.test(unconvertedValue)) returnStyles.push(`basis-${util.translateConvertedToIrregular(spacingUnitDict, unconvertedValue)}`)
      else returnStyles.push(`basis-${value}`)
      break
    // * WORDS
    case 'isolate':
      if(value.includes('isolate')) returnStyles.push(`isolate`)
      else returnStyles.push(`isolation-${value}`)
      break
    case 'isolation':
      if(value.includes('isolate')) returnStyles.push(`isolate`)
      else returnStyles.push(`isolation-${value}`)
      break
    case 'flex-direction': 
      returnStyles.push(`flex-${value}`.replace('column', 'col'))
      break
    case 'flex':
      if(unconvertedValue.includes('0 auto') || unconvertedValue.includes('initial')) returnStyles.push(`flex-initial`)
      else if(unconvertedValue.includes('auto')) returnStyles.push(`flex-auto`)
      else if(unconvertedValue.includes('none')) returnStyles.push(`flex-none`)
      else if(util.unitRegex.test(unconvertedValue)) returnStyles.push(`flex-[${unconvertedValue}]`)
      else returnStyles.push(`flex-${value}`)
      break
    case 'transition-property':
      if (unconvertedValue.includes('color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter, display, content-visibility, overlay, pointer-events')) returnStyles.push(`transition`)
      else returnStyles.push(`transition-${value}`)
      break
    case 'font-style': 
      if(value.includes('italic')) returnStyles.push(`italic`)
      else if(value.includes('normal')) returnStyles.push(`not-italic`)
      break
    case 'text-transform':
      if(value.includes('none')) returnStyles.push(`normal-case`)
      else returnStyles.push(`${value}`)
      break
    case 'overflow-wrap':
      if(value.include('break-word')) returnStyles.push(`break-words`)
      else returnStyles.push(`${value}`)
      break
    case 'word-break':
      if(value.includes('keep-all')) returnStyles.push(`break-keep`)
      if(value.includes('break-all')) returnStyles.push(`break-all`)
      else returnStyles.push(`break-${value}`)
      break
    case 'white-space':
      if(unconvertedValue.includes('normal') || unconvertedValue.includes("nowrap")) returnStyles.push(`whitespace-${unconvertedValue}`)
      else returnStyles.push(`whitespace-${value}`)
      break
    case 'content':
      if (value.includes('(') || value == 'none') returnStyles.push(`content-${value}`)
      else returnStyles.push(`content-[${value}]`)
      break
    case 'perspective':
      if(util.unitRegex.test(unconvertedValue)) returnStyles.push(`perspective-${util.translateConvertedToIrregular(perspectiveUnitDict, value)}`)
      else returnStyles.push(`perspective-${value}`)
      break
    case 'resize':
      if(value.includes('vertical')) returnStyles.push(`resize-y`)
      else if(value.includes('horizontal')) returnStyles.push(`resize-x`)
      else if(value.includes('both')) returnStyles.push(`resize`)
      else returnStyles.push(`resize-${value}`)
      break
    case 'scroll-snap-align':
      if(value.includes('none')) returnStyles.push(`snap-align-none`)
      else returnStyles.push(`snap-${value}`)
      break
    case 'scroll-snap-type':
      if(value.includes('none')) returnStyles.push(`snap-none`)
      if(value.includes('x')) returnStyles.push(`snap-x`)
      if(value.includes('y')) returnStyles.push(`snap-y`)
      if(value.includes('both')) returnStyles.push(`snap-both`)
      else returnStyles.push(`snap-${value}`)
      break
    // * TIME
    case 'transition-duration':
      if (unconvertedValue.includes('s') && !unconvertedValue.includes('(')) returnStyles.push(`duration-${util.convertTimeToMilliseconds(unconvertedValue)}`)
      else returnStyles.push(`duration-${value}`)
      break
    case 'transition-delay':
      if (unconvertedValue.includes('s') && !unconvertedValue.includes('(')) returnStyles.push(`delay-${util.convertTimeToMilliseconds(unconvertedValue)}`)
      else returnStyles.push(`delay-${value}`)
      break
    // * TRANSFORM
    case 'rotate':
      let rotations = value.split(' ')
      if (rotations.length == 1) returnStyles.push(convertRotation('rotate', rotations[0], ''))
      else if (rotations.length == 2) returnStyles.push(convertRotation(`rotate-${rotations[0]}`, rotations[1], ''))
      else returnStyles.push(`rotate-[${arbitraryValue}]`)
      break
    case 'scale':
      returnStyles.push(convertScalar('scale', value, ''))
      break
    case 'translate':
      let translations = value.split(' ')
      let negativeFlags = []
      for(let i = 0; i < translations.length; i++) {
        const [value, isNeg] = formatTranslateValue(translations[i])
        translations[i] = value
        negativeFlags.push(isNeg ? '-' : '')
      }
      const dir = ['x', 'y', 'z']
      for (let i = 0; i < translations.length; i++) returnStyles.push(`${negativeFlags[i]}translate-${dir[i]}-${translations[i]}`)
      break
    // * MISCELLANEOUS
    case 'grid-auto-flow': 
      returnStyles.push(`grid-flow-${value}`.replace(' ', '-').replace('column', 'col'))
      break  
    default:
      // console.log(`(${property}: ${value}) could not be converted, using ${unconvertedValue}`)
      if (singleValueDict.hasOwnProperty(property)) returnStyles.push(`${singleValueDict[property]}-[${arbitraryValue}]`)
      else returnStyles.push(`![${property}:${arbitraryValue}]`)
  } 
  return returnStyles
}

function formatTranslateValue(value) {
  value = value.replace('[', '').replace(']', '')
  const isNeg = value.includes('-') && !value.includes('var')
  
  const isSimpleVariable = value.includes('(--') && value.match(/\)/g)?.length <= 1
  const isComplexVariable = value.match(/\)/g)?.length > 1
  if (isSimpleVariable || value.includes('/')) return [value, isNeg]
  if (isComplexVariable) return [`[${value}]`, isNeg]
  if (value.includes('1px') || value == 'px') return ['px', isNeg]
  if (value.includes('100%') || value.includes('full')) return ['full', isNeg]

  const potentialNum = parseFloat(value.replace('px', ''))
  const possibleTailwindNum = (potentialNum <= 96 || potentialNum % 1 == 0)
  if (value.includes('px')|| possibleTailwindNum) return [`${potentialNum}`, isNeg]

  else return [`[${value}]`, isNeg]
}

function convertScalar(propertyName, value, backdrop) {
  const isPercentage = value.includes('%')
  // console.log(util.unitRegex.test(value), !util.numberRegex.test(value), value)
  if(!isPercentage && (util.unitRegex.test(value) || value.includes('(') || !util.numberRegex.test(value))) return `${backdrop}${propertyName}-${util.convertUnits(value)}`

  if (valueIsNegative(value)) {
    value = util.convertUnits(value.replace('[-', '').replace(']', ''))
    isNegative = '-'
  }

  if(isPercentage) value = Number(value.replace('%', '')) / 100
  return `${backdrop}${propertyName}-${value * 100}` // If the newValue is a number tailwind has a builtin number for, then use it multiplied by 100
}

function convertScalar100Case(propertyName, value, backdrop) {
  const isPercentage = value.includes('%')
  if(!isPercentage && (util.unitRegex.test(value) || value.includes('(') || !util.numberRegex.test(value))) return `${backdrop}${propertyName}-${util.convertUnits(value)}`

  if(value.includes('100%') || value == '1') return `${backdrop}${propertyName}` // If the value is 100%, then just use the property name

  if(isPercentage) value = Number(value.replace('%', '')) / 100
  return `${backdrop}${propertyName}-${value * 100}` // Else use the property name with the value in brackets
}

function convertRotation(propertyName, value, backdrop) {
  const isRotation = value.includes('deg') || value.includes('rad') || value.includes('turn') || value.includes('grad')
  if(!isRotation) return `${backdrop}${propertyName}-${util.convertUnits(value)}`

  value = util.toDegrees(value)
  if (valueIsNegative(value)) {
    value = util.convertUnits(value.replace('[-', '').replace(']', ''))
    isNegative = '-'
  }
  value = value.replace('deg', '')  // Remove the deg from the value for parsing
  return `${isNegative}${backdrop}${propertyName}-${value}` // If the newValue is a number tailwind has a builtin number for, then use it
}

function parseFilterRule(property, value) {
  const filterValues = value.replace(/\)(?=[a-zA-Z])/g, ')) ').split(') ').map(s => s.trim()) // Split the values by the space, after ensuring there are spaces between the functions
  const backdrop = (property == 'backdrop-filter') ? 'backdrop-' : ''
  let returnStyles = []
  for(let i = 0; i < filterValues.length; i++) {
    if(filterValues[i] == undefined || filterValues[i] == '' || filterValues[i] == 'none') {
      returnStyles.push(`${backdrop}filter-none`)
      continue
    }
    const pCount = (filterValues[i].match(/\(/g) ?? [])
    const noOtherFunctions = pCount.length <= 1
    if (filterValues[i].includes('url(') && noOtherFunctions) {
      returnStyles.push(`${backdrop}filter-[${filterValues[i]}]`)
      continue
    }
    if (filterValues[i].includes('var(') && noOtherFunctions) {
      returnStyles.push(`${backdrop}filter-(${filterValues[i].replace('var(', '').replace(')', '')})`)
      continue
    }
    const firstPIndex = filterValues[i].indexOf('(')
    const property = filterValues[i].slice(0, firstPIndex).trim()
    const value = filterValues[i].slice(firstPIndex + 1).trim().replace('))', ')')

    switch(property) {
      case 'blur':
        returnStyles.push(`${backdrop}blur-${util.irregularConvertUnits(blurUnitDict, value)}`)
        break
      case 'brightness':
        returnStyles.push(convertScalar('brightness', value, backdrop))
        break
      case 'contrast':
        returnStyles.push(convertScalar('contrast', value, backdrop))
        break
      case 'grayscale':
        returnStyles.push(convertScalar100Case('grayscale', value, backdrop))
        break
      case 'hue-rotate':
        returnStyles.push(convertRotation('hue-rotate', value, backdrop))
        break
      case 'invert':
        returnStyles.push(convertScalar100Case('invert', value, backdrop))
        break
      case 'saturate':
        returnStyles.push(convertScalar('saturate', value, backdrop))
        break
      case 'sepia':
        returnStyles.push(convertScalar100Case('sepia', value, backdrop))
        break
      case 'opacity':
        returnStyles.push(convertScalar('opacity', value, backdrop))
        break  
      case 'drop-shadow':
        returnStyles.push(`drop-shadow-${util.convertUnits(value)}`)
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
  const rawValues = util.splitSpacesOutsideParentheses(value)
  const processedValues = []
  const negativeFlags = []
  
  for (let i = 0; i < rawValues.length; i++) {
    isNegative = ''
    const processedValue = handleNegative(util.convertUnits(rawValues[i]))
    processedValues.push(processedValue)
    negativeFlags.push(isNegative === '-')
  }
  
  const formatShorthandValue = (val, isNeg, prop) => {
    let v = val
    if (v.startsWith('[') && v.endsWith(']')) v = v.substring(1, v.length - 1)
    const isSimpleNum = v.match(/^\d+(\.\d+)?$/)
    const isFraction = /^\d+\/\d+$/.test(v)
    const inDict = unitDict[`${v}px`] || unitDict[v] || tailwindColors[v]
    const isTailwindKeyword = /^[a-zA-Z-]+$/.test(v) && !isSimpleNum && !inDict && !v.includes('_')
    if (!isSimpleNum && !isFraction && !inDict && !isTailwindKeyword) v = `[${v}]`
    return isNeg ? `-${prop}-${v}` : `${prop}-${v}`
  }
  const formatShorthandValueDynamicArray = (values, negativeFlags, properties) => {
    let styles = []
    for(let i = 0; i < values.length; i++) styles.push(formatShorthandValue(values[i], negativeFlags[i], properties[i]))
    return styles
  }
  const prefix = shorthandDict[property]
  const insetPrefixes = [['inset'], ['inset-y', 'inset-x'], ['top', 'inset-x', 'bottom'], ['top', 'right', 'bottom', 'left']]
  const basePrefixes = [[`${prefix}`], [`${prefix}-y`, `${prefix}-x`], [`${prefix}-t`, `${prefix}-x`, `${prefix}-b`], [`${prefix}-t`, `${prefix}-r`, `${prefix}-b`, `${prefix}-l`]]
  const prefixes = property === 'inset' ? insetPrefixes : basePrefixes
  return formatShorthandValueDynamicArray(processedValues, negativeFlags, prefixes[processedValues.length - 1])
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

function parseTransformRule(value) {
  const transformValues = value.replace(/\)(?=[a-zA-Z])/g, ')) ').split(') ').map(s => s.trim()) // Split the values by the space, after ensuring there are spaces between the functions
  let returnStyles = []
  for(let i = 0; i < transformValues.length; i++) {
    if(transformValues[i] == undefined || transformValues[i] == '') continue

    let [property, value] = transformValues[i].split('(').map(s => s.trim())
    value = value.replace(')', '')

    const dir = ['x', 'y', 'z']
    let negativeFlags = []

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
      case 'translateZ':
        value = util.convertUnits(value)
        if (valueIsNegative(value)) value = util.convertUnits(value.replace('[-', '').replace(']', ''))
        returnStyles.push(`translate-z-${value}`)
        break
      case 'rotate':
        returnStyles.push(convertRotation('rotate', value, ''))
        break
      case 'rotateX':
        returnStyles.push(convertRotation('rotate-x', value, ''))
        break
      case 'rotateY':
        returnStyles.push(convertRotation('rotate-y', value, ''))
        break
      case 'rotateZ':
        returnStyles.push(convertRotation('rotate-z', value, ''))
        break
      case 'rotate3d':
        let rotations3d = value.split(',').map(s => s.trim())
        if (rotations3d.length < 4) break
        const rotationVal = rotations3d[3].replace('deg', '').replace('rad', '').replace('turn', '').replace('grad', '')
        const rotationUnit = rotations3d[3].replace(rotationVal, '')
        if (rotations3d[0] != '0') returnStyles.push(convertRotation('rotate-x', `${rotationVal * rotations3d[0]}${rotationUnit}`, ''))
        if (rotations3d[1] != '0') returnStyles.push(convertRotation('rotate-y', `${rotationVal * rotations3d[1]}${rotationUnit}`, ''))
        if (rotations3d[2] != '0') returnStyles.push(convertRotation('rotate-z', `${rotationVal * rotations3d[2]}${rotationUnit}`, ''))
        break
      case 'scale':
        let scalings = value.split(', ').map(s => s.trim())
        if (scalings.length == 1) returnStyles.push(convertScalar('scale', scalings[0], ''))
        else {
          returnStyles.push(convertScalar('scale-x', scalings[0], ''))
          returnStyles.push(convertScalar('scale-y', scalings[1], ''))
        } 
        break
      case 'scale3d':
        let scalings3d = value.split(', ').map(s => s.trim())
        if (scalings3d.length == 1) returnStyles.push(convertScalar('scale', scalings3d[0], ''))
        else if (scalings3d.length == 2) {
          returnStyles.push(convertScalar('scale-x', scalings3d[0], ''))
          returnStyles.push(convertScalar('scale-y', scalings3d[1], ''))
        } else if (scalings3d.length == 3) {
          returnStyles.push(convertScalar('scale-x', scalings3d[0], ''))
          returnStyles.push(convertScalar('scale-y', scalings3d[1], ''))
          returnStyles.push(convertScalar('scale-z', scalings3d[2], ''))
        }
        break
      case 'scaleX':
        returnStyles.push(convertScalar('scale-x', value, ''))
        break
      case 'scaleY':
        returnStyles.push(convertScalar('scale-y', value, ''))
        break
      case 'scaleZ':
        returnStyles.push(convertScalar('scale-z', value, ''))
        break
      case 'skewX':
        returnStyles.push(convertRotation('skew-x', value, ''))
        break
      case 'skewY':
        returnStyles.push(convertRotation('skew-y', value, ''))
        break
      case 'skew':
        let skews = value.split(', ').map(s => s.trim())
        if (skews.length == 1) returnStyles.push(convertRotation('skew', skews[0], ''))
        else if (skews.length == 2) {
          returnStyles.push(convertRotation('skew-x', skews[0], ''))
          returnStyles.push(convertRotation('skew-y', skews[1], ''))
        }
        break
      case 'translate':
        let translations = value.split(',').map(s => s.trim())
        negativeFlags = []
        for(let i = 0; i < translations.length; i++) {
          const [value, isNeg] = formatTranslateValue(translations[i])
          translations[i] = value
          negativeFlags.push(isNeg ? '-' : '')
        }
        for (let i = 0; i < translations.length; i++) returnStyles.push(`${negativeFlags[i]}translate-${dir[i]}-${translations[i]}`)
        break
      case 'translate3d':
        let translations3d = value.split(',').map(s => s.trim())
        negativeFlags = []
        for(let i = 0; i < translations3d.length; i++) {
          const [value, isNeg] = formatTranslateValue(translations3d[i])
          translations3d[i] = value
          negativeFlags.push(isNeg ? '-' : '')
        }
        for (let i = 0; i < translations3d.length; i++) returnStyles.push(`${negativeFlags[i]}translate-${dir[i]}-${translations3d[i]}`)
        break
      default:
        // createNotification(`${property}: ${value} could not be converted cleanly`, '1')
        returnStyles.push(`![${property}:(${util.replaceSpacesWithUnderscores(value)})]`)
        break
      
    }
  }
  return returnStyles
}

function valueIsNegative(value) {
  if(value != undefined && value.startsWith('[-')) {
    isNegative = '-'
    return true
  } else if(value != undefined && value.trim().startsWith('-') && /^-?\d/.test(value.trim())) {
    isNegative = '-'
    return true
  } else {
    isNegative = ''
    return false
  }
  
}