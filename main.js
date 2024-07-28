import { EditorView } from "@codemirror/view"
import { basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"
import './style.css'
import { shorthandDict, unitDict, borderRadiusUnitDict, blurUnitDict, letterSpacingUnitDict, fontWeightUnitDict, singleValueDict, propertylessDict, borderRadiusDict } from './dictionaries'
import * as util from './utilities'
import { inject } from '@vercel/analytics'
import { createAlert } from "./alerts"
import { createNotification } from "./notification"

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
})
let outputTailwind = ''
inputEditor.on('change', () => {
  const css = inputEditor.getValue()
  outputTailwind = convertCSSToPVPair(css)
  const jsonOutput = parseOutput(outputTailwind)
  displayOutputWithSelectors(jsonOutput)
})

function resetDisplay() {
  const outputElement = document.getElementById('output')
  outputElement.innerHTML = '';
}

function copy(type, text) {
  if(text == '' || text == undefined) {
    createNotification(`Nothing to copy here!`, 3);
    return
  }
  navigator.clipboard.writeText(text);
  const longText = text.length > 40 ? ' ...' : ''
  createNotification(`Copied ${type}: ${text.slice(0, 40)}${longText}`, 3);
}



function createOutputSelectorDiv(selector, json) {
  const outputSelectorDiv = document.createElement('div')
  outputSelectorDiv.className = 'outputSelector first:mt-0 my-6'
  
  const selectorFlexContainer = document.createElement('div')
  selectorFlexContainer.className = 'flex flex-wrap justify-start mb-3'
  
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
    const classButton = document.createElement('button')
    classButton.className = 'inline-flex cursor-pointer select-none text-left duration-100 flex-wrap items-center justify-center no-underline hover:no-underline w-fit mr-2 p-1 px-3 hover:px-1.5 h-fit group rounded-lg bg-white/[0.1] my-1 class-copybutton'
    classButton.innerHTML = `
      <p class="group-hover:mr-1 duration-200 text-sm xl:text-md text-white font-normal class-name">${className}</p>
      <svg class="w-0 group-hover:w-4 opacity-0 group-hover:opacity-100 duration-200 aspect-square stroke-1 fill-white" viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
        <rect class="w-6 aspect-square stroke-none fill-white opacity-0"/>
        <g transform="matrix(1.43 0 0 1.43 12 12)" >
          <path style="stroke: none stroke-width: 1 stroke-dasharray: none stroke-linecap: butt stroke-dashoffset: 0 stroke-linejoin: miter stroke-miterlimit: 4  fill-rule: nonzero opacity: 1" transform=" translate(-8, -7.5)" d="M 2.5 1 C 1.675781 1 1 1.675781 1 2.5 L 1 10.5 C 1 11.324219 1.675781 12 2.5 12 L 4 12 L 4 12.5 C 4 13.324219 4.675781 14 5.5 14 L 13.5 14 C 14.324219 14 15 13.324219 15 12.5 L 15 4.5 C 15 3.675781 14.324219 3 13.5 3 L 12 3 L 12 2.5 C 12 1.675781 11.324219 1 10.5 1 Z M 2.5 2 L 10.5 2 C 10.78125 2 11 2.21875 11 2.5 L 11 10.5 C 11 10.78125 10.78125 11 10.5 11 L 2.5 11 C 2.21875 11 2 10.78125 2 10.5 L 2 2.5 C 2 2.21875 2.21875 2 2.5 2 Z M 12 4 L 13.5 4 C 13.78125 4 14 4.21875 14 4.5 L 14 12.5 C 14 12.78125 13.78125 13 13.5 13 L 5.5 13 C 5.21875 13 5 12.78125 5 12.5 L 5 12 L 10.5 12 C 11.324219 12 12 11.324219 12 10.5 Z" stroke-linecap="round" />
        </g>
      </svg>
    `
    classButton.addEventListener('click', () => copy('the tailwind class', className))
    classesFlexContainer.appendChild(classButton)
  })
  
  outputSelectorDiv.appendChild(classesFlexContainer)
  outputElement.appendChild(outputSelectorDiv)
}
function displayOutputWithSelectors(json) {
  resetDisplay();
  Object.keys(json).forEach(selector => createOutputSelectorDiv(selector, json));
}

