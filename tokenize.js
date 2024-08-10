

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
  font-family: system-ui;
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
// .container {
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
//   padding: 20px;
  
//   .item {
//     background-color: #eee;
//     border-radius: 8px;
//     padding: 15px;
//     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

//     &:hover {
//       background-color: #ddd;
//       box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
//     }
    
//     &::before {
//       content: "Item ";
//       font-weight: bold;
//       color: #888;
//     }

//     &[aria-selected="true"] {
//       border: 2px solid #00f;
//       background-color: #d0e0ff;
//     }

//     &::after {
//       content: " (details)";
//       font-style: italic;
//       color: #666;
//     }
//   }
// }

// /* Data-attribute selector */
// .example1[aria-busy="true"] {
//   opacity: 0.5;
//   border-color: #f00;
// }

// /* States */
// .example1:hover {
//   background-color: #eee;
//   border-color: #aaa;
// }

// /* Media queries */
// @media (max-width: 600px) {
//   .example1 {
//     padding: 20px;
//     font-size: 0.8rem;
//   }

//   .container {
//     padding: 10px;
//   }
// }

// @media (min-width: 601px) and (max-width: 1024px) {
//   .example1 {
//     padding: 30px;
//     font-size: 1rem;
//   }

//   .container {
//     padding: 15px;
//   }
// }

// @media (min-width: 1025px) {
//   .example1 {
//     padding: 40px;
//     font-size: 1.2rem;
//   }

//   .container {
//     padding: 20px;
//   }
// }

// /* Additional states and pseudo-classes */
// .example1::before {
//   content: "Prefix ";
//   color: #777;
// }

// .example1::after {
//   content: " Suffix";
//   color: #777;
// }

// .example1:focus {
//   outline: 2px solid #0f0;
// }

// /* Advanced pseudo-classes and states */
// .example1:checked {
//   background-color: #f0f;
// }

// .example1:disabled {
//   cursor: not-allowed;
//   opacity: 0.5;
// }

// .example1:nth-child(odd) {
//   background-color: #fafafa;
// }

// .example1:nth-child(even) {
//   background-color: #eee;
// }



class Tree {
  constructor(value) {
    this.value = value;
    this.children = [];
  }

  addChild(value) {
    const newTree = new Tree(value);
    this.children.push(newTree);
    return newTree;
  }
}

class BracketPair {
  constructor(openIndex, closeIndex) {
    this.openIndex = openIndex;
    this.closeIndex = closeIndex;
  }
}

function tokenize(css) {
  const cssTree = new Tree({});
  let currentTree = cssTree;
  // const stack = [cssTree];

  // Remove newlines and extra spaces
  css = css.replace(/\s+/g, ' ').trim();

  // Remove comments
  css = css.replace(/\/\*.*?\*\//g, '');
  console.log(css)

  // Tokenize the CSS into rules and nested blocks
  // const regex = /([^{]+)\{([^{}]*)\}/g;
  // iterate through each character of the css string
  let bracketPairs = []

  for (let i = 0; i < css.length; i++) {
    const char = css[i];
    if (char === '{') {
      bracketPairs.push(new BracketPair(i, -1));
    } else if (char === '}') {
      // find the last bracketpair that has a closeIndex of -1
      for (let j = bracketPairs.length - 1; j >= 0; j--) {
        if (bracketPairs[j].closeIndex === -1) {
          bracketPairs[j].closeIndex = i;
          break;
        }
      }
    } 
  }
  // define the structure of the css tree based on the bracket pairs
  console.log(bracketPairs)
  
 
  return cssTree;
}


const cssTree = tokenize(css);
console.log(JSON.stringify(cssTree, null, 2));
