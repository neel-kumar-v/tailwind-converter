import './style.css'
import { shorthandDict, unitDict, borderRadiusUnitDict, blurUnitDict, letterSpacingUnitDict, fontWeightUnitDict, singleValueDict, propertylessDict, borderRadiusDict, cssAtRules, mediaQueryDict, viewportBreakpoints } from './dictionaries'
import * as util from './utilities'
import { inject } from '@vercel/analytics'
import { createAlert } from "./alerts"
import { createNotification } from "./notification"
// import { tokenize } from  '@csstools/tokenizer'

inject() // 

const outputElement = document.getElementById('output');
const cssButton = document.getElementById('copycss')
const tailwindButton = document.getElementById('copytailwind')
const input = document.getElementById('input')

const numberRegex = /\d/
const zeroRegex = /0[a-zA-Z]*/
  
cssButton.addEventListener('click', () => {
  copy(inputEditor.getValue())
})

tailwindButton.addEventListener('click', () => {
  if (outputTailwind == '') {
    createNotification('Nothing was copied')
  }
  copy('all TailwindCSS directives', `${outputTailwind}`)
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
inputEditor.on('change', () => {
  // const css = inputEditor.getValue()
  // console.log(css)
  // for (const token of tokenize(css)) {
  //   if (token.type != 3) {

  //     console.log(token) // logs an individual CSSToken
  //   }
  // }
  // outputTailwind = convertCSSToPVPair(css)
  // const jsonOutput = parseOutput(outputTailwind)
  // displayOutputWithSelectors(jsonOutput)
})










// ! Old Code
// ! Old Code
// ! Old Code

function resetDisplay() {
  const outputElement = document.getElementById('output')
  outputElement.innerHTML = '';
}
// TODO: Fix copycss function
function copy(type, text) {
  if(text == '' || text == undefined) {
    createNotification(`Nothing to copy here!`, 3);
    return
  }
  navigator.clipboard.writeText(text);
  const longText = text.length > 40 ? ' ...' : ''
  createNotification(`Copied ${type}: ${text.slice(0, 40)}${longText}`, 3);
}
function createCustomizableButton(text, color, outlineStyles) {
  const button = document.createElement('button')
    button.className = `inline-flex cursor-pointer select-none text-left duration-200 flex-wrap items-center justify-center no-underline hover:no-underline w-fit mr-2 p-1 px-3 hover:px-1.5 h-fit group rounded-lg ${color} my-1  class-copybutton`
    button.style = outlineStyles
    button.innerHTML = `
      <p class="group-hover:mr-1 duration-200 text-sm xl:text-md text-white font-normal class-name">${text}</p>
      <svg class="w-0 group-hover:w-4 opacity-0 group-hover:opacity-100 duration-200 aspect-square stroke-1 fill-white" viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
        <rect class="w-6 aspect-square stroke-none fill-white opacity-0"/>
        <g transform="matrix(1.43 0 0 1.43 12 12)" >
          <path style="stroke: none stroke-width: 1 stroke-dasharray: none stroke-linecap: butt stroke-dashoffset: 0 stroke-linejoin: miter stroke-miterlimit: 4  fill-rule: nonzero opacity: 1" transform=" translate(-8, -7.5)" d="M 2.5 1 C 1.675781 1 1 1.675781 1 2.5 L 1 10.5 C 1 11.324219 1.675781 12 2.5 12 L 4 12 L 4 12.5 C 4 13.324219 4.675781 14 5.5 14 L 13.5 14 C 14.324219 14 15 13.324219 15 12.5 L 15 4.5 C 15 3.675781 14.324219 3 13.5 3 L 12 3 L 12 2.5 C 12 1.675781 11.324219 1 10.5 1 Z M 2.5 2 L 10.5 2 C 10.78125 2 11 2.21875 11 2.5 L 11 10.5 C 11 10.78125 10.78125 11 10.5 11 L 2.5 11 C 2.21875 11 2 10.78125 2 10.5 L 2 2.5 C 2 2.21875 2.21875 2 2.5 2 Z M 12 4 L 13.5 4 C 13.78125 4 14 4.21875 14 4.5 L 14 12.5 C 14 12.78125 13.78125 13 13.5 13 L 5.5 13 C 5.21875 13 5 12.78125 5 12.5 L 5 12 L 10.5 12 C 11.324219 12 12 11.324219 12 10.5 Z" stroke-linecap="round" />
        </g>
      </svg>
    `
    return button
}

function findParentBySelector(element, tagname) {
  if (element.tagName == tagname) return element
  else return findParentBySelector(element.parentElement, tagname)
}

function handleHoverOnConflictingClasses(event, isHovering) {
  let element = findParentBySelector(event.target, 'BUTTON')
  let colorKey = element.getAttribute('data-colorMatch')
  // find all other peer buttons that have the same colorKey
  let buttons = Array.from(element.parentElement.getElementsByClassName('class-copybutton'))
  if(isHovering) {
    // console.log('mouse over')
    buttons.forEach(button => {
      if(button.getAttribute('data-colorMatch') == null || button.getAttribute('data-colorMatch') != colorKey) {
        button.style.opacity =  '0.2'
      }
    })
  } else {
    console.log('mouse out')
    buttons.forEach(button => {
      button.style.opacity = '1'
    })
  }
}

function createOutputSelectorDiv(selector, json) {
  const outputSelectorDiv = document.createElement('div')
  outputSelectorDiv.className = 'outputSelector first:mt-0 my-6'
  
  const selectorFlexContainer = document.createElement('div')
  selectorFlexContainer.className = 'flex flex-wrap justify-start mb-3 has-[:hover]:flex-nowrap'
  
  const selectorNameElement = document.createElement('h2')
  selectorNameElement.className = 'selector mr-2 font-normal text-xl xl:text-2xl text-white p-1'
  selectorNameElement.textContent = selector
  selectorFlexContainer.appendChild(selectorNameElement)
  
  const selectorCopyButton1 = document.createElement('button')
  selectorCopyButton1.className = 'inline-flex cursor-pointer select-none text-left duration-100 flex-wrap items-center justify-center no-underline hover:no-underline hover:bg-white/[0.1] w-fit xl:mx-3 mx-1 p-1 xl:px-3 px-1 rounded-lg'
  selectorCopyButton1.innerHTML = `
    <p class="mr-2 text-sm xl:text-md text-white/75 font-normal normal-case">Copy as TailwindCSS directive</p>
    <svg-icon width="5" opacity="75"></svg-icon>
  `
  selectorCopyButton1.addEventListener('click', () => copy('selector tailwind directive ', `${selector} {\n  @apply ${json[selector].join(' ')}\n}`))
  selectorFlexContainer.appendChild(selectorCopyButton1)
  
  const selectorCopyButton2 = document.createElement('button')
  selectorCopyButton2.className = 'inline-flex cursor-pointer select-none text-left duration-100 flex-wrap items-center justify-center no-underline hover:no-underline hover:bg-white/[0.1] w-fit mx-3 p-1 px-3 rounded-lg'
  selectorCopyButton2.innerHTML = `
    <p class="mr-2 text-sm xl:text-md text-white/75 font-normal normal-case">Copy as TailwindCSS classes</p>
    <svg-icon width="5" opacity="75"></svg-icon>
  `
  selectorCopyButton2.addEventListener('click', () => copy('selector tailwind classes', `${json[selector].join(' ')}`))
  selectorFlexContainer.appendChild(selectorCopyButton2) 
  outputSelectorDiv.appendChild(selectorFlexContainer)
  
  const classesFlexContainer = document.createElement('div')
  classesFlexContainer.className = 'classes flex flex-wrap justify-start'
  
  json[selector].forEach(className => {
    let classButton = createCustomizableButton(className, 'bg-white/[0.1]', '')
    classButton.addEventListener('click', () => copy('the tailwind class', className))
    if(className.includes('!')) {
      classButton = createCustomizableButton(className.substring(1), 'bg-red-500/[0.5]', '')
      let tooltip = document.createElement('div')
      tooltip.className = 'tooltip tooltip-error'
      tooltip.setAttribute('data-tooltip', 'No TailwindCSS equivalent: not recommended')
      tooltip.appendChild(classButton)
      // tooltip.addEventListener('mouseover', (event) => {
      //   let element = findParentBySelector(event.target, 'DIV')
      //   element.classList.add('tooltip-open')
      // })
      // tooltip.addEventListener('mouseleave', (event) => {
      //   let element = findParentBySelector(event.target, 'DIV')
      //   element.classList.remove('tooltip-open')
      // })
      classesFlexContainer.appendChild(tooltip)
    }
    else if (className.includes('?')) {
      let colorDict = {
        "0": "59, 130, 246",
        "1": "34, 197, 94",
        "2": "234, 179, 8",
        "3": "139, 92, 246",
        "4": "249, 115, 22",
        "5": "236, 72, 153",
        "6": "20, 184, 166",
        "7": "6, 182, 212",
        "8": "99, 102, 241",
        "9": "132, 204, 22"
      }

      let split = className.split('?')
      let colorKey = split[0]
      classButton = createCustomizableButton(split[1], `bg-transparent`, `outline: 2px solid rgba(${colorDict[colorKey]}, 0.5); background-color: rgba(${colorDict[colorKey]}, 0.24);`)
      classButton.setAttribute('data-colorMatch', colorKey)
      classesFlexContainer.appendChild(classButton)
      classButton.addEventListener('mouseover', (event) => handleHoverOnConflictingClasses(event, true))
      classButton.addEventListener('mouseleave', (event) => handleHoverOnConflictingClasses(event, false))
    }
    else {
      classesFlexContainer.appendChild(classButton)
    }
  })
  
  outputSelectorDiv.appendChild(classesFlexContainer)
  outputElement.appendChild(outputSelectorDiv)
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      classesFlexContainer.classList.replace('flex-wrap', 'flex-nowrap');
    }, 0);
  })
}


