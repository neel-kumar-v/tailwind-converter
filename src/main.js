import './style.css'
import * as util from './helpers/utilities'
import { inject } from '@vercel/analytics'
import { createNotification } from "./helpers/notification"
import { tokenize, tokenizeMultipleSelectors } from './helpers/tokenize'
import { displayOutputWithSelectors, JSONToStringArray, resetDisplay } from './helpers/display'
import { parseSelectors, combineSelectorPrefixes } from './helpers/prefix'
import { convertCSSJSONToTailwind, formatTailwindArrayToDict } from './helpers/converter'
import { hasRoot, findRoot, parseVariables } from './helpers/config-generator'
inject() // 


const cssButton = document.getElementById('copycss')
const tailwindButton = document.getElementById('copytailwind')
const input = document.getElementById('input')
  
cssButton.addEventListener('click', () => {
  const copyText = inputEditor.getValue()
  console.log(copyText)
  util.copy('all CSS', copyText)
})
tailwindButton.addEventListener('click', () => {
  if (outputTailwindJSON == undefined) {
    createNotification('Nothing to copy here!', 3)
    return
  }
  util.copy('all TailwindCSS directives', outputTailwindRuleArray.join('\n'))
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

let outputTailwindJSON
export let outputTailwindRuleArray = []

const settings = document.getElementById('settingsModal').getElementsByClassName('modal-box')[0].querySelectorAll('.flex')
inputEditor.on('change', main)
settings.forEach(setting => setting.querySelector('input').addEventListener('change', main))
// settings[0].querySelector('input').addEventListener('change', main)
// settings[1].querySelector('input').addEventListener('change', main)
// settings[2].querySelector('input').addEventListener('change', main)

function main() {
  resetDisplay()
  retrieveSettings()
  const css = inputEditor.getValue()
  let cssJSON;
  // console.log(css)
  if (multipleSelectors) cssJSON = tokenizeMultipleSelectors(css)
  else cssJSON = tokenize(css)
  cssJSON = parseVariables(cssJSON)
  console.log("CSS JSON: ", cssJSON)


  outputTailwindJSON = formatTailwindArrayToDict(convertCSSJSONToTailwind(cssJSON))
  console.log("Flattened CSS Tree JSON: ", outputTailwindJSON)


  const outputTailwindSelectorPrefixes = parseSelectors(outputTailwindJSON);
  console.log("Flattened CSS Selector-Prefix: ", outputTailwindSelectorPrefixes)

  combineSelectorPrefixes(outputTailwindJSON, outputTailwindSelectorPrefixes);
  displayOutputWithSelectors(outputTailwindJSON)
  outputTailwindRuleArray = JSONToStringArray(outputTailwindJSON)
}

export let arbitraryRules
export let arbitraryPrefixes
export let remPixelConversionRatio
export let multipleSelectors
// console.log(settings)
export function retrieveSettings() {
  arbitraryRules = settings[0].querySelector('input').checked
  arbitraryPrefixes = settings[1].querySelector('input').checked
  remPixelConversionRatio = parseFloat(settings[2].querySelector('input').value)
  multipleSelectors = settings[3].querySelector('input').checked
  console.log(arbitraryRules, arbitraryPrefixes, remPixelConversionRatio, multipleSelectors)
}
