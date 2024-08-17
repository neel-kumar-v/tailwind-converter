# Tailwind Converter Website

This repository contains the code behind this [site](https://csstotailwind.vercel.app) that converts almost any supported CSS media query, data attribute, or class into [TailwindCSS](https://github.com/tailwindlabs/tailwindcss). Just type, copy/paste, or drag/drop valid CSS into the editor panel, and the correct TailwindCSS classes will show up.

## Why?

When I first tried to convert an old CSS design to Tailwind I looked up a CSS to TailwindCSS converter. I found [this site](https://tailwind-converter.netlify.app/). While the site was aesthetically pleasing and easy-to-use, it lacked some significant features, such as prefixing of any kind, shorthand value support, etc. This inspired me to begin coding this project over a year ago. 

While working on the project, I found [this site](https://transform.tools/css-to-tailwind), which utilizes [this package](https://github.com/Jackardios/css-to-tailwindcss), which admittedly has a *little* bit more coverage of all CSS features compared to my project at this point. However, I found that the practice of translating everything to @apply directives shortcut some of the more complex prefixing issues and goes against TailwindCSS best practices.  Additionally, the lack of word wrap and default arbitrary value support leads to a suboptimal DX.

So, I made my own converter, with the DX of the first solution and the comprehensiveness of the second site. My goal was to make it as easy as possible to copy any subset of classes in any format needed, as well as to reduce the number of different selectors with prefixes.

## Roadmap

- [x] Recursive Nesting
- [ ] Animation & transition shorthand support
- [ ] Border & outline shorthand support
- [ ] Nested `@media` and `@support` query support
- [ ] Support for multiple CSS selectors
- [ ] Fix browser favicon
- [ ] Fix CodeMirror's error highlighting 
- [ ] Resizable panels
- [ ] Error handling bad CSS and resetting the display
- [ ] CSS variable support w/ auto generating Tailwind config file
	- Currently supported through arbitrary values, but the Tailwind config solution would be cleaner
- [ ] ...
