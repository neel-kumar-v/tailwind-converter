import './style.css'
import * as util from './helpers/utilities'
import { inject } from '@vercel/analytics'
import { createNotification } from "./helpers/notification"
import { tokenize } from './helpers/tokenize'
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

inputEditor.on('change', main)

function main() {
  resetDisplay()
  const css = inputEditor.getValue()
  console.log(css)

  let cssJSON = tokenize(css)
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