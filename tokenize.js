  
// /* Base styles for example1 and example2 */
// .example1 {
//   inset: 25px 30px 2px;
//   stroke: #475569;
//   padding: 45px 44px 43px 42px;
//   will-change: scroll-position;
//   scroll-padding: 0.625rem;
//   margin: 5px 7px;
//   cursor: default;
//   transform-origin: bottom right;
//   transition-duration: 75ms;
//   transition-delay: 75ms; /* corrected property name */
//   border-collapse: separate;
//   table-layout: fixed;
//   background-blend-mode: color-dodge;
//   mix-blend-mode: lighten;
//   opacity: 0.25;
//   outline-offset: 4px;
//   outline-style: dashed;
//   border-width: 4px 1.25em;
//   background-size: contain;
//   background-origin: content-box;
//   background-clip: text;
//   text-indent: 0.5rem;
//   text-decoration-thickness: 4px;
//   list-style-position: outside;
//   line-height: 1.5rem;
//   font-weight: 400;
//   letter-spacing: 0.025em;
//   height: 0.625rem;
//   max-height: 0.5rem;
//   place-content: space-between;
//   align-self: flex-end;
//   justify-content: space-around;
//   column-gap: 0.125rem;
//   row-gap: 0.125rem; /* corrected value */
//   object-fit: scale-down;
//   order: 4;
//   border-radius: 25% 12px 8px 7%;
//   backdrop-filter: hue-rotate(30deg);
//   filter: saturate(1.5);
//   transform: translateY(17rem);
// }

const css = `

/* Nested selectors */
label {
  font-family:    system-ui;
  font-size: 1.25rem;
  color: #333;
  border: 1px solid #ccc;
  padding: 10px;

  input {
    border: 2px dashed blue;
    padding: 5px;
    font-size: 1rem;
    background-color: #fafafa;
    
    &:focus {
      border-color: #00f;
      background-color: #e0e0e0;
    }
    
    &:disabled {
      border-color: #999;
      background-color: #f0f0f0;
      cursor: not-allowed;
    }
  }

  &::before {
    content: "Label:";
    font-weight: bold;
    color: #444;
  }

  &::after {
    content: " (Required)";
    font-style: italic;
    color: #f00;
  }
}
.example2 {
  border-radius: 25% 10%;
  border-radius: 25% 12px;
  border-radius: 25% 12px 8px;
  border-radius: 25% 12px 8px 7%;
}
body {
  background: #1D1F20;
}
main {
  height: 100vh;
  width: 100vw;
}

.button {
  background: #2B2D2F;
  height: 80px;
  width: 200px;
  text-align: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  margin: 0 auto;
  cursor: pointer;
  border-radius: 4px;
}

.text {
  font: bold 1.25rem/1 poppins;
  color: #71DFBE;
  position: absolute;
  top: 50%;
  transform: translateY(-52%);
  left: 0;
  right: 0;
}

.progress-bar {
  position: absolute;
  height: 10px;
  width: 0;
  right: 0;
  top: 50%;
  left: 50%;
  border-radius: 200px;
  transform: translateY(-50%) translateX(-50%);
  background: lighten(#2B2D2F, 15%);
}

svg {
  width: 30px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  left: 50%;
  right: 0;
}

.check {
  fill: none;
  stroke: #FFFFFF;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}


.container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  
  .item {
    background-color: #eee;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    &:hover {
      background-color: #ddd;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
    
    &::before {
      content: "Item ";
      font-weight: bold;
      color: #888;
    }

    &[aria-selected="true"] {
      border: 2px solid #00f;
      background-color: #d0e0ff;
    }

    &::after {
      content: " (details)";
      font-style: italic;
      color: #666;
    }
  }
}

/* Data-attribute selector */
.example1[aria-busy="true"] {
  opacity: 0.5;
  border-color: #f00;
}

/* States */
.example1:hover {
  background-color: #eee;
  border-color: #aaa;
}

/* Media queries */
@media (max-width: 600px) {
  .example1 {
    padding: 20px;
    font-size: 0.8rem;
  }

  .container {
    padding: 10px;
  }
}

@media (min-width: 601px) and (max-width: 1024px) {
  .example1 {
    padding: 30px;
    font-size: 1rem;
  }

  .container {
    padding: 15px;
  }
}

@media (min-width: 1025px) {
  .example1 {
    padding: 40px;
    font-size: 1.2rem;
  }

  .container {
    padding: 20px;
  }
}

/* Additional states and pseudo-classes */
.example1::before {
  content: "Prefix ";
  color: #777;
}

.example1::after {
  content: " Suffix";
  color: #777;
}

.example1:focus {
  outline: 2px solid #0f0;
}

/* Advanced pseudo-classes and states */
.example1:checked {
  background-color: #f0f;
}

.example1:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.example1:nth-child(odd) {
  background-color: #fafafa;
}

.example1:nth-child(even) {
  background-color: #eee;
}
`

