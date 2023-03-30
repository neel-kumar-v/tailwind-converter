import './style.css'
import { shorthandDict, unitDict, borderRadiusUnitDict, blurUnitDict, letterSpacingUnitDict, fontWeightUnitDict } from './dictionaries'
import * as util from './utilities'
const cssButton = document.getElementById('copycss')
const tailwindButton = document.getElementById('copytailwind')
const htmlButton = document.getElementById('copyhtml')
const input = document.getElementById('input')
const inputHTML = document.getElementById('inputHTML')
const output = document.getElementById('output')

const numberRegex = /\d/
const zeroRegex = /0[a-zA-Z]*/

input.addEventListener('input', () => {
  console.log(inputHTML.value)
  if(inputHTML.value == '')  {
    console.log("esfg")
    output.textContent = convertToTailwind(input.value)
  }
  else {
    console.log("sdsdf")
    output.textContent = convertToHTML(convertToTailwind(input.value), inputHTML.value)
  }
})

inputHTML.addEventListener('input', () => {
  console.log("sdsdf")
  output.textContent = convertToHTML(convertToTailwind(input.value), inputHTML.value)
})

cssButton.addEventListener('click', () => {
  util.copy(input)
})
htmlButton.addEventListener('click', () => {
  util.copy(inputHTML)
})

tailwindButton.addEventListener('click', () => {
  util.copy(output)
})

