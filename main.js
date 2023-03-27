import './style.css'
import { shorthandDict, unitDict, colorsDict, borderRadiusUnitDict, blurUnitDict, letterSpacingUnitDict, fontWeightUnitDict } from './dictionaries'
const submitButton = document.getElementById('submit')
const cssButton = document.getElementById('copycss')
const tailwindButton = document.getElementById('copytailwind')
const input = document.getElementById('input')
const output = document.getElementById('output')

const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
const otherColorRegex = /^(rgb|rgba|hsl|hsla|hsv|cmyk)\(\s*(-?\d+%?\s*([,\s]+|$)){2,3}(-?\d+%?\s*,?\s*[\d.]*%?\s*)?\)$/
const numberRegex = /\d/
const unitRegex = /-?\d*\.?\d+(?:ch|cm|em|ex|in|mm|pc|ms|s|pt|px|rem|vh|vmax|vmin|vw|%)/
const zeroRegex = /0[a-zA-Z]*/

input.addEventListener('input', () => {
  output.textContent = convertToTailwind(input.value)
})

cssButton.addEventListener('click', () => {

  // Select the text field
  input.select();
  input.setSelectionRange(0, 99999); // For mobile devices

   // Copy the text inside the text field
  navigator.clipboard.writeText(input.value);

  // Alert the copied text
  alert("Copied the text: " + input.value.slice(0, 40) + "...");
})
tailwindButton.addEventListener('click', () => {

  // Select the text field
  output.select();
  output.setSelectionRange(0, 99999); // For mobile devices

   // Copy the text inside the text field
  navigator.clipboard.writeText(output.value);

  // Alert the copied text
  alert("Copied the text: " + output.value.slice(0, 40) + "...");
})

