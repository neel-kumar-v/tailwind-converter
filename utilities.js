const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
const otherColorRegex = /^(rgb|rgba|hsl|hsla|hsv|cmyk)\(\s*(-?\d+%?\s*([,\s]+|$)){2,3}(-?\d+%?\s*,?\s*[\d.]*%?\s*)?\)$/
const numberRegex = /\d/
const unitRegex = /-?\d*\.?\d+(?:ch|cm|em|ex|in|mm|pc|ms|s|pt|px|rem|vh|vmax|vmin|vw|%)/
import { unitDict, colorsDict, tailwindColors } from './dictionaries'
import tinycolor from 'tinycolor2';
import { createNotification } from './notification';

export function shorthand(values, property) {
    let returnStyles = [];

    if (values.length === 1) {
        returnStyles.push(`${property}-${values[0]}`);
    } else if (values.length === 2) {
        returnStyles.push(`${property}y-${values[0]}`);
        returnStyles.push(`${property}x-${values[1]}`);
    } else if (values.length === 3) {
        returnStyles.push(`${property}t-${values[0]}`);
        returnStyles.push(`${property}x-${values[1]}`);
        returnStyles.push(`${property}b-${values[2]}`);
    } else if (values.length === 4) {
        returnStyles.push(`${property}t-${values[0]}`);
        returnStyles.push(`${property}r-${values[1]}`);
        returnStyles.push(`${property}b-${values[2]}`);
        returnStyles.push(`${property}l-${values[3]}`);
    }

    for(let i = 0; i < returnStyles.length; i++) {
        if(returnStyles[i] != undefined) returnStyles[i] = returnStyles[i].replace('--', '-') // Sometimes due to the suffixes in the dictionary, there will be 2 dashes, so this fixes that
    }

    return returnStyles;
}
  
  
export function convertUnits(value) {
    // TODO: Add support for things like calc(), minmax() etc.
    if(value != undefined) {
        const coveredByDictionary = unitDict != undefined && unitDict[value] != undefined
        // console.log(`convertUnits() - ${value} was covered by the dictionary: ${coveredByDictionary}`)

        const isColor = colorsDict[value] != undefined || hexColorRegex.test(value) || otherColorRegex.test(value)
        // console.log(`convertUnits() - ${value} was a color: ${isColor}`)

        const includesMultipleValues = value.split(' ') != undefined && value.split(' ').length > 1 && !value.includes('/')
        // console.log(`convertUnits() - ${value} includes multiple values: ${includesMultipleValues}`)
        
        const isDigitWithUnits = numberRegex.test(value) && unitRegex.test(value)
        // console.log(`convertUnits() - ${value} was not a digit with units: ${!isDigitWithUnits}`)

        if(coveredByDictionary) return unitDict[value]
        else if(isColor) return handleColors(value)
        else if(includesMultipleValues) {
            let values = value.split(' ')
            let returnValues = '';
            for(let i = 0; i < values.length; i++) {
                values[i] = convertUnits(values[i])
                returnValues += `${values[i]} `
            }
            return returnValues.substring(0, returnValues.length - 1)
        } else if(value.includes('/')) return '[' + value + ']'
        else if(!isDigitWithUnits) return value // if it is not a digit or it is a digit without a unit
        else return '[' + value + ']'
    }
}

function handleColors(value) {
    if(colorsDict[value] != undefined) value = colorsDict[value]
    // console.log(value)
    const hexColor = tinycolor(value).toHexString()
    // console.log(hexColor)
    if(tailwindColors.hasOwnProperty(hexColor)) {
        // console.log(tailwindColors[hexColor])
        return tailwindColors[hexColor]
    }
    else return '[' + hexColor + ']'
}
export function revertUnits(object, value) { // This function is used to convert the shorthand values back to their original values
    return Object.keys(object).find(key => object[key] === value); 
}

export function irregularConvertUnits(unitDictionary, value) {
    if(unitDictionary[value] != undefined) return unitDictionary[value]
    else return `[${value}]`
}
export function translateConvertedToIrregular (irregularUnitDict, value) {
    if(revertUnits(unitDict, value) != undefined) value = `${revertUnits(unitDict, value)}`
    if(irregularUnitDict[value] != undefined) value = irregularUnitDict[value]
    return value
}
function copy(text) {
    navigator.clipboard.writeText(text);
    createNotification("Copied the text: " + elementToCopyFrom.value.slice(0, 40) + "...");
}