function convertToTailwind(css) {
  const styles = css.split('\n') // Split styles by line
    .filter(style => style.trim() !== '') // Remove empty lines
    .map(style => style.trim()) // Trim leading/trailing spaces
    .reduce((stylesList, style) => {
      let [property, value] = style.split(':').map(s => s.trim()); // Split up the properties and the styles
      if(value != undefined) value = value.replace(';', ''); // Get rid of the semicolon
      if(value == undefined && property.includes('{')) stylesList.push(`${property}\n`) // If its the style declaration: list it out and enter a new line
      if(value == undefined && property.includes('}')) stylesList.push(`\n} \n`) // If it is the ending bracket: enter past the styles place the bracket, then enter another new line

      if(property == 'filter' || property == 'backdrop-filter') { // Special case #1: The filter backdrop-filter properties all have many different values based on their functions
        let [newProperty, newValue] = value.split('(').map(s => s.trim()) // EX: filter: blur(4px); treated as blur: 4px
        newValue = newValue.replace(')', '')
        const backdrop = (property == 'backdrop-filter') ? 'backdrop-' : '' // Filter and backdrop-filter are grouped so the backdrop prefix can be added concisely
        let availableValues = [];
        switch(newProperty) {
          case 'blur':
            stylesList.push(`${backdrop}blur-${util.irregularConvertUnits(blurUnitDict, newValue)}`)
            break;
          case 'brightness':
            availableValues = [0, 0.5, 0.75, 0.9, 0.95, 1, 1.05, 1.1, 1.25, 1.5, 2] 
            if(availableValues.includes(Number(newValue))) stylesList.push(`${backdrop}brightness-${newValue * 100}`) // If the newValue is a number tailwind has a builtin number for, then use it multiplied by 100
            else stylesList.push(`${backdrop}brightness-[${newValue}]`) // Else use a arbitrary value
            break;
          case 'contrast':
            availableValues = [0, 0.5, 0.75, 1, 1.25, 1.5, 2] 
            if(availableValues.includes(Number(newValue))) stylesList.push(`${backdrop}contrast-${newValue * 100}`)
            else stylesList.push(`${backdrop}contrast-[${newValue}]`)
            break;
          case 'grayscale':
            if(newValue.includes('100%')) stylesList.push(`${backdrop}grayscale`)
            else if(zeroRegex.test(newValue)) stylesList.push(`${backdrop}grayscale-0`)
            else stylesList.push(`${backdrop}grayscale-[${newValue}]`)
            break;
          case 'hue-rotate':
            availableValues = [0, 15, 30, 60, 90, 180]
            newValue = newValue.replace('deg', '') 
            if(availableValues.includes(Number(newValue))) stylesList.push(`${backdrop}hue-rotate-${newValue}`)
            else stylesList.push(`${backdrop}hue-rotate-[${newValue}deg]`)
            break;
          case 'invert':
            if(newValue.includes('100%')) stylesList.push(`${backdrop}invert`)
            else if(zeroRegex.test(newValue)) stylesList.push(`${backdrop}invert-0`)
            else stylesList.push(`${backdrop}invert-[${newValue}]`)
            break;
          case 'saturate':
            availableValues = [0, 0.5, 1, 1.5, 2] 
            if(availableValues.includes(Number(newValue))) stylesList.push(`${backdrop}contrast-${newValue * 100}`)
            else stylesList.push(`${backdrop}contrast-[${newValue}]`)
            break;
          case 'sepia':
            if(newValue.includes('100%')) stylesList.push(`${backdrop}sepia`)
            else if(zeroRegex.test(newValue)) stylesList.push(`${backdrop}sepia-0`)
            else stylesList.push(`${backdrop}sepia-[${newValue}]`)
            break;
          default:
            break;

        } 
      }

      if(property == "transform") {
        let [newProperty, newValue] = value.split('(').map(s => s.trim()) // EX: filter: blur(4px); treated as blur: 4px
        newValue = newValue.replace(')', '')
        let availableValues = [];
        switch(newProperty) {
          case 'scale':
            availableValues = [0, 0.5, 0.75, 0.9, 0.95, 1, 1.05, 1.1, 1.25, 1.5]
            if(availableValues.includes(Number(newValue))) stylesList.push(`scale-${newValue * 100}`)
            else stylesList.push(`scale-[${newValue}]`) 
            break;
          case 'scaleX':
            availableValues = [0, 0.5, 0.75, 0.9, 0.95, 1, 1.05, 1.1, 1.25, 1.5]
            if(availableValues.includes(Number(newValue))) stylesList.push(`scale-x-${newValue * 100}`)
            else stylesList.push(`scale-x-[${newValue}]`) 
            break;
          case 'scaleY':
            availableValues = [0, 0.5, 0.75, 0.9, 0.95, 1, 1.05, 1.1, 1.25, 1.5]
            if(availableValues.includes(Number(newValue))) stylesList.push(`scale-y-${newValue * 100}`)
            else stylesList.push(`scale-y-[${newValue}]`) 
            break;
          case 'rotate':
            availableValues = [0, 1, 2, 3, 6, 12, 45, 90, 180]
            newValue = newValue.replace('deg', '') 
            if(availableValues.includes(Number(newValue))) stylesList.push(`rotate-${newValue}`)
            else stylesList.push(`rotate-[${newValue}deg]`)
            break;
          case 'translateX':
            // console.log(newValue)
            newValue = newValue.split(' ')
            // console.log(newValue)
            if(newValue.length == 1) {
              stylesList.push(`translate-x-${util.convertUnits(String(newValue))}`)
            } else if(newValue.length == 2) {
              stylesList.push(`translate-x-${util.convertUnits(newValue[0])}`)
              stylesList.push(`translate-y-${util.convertUnits(newValue[1])}`)
            } 
            break;
          case 'translateY':
            // console.log(newValue)
            newValue = newValue.split(' ')
            // console.log(newValue)
            if(newValue.length == 1) {
              stylesList.push(`translate-y-${util.convertUnits(String(newValue))}`)
            } else if(newValue.length == 2) {
              stylesList.push(`translate-y-${util.convertUnits(newValue[0])}`)
              stylesList.push(`translate-x-${util.convertUnits(newValue[1])}`)
            } 
            break;
          case 'skewX':
            availableValues = [0, 1, 2, 3, 6, 12]
            newValue = newValue.replace('deg', '') 
            if(availableValues.includes(Number(newValue))) stylesList.push(`skew-x-${newValue}`)
            else stylesList.push(`skew-x-[${newValue}deg]`)
            break;
            break;
          case 'skewY':
            availableValues = [0, 1, 2, 3, 6, 12]
            newValue = newValue.replace('deg', '') 
            if(availableValues.includes(Number(newValue))) stylesList.push(`skew-y-${newValue}`)
            else stylesList.push(`skew-y-[${newValue}deg]`)
            break;

          default:
            break;
        }
      }

      value = util.convertUnits(value)

      switch (property) {
        // * SINGLE VALUES WITH UNITS
        // TODO: Revert Units and convert to sm, md, xl, etc for border radius, font size, max width, etc
        case 'margin-top':
          stylesList.push(`mt-${value}`);
          break;
        case 'margin-left':
          stylesList.push(`ml-${value}`);
          break;
        case 'margin-bottom':
          stylesList.push(`mb-${value}`);
          break;
        case 'margin-right':
          stylesList.push(`mr-${value}`);
          break;
        case 'padding-top':
          stylesList.push(`pt-${value}`);
          break;
        case 'padding-left':
          stylesList.push(`pl-${value}`);
          break;
        case 'padding-bottom':
          stylesList.push(`pb-${value}`);
          break;
        case 'padding-right':
          stylesList.push(`pr-${value}`);
          break;
        case 'border-top-width':
          stylesList.push(`border-t-${value}`);
          break;
        case 'border-left-width':
          stylesList.push(`border-l-${value}`);
          break;
        case 'border-bottom-width':
          stylesList.push(`border-b-${value}`);
          break;
        case 'border-right-width':
          stylesList.push(`border-r-${value}`);
          break;
        case 'border-top-right-radius':
          value = util.translateConvertedToIrregular(borderRadiusUnitDict, value)
          stylesList.push(`rounded-tr-${value}`);
          break;
        case 'border-bottom-left-radius':
          value = util.translateConvertedToIrregular(borderRadiusUnitDict, value)
          stylesList.push(`rounded-bl-${value}`);
          break;
        case 'border-bottom-right-radius':
          value = util.translateConvertedToIrregular(borderRadiusUnitDict, value)
          stylesList.push(`rounded-br-${value}`);
          break;
        case 'border-top-right-radius':
          value = util.translateConvertedToIrregular(borderRadiusUnitDict, value)
          stylesList.push(`rounded-tr-${value}`);
          break;
        case 'height':
          stylesList.push(`h-${value}`);
          break;
        case 'width':
          stylesList.push(`w-${value}`);
          break;
        case 'gap':
          stylesList.push(`gap-${value}`);
          break;
        case 'column-gap':
          stylesList.push(`gap-x-${value}`);
          break;
        case 'row-gap':
          stylesList.push(`gap-y-${value}`);
          break;
        case 'min-width':
          stylesList.push(`min-w-${value}`);
          break;
        case 'max-width':
          stylesList.push(`max-w-${value}?`);
          break;   
        case 'min-height':
          stylesList.push(`min-h-${value}`);
          break;
        case 'max-height':
          stylesList.push(`max-h-${value}`);
          break;
        case 'line-height':
          stylesList.push(`leading-${value}`);
          break;
        case 'text-indent':
          stylesList.push(`indent-${value}`);
          break;
        case 'transition-duration':
          stylesList.push(`duration-${value}`);
          break;
        case 'transition-delay':
          stylesList.push(`delay-${value}`);
          break;
        case 'text-decoration-thickness':
          if(numberRegex.test(value)) value = revertUnits(unitDict, value).replace('px', '')
          stylesList.push(`decoration-${value}`)
          break;
        case 'text-underline-offset':
          if(numberRegex.test(value)) value = revertUnits(unitDict, value)
          stylesList.push(`underline-offset-${value}`)
          break;
        case 'outline-width':
          if(numberRegex.test(value)) value = revertUnits(unitDict, value)
          stylesList.push(`outline-${value.replace('px', '')}`)
          break;
        case 'outline-offset':
          if(numberRegex.test(value)) value = revertUnits(unitDict, value)
          stylesList.push(`outline-offset-${value.replace('px', '')}`)
          break;
        case 'letter-spacing':
          value = value.replace('[', '').replace(']', '')
          stylesList.push(`tracking-${util.irregularConvertUnits(letterSpacingUnitDict, value)}`)
          break;

        // * SHORTHANDABLE VALUES
        case 'border-width':
          const borderWidths = util.shorthand(value.split(' '), shorthandDict[property])
          for(let i = 0; i < borderWidths.length; i++) {
            stylesList.push(borderWidths[i])
          }
          break;
        case 'border-radius':
          let borderRadiuses = value.split(' ')
          for(let i = 0; i < borderRadiuses.length; i++) {
            borderRadiuses[i] = util.translateConvertedToIrregular(borderRadiusUnitDict, borderRadiuses[i])
          }
          if (borderRadiuses.length === 1) {
            stylesList.push(`rounded-${borderRadiuses[0]}`.replace('-/', ''));
          } else if (borderRadiuses.length === 2) {
            stylesList.push(`rounded-tl-${borderRadiuses[0]}`.replace('-/', ''));
            stylesList.push(`rounded-br-${borderRadiuses[0]}`.replace('-/', ''));
            stylesList.push(`rounded-tr-${borderRadiuses[1]}`.replace('-/', ''));
            stylesList.push(`rounded-bl-${borderRadiuses[1]}`.replace('-/', ''));
          } else if (borderRadiuses.length === 3) { 
            stylesList.push(`rounded-tl-${borderRadiuses[0]}`.replace('-/', ''));
            stylesList.push(`rounded-tr-${borderRadiuses[1]}`.replace('-/', ''));
            stylesList.push(`rounded-bl-${borderRadiuses[1]}`.replace('-/', ''));
            stylesList.push(`rounded-br-${borderRadiuses[2]}`.replace('-/', ''));
          } else if (borderRadiuses.length === 4) {
            stylesList.push(`rounded-tl-${borderRadiuses[0]}`.replace('-/', ''));
            stylesList.push(`rounded-tr-${borderRadiuses[1]}`.replace('-/', ''));
            stylesList.push(`rounded-br-${borderRadiuses[2]}`.replace('-/', ''));
            stylesList.push(`rounded-bl-${borderRadiuses[3]}`.replace('-/', ''));
          }
          break;
        case 'margin':
          const margins = util.shorthand(value.split(' '), shorthandDict[property])
          for(let i = 0; i < margins.length; i++) {
            stylesList.push(margins[i])
          }
          break;
        case 'scroll-margin':
          const scrollMargins = util.shorthand(value.split(' '), shorthandDict[property])
          for(let i = 0; i < scrollMargins.length; i++) {
            stylesList.push(scrollMargins[i])
          }
          break;
        case 'padding':
          const paddings = util.shorthand(value.split(' '), shorthandDict[property])
          for(let i = 0; i < paddings.length; i++) {
            stylesList.push(paddings[i])
          }
          break;
        case 'scroll-padding':
          const scrollPaddings = util.shorthand(value.split(' '), shorthandDict[property])
          for(let i = 0; i < scrollPaddings.length; i++) {
            stylesList.push(scrollPaddings[i])
          }
          break;
        case 'border-spacing':
          const borderSpacings = util.shorthand(value.split(' '), shorthandDict[property])
          for(let i = 0; i < borderSpacings.length; i++) {
            stylesList.push(borderSpacings[i])
          }
          break;
        case 'inset':
          const values = value.split(' ')
          if (values.length === 1) {
            stylesList.push(`inset-${values[0]}`);
          } else if (values.length === 2) {
            stylesList.push(`inset-y-${values[0]}`);
            stylesList.push(`inset-x-${values[1]}`);
          } else if (values.length === 3) {
            stylesList.push(`top-${values[0]}`);
            stylesList.push(`inset-x-${values[1]}`);
            stylesList.push(`bottom-${values[2]}`);
          } else if (values.length === 4) {
            stylesList.push(`top-${values[0]}`);
            stylesList.push(`right-${values[1]}`);
            stylesList.push(`bottom-${values[2]}`);
            stylesList.push(`left-${values[3]}`);
          }
          break;

        // * NUMBER NO UNIT
        case 'grid-row-start':
          stylesList.push(`row-start-${value}`)
          break;
        case 'grid-row-end':
          stylesList.push(`row-end-${value}`)
          break;
        case 'grid-column-start':
          stylesList.push(`col-start-${value}`)
          break;
        case 'grid-column-end':
          stylesList.push(`col-end-${value}`)
          break;
        case 'stroke-width':
          stylesList.push(`stroke-${value}`)
          break;
        case 'z-index':
          stylesList.push(`z-${value}`)
          break;
        case 'columns':
          stylesList.push(`columns-${value}`)
          break;
        case 'order':
          if(value == '0') stylesList.push('order-none')
          else stylesList.push(`order-${value}`)
          break;
        case 'opacity':
          stylesList.push(`opacity-${value * 100}`)
          break;
        case 'aspect-ratio':
          if(value.includes('1 / 1')) stylesList.push(`aspect-square`)
          if(value.includes('16 / 9')) stylesList.push(`aspect-video`)
          else stylesList.push(`aspect-${value}`)
          break;
        case 'font-weight':
          stylesList.push(`font-${util.irregularConvertUnits(fontWeightUnitDict, value)}`)
          break;
        case 'flex-grow':
          if(value.includes('1')) stylesList.push(`grow`)
          else stylesList.push(`grow-0`)
          break;
        case 'flex-shrink':
          if(value.includes('1')) stylesList.push(`shrink`)
          else stylesList.push(`shrink-0`)
          break;
        
        // * WORDS
        case 'break-after':
          stylesList.push(`break-after-${value}`)
          break;
        case 'break-before':
          stylesList.push(`break-before-${value}`)
          break;
        case 'break-inside':
          stylesList.push(`break-inside-${value}`)
          break;
        case 'box-decoration-break-inside':
          stylesList.push(`box-decoration-${value}`)
          break;
        case 'box-sizing':
          stylesList.push(`box-${value}`)
          break;
        case 'display':
          stylesList.push(`${value}`)
          break;
        case 'position':
          stylesList.push(`${value}`)
          break;
        case 'visibility':
          stylesList.push(`${value}`)
          break;
        case 'float':
          stylesList.push(`float-${value}`)
          break;
        case 'clear':
          stylesList.push(`clear-${value}`)
          break;
        case 'isolate':
          if(value.includes('isolate')) stylesList.push('isolate')
          else stylesList.push(`isolation-${value}`)
          break;
        case 'object-fit':
          stylesList.push(`object-${value}`)
          break;
        case 'object-position':
          stylesList.push(`object-${value}`)
          break;
        case 'overflow':
          stylesList.push(`overflow-${value}`)
          break;
        case 'overflow-x':
          stylesList.push(`overflow-x-${value}`)
          break;
        case 'overflow-y':
          stylesList.push(`overflow-y-${value}`)
          break;
        case 'overscroll':
          stylesList.push(`overscroll-${value}`)
          break;
        case 'overscroll-x':
          stylesList.push(`overscroll-x-${value}`)
          break;
        case 'overscroll-y':
          stylesList.push(`overscroll-y-${value}`)
          break;
        case 'flex-direction':
          stylesList.push(`flex-${value}`.replace('column', 'col'))
          break;
        case 'flex-wrap':
          stylesList.push(`flex-${value}`)
          break;
        // TODO: Flex
        case 'grid-auto-flow':
          stylesList.push(`grid-flow-${value}`.replace(' ', '-').replace('column', 'col'))
          break;
        case 'grid-auto-columns':
          stylesList.push(`auto-cols-${value}`)
          break;
        case 'grid-auto-rows':
          stylesList.push(`auto-rows-${value}`)
          break;
        case 'justify-content':
          stylesList.push(`justify-${value}`)
          break;
        case 'justify-items':
          stylesList.push(`justify-items-${value}`)
          break;
        case 'justify-self':
          stylesList.push(`justify-self-${value}`)
          break;
        case 'align-content':
          stylesList.push(`content-${value}`)
          break;
        case 'align-items':
          stylesList.push(`items-${value}`)
          break;
        case 'align-self':
          stylesList.push(`self-${value}`)
          break;
        case 'place-content':
          stylesList.push(`place-content-${value}`)
          break;
        case 'place-items':
          stylesList.push(`place-items-${value}`)
          break;
        case 'place-self':
          stylesList.push(`place-self-${value}`)
          break;
        case 'font-style':
          if(value.includes('italic')) stylesList.push(`italic`)
          else if(value.includes('normal')) stylesList.push(`not-italic`)
          break;
        case 'font-variant-numeric':
          stylesList.push(`${value}`)
          break;
        case 'list-style-type':
          stylesList.push(`list-${value}`)
          break;
        case 'list-style-position':
          stylesList.push(`list-${value}`)
          break;
        case 'text-align':
          stylesList.push(`text-${value}`)
          break;
        case 'text-decoration-line':
          if(value.includes('none')) stylesList.push('no-underline')
          else stylesList.push(`${value}`)
          break;
        case 'text-transform':
          if(value.includes('none')) stylesList.push('normal-case')
          else stylesList.push(`${value}`)
          break;
        case 'text-decoration-style':
          stylesList.push(`decoration-${value}`)
          break;
        case 'text-overflow':
          stylesList.push(`text-${value}`)
          break;
        case 'vertical-align':
          stylesList.push(`align-${value}`)
          break;
        case 'white-space':
          stylesList.push(`whitespace-pre-${value}`)
          break;
        case 'overflow-wrap':
          if(value.include('break-word')) stylesList.push('break-words')
          else stylesList.push(`${value}`)
          break;
        case 'word-break':
          if(value.includes('keep-all')) stylesList.push(`break-keep`)
          else stylesList.push(`whitespace-pre-${value}`)
          break;
        case 'content':
          stylesList.push(`content-${value}`)
          break;
        case 'background-attachment':
          stylesList.push(`bg-${value}`)
          break;
        case 'background-clip':
          stylesList.push(`bg-clip-${value}`)
          break;
        case 'background-origin':
          stylesList.push(`bg-origin-${value}`)
          break;
        case 'background-position':
          stylesList.push(`bg-${value}`)
          break;
        case 'background-repeat':
          stylesList.push(`bg-${value}`)
          break;
        case 'background-size':
          stylesList.push(`bg-${value}`)
          break;
        case 'border-style':
          stylesList.push(`border-${value}`)
          break;
        case 'outline-style':
          stylesList.push(`outline-${value}`)
          break;
        case 'mix-blend-mode':
          stylesList.push(`mix-blend-${value}`)
          break;
        case 'background-blend-mode':
          stylesList.push(`bg-blend-${value}`)
          break;
        case 'border-collapse':
          stylesList.push(`border-${value}`)
          break;
        case 'table-layout':
          stylesList.push(`table-${value}`)
          break;
        case 'transform-origin':
          stylesList.push(`origin-${value}`.replace(' ', '-'))
          break;
        case 'appearance':
          stylesList.push(`${value}`)
          break;
        case 'cursor':
          stylesList.push(`cursor-${value}`)
          break;
        case 'pointer-events':
          stylesList.push(`pointer-events-${value}`)
          break;
        case 'scroll-bahviour':
          stylesList.push(`scroll-${value}`)
          break;
        case 'resize':
          if(value.includes('vertical')) stylesList.push('resize-y')
          else if(value.includes('horizontal')) stylesList.push('resize-x')
          else if(value.includes('both')) stylesList.push('resize')
          else stylesList.push(`resize-${value}`)
          break;
        case 'scroll-snap-align':
          if(value.includes('none')) stylesList.push('snap-align-none')
          else stylesList.push(`snap-${value}`)
          break;
        case 'scroll-snap-stop':
          stylesList.push(`snap-${value}`)
          break;
        case 'scroll-snap-type':
          stylesList.push(`snap-${value}`)
          break;
        case 'touch-action':
          stylesList.push(`touch-${value}`)
          break;
        case 'user-select':
          stylesList.push(`select-${value}`)
          break;
        case 'will-change':
          stylesList.push(`will-change-${value}`)
          break;
        
        // * COLORS
        case 'background-color':
          stylesList.push(`bg-${value}`)
          break;
        case 'background':
          stylesList.push(`bg-${value}`)
          break;
        case 'text-color':
          stylesList.push(`text-${value}`)
          break;
        case 'text-decoration-color':
          stylesList.push(`decoration-${value}`)
          break;
        case 'border-color':
          stylesList.push(`border-${value}`)
          break;
        case 'outline-color':
          stylesList.push(`outline-${value}`)
          break;
        case 'accent-color':
          stylesList.push(`stylesListent-${value}`)
          break;
        case 'caret-color':
          stylesList.push(`caret-${value}`)
          break;
        case 'fill':
          stylesList.push(`fill-${value}`)
          break;
        case 'stroke':
          stylesList.push(`stroke-${value}`)
          break;
        
        default:
          break;
      }
      return stylesList;
    }, []);
  return styles.join(' ');
}

