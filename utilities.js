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
    if(value != undefined) {
        if(unitDict[value] != undefined) { 
        return unitDict[value]
        } else if(colorsDict[value] != undefined) { 
        return '[' + colorsDict[value] + ']'
        } else if(hexColorRegex.test(value) || otherColorRegex.test(value)) { 
        return '[' + value + ']'
        } else if(value.split(' ') != undefined && value.split(' ').length > 1 && !value.includes('/')) {
        let values = value.split(' ')
        let returnValues = '';
        for(let i = 0; i < values.length; i++) {
            values[i] = convertUnits(values[i])
            returnValues += `${values[i]} `
        }
        return returnValues.substring(0, returnValues.length - 1)
        } else if(value.includes('/')) {
        return '[' + value + ']'
        } else if(!numberRegex.test(value) || !unitRegex.test(value)) { // if it is not a digit or it is a digit without a unit
        return value
        } else {
        return '[' + value + ']'
        }
    }
}
export function revertUnits(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

export function irregularConvertUnits(unitDictionary, value) {
    if(unitDictionary[value] != undefined) return unitDictionary[value]
    else return `[${value}]`
}
export function translateConvertedToIrregular (irregularUnitDict, value) {
    if(revertUnits(unitDict, value) != undefined) value = `${revertUnits(unitDict, value)}`
    if(irregularUnitDict[formattedValue] != undefined) value = irregularUnitDict[value]
    return value
}
export function copy(elementToCopyFrom) {
    elementToCopyFrom.select();
    elementToCopyFrom.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(elementToCopyFrom.value);
    alert("Copied the text: " + elementToCopyFrom.value.slice(0, 40) + "...");
}