class Tree {
  constructor(value, parent=null) {
    this.value = value;
    this.children = {};
    this.parent = parent;
  }

  addChild(value) {
    const newTree = new Tree(value, this);
    this.children[value] = newTree;
    return newTree;
  }
  addRule(key, value) {
    this.children[key] = value;
  }
  // toJSON() {
  //   const childrenJSON = {};
  //   for (const [key, child] of Object.entries(this.children)) {
  //     if (child instanceof Tree) {
  //       childrenJSON[key] = child.toJSON();
  //     } else {
  //       childrenJSON[key] = child;
  //     }
  //   }
  //   return { [this.value]: childrenJSON };
  // }
}




export function tokenize(css) {
  const cssTreeArray = [];

  // Remove comments
  css = css.replace(/\/\*.*?\*\//g, '').replace(/\s+/g, " ").trim();
  // console.log(css)
  
  const cssArray = css.match(/[^{};]+{?|}|;/g).map(token => token.trim()).filter(token => token !== ';' && token !== '');
  // console.table(cssArray)
  // let tokenIndex = 0;
  let currentTree = null;
  // while (tokenIndex < cssArray.length) {
  //   const token = cssArray[tokenIndex];
  //   if (token == "") {
  //     tokenIndex++
  //     continue
  //   }
  //   if (token === "{") {
  //     if (currentTree === null) {
  //       currentTree = new Tree(cssArray[tokenIndex - 1]);
  //       cssTreeArray.push(currentTree)
  //     } else {
  //       currentTree = currentTree.addChild(cssArray[tokenIndex - 1]);
  //     }
      
  //     tokenIndex += 2;
  //     continue;
  //   }
  //   if (token.includes(":")) {
  //     // get the value associated by reading the next tokens until we get one with a semicolon
  //     let value = "";
  //     let valueTokenIndex = tokenIndex + 1
  //     while (valueTokenIndex < cssArray.length && !cssArray[valueTokenIndex].includes(";")) {
  //       value += cssArray[valueTokenIndex] + " ";
  //       valueTokenIndex++;
  //     }
  //     tokenIndex = valueTokenIndex - 1
  //     continue
  //   }
  //   if (token === "}") {
  //     currentTree = currentTree.parent;
  //     tokenIndex++;
  //     continue
  //   }
  //   tokenIndex++;
    
  // }
  cssArray.forEach(token => {
    if (token.includes("{")) {
      const selector = token.replace("{", "").trim();
      // console.log(token, currentTree)
      if (currentTree === null) {
        currentTree = new Tree(selector);
        cssTreeArray.push(currentTree);
      } else {
        currentTree = currentTree.addChild(selector);
      }
    } else if (token === "}") {
      currentTree = currentTree.parent;
    } else if (token.includes(":")) {
      const [key, value] = token.split(":").map(item => item.trim());
      currentTree.addRule(key, value.replace(";", ""));
    } 
  })
  
  return cssTreeArray.map(tree => toJSON(tree)).map(obj => removeDuplicates(obj));
}

function toJSON(tree) {
  const result = {};
  for (const [key, child] of Object.entries(tree.children)) {
    if (child instanceof Tree) {
      result[key] = toJSON(child);
    } else {
      result[key] = child;
    }
  }
  return { [tree.value]: result };
}

function removeDuplicates(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Recursively remove duplicates in the child object
      obj[key] = removeDuplicates(obj[key]);

      // If the child object has a single key with the same name as the parent key, merge them
      if (Object.keys(obj[key]).length === 1 && Object.keys(obj[key])[0] === key) {
        obj[key] = obj[key][key];
      }
    }
  }

  return obj;
}


// const cssTreeArray = tokenize(css);
// // cssTreeArray.map(tree => removeDuplicates(tree));
// const string = JSON.stringify(cssTreeArray, null, 2);
// console.log(cssTreeArray);
// console.log(string);


// --
// class BracketPair {
//   constructor(openIndex, closeIndex) {
//     this.openIndex = openIndex;
//     this.closeIndex = closeIndex;
//   }
// }
// let bracketPairs = []

// for (let i = 0; i < css.length; i++) {
  //   const char = css[i];
  //   if (char === '{') {
    //     bracketPairs.push(new BracketPair(i, -1));
    //   } else if (char === '}') {
      //     // find the last bracketpair that has a closeIndex of -1
      //     for (let j = bracketPairs.length - 1; j >= 0; j--) {
        //       if (bracketPairs[j].closeIndex === -1) {
          //         bracketPairs[j].closeIndex = i;
          //         break;
          //       }
          //     }
          //   } 
          // }
  // define the structure of the css tree based on the bracket pairs
  // console.log(bracketPairs)