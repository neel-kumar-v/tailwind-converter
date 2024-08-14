import './style.css'
import * as util from './utilities'
import { inject } from '@vercel/analytics'
import { createNotification } from "./notification"
import { tokenize } from './tokenize'
import { displayOutputWithSelectors } from './display'
import { parseSelectors, combineSelectorPrefixes } from './prefix'
import { convertCSSJSONToTailwind, formatTailwindArrayToDict } from './converter'

inject() // 


const cssButton = document.getElementById('copycss')
const tailwindButton = document.getElementById('copytailwind')
const input = document.getElementById('input')
  
cssButton.addEventListener('click', () => {
  util.copy(inputEditor.getValue())
})

tailwindButton.addEventListener('click', () => {
  if (outputTailwind == '') {
    createNotification('Nothing was copied')
  }
  util.copy('all TailwindCSS directives', `${outputTailwind}`)
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

inputEditor.on('change', () => {
  const css = inputEditor.getValue()

  const cssJSON = tokenize(css)
  // console.log(cssJSON)
  let outputTailwindJSON = formatTailwindArrayToDict(convertCSSJSONToTailwind(cssJSON))
  // console.log("Flattened CSS Tree JSON: ", outputTailwindJSON)
  const outputTailwindSelectorPrefixes = parseSelectors(outputTailwindJSON);
  // console.log("Flattened CSS Selector-Prefix: ", outputTailwindSelectorPrefixes)
  combineSelectorPrefixes(outputTailwindJSON, outputTailwindSelectorPrefixes);
  displayOutputWithSelectors(outputTailwindJSON)
})

