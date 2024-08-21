import { unitDict } from "./dictionaries"
import * as util from "./utilities"

export let tailwindThemeConfig = {
    colors: {},
    extend: {
        spacing: {}
    }
}
export function parseVariables(json) {
    // Object.keys(json).forEach(key => {
    //     const values = json[key]
    //     values.forEach(value => {
    //         if (!value.includes('--')) return
    //         console.log(value)
    //     })
        
    // })
//   json = removeRoot(json)
//   console.log("root: ", root)
  json.forEach(tree => {
    if (Object.keys(tree).length == 0) return
    tree = tree[Object.keys(tree)[0]] // Assumes that each dictionary inside the json has one key, which then has a dictionary with more values as the
    // console.log(tree) 
    Object.keys(tree).forEach(key => {
        if (!key.includes('--')) return
        unitDict[`var(${key})`] = key.replace('--', '')
        const value = tree[key]
        delete tree[key]
        // console.log(key, value)
        key = key.replace('--', '')
        if (util.hexColorRegex.test(value)) {
            if (util.numberRegex.test(key)) {
                const num = util.numberRegex.match(key)
                // console.log(num)
                key = key.replace(`-${num}`, '')
                tailwindThemeConfig.colors[key].num = value
            } else {
                tailwindThemeConfig.colors[key] = value
            }
        } else if (util.unitRegex.test(value)) {
            tailwindThemeConfig.extend.spacing[key] = value
        }
    })
  })

  
//   console.log(tailwindThemeConfig);
//   console.log(unitDict)
  return json
}

export function hasRoot(json) {
  for (const tree of json) {
    if (tree["root"] != undefined) return true
  }
  return false
}

export function findRoot(json) {
  for (const tree of json) {
    if (tree["root"] != undefined) return tree["root"]
  }
  return undefined
}
function removeRoot(json) {
  return json.filter(tree => tree["root"] == undefined)
}