import './style.css'
import * as util from './helpers/utilities'
import { inject } from '@vercel/analytics'
import { createNotification } from "./helpers/notification"
import { tokenize, tokenizeMultipleSelectors } from './helpers/tokenize'
import { displayConfigModal, displayOutputWithSelectors, highlightTooltip, JSONToStringArray, resetDisplay } from './helpers/display'
import { parseSelectors, combineSelectorPrefixes } from './helpers/prefix'
import { convertCSSJSONToTailwind, formatTailwindArrayToDict } from './helpers/converter'
import { parseVariables, tailwindThemeConfig } from './helpers/config-generator'
import { highlightActiveLine } from '@codemirror/view'
inject() // 


const cssButton = document.getElementById('copycss')
const tailwindButton = document.getElementById('copytailwind')
const input = document.getElementById('input')
const configModalButton = document.getElementById('copyconfig')
  
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
  track('Conversion')
  resetDisplay()
  retrieveSettings()
  const css = inputEditor.getValue()
  if (css == '') return
  let cssJSON;
  // console.log(css)
  if (multipleSelectors) cssJSON = tokenizeMultipleSelectors(css)
  else cssJSON = tokenize(css)
  cssJSON = parseVariables(cssJSON)
  if (Object.keys(tailwindThemeConfig.colors).length != 0 || Object.keys(tailwindThemeConfig.extend.spacing).length != 0) {
    displayConfigModal(tailwindThemeConfig)
    if (configModalButton.classList.contains('hidden')) {
      configModalButton.classList.remove('hidden')
      highlightTooltip(configModalButton, 2000)
    }
  } else if (configModalButton.classList.contains('hidden') == false) {
    configModalButton.classList.add('hidden')
  }
  console.log("CSS JSON: ", cssJSON)


  outputTailwindJSON = formatTailwindArrayToDict(convertCSSJSONToTailwind(cssJSON))
  console.log("Flattened CSS Tree JSON: ", outputTailwindJSON)
  
  
  const outputTailwindSelectorPrefixes = parseSelectors(outputTailwindJSON);
  console.log("Flattened CSS Selector-Prefix: ", outputTailwindSelectorPrefixes)
  
  combineSelectorPrefixes(outputTailwindJSON, outputTailwindSelectorPrefixes)
  removeArbitraryRules(outputTailwindJSON, !arbitraryPrefixes, !arbitraryRules)
  // console.log("Prefixed Tree JSON: ", outputTailwindJSON)
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
  // console.log(arbitraryRules, arbitraryPrefixes, remPixelConversionRatio, multipleSelectors)
}
// wait 0.5 seconds and then highlight the tooltip
// setTimeout
Array.from(document.querySelectorAll('.tooltip')).
  filter(tooltip => !tooltip.classList.contains('hidden')).
  forEach((tooltip, index) => setTimeout(() => highlightTooltip(tooltip, 1000), index * 1000 + 500))

const codeEditors = document.querySelectorAll('.CodeMirror')
if (codeEditors.length > 1) {
  codeEditors.forEach((editor, index) => {
    if (index == 0) return
    editor.remove()
  })
}

const arbitraryPrefixesRegex = /!(?![^"]*["])[^!]*:/
const arbitraryRulesRegex = /:(?![^"]*["])[^:]*!/

function removeArbitraryRules(json, removeArbitraryPrefixes, removeArbitraryRules) {
  Object.keys(json).forEach(key => {
    if (removeArbitraryRules) json[key] = json[key].filter(rule => !arbitraryRulesRegex.test(rule))
    if (removeArbitraryPrefixes) json[key] = json[key].filter(rule => !arbitraryPrefixesRegex.test(rule))
  })
  return json
}