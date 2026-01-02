export const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
export const otherColorRegex = /^(rgb|rgba|hsl|hsla|hsv|cmyk|oklch)\(\s*(-?\d*\.?\d+%?\s*([,\s]+|$)){2,3}(-?\d*\.?\d+%?\s*,?\s*[\d.]*%?\s*)?\)$/
export const numberRegex = /\d/
export const unitRegex = /-?\d*\.?\d+(?:ch|cm|em|ex|in|mm|pc|ms|s|pt|px|rem|vh|vmax|vmin|vw|%)/
export const rotationRegex = /turn|rad|grad/
export const sansSerifRegex = /ui-sans-serif|system-ui|sans-serif|Apple Color Emoji|Segoe UI Emoji|Segoe UI Symbol|Noto Color Emoji/
export const serifRegex = /ui-serif|Georgia|Cambria|Times New Roman|Times|serif/
export const monospaceRegex = /ui-monospace|SFMono-Regular|Menlo|Monaco|Consolas|Liberation Mono|Courier New|monospace/

import { unitDict, colorsDict, tailwindColors } from './dictionaries'
import tinycolor from 'tinycolor2'
import { createNotification } from './notification'
import { remPixelConversionRatio, retrieveSettings } from '../main'
  
export function convertUnits(value) {
    if(value == undefined) {
        // console.log('convertUnits() - value is undefined')
        return value
    }
    value = replaceOperatorSpaces(value).trim()
    const includesMultipleValues = value.split(' ') != undefined && value.split(' ').length > 1 && !value.includes('/') && !value.includes(',')
    // console.log(`convertUnits() - ${value} includes multiple values: ${includesMultipleValues}`)
    
    if (value.includes('rem') && !includesMultipleValues) {
        value = value.replace('rem', '')
        const num = parseFloat(value)
        retrieveSettings()
        value = `${num * remPixelConversionRatio}px`
    }
    // console.log(`Value: ${value}`)
    const coveredByDictionary = unitDict != undefined && unitDict[value] != undefined

    // console.log(`convertUnits() - ${value} was covered by the dictionary: ${coveredByDictionary}`)
    const isColor = colorsDict[value] != undefined || tailwindColors[value] != undefined || hexColorRegex.test(value) || otherColorRegex.test(value)
    // console.log(`convertUnits() - ${value} was a color: ${isColor}, colorsDict[value]: ${colorsDict[value]}, tailwindColors[value]: ${tailwindColors[value]}`)
    
    const isDigitWithUnits = numberRegex.test(value) && unitRegex.test(value) || value.includes(',') || value.includes('(')
    // console.log(`convertUnits() - ${value} was not a digit with units: ${!isDigitWithUnits}`)

    const isSimpleRatio = value.includes('/') && !value.includes('span')
    const isSpanRatio = value.includes('span') && value.includes('/')
    // console.log(`convertUnits() - ${value} is a span ratio: ${isSpanRatio}`)
    // console.log(`convertUnits() - ${value} is a ratio: ${isSimpleRatio}`)
    const isSimpleVariable = value.includes('var(--') && value.split('(').length == 2
    // console.log(`convertUnits() - ${value} is a variable: ${isSimpleVariable}`)
    const isRepeatFunction = value.includes('repeat') && value.includes('minmax(0, 1fr)')
    // console.log(`convertUnits() - ${value} is a repeat function: ${isRepeatFunction}`)
    const isURL = value.includes('url(')
    // console.log(`convertUnits() - ${value} is a URL: ${isURL}`)

    let returnValue = ''

    // console.log(coveredByDictionary, isColor, includesMultipleValues, !isDigitWithUnits, isSimpleRatio, isSpanRatio, isSimpleVariable, isRepeatFunction, isURL)
    if (!isURL && (value.includes(`'`) || value.includes(`"`))) return value

    if(coveredByDictionary) returnValue = unitDict[value]
    else if(isColor) returnValue = handleColors(value)
    else if(isSimpleVariable) returnValue = handleVariable(value)
    else if(isSimpleRatio) returnValue = handleRatio(value)
    else if(isSpanRatio) returnValue = handleSpanRatio(value)
    else if(isRepeatFunction) returnValue = handleRepeatFunction(value)
    else if(includesMultipleValues) returnValue = handleMultipleValues(value)
    else if(!isDigitWithUnits) returnValue = value // if it is not a digit or it is a digit without a unit
    else if (rotationRegex.test(value)) returnValue = toDegrees(value)
    else returnValue = handleBaseCase(value)

    // console.log(`returned value: ${returnValue}`)
    return returnValue
}

export function toDegrees(value) {
    let rotation = 0
    if (value.includes('turn')) {
        let turnValue = value.replace('turn', '')
        rotation = parseFloat(turnValue) * 360
    }
    else if (value.includes('rad')) {
        let radValue = value.replace('rad', '')
        rotation = parseFloat(radValue) * 180 / Math.PI
    }
    else if (value.includes('grad')) {
        let gradValue = value.replace('grad', '')
        rotation = parseFloat(gradValue) * 0.9
    }
    rotation = Math.round(rotation)
    return `${rotation}deg`
        
}

function replaceOperatorSpaces(value) {
    // Remove spaces after opening parentheses and before closing parentheses
    let result = value.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')')
    
    // Remove spaces before/after operators (+, -, /, *, =, :)
    result = result.replace(/\s+([+\-*/=:])/g, '$1').replace(/([+\-*/=:])\s+/g, '$1')

    // Remove spaces after commas
    result = result.replace(/,\s+/g, ',')
    return result
}