function parseOutput(cssString) {
    // Remove @apply and extra spaces
    const cleanedCss = cssString.replace(/@apply\s+/g, '').trim() // Remove the @apply and any extra spaces
  
    // Split by selector and braces
    let jsonResult = {};
    
    const cssRules = cleanedCss.split('}').filter(rule => rule.trim().length > 0)
    
    cssRules.forEach(rule => {
        // Extract the selector and the class definitions
        const [selector, classes] = rule.split('{').map(part => part.trim())
        // console.log(`selector, classes :
        //   ${selector}, ${classes}`)
        // Split the classes into an array
        const classArray = classes.split(/\s+/).filter(className => className.length > 0)
        // console.log(`class array:
        //   ${classArray}`)
        // Add to the result object
        jsonResult[selector] = classArray
    });
  console.log(jsonResult)
  return jsonResult;
}

function convertLinearWithAvailableValues(stylesList, propertyName, value, availableValues, backdrop) {
  console.log(availableValues.includes(Number(value)))
  if(availableValues.includes(Number(value))) appendToStylesList(stylesList, `${isNegative}${backdrop}${propertyName}-${value * 100}`) // If the newValue is a number tailwind has a builtin number for, then use it multiplied by 100
  else appendToStylesList(stylesList, `${isNegative}${backdrop}${property}-[${value}]`) // Else use a arbitrary value
}

function convertRotationWithAvailableValues(stylesList, propertyName, value, availableValues, backdrop) {
  value = value.replace('deg', '')  // Remove the deg from the value for parsing
  if(availableValues.includes(Number(value))) appendToStylesList(stylesList, `${isNegative}${backdrop}${propertyName}-${value}`) // If the newValue is a number tailwind has a builtin number for, then use it
  else appendToStylesList(stylesList, `${isNegative}${backdrop}${propertyName}-[${value}deg]`) // Else use a arbitrary value and add deg back to it 
}

function convertPercentageScaledWithAvailableValues(stylesList, propertyName, value, backdrop) {
  if(value.includes('100%')) appendToStylesList(stylesList, `${isNegative}${backdrop}${propertyName}`) // If the value is 100%, then just use the property name
  else if(zeroRegex.test(value)) appendToStylesList(stylesList, `${isNegative}${backdrop}${propertyName}-0`) // If the value is 0, then just use the property name with a 0
  else appendToStylesList(stylesList, `${isNegative}${backdrop}${propertyName}-[${value}]`) // Else use the property name with the value in brackets
}

function convertFilterToTailwind(property, value, stylesList) {
  let [newProperty, newValue] = value.split('(').map(s => s.trim()) // EX: filter: blur(4px); treated as blur: 4px
  newValue = newValue.replace(')', '')
  const backdrop = (property == 'backdrop-filter') ? 'backdrop-' : '' // Filter and backdrop-filter are grouped so the backdrop prefix can be added concisely
  switch(newProperty) {
    case 'blur':
      appendToStylesList(stylesList, `${isNegative}${backdrop}blur-${util.irregularConvertUnits(blurUnitDict, newValue)}`)
      break
    case 'brightness':
      convertLinearWithAvailableValues(stylesList, 'brightness', newValue, [0, 0.5, 0.75, 0.9, 0.95, 1, 1.05, 1.1, 1.25, 1.5, 2], backdrop)
      break
    case 'contrast':
      convertLinearWithAvailableValues(stylesList, 'contrast', newValue, [0, 0.5, 0.75, 1, 1.25, 1.5, 2], backdrop)
      break
    case 'grayscale':
      convertPercentageScaledWithAvailableValues(stylesList, 'grayscale', newValue, backdrop)
      break
    case 'hue-rotate':
      convertRotationWithAvailableValues(stylesList, 'hue-rotate', newValue, [0, 15, 30, 60, 90, 180], backdrop)
      break
    case 'invert':
      convertPercentageScaledWithAvailableValues(stylesList, 'invert', newValue, backdrop)
      break
    case 'saturate':
      convertLinearWithAvailableValues(stylesList, 'saturate', newValue, [0, 0.5, 1, 1.5, 2], backdrop)
      break
    case 'sepia':
      convertPercentageScaledWithAvailableValues(stylesList, 'sepia', newValue, backdrop)
      break
    default:
      appendToStylesList(stylesList, `${isNegative}!(${property}: ${value})`)
      createNotification(`(${property}: ${value}) could not be converted`, 1)
      break

  }
}