function convertToTailwind(css) {
  const styles = css.split('\n')
    .filter(style => style.trim() !== '') // remove empty lines
    .map(style => style.trim()) // trim leading/trailing spaces
    .reduce((stylesList, style) => {
      let [property, value] = style.split(':').map(s => s.trim()); // Split up the properties and the styles
      if(value != undefined) value = value.replace(';', ''); //Get rid of the semicolon
      console.log(property)
      console.log(value)
      if(value == undefined && property.includes('{')) stylesList.push(`${property}\n`)
      if(value == undefined && property.includes('}')) stylesList.push(`\n} \n`)

      if(property == 'filter' || property == 'transform' || property == 'backdrop-filter') {
        let [newProperty, newValue] = value.split('(').map(s => s.trim())
        newValue = newValue.replace(')', '')
        if(property == 'filter' || property == 'backdrop-filter') {
          const backdrop = (property == 'backdrop-filter') ? 'backdrop-' : ''
          let availableValues = [];
          switch(newProperty) {
            case 'blur':
              stylesList.push(`${backdrop}blur-${irregularConvertUnits(blurUnitDict, newValue)}`)

              break;
            case 'brightness':
              availableValues = [0, 0.5, 0.75, 0.9, 0.95, 1, 1.05, 1.1, 1.25, 1.5, 2] 
              if(availableValues.includes(Number(newValue))) stylesList.push(`${backdrop}brightness-${newValue * 100}`)
              else stylesList.push(`${backdrop}brightness-[${newValue}]`)
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

        } else {
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
              stylesList.push(`translate-x-${convertUnits(newValue)}`)
              break;
            case 'translateY':
              stylesList.push(`translate-y-${convertUnits(newValue)}`)
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
      }

      value = convertUnits(value)

      switch (property) {
        // * * SINGLE VALUES
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
          stylesList.push(`rounded-tr-${value}`);
          break;
        case 'border-bottom-left-radius':
          stylesList.push(`rounded-bl-${value}`);
          break;
        case 'border-bottom-right-radius':
          stylesList.push(`rounded-br-${value}`);
          break;
        case 'border-top-right-radius':
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
          stylesList.push(`tracking-${irregularConvertUnits(letterSpacingUnitDict, value)}`)
          break;

        // * SHORTHANDABLE VALUES
        case 'border-width':
          const borderWidths = shorthand(value.split(' '), shorthandDict[property])
          for(let i = 0; i < borderWidths.length; i++) {
            stylesList.push(borderWidths[i])
          }
          break;
        case 'border-radius':
          let borderRadiuses = value.split(' ')
          for(let i = 0; i < borderRadiuses.length; i++) {
            if(revertUnits(unitDict, borderRadiuses[i]) != undefined) borderRadiuses[i] = `[${revertUnits(unitDict, borderRadiuses[i])}]`
            const formattedBorderRadiuses = borderRadiuses[i].replace('[', '').replace(']', '')
            if(borderRadiusUnitDict[formattedBorderRadiuses] != undefined) borderRadiuses[i] = borderRadiusUnitDict[formattedBorderRadiuses]
          }
          if (borderRadiuses.length === 1) {
            stylesList.push(`rounded-${borderRadiuses[0]}`);
          } else if (borderRadiuses.length === 2) {
            stylesList.push(`rounded-tl-${borderRadiuses[0]}`);
            stylesList.push(`rounded-br-${borderRadiuses[0]}`);
            stylesList.push(`rounded-tr-${borderRadiuses[1]}`);
            stylesList.push(`rounded-bl-${borderRadiuses[1]}`);
          } else if (borderRadiuses.length === 3) {
            stylesList.push(`rounded-tl-${borderRadiuses[0]}`);
            stylesList.push(`rounded-tr-${borderRadiuses[1]}`);
            stylesList.push(`rounded-bl-${borderRadiuses[1]}`);
            stylesList.push(`rounded-br-${borderRadiuses[2]}`);
          } else if (borderRadiuses.length === 4) {
            stylesList.push(`rounded-tl-${borderRadiuses[0]}`);
            stylesList.push(`rounded-tr-${borderRadiuses[1]}`);
            stylesList.push(`rounded-br-${borderRadiuses[2]}`);
            stylesList.push(`rounded-bl-${borderRadiuses[3]}`);
          }
          break;
        case 'margin':
          const margins = shorthand(value.split(' '), shorthandDict[property])
          for(let i = 0; i < margins.length; i++) {
            stylesList.push(margins[i])
          }
          break;
        case 'scroll-margin':
          const scrollMargins = shorthand(value.split(' '), shorthandDict[property])
          for(let i = 0; i < scrollMargins.length; i++) {
            stylesList.push(scrollMargins[i])
          }
          break;
        case 'padding':
          const paddings = shorthand(value.split(' '), shorthandDict[property])
          for(let i = 0; i < paddings.length; i++) {
            stylesList.push(paddings[i])
          }
          break;
        case 'scroll-padding':
          const scrollPaddings = shorthand(value.split(' '), shorthandDict[property])
          for(let i = 0; i < scrollPaddings.length; i++) {
            stylesList.push(scrollPaddings[i])
          }
          break;
        case 'border-spacing':
          const borderSpacings = shorthand(value.split(' '), shorthandDict[property])
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
          stylesList.push(`font-${irregularConvertUnits(fontWeightUnitDict, value)}`)
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
        case 'stylesListent-color':
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

function shorthand(values, property) {
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

  return returnStyles;n
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
function convertUnits(value) {
  if(value != undefined) {
    if(unitDict[value] != undefined) { 
      return unitDict[value]
    } else if(colorsDict[value] != undefined) { 
      return '[' + colorsDict[value] + ']'
    } else if(hexColorRegex.test(value) || otherColorRegex.test(value)) { 
      return '[' + value + ']'
    } else if(value.split(' ').length > 1 && !value.includes('/')) {
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
function revertUnits(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function irregularConvertUnits(unitDictionary, value) {
  if(unitDictionary[value] != undefined) return unitDictionary[value]
  else return `[${value}]`
}