export function replaceSpacesWithUnderscores(value) {
    let result = replaceOperatorSpaces(value)
    // console.log(result)
    return result.replace(/\s+/g, '_')
}

function parseRGBA(input) {
    // Match and capture the rgba values
    const regex = /rgba\(\s*(\d+)\s*,?\s*(\d+)\s*,?\s*(\d+)\s*,?\s*([\d.]+)\s*\)/i
    const match = input.match(regex)
    
    // If there's a match, format it correctly
    if (match) {
        const r = match[1]
        const g = match[2]
        const b = match[3]
        const a = match[4]
        return [r, g, b, a]
    }
    
    // Return the original input if it doesn't match the expected pattern
    return input
}

function handleRatio(value) {
  let [width, height] = value.split('/').map(s => s.trim()).map(s => convertUnits(s))
  return handleGeneralRatio(width, height)
}

function handleSpanRatio(value) {
  let [width, height] = value.split('/').map(s => s.replace('span', '').trim()).map(s => convertUnits(s))
  return handleGeneralRatio(width, height)
}

function handleGeneralRatio(width, height) {
    if (width.includes('(') && width == height) return width
    if (numberRegex.test(width) && numberRegex.test(height)) return `${width}/${height}`
    if (width.includes('(')) width.replace('(', 'var(')
    if (height.includes('(')) height.replace('(', 'var(')
    width.replace('[', '').replace(']', '')
    height.replace('[', '').replace(']', '')
    return `${replaceSpacesWithUnderscores(width)}/${replaceSpacesWithUnderscores(height)}`
}
function handleVariable(value) {
  const variableName = value.replace('var(', '').replace(')', '')
  return `(${variableName})`
}
export function handleNamedVariable(value, variableName) {
    const variable = value.replace('(', '').replace(')', '')
    return `(${variableName}:${variable})`
}
function handleRepeatFunction(value) {
  let repeatNum = value.replace('repeat(', '').split(',')[0]
  return convertUnits(repeatNum)
}
function handleMultipleValues(value) {
    let values = value.split(' ')
    let returnValues = ''
    for(let i = 0; i < values.length; i++) {
        values[i] = convertUnits(values[i])
        returnValues += `${values[i]} `
    }
    return returnValues.substring(0, returnValues.length - 1)
}
function handleBaseCase(value) {
    return '[' + replaceSpacesWithUnderscores(value) + ']'
}

function handleColors(value) {
    if(tailwindColors[value] != undefined) return tailwindColors[value]
    if(colorsDict[value] != undefined) value = colorsDict[value]

    let hexColor = ''
    let opacity = ''

    let rgbaValues
    if(value.includes('rgba')) rgbaValues = parseRGBA(value)

    if (rgbaValues != value && rgbaValues != undefined) {
        hexColor = tinycolor({r: rgbaValues[0], g: rgbaValues[1], b: rgbaValues[2]}).toHexString() 
        if(rgbaValues[3] == 1) opacity = ''
        else if((Number(rgbaValues[3]) * 100) % 5 == 0) opacity = `/${Number(rgbaValues[3]) * 100}`
        else opacity = `/[${rgbaValues[3]}]` 
    } else {
        hexColor = tinycolor(value).toHexString()
    }
    // console.log(hexColor)
    if(tailwindColors.hasOwnProperty(hexColor)) return tailwindColors[hexColor] + opacity
    else return '[' + hexColor + ']' + opacity
}
export function revertUnits(object, value) { // This function is used to convert the shorthand values back to their original values
    return Object.keys(object).find(key => object[key] === value) 
}

export function irregularConvertUnits(unitDictionary, value) {
    value = value.replace('[', '').replace(']', '')
    if(unitDictionary[value] != undefined) return unitDictionary[value]
    if (value.includes('var(')) return value.replace('var', '')
    if (value.includes('(') && value.includes(')')) return value
    return `[${value}]`
}
export function translateConvertedToIrregular (irregularUnitDict, value) {
    value = value.replace('[', '').replace(']', '')
    if(revertUnits(unitDict, value) != undefined) value = `${revertUnits(unitDict, value)}`
    if(irregularUnitDict[value] != undefined) value = irregularUnitDict[value]
    else value = `[${replaceSpacesWithUnderscores(value)}]`
    return value
}

export function splitSpacesOutsideParentheses(value) {
    const rawValues = []
    let part = ''
    let nestLevel = 0
    for (let i = 0; i < value.length; i++) {
        const char = value[i]
        if (char === '(') nestLevel++
        if (char === ')') nestLevel--
        if (char === ' ' && nestLevel === 0) {
            if (part) rawValues.push(part)
            part = ''
        } else {
            part += char
        }
    }
    if (part) rawValues.push(part)
    return rawValues
}

export function convertTimeToMilliseconds(value) {
    if(value.includes('ms')) return parseFloat(value.replace('ms', ''))
    if(value.includes('s')) return parseFloat(value.replace('s', '')) * 1000
    return value
}
// TODO: Fix copycss function
export function copy(type, text) {
  if(text == '' || text == undefined) {
    createNotification(`Nothing to copy here!`, 3)
    return
  }
  navigator.clipboard.writeText(text)
  const longText = text.length > 40 ? ' ...' : ''
//   console.log(`text was ${text.length} characters long`, longText)
  createNotification(`Copied ${type}: ${text.slice(0, 40)}${longText}`, 3)
}