function convertShorthandToTailwind(stylesList, property, value) {
  const shorthandValues = util.shorthand(value.split(' '), shorthandDict[property]) // Split the values by space and parse the shorthand notation
  for (let i = 0; i < shorthandValues.length; i++) {
    appendToStylesList(stylesList, `${isNegative}shorthandValues[i]`) // Push each value to the stylesList
  }
}

function convertPropertylessToTailwind(stylesList, property, value) {
  // Edge cases where the value is not the same as the tailwind class
  if (property == 'display' && value == 'none') appendToStylesList(stylesList, `hidden`)
  else if (property == 'visibility' && value == 'hidden') appendToStylesList(stylesList, `invisible`)
  else if (property == 'font-variant-numeric' && value == 'normal') appendToStylesList(stylesList, `normal-nums`)
  else if (property == 'text-decoration-line' && value == 'none') appendToStylesList(stylesList, `no-underline`)
  else if (property == 'overflow-wrap' && value == 'break-word') appendToStylesList(stylesList, `break-words`)
  else if (property == 'text-transform' && value == 'none') appendToStylesList(stylesList, `normal-case`)
  else appendToStylesList(stylesList, `${value}`) 
}

function appendToStylesList(stylesList, value) {
  if(insideCSSRule) {
    stylesList.push(value)
  } else {
    createAlert(`The value ${value} was not inside a CSS rule and was not converted to TailwindCSS`)
  }

}

let insideCSSRule = false;
let isNegative = '';

function removeNegative(value) {
  return value.replace('[-', '').replace(']', '')
}