function convertToHTML(css, html) {
  css = css.split(/[\{\}]/g)
  const formattedCSS = []
  for(let i = 0; i < css.length; i++) {
    formattedCSS.push(css[i].replace(/\n/g, "").replace('}', '').trim()) 
  }
  console.log(formattedCSS)
}


// EXAMPLE
/* example1 {
  inset: 25px 30px 2px;
  stroke: #475569;
  padding: 45px 44px 43px 42px;
  will-change: scroll-position;
  scroll-padding: 0.625rem; 
  margin: 5px 7px;
  cursor: default;
  transform-origin: bottom right;
  transition-duration: 75ms;
  delay-75	transition-delay: 75ms;
  border-collapse: separate;
  table-layout: fixed;
  background-blend-mode: color-dodge;
  mix-blend-mode: lighten;
  opacity: 0.25;
  outline-offset: 4px;
  outline-style: dashed;
  border-width: 4px 1.25em;
  background-size: contain;
  background-origin: content-box;
  background-clip: text;
  text-indent: 0.5rem;
  text-decoration-thickness: 4px;
  list-style-position: outside;
  line-height: 1.5rem;
  font-weight: 400;
  letter-spacing: 0.025em;
  height: 0.625rem;
  max-height: 0.5rem; 
  place-content: space-between;
  align-self: flex-end;
  justify-content: space-around;
  column-gap: 0.125rem; 
  row-gap: 0.125rem;
  order: 4;
  object-fit: scale-down;
  border-radius: 25% 12px 8px 7%;
  backdrop-filter: hue-rotate(30deg);
  filter: saturate(1.5);
  transform: translateY(17rem);
} 
example2 {
  border-radius: 25% 10%;
  border-radius: 25% 12px;
  border-radius: 25% 12px 8px;
  border-radius: 25% 12px 8px 7%;
} */