import { specialSelectors } from "./dictionaries"

class Tree {
  constructor(value, parent=null) {
    this.value = value
    this.children = {}
    this.parent = parent
  }

  addChild(value) {
    const newTree = new Tree(value, this)
    this.children[value] = newTree
    return newTree
  }
  addRule(key, value) {
    this.children[key] = value
  }
}
export function tokenizeMultipleSelectors(css) {
  const cssTreeArray = []

  css = css.replace(/\/\*.*?\*\//g, '').replace(/\s+/g, " ").trim()
  
  const cssArray = css.match(/[^{};]+{?|}|;/g).map(token => token.trim()).filter(token => token !== ';' && token !== '');

  let currentTrees = []

  cssArray.forEach(token => {
    // console.log(token)
    if (token.includes("{")) {
      let selector = token.replace('{', '').trim()
      
      specialSelectors.forEach(specialSelector => {
        if (selector.trim() === `:${specialSelector}`) {
          selector = selector.replace(`:${specialSelector}`, specialSelector)
        }
      })

      let selectors = selector.split(",").map(item => item.trim())
      
      currentTrees = selectors.map(singleSelector => {
        if (currentTrees.length === 0) {
          const newTree = new Tree(singleSelector)
          cssTreeArray.push(newTree)
          return newTree
        } else {
          return currentTrees[0].addChild(singleSelector)
        }
      })
    } else if (token === "}") {
      currentTrees = currentTrees.map(tree => tree.parent).filter(Boolean)
    } else if (token.includes(":")) {
      const [key, value] = token.split(":").map(item => item.trim())
      // console.log(key, value)
      currentTrees.forEach(tree => tree.addRule(key, value.replace(";", "")))
    } 
  })
  
  return cssTreeArray.map(tree => toJSON(tree)).map(obj => removeDuplicates(obj))
}

export function tokenize(css) {
  const cssTreeArray = []

  css = css.replace(/\/\*.*?\*\//g, '').replace(/\s+/g, " ").trim()
  // console.log(css)
  
  const cssArray = css.match(/[^{};]+{?|}|;/g).map(token => token.trim()).filter(token => token !== ';' && token !== '')

  let currentTree = null

  cssArray.forEach(token => {
    if (token.includes("{")) {
      let selector = token.replace('{', '').trim()
      // edge case for the :root and similar selectors to escape out of the pseudo-classes code system
      // console.log(token, currentTree)
      specialSelectors.forEach(specialSelector => {
        if (selector.trim() == `:${specialSelector}`) {
          selector = selector.replace(`:${specialSelector}`, specialSelector)
        }
      })
      let selectors = selector.split(",").map(item => item.trim())
      if (currentTree === null) {
        currentTree = new Tree(selector)
        cssTreeArray.push(currentTree)
      } else {
        currentTree = currentTree.addChild(selector)
      }
    } else if (token === "}") {
      currentTree = currentTree.parent
    } else if (token.includes(":")) {
      const [key, value] = token.split(":").map(item => item.trim())
      currentTree.addRule(key, value.replace(";", ""))
    } 
  })
  
  return cssTreeArray.map(tree => toJSON(tree)).map(obj => removeDuplicates(obj))
}

function toJSON(tree) {
  const result = {}
  for (const [key, child] of Object.entries(tree.children)) {
    if (child instanceof Tree) {
      result[key] = toJSON(child)
    } else {
      result[key] = child
    }
  }
  return { [tree.value]: result }
}

function removeDuplicates(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Recursively remove duplicates in the child object
      obj[key] = removeDuplicates(obj[key])

      // If the child object has a single key with the same name as the parent key, merge them
      if (Object.keys(obj[key]).length === 1 && Object.keys(obj[key])[0] === key) {
        obj[key] = obj[key][key]
      }
    }
  }

  return obj
}