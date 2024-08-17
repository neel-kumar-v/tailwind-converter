const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
const otherColorRegex = /^(rgb|rgba|hsl|hsla|hsv|cmyk)\(\s*(-?\d+%?\s*([,\s]+|$)){2,3}(-?\d+%?\s*,?\s*[\d.]*%?\s*)?\)$/
export const numberRegex = /\d/
const unitRegex = /-?\d*\.?\d+(?:ch|cm|em|ex|in|mm|pc|ms|s|pt|px|rem|vh|vmax|vmin|vw|%)/
import { unitDict, colorsDict, tailwindColors } from './dictionaries'
import tinycolor from 'tinycolor2'
import { createNotification } from './notification'

export function shorthand(values, property) {
    let returnStyles = []

    if (values.length === 1) {
        returnStyles.push(`${property}-${values[0]}`)
    } else if (values.length === 2) {
        returnStyles.push(`${property}y-${values[0]}`)
        returnStyles.push(`${property}x-${values[1]}`)
    } else if (values.length === 3) {
        returnStyles.push(`${property}t-${values[0]}`)
        returnStyles.push(`${property}x-${values[1]}`)
        returnStyles.push(`${property}b-${values[2]}`)
    } else if (values.length === 4) {
        returnStyles.push(`${property}t-${values[0]}`)
        returnStyles.push(`${property}r-${values[1]}`)
        returnStyles.push(`${property}b-${values[2]}`)
        returnStyles.push(`${property}l-${values[3]}`)
    }

    for(let i = 0; i < returnStyles.length; i++) {
        if(returnStyles[i] != undefined) returnStyles[i] = returnStyles[i].replace('--', '-') // Sometimes due to the suffixes in the dictionary, there will be 2 dashes, so this fixes that
    }

    return returnStyles
}
  
  
export function convertUnits(value) {
    if(value != undefined) {
        const coveredByDictionary = unitDict != undefined && unitDict[value] != undefined
        // console.log(`convertUnits() - ${value} was covered by the dictionary: ${coveredByDictionary}`)

        const isColor = colorsDict[value] != undefined || hexColorRegex.test(value) || otherColorRegex.test(value)
        // console.log(`convertUnits() - ${value} was a color: ${isColor}`)

        const includesMultipleValues = value.split(' ') != undefined && value.split(' ').length > 1 && !value.includes('/') && !value.includes(',')
        // console.log(`convertUnits() - ${value} includes multiple values: ${includesMultipleValues}`)
        
        const isDigitWithUnits = numberRegex.test(value) && unitRegex.test(value) || value.includes(',') || value.includes('(')
        // console.log(`convertUnits() - ${value} was not a digit with units: ${!isDigitWithUnits}`)
        // console.log(value)

        let returnValue = ''

        // console.log(coveredByDictionary, isColor, includesMultipleValues, !isDigitWithUnits, value.includes('/'))
        if (value.includes(`'`) || value.includes(`"`)) return value

        if(coveredByDictionary) returnValue = unitDict[value]
        else if(isColor) returnValue = handleColors(value)
        else if(includesMultipleValues) {
            let values = value.split(' ')
            let returnValues = ''
            for(let i = 0; i < values.length; i++) {
                values[i] = convertUnits(values[i])
                returnValues += `${values[i]} `
            }
            returnValue = returnValues.substring(0, returnValues.length - 1)
        } else if(value.includes('/')) returnValue = '[' + replaceSpacesWithUnderscores(value) + ']'
        else if(!isDigitWithUnits) returnValue = value // if it is not a digit or it is a digit without a unit
        else returnValue = '[' + replaceSpacesWithUnderscores(value) + ']'
        // console.log(`returned value: ${returnValue}`)
        return returnValue
    }
}

export function replaceSpacesWithUnderscores(value) {
    return value.replace(/\s+/g, '_')
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



function handleColors(value) {
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
    if(unitDictionary[value] != undefined) return unitDictionary[value]
    else return `[${value}]`
}
export function translateConvertedToIrregular (irregularUnitDict, value) {
    if(revertUnits(unitDict, value) != undefined) value = `${revertUnits(unitDict, value)}`
    if(irregularUnitDict[value] != undefined) value = irregularUnitDict[value]
    else value = `[${value.replace(/ /g, '_')}]`.replace('[[', '[').replace(']]', ']')
    return value
}
// TODO: Fix copycss function
export function copy(text, type) {
  if(text == '' || text == undefined) {
    createNotification(`Nothing to copy here!`, 3);
    return
  }
  navigator.clipboard.writeText(text);
  const longText = text.length > 40 ? ' ...' : ''
  console.log(`text was ${text.length} characters long`, longText)
  createNotification(`Copied ${type}: ${text.slice(0, 40)}${longText}`, 3);
}