function parseTransformRule(property, value, stylesList) {
  const transformValues = value.replace(/\)(?=[a-zA-Z])/g, ')) ').split(') ').map(s => s.trim()) // Split the values by the space, after ensuring there are spaces between the functions
  for(let i = 0; i < transformValues.length; i++) {
    if(transformValues[i] == undefined || transformValues[i] == '') continue

    let [property, value] = transformValues[i].split('(').map(s => s.trim())
    value = value.replace(')', '')

    switch(property) {
      case 'translateX':
        value = util.convertUnits(value)
        if (valueIsNegative(value)) value = util.convertUnits(value.replace('[-', '').replace(']', ''))
        appendToStylesList(stylesList, `${isNegative}translate-x-${value}`)
        break
      case 'translateY':
        value = util.convertUnits(value)
        if (valueIsNegative(value)) value = util.convertUnits(value.replace('[-', '').replace(']', ''))
        appendToStylesList(stylesList, `${isNegative}translate-y-${value}`)
        break
      case 'rotate':
        convertRotationWithAvailableValues(stylesList, 'rotate', value, [0, 1, 2, 3, 6, 12, 45, 90, 180], '')
        break
      case 'scale':
        convertLinearWithAvailableValues(stylesList, 'scale', value, [0, 0.5, 0.75, 0.9, 0.95, 1, 1.05, 1.1, 1.25, 1.5], '')
        break
      case 'scaleX':
        convertLinearWithAvailableValues(stylesList, 'scale-x', value, [0, 0.5, 0.75, 0.9, 0.95, 1, 1.05, 1.1, 1.25, 1.5], '')
        break
      case 'scaleY':
        convertLinearWithAvailableValues(stylesList, 'scale-y', value, [0, 0.5, 0.75, 0.9, 0.95, 1, 1.05, 1.1, 1.25, 1.5], '')
        break
      case 'skewX':
        convertRotationWithAvailableValues(stylesList, 'skew-x', value, [0, 1, 2, 3, 6, 12], '')
        break
      case 'skewY':
        convertRotationWithAvailableValues(stylesList, 'skew-y', value, [0, 1, 2, 3, 6, 12], '')
        break
      case 'translate':
        let split = value.split(', ')
        let [translateX, translateY, translateZ] = [util.convertUnits(split[0]), util.convertUnits(split[1]), split[2]]

        if (valueIsNegative(translateX)) translateX = util.convertUnits(translateX.replace('[-', '').replace(']', ''))
        appendToStylesList(stylesList, `${isNegative}translate-x-${translateX}`)

        if (valueIsNegative(translateY)) translateY = util.convertUnits(translateY.replace('[-', '').replace(']', ''))
        appendToStylesList(stylesList, `${isNegative}translate-y-${translateY}`)

        appendToStylesList(stylesList, `transform-[translateZ(${translateZ.replace(/\s/g, '_')})]`)
        break
      default:
        appendToStylesList(stylesList, `transform-[${property}(${value.replace(/\s/g, '_')})]`)
        createNotification(`${property}: ${value} could not be converted cleanly`, '1')
        break
      
    }
  }
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
function convertPVPairToTailwind(stylesList, style) {
  let [property, value] = style.split(':').map(s => s.trim()) // Split up the properties and the styles
  if(property.includes('/*')) return stylesList // If it is a comment, ignore it
  if(value != undefined) value = value.replace(';', '') // Get rid of the semicolon
  else {
    if(property.includes('{')) {
      // if(insideCSSRule) createAlert('Error: Nested CSS rules are not supported yet')
      insideCSSRule = true
      appendToStylesList(stylesList, `${property}\n @apply`) // If its the style declaration: list it out and enter a new line
      return stylesList
    } else if(property.includes('}')) {
      appendToStylesList(stylesList, `\n} \n`) // If it is the ending bracket: enter past the styles place the bracket, then enter another new line
      insideCSSRule = false
      return stylesList
    } else {
      value = ''
    }

  } 


  if(property == 'filter' || property == 'backdrop-filter') {
    convertFilterToTailwind(property, value, stylesList)  // Case #1: The filter and backdrop-filter properties all have many different values based on their functions
    return stylesList;
  }

  if(property == "transform") {
    parseTransformRule(property, value, stylesList) // Case #2: The transform property has many different values based on their functions
    return stylesList
  } 

  value = util.convertUnits(value)

  console.log(value)
  if (valueIsNegative(value)) value = util.convertUnits(value.replace('[-', '').replace(']', '')).replace('[-', '[')

    // * EDGE CASES
  switch (property) {
    // * SINGLE VALUES WITH UNITS
    // * BORDER CORNER RADIUS
    // * STYLES THAT NEED REVERTED UNITS
    case 'text-decoration-thickness':
      if(numberRegex.test(value)) value = util.revertUnits(unitDict, value).replace('px', '')
      appendToStylesList(stylesList, `${isNegative}decoration-${value}`)
      break
    case 'text-underline-offset':
      if(numberRegex.test(value)) value = util.revertUnits(unitDict, value)
      appendToStylesList(stylesList, `${isNegative}underline-offset-${value}`)
      break
    case 'outline-width':
      if(numberRegex.test(value)) value = util.revertUnits(unitDict, value)
      appendToStylesList(stylesList, `${isNegative}outline-${value.replace('px', '')}`)
      break
    case 'outline-offset':
      if(numberRegex.test(value)) value = util.revertUnits(unitDict, value)
      appendToStylesList(stylesList, `${isNegative}outline-offset-${value.replace('px', '')}`)
      break
    case 'letter-spacing':
      value = value.replace('[', '').replace(']', '')
      appendToStylesList(stylesList, `${isNegative}tracking-${util.irregularConvertUnits(letterSpacingUnitDict, value)}`)
      break

    // * SHORTHANDABLE VALUES EDGE CASES
    
    case 'border-radius':
      let borderRadiuses = value.split(' ')
      for(let i = 0; i < borderRadiuses.length; i++) {
        borderRadiuses[i] = util.translateConvertedToIrregular(borderRadiusUnitDict, borderRadiuses[i])
      }
      if (borderRadiuses.length === 1) {
        appendToStylesList(stylesList, `${isNegative}rounded-${borderRadiuses[0]}`.replace('-/', ''))
      } else if (borderRadiuses.length === 2) {
        appendToStylesList(stylesList, `${isNegative}rounded-tl-${borderRadiuses[0]}`.replace('-/', ''))
        appendToStylesList(stylesList, `${isNegative}rounded-br-${borderRadiuses[0]}`.replace('-/', ''))
        appendToStylesList(stylesList, `${isNegative}rounded-tr-${borderRadiuses[1]}`.replace('-/', ''))
        appendToStylesList(stylesList, `${isNegative}rounded-bl-${borderRadiuses[1]}`.replace('-/', ''))
      } else if (borderRadiuses.length === 3) { 
        appendToStylesList(stylesList, `${isNegative}rounded-tl-${borderRadiuses[0]}`.replace('-/', ''))
        appendToStylesList(stylesList, `${isNegative}rounded-tr-${borderRadiuses[1]}`.replace('-/', ''))
        appendToStylesList(stylesList, `${isNegative}rounded-bl-${borderRadiuses[1]}`.replace('-/', ''))
        appendToStylesList(stylesList, `${isNegative}rounded-br-${borderRadiuses[2]}`.replace('-/', ''))
      } else if (borderRadiuses.length === 4) {
        appendToStylesList(stylesList, `${isNegative}rounded-tl-${borderRadiuses[0]}`.replace('-/', ''))
        appendToStylesList(stylesList, `${isNegative}rounded-tr-${borderRadiuses[1]}`.replace('-/', ''))
        appendToStylesList(stylesList, `${isNegative}rounded-br-${borderRadiuses[2]}`.replace('-/', ''))
        appendToStylesList(stylesList, `${isNegative}rounded-bl-${borderRadiuses[3]}`.replace('-/', ''))
      }
      break

    case 'inset':
      const values = value.split(' ')
      if (values.length === 1) {
        appendToStylesList(stylesList, `${isNegative}inset-${values[0]}`)
      } else if (values.length === 2) {
        appendToStylesList(stylesList, `${isNegative}inset-y-${values[0]}`)
        appendToStylesList(stylesList, `${isNegative}inset-x-${values[1]}`)
      } else if (values.length === 3) {
        appendToStylesList(stylesList, `${isNegative}top-${values[0]}`)
        appendToStylesList(stylesList, `${isNegative}inset-x-${values[1]}`)
        appendToStylesList(stylesList, `${isNegative}bottom-${values[2]}`)
      } else if (values.length === 4) {
        appendToStylesList(stylesList, `${isNegative}top-${values[0]}`)
        appendToStylesList(stylesList, `${isNegative}right-${values[1]}`)
        appendToStylesList(stylesList, `${isNegative}bottom-${values[2]}`)
        appendToStylesList(stylesList, `${isNegative}left-${values[3]}`)
      }
      break

    // * NUMBER NO UNIT
    case 'order':
      if(value == '0') appendToStylesList(stylesList, `${isNegative}order-none`)
      else appendToStylesList(stylesList, `${isNegative}order-${value}`)
      break
    case 'opacity':
      appendToStylesList(stylesList, `${isNegative}opacity-${value * 100}`)
      break
    case 'aspect-ratio':
      if(value.includes('1 / 1')) appendToStylesList(stylesList, `${isNegative}aspect-square`)
      if(value.includes('16 / 9')) appendToStylesList(stylesList, `${isNegative}aspect-video`)
      else appendToStylesList(stylesList, `${isNegative}aspect-${value}`)
      break
    case 'font-weight':
      appendToStylesList(stylesList, `${isNegative}font-${util.irregularConvertUnits(fontWeightUnitDict, value)}`)
      break
    case 'flex-grow':
      if(value.includes('1')) appendToStylesList(stylesList, `${isNegative}grow`)
      else appendToStylesList(stylesList, `${isNegative}grow-0`)
      break
    case 'flex-shrink':
      if(value.includes('1')) appendToStylesList(stylesList, `${isNegative}shrink`)
      else appendToStylesList(stylesList, `${isNegative}shrink-0`)
      break
    
    // * WORDS
    case 'isolate':
      if(value.includes('isolate')) appendToStylesList(stylesList, `${isNegative}isolate`)
      else appendToStylesList(stylesList, `${isNegative}isolation-${value}`)
      break
    case 'flex-direction':
      appendToStylesList(stylesList, `${isNegative}flex-${value}`.replace('column', 'col'))
      break
  
    // TODO: Flex
    case 'grid-auto-flow':
      appendToStylesList(stylesList, `${isNegative}grid-flow-${value}`.replace(' ', '-').replace('column', 'col'))
      break
    case 'flex':
      break
    
    case 'font-style':
      if(value.includes('italic')) appendToStylesList(stylesList, `${isNegative}italic`)
      else if(value.includes('normal')) appendToStylesList(stylesList, `${isNegative}not-italic`)
      break
    case 'text-transform':
      if(value.includes('none')) appendToStylesList(stylesList, `${isNegative}normal-case`)
      else appendToStylesList(stylesList, `${isNegative}${value}`)
      break
    case 'overflow-wrap':
      if(value.include('break-word')) appendToStylesList(stylesList, `${isNegative}break-words`)
      else appendToStylesList(stylesList, `${isNegative}${value}`)
      break
    case 'word-break':
      if(value.includes('keep-all')) appendToStylesList(stylesList, `${isNegative}break-keep`)
      else appendToStylesList(stylesList, `${isNegative}whitespace-pre-${value}`)
      break
    case 'content':
      appendToStylesList(stylesList, `${isNegative}content-[${value}]`)
      break
    // case 'transform-origin':
    //   appendToStylesList(stylesList, `${isNegative}origin-${value}`.replace(' ', '-'))
    //   break
    case 'resize':
      if(value.includes('vertical')) appendToStylesList(stylesList, `${isNegative}resize-y`)
      else if(value.includes('horizontal')) appendToStylesList(stylesList, `${isNegative}resize-x`)
      else if(value.includes('both')) appendToStylesList(stylesList, `${isNegative}resize`)
      else appendToStylesList(stylesList, `${isNegative}resize-${value}`)
      break
    case 'scroll-snap-align':
      if(value.includes('none')) appendToStylesList(stylesList, `${isNegative}snap-align-none`)
      else appendToStylesList(stylesList, `${isNegative}snap-${value}`)
      break
    case 'scroll-snap-type':
      break

    default:
      appendToStylesList(stylesList, `[${property}: ${value}]`)
      break
  }
  
  const valueIsShorthand = (value != undefined && value.split(' ') != undefined && value.split(' ') != null) && value.split(' ').length > 1  // If the value is shorthand and the property is shorthandable
  if (shorthandDict.hasOwnProperty(property) && valueIsShorthand) {
    convertShorthandToTailwind(stylesList, property, value)
    return stylesList
  }

  if (singleValueDict.hasOwnProperty(property) && !valueIsShorthand) appendToStylesList(stylesList, `${isNegative}${singleValueDict[property]}-${value}`) // Applies to most styles: margin, padding, border-width, border-radius, etc

  if (propertylessDict.hasOwnProperty(property)) convertPropertylessToTailwind(stylesList, property, value) // Applies to display, position, visibility, etc
 

  if (borderRadiusDict.hasOwnProperty(property)) {
    value = util.translateConvertedToIrregular(borderRadiusUnitDict, value)
    appendToStylesList(stylesList, `${isNegative}${borderRadiusDict[property]}-${value}`)
  }


  
  return stylesList
}


function convertCSSToPVPair(css) {
  const styles = css.split('\n') // Split styles by line
    .filter(style => style.trim() !== '') // Remove empty lines
    .map(style => style.trim()) // Trim leading/trailing spaces
    .reduce((stylesList, style) => convertPVPairToTailwind(stylesList, style), [])
  return styles.join(' ')
}




