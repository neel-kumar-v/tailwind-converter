

const numberRegex = /\d/
const zeroRegex = /0[a-zA-Z]*/
  
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

// .example2 {
//   border-radius: 25% 10%;
//   border-radius: 25% 12px;
//   border-radius: 25% 12px 8px;
//   border-radius: 25% 12px 8px 7%;
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
`

/* I want it to look like
[
  Tree(label, {
      font-family: system-ui,
      font-size: 1.25rem,
      color: #333,
      border: 1px solid #ccc,
      padding: 10px,
      input: Tree(input, {
        border: 2px dashed blue,
        padding: 5px,
        font-size: 1rem,
        background-color: #fafafa,
        "&:focus": Tree(focus, {
          border-color: #00f,
          background-color: #e0e0e0
        }),
        "&:disabled": Tree(disabled, {
          border-color: #999,
          background-color: #f0f0f0,
          cursor: not-allowed
        })
      }),
      "&::before": Tree(before, {
        content: "Label:",
        font-weight: bold,
        color: #444
      }),
      "&::after": Tree(after, {
        content: " (Required)",
        font-style: italic,
        color: #f00
      })
    })
  }),
  Tree(example2, {
    border-radius: 25% 10%;
    border-radius: 25% 12px;
    border-radius: 25% 12px 8px;
    border-radius: 25% 12px 8px 7%;
  })

]
*/
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
}



// class BracketPair {
//   constructor(openIndex, closeIndex) {
//     this.openIndex = openIndex;
//     this.closeIndex = closeIndex;
//   }
// }

function tokenize(css) {
  const cssTreeArray = [];
  // const stack = [cssTreeArray];

  // Remove newlines and extra spaces
  css = css.replace(/\s+/g, ' ').trim();

  // Remove comments
  css = css.replace(/\/\*.*?\*\//g, '').replace(":", ": ").replace(/\s+/g, " ")
  console.log(css)

  
  const cssArray = css.split(' ')
  console.log(cssArray)
  let tokenIndex = 0;
  let currentTree = null;
  while (tokenIndex < cssArray.length) {
    const token = cssArray[tokenIndex];
    if (token == "") {
      tokenIndex++
      continue
    }
    if (token === "{") {
      if (currentTree === null) {
        currentTree = new Tree(cssArray[tokenIndex - 1]);
        cssTreeArray.push(currentTree)
      } else {
        currentTree = currentTree.addChild(cssArray[tokenIndex - 1]);
      }

      tokenIndex += 2;
      continue;
    }
    if (token.includes(":")) {
      // get the value associated by reading the next tokens until we get one with a semicolon
      let value = "";
      let valueTokenIndex = tokenIndex + 1
      while (valueTokenIndex < cssArray.length && !cssArray[valueTokenIndex].includes(";")) {
        value += cssArray[valueTokenIndex] + " ";
        valueTokenIndex++;
      }
      tokenIndex = valueTokenIndex - 1
    }
    if (token === "}") {
      currentTree = currentTree.parent;
    }

  }
 
  return cssTreeArray;
}


// const cssTreeArray = tokenize(css);
console.log(cssTreeArray);


// --
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