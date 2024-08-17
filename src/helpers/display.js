import { copy } from './utilities.js'

const outputElement = document.getElementById('output');


function resetDisplay() {
  const outputElement = document.getElementById('output')
  outputElement.innerHTML = '';
}

function createCustomizableButton(text, color, outlineStyles) {
  const button = document.createElement('button')
    button.className = `inline-flex cursor-pointer select-none text-left duration-200 flex-wrap items-center justify-center no-underline hover:no-underline w-fit mr-2 p-1 px-3 hover:px-1.5 h-fit group rounded-lg ${color} my-1  class-copybutton`
    button.style = outlineStyles
    button.innerHTML = `
      <p class="group-hover:mr-1 duration-200 text-sm xl:text-md text-white font-normal class-name">${text}</p>
      <svg class="w-0 group-hover:w-4 opacity-0 group-hover:opacity-100 duration-200 aspect-square stroke-1 fill-white" viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
        <rect class="w-6 aspect-square stroke-none fill-white opacity-0"/>
        <g transform="matrix(1.43 0 0 1.43 12 12)" >
          <path style="stroke: none stroke-width: 1 stroke-dasharray: none stroke-linecap: butt stroke-dashoffset: 0 stroke-linejoin: miter stroke-miterlimit: 4  fill-rule: nonzero opacity: 1" transform=" translate(-8, -7.5)" d="M 2.5 1 C 1.675781 1 1 1.675781 1 2.5 L 1 10.5 C 1 11.324219 1.675781 12 2.5 12 L 4 12 L 4 12.5 C 4 13.324219 4.675781 14 5.5 14 L 13.5 14 C 14.324219 14 15 13.324219 15 12.5 L 15 4.5 C 15 3.675781 14.324219 3 13.5 3 L 12 3 L 12 2.5 C 12 1.675781 11.324219 1 10.5 1 Z M 2.5 2 L 10.5 2 C 10.78125 2 11 2.21875 11 2.5 L 11 10.5 C 11 10.78125 10.78125 11 10.5 11 L 2.5 11 C 2.21875 11 2 10.78125 2 10.5 L 2 2.5 C 2 2.21875 2.21875 2 2.5 2 Z M 12 4 L 13.5 4 C 13.78125 4 14 4.21875 14 4.5 L 14 12.5 C 14 12.78125 13.78125 13 13.5 13 L 5.5 13 C 5.21875 13 5 12.78125 5 12.5 L 5 12 L 10.5 12 C 11.324219 12 12 11.324219 12 10.5 Z" stroke-linecap="round" />
        </g>
      </svg>
    `
    return button
}

function findParentBySelector(element, tagname) {
  if (element.tagName == tagname) return element
  else return findParentBySelector(element.parentElement, tagname)
}

function handleHoverOnConflictingClasses(event, isHovering) {
  let element = findParentBySelector(event.target, 'BUTTON')
  let colorKey = element.getAttribute('data-colorMatch')
  // find all other peer buttons that have the same colorKey
  let buttons = Array.from(element.parentElement.getElementsByClassName('class-copybutton'))
  if(isHovering) {
    // console.log('mouse over')
    buttons.forEach(button => {
      if(button.getAttribute('data-colorMatch') == null || button.getAttribute('data-colorMatch') != colorKey) {
        button.style.opacity =  '0.2'
      }
    })
  } else {
    console.log('mouse out')
    buttons.forEach(button => {
      button.style.opacity = '1'
    })
  }
}

