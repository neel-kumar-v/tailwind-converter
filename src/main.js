import './style.css'
import * as util from './helpers/utilities'
import { inject } from '@vercel/analytics'
import { createNotification } from "./helpers/notification"
import { tokenize } from './helpers/tokenize'
import { displayOutputWithSelectors } from './helpers/display'
import { parseSelectors, combineSelectorPrefixes } from './helpers/prefix'
import { convertCSSJSONToTailwind, formatTailwindArrayToDict } from './helpers/converter'

inject() // 


const cssButton = document.getElementById('copycss')
const tailwindButton = document.getElementById('copytailwind')
const input = document.getElementById('input')
  
cssButton.addEventListener('click', () => {
  const copyText = inputEditor.getValue()
  console.log(copyText)
  util.copy(copyText, 'all CSS')
})

tailwindButton.addEventListener('click', () => {
  console.log(outputTailwindJSON)
  if (outputTailwindJSON == '') {
    createNotification('Nothing was copied')
    return
  }
  let outputString = ''
  Object.keys(outputTailwindJSON).forEach(key => {
    if (outputTailwindJSON[key] == '') return
    outputString += `${key} +  {\n \t@apply `
    outputTailwindJSON[key].forEach(rule => {
      if (rule == '') return
      outputString += `${rule.replace('!', '').trim()} `
    })
    outputString += '\n}\n'
  })
  console.log(outputString)
  util.copy(outputString, 'all TailwindCSS directives')
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
inputEditor.on('change', () => {
  const css = inputEditor.getValue()

  const cssJSON = tokenize(css)
  console.log("CSS JSON: ", cssJSON)
  outputTailwindJSON = formatTailwindArrayToDict(convertCSSJSONToTailwind(cssJSON))
  console.log("Flattened CSS Tree JSON: ", outputTailwindJSON)
  const outputTailwindSelectorPrefixes = parseSelectors(outputTailwindJSON);
  console.log("Flattened CSS Selector-Prefix: ", outputTailwindSelectorPrefixes)
  combineSelectorPrefixes(outputTailwindJSON, outputTailwindSelectorPrefixes);
  displayOutputWithSelectors(outputTailwindJSON)
})