function displayOutputWithSelectors(json) {
  resetDisplay();
  Object.keys(json).forEach(selector => createOutputSelectorDiv(selector, json));
}

function parseOutput(cssString) {
    // Remove @apply and extra spaces
    const cleanedCss = cssString.replace(/@apply\s+/g, '').trim() // Remove the @apply and any extra spaces
  
    let jsonResult = {};
    
    
    const cssRules = cleanedCss.trim().split('}').filter(rule => rule.trim().length > 0).map(str => str.trim()) // cssrules is an
    console.log(cleanedCss)
    
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
        returnStyles.push(`insideAtRuletranslate-x-${value}`)
        break
      case 'translateY':
        value = util.convertUnits(value)
        if (valueIsNegative(value)) value = util.convertUnits(value.replace('[-', '').replace(']', ''))
        returnStyles.push(`insideAtRuletranslate-y-${value}`)
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
        returnStylesTranslate.push(`insideAtRuletranslate-x-${translateX}`)

        if (valueIsNegative(translateY)) translateY = util.convertUnits(translateY.replace('[-', '').replace(']', ''))
        returnStylesTranslate.push(`insideAtRuletranslate-y-${translateY}`)

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
    console.log(`${debugStringBuilder}`)
    
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
      console.log(debugStringBuilder)
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
      return appendToStylesList(`insideAtRuleunderline-offset-${value}`)
    case 'outline-width':
      if(numberRegex.test(value)) value = util.revertUnits(unitDict, value)
      return appendToStylesList(`outline-${value.replace('px', '')}`)
    case 'outline-offset':
      if(numberRegex.test(value)) value = util.revertUnits(unitDict, value)
      return appendToStylesList(`insideAtRuleoutline-offset-${value.replace('px', '')}`)
    case 'letter-spacing':
      value = value.replace('[', '').replace(']', '')
      return appendToStylesList(`insideAtRuletracking-${util.irregularConvertUnits(letterSpacingUnitDict, value)}`)

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
        returnStyles.push(`insideAtRuleinset-${values[0]}`)
      } else if (values.length === 2) {
        returnStyles.push(`insideAtRuleinset-y-${values[0]}`)
        returnStyles.push(`insideAtRuleinset-x-${values[1]}`)
      } else if (values.length === 3) {
        returnStyles.push(`insideAtRuletop-${values[0]}`)
        returnStyles.push(`insideAtRuleinset-x-${values[1]}`)
        returnStyles.push(`insideAtRulebottom-${values[2]}`)
      } else if (values.length === 4) {
        returnStyles.push(`insideAtRuletop-${values[0]}`)
        returnStyles.push(`insideAtRuleright-${values[1]}`)
        returnStyles.push(`insideAtRulebottom-${values[2]}`)
        returnStyles.push(`insideAtRuleleft-${values[3]}`)
      }
      return appendToStylesList(returnStyles)

    // * NUMBER NO UNIT
    case 'order':
      if(value == '0') return appendToStylesList(`order-none`)
      else return appendToStylesList(`insideAtRuleorder-${value}`)
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
      else return appendToStylesList(`insideAtRuleshrink-0`)
    
    // * WORDS
    case 'isolate':
      if(value.includes('isolate')) return appendToStylesList(`isolate`)
      else return appendToStylesList(`isolation-${value}`)
      break
    case 'flex-direction': return appendToStylesList(`insideAtRuleflex-${value}`.replace('column', 'col'))
  
    // TODO: Flex
    case 'grid-auto-flow': return appendToStylesList(`insideAtRulegrid-flow-${value}`.replace(' ', '-').replace('column', 'col'))
    
    case 'font-style': 
      if(value.includes('italic')) return appendToStylesList(`insideAtRuleitalic`)
      else if(value.includes('normal')) return appendToStylesList(`insideAtRulenot-italic`)
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
  console.table(styles)
  return styles.join(' ')
}