function createOutputSelectorDiv(selector, json) {
  const outputSelectorDiv = document.createElement('div')
  outputSelectorDiv.className = 'outputSelector first:mt-0 my-6'
  
  const selectorFlexContainer = document.createElement('div')
  selectorFlexContainer.className = 'flex flex-wrap justify-start mb-3 has-[:hover]:flex-nowrap'
  
  const selectorNameElement = document.createElement('h2')
  selectorNameElement.className = 'selector mr-2 font-normal text-xl xl:text-2xl text-white p-1'
  selectorNameElement.textContent = selector
  selectorFlexContainer.appendChild(selectorNameElement)
  
  const selectorCopyButton1 = document.createElement('button')
  selectorCopyButton1.className = 'inline-flex cursor-pointer select-none text-left duration-100 flex-wrap items-center justify-center no-underline hover:no-underline hover:bg-white/[0.1] w-fit xl:mx-3 mx-1 p-1 xl:px-3 px-1 rounded-lg'
  selectorCopyButton1.innerHTML = `
    <p class="mr-2 text-sm xl:text-md text-white/75 font-normal normal-case max-lg:hidden">Copy as CSS with @apply</p>
    <p class="mr-2 text-sm xl:text-md text-white/75 font-normal normal-case lg:hidden">@apply</p>
    <svg-icon width="5" opacity="75"></svg-icon>
  `
  selectorCopyButton1.addEventListener('click', () => copy(`${selector} Tailwind @apply directive `, `${selector} {\n  @apply ${json[selector].join(' ')}\n}`))
  selectorFlexContainer.appendChild(selectorCopyButton1)
  
  const selectorCopyButton2 = document.createElement('button')
  selectorCopyButton2.className = 'inline-flex cursor-pointer select-none text-left duration-100 flex-wrap items-center justify-center no-underline hover:no-underline hover:bg-white/[0.1] w-fit mx-3 p-1 px-3 rounded-lg'
  selectorCopyButton2.innerHTML = `
    <p class="mr-2 text-sm xl:text-md text-white/75 font-normal normal-case max-lg:hidden">Copy as TailwindCSS classes</p>
    <p class="mr-2 text-sm xl:text-md text-white/75 font-normal normal-case lg:hidden">Classes</p>
    <svg-icon width="5" opacity="75"></svg-icon>
  `
  selectorCopyButton2.addEventListener('click', () => copy(`${selector} Tailwind classes`, `${json[selector].join(' ')}`))
  selectorFlexContainer.appendChild(selectorCopyButton2) 
  outputSelectorDiv.appendChild(selectorFlexContainer)
  
  const classesFlexContainer = document.createElement('div')
  classesFlexContainer.className = 'classes flex flex-wrap justify-start'
  
  json[selector].forEach(className => {
    let classButton = createCustomizableButton(className, 'bg-white/[0.1]', '')
    classButton.addEventListener('click', () => copy('the Tailwind class', className))
    if(className.includes('!')) {
      classButton = createCustomizableButton(className.replace('!', ''), 'bg-red-500/[0.5]', '')
      classButton.addEventListener('click', () => copy('the Tailwind one-off class', className.replace('!', '')))
      classesFlexContainer.appendChild(classButton)
      // let tooltip = document.createElement('div')
      // tooltip.className = 'tooltip tooltip-error'
      // tooltip.setAttribute('data-tooltip', 'No TailwindCSS equivalent: not recommended')
      // tooltip.appendChild(classButton)
      // tooltip.addEventListener('mouseover', (event) => {
      //   let element = findParentBySelector(event.target, 'DIV')
      //   element.classList.add('tooltip-open')
      // })
      // tooltip.addEventListener('mouseleave', (event) => {
      //   let element = findParentBySelector(event.target, 'DIV')
      //   element.classList.remove('tooltip-open')
      // })
    }
    else if (className.includes('?')) {
      let colorDict = {
        "0": "59, 130, 246",
        "1": "34, 197, 94",
        "2": "234, 179, 8",
        "3": "139, 92, 246",
        "4": "249, 115, 22",
        "5": "236, 72, 153",
        "6": "20, 184, 166",
        "7": "6, 182, 212",
        "8": "99, 102, 241",
        "9": "132, 204, 22"
      }

      let split = className.split('?')
      let colorKey = split[0]
      classButton = createCustomizableButton(split[1], `bg-transparent`, `outline: 2px solid rgba(${colorDict[colorKey]}, 0.5); background-color: rgba(${colorDict[colorKey]}, 0.24);`)
      classButton.setAttribute('data-colorMatch', colorKey)
      classesFlexContainer.appendChild(classButton)
      classButton.addEventListener('mouseover', (event) => handleHoverOnConflictingClasses(event, true))
      classButton.addEventListener('mouseleave', (event) => handleHoverOnConflictingClasses(event, false))
    }
    else {
      classesFlexContainer.appendChild(classButton)
    }
  })
  
  outputSelectorDiv.appendChild(classesFlexContainer)
  outputElement.appendChild(outputSelectorDiv)
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      classesFlexContainer.classList.replace('flex-wrap', 'flex-nowrap');
    }, 0);
  })
}


export function displayOutputWithSelectors(json) {
  resetDisplay();
  Object.keys(json).forEach(selector => createOutputSelectorDiv(selector, json));
}


export function JSONToStringArray(json) {
  if (json == '') {
    console.log('Nothing was copied')
    return
  }
  let outputTailwindRuleArray = []
  Object.keys(json).forEach(key => {
    if (json[key] == '') return
    console.log(json[key])
    let tailwindRule = `${key} {\n \t@apply ${json[key].filter(rule => rule != '').join(' ')};\n}`
    outputTailwindRuleArray.push(tailwindRule)
  })
  console.log(outputTailwindRuleArray.join('\n'))
  return outputTailwindRuleArray
}
