export const shorthandDict = {
  'margin': 'm',
  'padding': 'p',
  'inset': 'inset-',
  'border-width': 'border-',
  'scroll-margin': 'scroll-m',
  'scroll-padding': 'scroll-p',
  'border-spacing': 'border-spacing-',
}

export const singleValueDict = {
  'aspect-ratio': 'aspect',
  'margin-top': 'mt', 'margin-left': 'ml', 'margin-bottom': 'mb', 'margin-right': 'mr',
  'padding-top': 'pt', 'padding-left': 'pl', 'padding-bottom': 'pb', 'padding-right': 'pr',
  'border-top-width': 'border-t', 'border-left-width': 'border-l', 'border-bottom-width': 'border-b', 'border-right-width': 'border-r',
  'height': 'h', 'width': 'w',
  'gap': 'gap', 'column-gap': 'gap-x', 'row-gap': 'gap-y',
  'min-width': 'min-w', 'max-width': 'max-w', 'min-height': 'min-h', 'max-height': 'max-h',
  // 'line-height': 'leading',
  'text-indent': 'indent',
  'transition-duration': 'duration', 'transition-delay': 'delay', 'transition-timing-function': 'ease',
  'grid-row-start': 'row-start', 'grid-row-end': 'row-end', 'grid-column-start': 'col-start', 'grid-column-end': 'col-end', 
  'z-index': 'z',
  'columns': 'columns',
  'break-after': 'break-after', 'break-before': 'break-before', 'break-inside': 'break-inside',
  'box-decoration-break-inside': 'box-decoration',
  'box-sizing': 'box',
  'float': 'float',
  'clear': 'clear',
  'flex': 'flex',
  'object-fit': 'object', 'object-position': 'object', 'overflow': 'overflow', 'overflow-x': 'overflow-x', 'overflow-y': 'overflow-y',
  'overscroll': 'overscroll', 'overscroll-x': 'overscroll-x', 'overscroll-y': 'overscroll-y',
  'flex-wrap': 'flex',
  'grid-auto-columns': 'auto-cols', 'grid-auto-rows': 'auto-rows', 'grid-template-columns': 'grid-cols', 'grid-template-rows': 'grid-rows',
  'justify-content': 'justify', 'justify-items': 'justify-items', 'justify-self': 'justify-self',
  'align-content': 'content', 'align-items': 'items', 'align-self': 'self',
  'place-content': 'place-content', 'place-items': 'place-items', 'place-self': 'place-self',
  'list-style-type': 'list', 'list-style-position': 'list',
  'text-align': 'text', 'text-decoration-style': 'decoration', 'text-overflow': 'text',
  'vertical-align': 'align',
  'white-space': 'whitespace-pre',
  'background-attachment': 'bg', 'background-clip': 'bg-clip', 'background-origin': 'bg-origin', 'background-position': 'bg', 'background-repeat': 'bg', 'background-size': 'bg', 'background-image': 'bg', 'background-color': 'bg', 'background': 'bg', // Todo: bg-no-repeat edge case
  'border-style': 'border',
  ' -style': 'outline',
  'mix-blend-mode': 'mix-blend', 'background-blend-mode': 'bg-blend',
  'border-collapse': 'border',
  'table-layout': 'table',
  'cursor': 'cursor',
  'pointer-events': 'pointer-events',
  'scroll-behaviour': 'scroll', 'scroll-snap-stop': 'snap',
  'touch-action': 'touch',
  'user-select': 'select',
  'will-change': 'will-change',
  'text-color': 'text', 'text-decoration-color': 'decoration',
  'border-color': 'border', 'outline-color': 'outline', 'accent-color': 'accent', 'caret-color': 'caret',
  'fill': 'fill',
  'stroke': 'stroke',
  'stroke-width': 'stroke',
  'inset-inline-start': 'start', 'inset-inline-end': 'end',
  'top': 'top', 'left': 'left', 'bottom': 'bottom', 'right': 'right',
  'appearance': 'appearance',
  'margin': 'm', 'padding': 'p', 'inset': 'inset-', 'border-width': 'border', 
  'scroll-margin': 'scroll-m', 'scroll-margin-top': 'scroll-mt', 'scroll-margin-left': 'scroll-ml', 'scroll-margin-bottom': 'scroll-mb', 'scroll-margin-right': 'scroll-mr', 'scroll-margin-inline-start': 'scroll-ms', 'scroll-margin-inline-end': 'scroll-me', 
  'scroll-padding': 'scroll-p', 'scroll-padding-top': 'scroll-pt', 'scroll-padding-left': 'scroll-pl', 'scroll-padding-bottom': 'scroll-pb', 'scroll-padding-right': 'scroll-pr', 'scroll-padding-inline-start': 'scroll-ps', 'scroll-padding-inline-end': 'scroll-pe', 
  'border-spacing': 'border-spacing',
  '--tw-scroll-snap-strictness': 'snap', 'scroll-snap-type': 'snap',
  'color': 'text',
  'transform-origin': 'origin',
  '--tw-ring-color': 'ring', '--tw-ring-inset': 'ring',
  'grid-column': 'col-span', 'grid-row': 'row-span', 'grid-column-start': 'col-start', 'grid-column-end': 'col-end', 'grid-row-start': 'row-start', 'grid-row-end': 'row-end',
  'border-left-color': 'border-l', 'border-right-color': 'border-r', 'border-top-color': 'border-t', 'border-bottom-color': 'border-b', 'border-inline-start-color': 'border-start', 'border-inline-end-color': 'border-end',
  'caption-side': 'caption',
  'forced-color-adjust': 'forced-color-adjust',
  'overflow-wrap': 'break', 'word-break': 'break', 
  'column-reverse': 'col-reverse', 'row-reverse': 'row-reverse'
}

export const propertylessDict = {
  'display': '',
  'position': '',
  'visibility': '',
  'font-variant-numeric': '',
  'text-decoration-line': '',
  'text-transform': '',
}

export const unitDict = {
  // Pixel lengths
  '0px': '0', '0rem': '0', '1px': 'px', '0.0625rem': 'px',
  '2px': '0.5', '0.125rem': '0.5', '4px': '1', '0.25rem': '1',
  '6px': '1.5', '0.375rem': '1.5', '8px': '2', '0.5rem': '2',
  '10px': '2.5', '0.625rem': '2.5', '12px': '3', '0.75rem': '3',
  '14px': '3.5', '0.875rem': '3.5', '16px': '4', '1rem': '4',
  '20px': '5', '1.25rem': '5',
  '24px': '6', '1.5rem': '6',
  '28px': '7', '1.75rem': '7',
  '32px': '8', '2rem': '8',
  '36px': '9', '2.25rem': '9',
  '40px': '10', '2.5rem': '10',
  '44px': '11', '2.75rem': '11',
  '48px': '12', '3rem': '12',
  '52px': '13', '3.25rem': '13',
  '56px': '14', '3.5rem': '14',
  '64px': '16', '4rem': '16',
  '80px': '20', '5rem': '20',
  '96px': '24', '6rem': '24',
  '112px': '28', '7rem': '28',
  '128px': '32', '8rem': '32',
  '144px': '36', '9rem': '36',
  '160px': '40', '10rem': '40',
  '176px': '44', '11rem': '44',
  '192px': '48', '12rem': '48',
  '208px': '52', '13rem': '52',
  '224px': '56', '14rem': '56',
  '240px': '60', '15rem': '60',
  '256px': '64', '16rem': '64',
  '288px': '72', '18rem': '72',
  '320px': '80', '20rem': '80',
  '384px': '96', '24rem': '96',
  'min': 'min-content', 'max': 'max-content',
  'flex-start': 'start', 'flex-end': 'end',
  'space-between': 'between', 'space-around': 'around', 'space-evenly': 'evenly',
  'fit-content': 'fit',
  'border-box': 'border',
  'padding-box': 'padding',
  'content-box': 'content',
  'currentColor': 'current',
  'scroll-position': 'scroll',
  'minmax(0, 1fr)': 'fr',
  '100%': 'full', '25%': '1/4', '33%': '1/3', '50%': '1/2', '75%': '3/4',
  '100vh': 'screen', '100vw': 'screen', '100dvw': 'dvw', '100dvh': 'dvh', '100lvw': 'lvw', '100lvh': 'lvh', '100svh': 'svh', '100svw': 'svw',
  '0s': '0', '75ms': '75', '100ms': '100', '150ms': '150', '200ms': '200', '300ms': '300', '500ms': '500', '700ms': '700', '1000ms': '1000',
  'column': 'col', 'row': 'row', 'dense': 'dense', 'column dense': 'col-dense', 'row dense': 'row-dense',
  'repeat(1, minmax(0, 1fr))': '1', 'repeat(2, minmax(0, 1fr))': '2', 'repeat(3, minmax(0, 1fr))': '3', 'repeat(4, minmax(0, 1fr))': '4', 'repeat(5, minmax(0, 1fr))': '5', 'repeat(6, minmax(0, 1fr))': '6', 'repeat(7, minmax(0, 1fr))': '7', 'repeat(8, minmax(0, 1fr))': '8', 'repeat(9, minmax(0, 1fr))': '9', 'repeat(10, minmax(0, 1fr))': '10', 'repeat(11, minmax(0, 1fr))': '11', 'repeat(12, minmax(0, 1fr))': '12',
  'x var(--tw-scroll-snap-strictness)': 'x', 'y var(--tw-scroll-snap-strictness)': 'y', 'both var(--tw-scroll-snap-strictness)': 'both',
  'bottom left': 'bottom-left', 'bottom right': 'bottom-right', 'top left': 'top-left', 'top right': 'top-right', 'left': 'left', 'right': 'right', 'top': 'top', 'bottom': 'bottom',
  'inherit': 'inherit', 'currentColor': 'current', 'transparent': 'transparent',
  'var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color': '0', 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color': '1', 'var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color': '2', 'var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color': '4', 'var(--tw-ring-inset) 0 0 0 calc(8px + var(--tw-ring-offset-width)) var(--tw-ring-color': '8',
  '-9999': 'first', '9999': 'last',
  'span 1 / span 1': '1', 'span 2 / span 2': '2', 'span 3 / span 3': '3', 'span 4 / span 4': '4', 'span 5 / span 5': '5', 'span 6 / span 6': '6', 'span 7 / span 7': '7', 'span 8 / span 8': '8', 'span 9 / span 9': '9', 'span 10 / span 10': '10', 'span 11 / span 11': '11', 'span 12 / span 12': '12', '1 / -1': 'full',
  '1 1 0%': '1', '1 1 auto': 'auto', '0 1 auto': 'initial',
  'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"': 'sans', 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif': 'serif', 'ui-monospace font-mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace': 'mono',
  'linear-gradient(to top, var(--tw-gradient-stops))': 'to-t', 'linear-gradient(to top right, var(--tw-gradient-stops))': 'to-tr', 'linear-gradient(to right, var(--tw-gradient-stops))': 'to-r', 'linear-gradient(to bottom right, var(--tw-gradient-stops))': 'to-br', 'linear-gradient(to bottom, var(--tw-gradient-stops))': 'to-b', 'linear-gradient(to bottom left, var(--tw-gradient-stops))': 'to-bl', 'linear-gradient(to left, var(--tw-gradient-stops))': 'to-l', 'linear-gradient(to top left, var(--tw-gradient-stops))': 'to-tl',
  '0 1px 2px 0 rgb(0 0 0 / 0.05)': 'sm', '0 1px 3px 0 rgb(0 0 0 / 0.1)': '', '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)': 'md', '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)': 'lg', '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)': 'xl', '0 25px 50px -12px rgb(0 0 0 / 0.25)': '2xl', 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)': 'inset', '0 0 #000000': 'none',
  'cubic-bezier(0.4, 0, 1, 1)': 'ease-in', 'cubic-bezier(0, 0, 0.2, 1)': 'ease-out', 'cubic-bezier(0.4, 0, 0.2, 1)': 'ease-in-out', 
  'break-word': 'break-words', 'break-all': 'all', 'keep-all': 'keep',
  '1 / 1': 'square', '16 / 9': 'video',
};
// TODO: Add more values to the non translate values
export const nonTranslateValues = [
  'auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column', 'clone', 'slice', 'block', 'inline-block', 'inline', 'flex', 'inline-flex', 'table', 'inline-table', 'table-caption', 'table-cell', 'table-column', 'table-column-group', 'table-footer-group', 'table-header-group', 'table-row-group', 'table-row', 'flow-root', 'grid', 'inline-grid', 'contents', 'list-item', 'start', 'end', 'right', 'left', 'none', 'start', 'end', 'both', 'contain', 'cover', 'fill', 'scale-down', 'bottom', 'center', 'left-bottom', 'left-top', 'right-bottom', 'right-top', 'top', 'auto', 'clip', 'visible', 'scroll', 'static', 'fixed', 'absolute', 'relative', 'sticky', 'row', 'wrap', 'wrap-reverse', 'nowrap', 'dense', 'normal', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly', 'stretch', 'baseline', 'ordinal', 'slashed-zero', 'lining-nums', 'oldstyle-nums', 'proportional-nums', 'tabular-nums', 'diagonal-fractions', 'stacked-fractions', 'inside', 'outside', 'disc', 'decimal', 'justify', 'underline', 'overline', 'line-through', 'solid', 'double', 'dotted', 'dashed', 'wavy', 'from-font', 'uppercase', 'lowercase', 'capitalize', 'ellipsis', 'wrap', 'nowrap', 'balance', 'pretty', 'text-top', 'text-bottom', 'sub', 'super', 'pre', 'pre-line', 'pre-wrap', 'break-spaces', 'manual', 'fixed', 'local', 'scroll', 'text'
]

export const colorsDict = { 'black': '#000000',
  'silver': '#c0c0c0',
  'gray': '#808080',
  'white': '#ffffff',
  'maroon': '#800000',
  'red': '#ff0000',
  'purple': '#800080',
  'fuchsia': '#ff00ff',
  'green': '#008000',
  'lime': '#00ff00',
  'olive': '#808000',
  'yellow': '#ffff00',
  'navy': '#000080',
  'blue': '#0000ff',
  'teal': '#008080',
  'aqua': '#00ffff',
  'orange': '#ffa500',
  'aliceblue': '#f0f8ff',
  'antiquewhite': '#faebd7',
  'aquamarine': '#7fffd4',
  'azure': '#f0ffff',
  'beige': '#f5f5dc',
  'bisque': '#ffe4c4',
  'blanchedalmond': '#ffebcd',
  'blueviolet': '#8a2be2',
  'brown': '#a52a2a',
  'burlywood': '#deb887',
  'cadetblue': '#5f9ea0',
  'chartreuse': '#7fff00',
  'chocolate': '#d2691e',
  'coral': '#ff7f50',
  'cornflowerblue': '#6495ed',
  'cornsilk': '#fff8dc',
  'crimson': '#dc143c',
  'cyan': '#00ffff',
  'darkblue': '#00008b',
  'darkcyan': '#008b8b',
  'darkgoldenrod': '#b8860b',
  'darkgray': '#a9a9a9',
  'darkgreen': '#006400',
  'darkgrey': '#a9a9a9',
  'darkkhaki': '#bdb76b',
  'darkmagenta': '#8b008b',
  'darkolivegreen': '#556b2f',
  'darkorange': '#ff8c00',
  'darkorchid': '#9932cc',
  'darkred': '#8b0000',
  'darksalmon': '#e9967a',
  'darkseagreen': '#8fbc8f',
  'darkslateblue': '#483d8b',
  'darkslategray': '#2f4f4f',
  'darkslategrey': '#2f4f4f',
  'darkturquoise': '#00ced1',
  'darkviolet': '#9400d3',
  'deeppink': '#ff1493',
  'deepskyblue': '#00bfff',
  'dimgray': '#696969',
  'dimgrey': '#696969',
  'dodgerblue': '#1e90ff',
  'firebrick': '#b22222',
  'floralwhite': '#fffaf0',
  'forestgreen': '#228b22',
  'gainsboro': '#dcdcdc',
  'ghostwhite': '#f8f8ff',
  'gold': '#ffd700',
  'goldenrod': '#daa520',
  'greenyellow': '#adff2f',
  'grey': '#808080',
  'honeydew': '#f0fff0',
  'hotpink': '#ff69b4',
  'indianred': '#cd5c5c',
  'indigo': '#4b0082',
  'ivory': '#fffff0',
  'khaki': '#f0e68c',
  'lavender': '#e6e6fa',
  'lavenderblush': '#fff0f5',
  'lawngreen': '#7cfc00',
  'lemonchiffon': '#fffacd',
  'lightblue': '#add8e6',
  'lightcoral': '#f08080',
  'lightcyan': '#e0ffff',
  'lightgoldenrodyellow': '#fafad2',
  'lightgray': '#d3d3d3',
  'lightgreen': '#90ee90',
  'lightgrey': '#d3d3d3',
  'lightpink': '#ffb6c1',
  'lightsalmon': '#ffa07a',
  'lightseagreen': '#20b2aa',
  'lightskyblue': '#87cefa',
  'lightslategray': '#778899',
  'lightslategrey': '#778899',
  'lightsteelblue': '#b0c4de',
  'lightyellow': '#ffffe0',
  'limegreen': '#32cd32',
  'linen': '#faf0e6',
  'magenta': '#ff00ff',
  'mediumaquamarine': '#66cdaa',
  'mediumblue': '#0000cd',
  'mediumorchid': '#ba55d3',
  'mediumpurple': '#9370db',
  'mediumseagreen': '#3cb371',
  'mediumslateblue': '#7b68ee',
  'mediumspringgreen': '#00fa9a',
  'mediumturquoise': '#48d1cc',
  'mediumvioletred': '#c71585',
  'midnightblue': '#191970',
  'mintcream': '#f5fffa',
  'mistyrose': '#ffe4e1',
  'moccasin': '#ffe4b5',
  'navajowhite': '#ffdead',
  'oldlace': '#fdf5e6',
  'olivedrab': '#6b8e23',
  'orangered': '#ff4500',
  'orchid': '#da70d6',
  'palegoldenrod': '#eee8aa',
  'palegreen': '#98fb98',
  'paleturquoise': '#afeeee',
  'palevioletred': '#db7093',
  'papayawhip': '#ffefd5',
  'peachpuff': '#ffdab9',
  'peru': '#cd853f',
  'pink': '#ffc0cb',
  'plum': '#dda0dd',
  'powderblue': '#b0e0e6',
  'rosybrown': '#bc8f8f',
  'royalblue': '#4169e1',
  'saddlebrown': '#8b4513',
  'salmon': '#fa8072',
  'sandybrown': '#f4a460',
  'seagreen': '#2e8b57',
  'seashell': '#fff5ee',
  'sienna': '#a0522d',
  'skyblue': '#87ceeb',
  "slateblue": "#6a5acd",
  "slategray": "#708090",
  "slategrey": "#708090",
  "snow": "#fffafa",
  "springgreen": "#00ff7f",
  "steelblue": "#4682b4",
  "tan": "#d2b48c",
  "thistle": "#d8bfd8",
  "tomato": "#ff6347",
  "turquoise": "#40e0d0",
  "violet": "#ee82ee",
  "wheat": "#f5deb3",
  "whitesmoke": "#f5f5f5",
  "yellowgreen": "#9acd32"
}
export const tailwindColors = {
  '#f8fafc': 'slate-50', '#f1f5f9': 'slate-100', '#e2e8f0': 'slate-200', '#cbd5e1': 'slate-300', '#94a3b8': 'slate-400', '#64748b': 'slate-500', '#475569': 'slate-600', '#334155': 'slate-700', '#1e293b': 'slate-800', '#0f172a': 'slate-900', '#020617': 'slate-950',
  '#f9fafb': 'gray-50', '#f3f4f6': 'gray-100', '#e5e7eb': 'gray-200', '#d1d5db': 'gray-300', '#9ca3af': 'gray-400', '#6b7280': 'gray-500', '#4b5563': 'gray-600', '#374151': 'gray-700', '#1f2937': 'gray-800', '#111827': 'gray-900', '#030712': 'gray-950',
  '#fafafa': 'zinc-50', '#f4f4f5': 'zinc-100', '#e4e4e7': 'zinc-200', '#d4d4d8': 'zinc-300', '#a1a1aa': 'zinc-400', '#71717a': 'zinc-500', '#52525b': 'zinc-600', '#3f3f46': 'zinc-700', '#27272a': 'zinc-800', '#18181b': 'zinc-900', '#09090b': 'zinc-950',
  '#f5f5f5': 'neutral-100', '#e5e5e5': 'neutral-200', '#d4d4d4': 'neutral-300', '#a3a3a3': 'neutral-400', '#737373': 'neutral-500', '#525252': 'neutral-600', '#404040': 'neutral-700', '#262626': 'neutral-800', '#171717': 'neutral-900', '#0a0a0a': 'neutral-950',
  '#fafaf9': 'stone-50', '#f5f5f4': 'stone-100', '#e7e5e4': 'stone-200', '#d6d3d1': 'stone-300', '#a8a29e': 'stone-400', '#78716c': 'stone-500', '#57534e': 'stone-600', '#44403c': 'stone-700', '#292524': 'stone-800', '#1c1917': 'stone-900', '#0c0a09': 'stone-950',
  '#fef2f2': 'red-50', '#fee2e2': 'red-100', '#fecaca': 'red-200', '#fca5a5': 'red-300', '#f87171': 'red-400', '#ef4444': 'red-500', '#dc2626': 'red-600', '#b91c1c': 'red-700', '#991b1b': 'red-800', '#7f1d1d': 'red-900', '#450a0a': 'red-950',
  '#fff7ed': 'orange-50', '#ffedd5': 'orange-100', '#fed7aa': 'orange-200', '#fdba74': 'orange-300', '#fb923c': 'orange-400', '#f97316': 'orange-500', '#ea580c': 'orange-600', '#c2410c': 'orange-700', '#9a3412': 'orange-800', '#7c2d12': 'orange-900', '#431407': 'orange-950',
  '#fffbeb': 'amber-50', '#fef3c7': 'amber-100', '#fde68a': 'amber-200', '#fcd34d': 'amber-300', '#fbbf24': 'amber-400', '#f59e0b': 'amber-500', '#d97706': 'amber-600', '#b45309': 'amber-700', '#92400e': 'amber-800', '#78350f': 'amber-900', '#451a03': 'amber-950',
  '#fefce8': 'yellow-50', '#fef9c3': 'yellow-100', '#fef08a': 'yellow-200', '#fde047': 'yellow-300', '#facc15': 'yellow-400', '#eab308': 'yellow-500', '#ca8a04': 'yellow-600', '#a16207': 'yellow-700', '#854d0e': 'yellow-800', '#713f12': 'yellow-900', '#422006': 'yellow-950',
  '#f7fee7': 'lime-50', '#ecfccb': 'lime-100', '#d9f99d': 'lime-200', '#bef264': 'lime-300', '#a3e635': 'lime-400', '#84cc16': 'lime-500', '#65a30d': 'lime-600', '#4d7c0f': 'lime-700', '#3f6212': 'lime-800', '#365314': 'lime-900', '#1a2e05': 'lime-950',
  '#f0fdf4': 'green-50', '#dcfce7': 'green-100', '#bbf7d0': 'green-200', '#86efac': 'green-300', '#4ade80': 'green-400', '#22c55e': 'green-500', '#16a34a': 'green-600', '#15803d': 'green-700', '#166534': 'green-800', '#14532d': 'green-900', '#052e16': 'green-950',
  '#ecfdf5': 'emerald-50', '#d1fae5': 'emerald-100', '#a7f3d0': 'emerald-200', '#6ee7b7': 'emerald-300', '#34d399': 'emerald-400', '#10b981': 'emerald-500', '#059669': 'emerald-600', '#047857': 'emerald-700', '#065f46': 'emerald-800', '#064e3b': 'emerald-900', '#022c22': 'emerald-950',
  '#f0fdfa': 'teal-50', '#ccfbf1': 'teal-100', '#99f6e4': 'teal-200', '#5eead4': 'teal-300', '#2dd4bf': 'teal-400', '#14b8a6': 'teal-500', '#0d9488': 'teal-600', '#0f766e': 'teal-700', '#115e59': 'teal-800', '#134e4a': 'teal-900', '#042f2e': 'teal-950',
  '#ecfeff': 'cyan-50', '#cffafe': 'cyan-100', '#a5f3fc': 'cyan-200', '#67e8f9': 'cyan-300', '#22d3ee': 'cyan-400', '#06b6d4': 'cyan-500', '#0891b2': 'cyan-600', '#0e7490': 'cyan-700', '#155e75': 'cyan-800', '#164e63': 'cyan-900', '#083344': 'cyan-950',
  '#f0f9ff': 'sky-50', '#e0f2fe': 'sky-100', '#bae6fd': 'sky-200', '#7dd3fc': 'sky-300', '#38bdf8': 'sky-400', '#0ea5e9': 'sky-500', '#0284c7': 'sky-600', '#0369a1': 'sky-700', '#075985': 'sky-800', '#0c4a6e': 'sky-900', '#082f49': 'sky-950',
  '#eff6ff': 'blue-50', '#dbeafe': 'blue-100', '#bfdbfe': 'blue-200', '#93c5fd': 'blue-300', '#60a5fa': 'blue-400', '#3b82f6': 'blue-500', '#2563eb': 'blue-600', '#1d4ed8': 'blue-700', '#1e40af': 'blue-800', '#1e3a8a': 'blue-900', '#172554': 'blue-950',
  '#eef2ff': 'indigo-50', '#e0e7ff': 'indigo-100', '#c7d2fe': 'indigo-200', '#a5b4fc': 'indigo-300', '#818cf8': 'indigo-400', '#6366f1': 'indigo-500', '#4f46e5': 'indigo-600', '#4338ca': 'indigo-700', '#3730a3': 'indigo-800', '#312e81': 'indigo-900', '#1e1b4b': 'indigo-950',
  '#f5f3ff': 'violet-50', '#ede9fe': 'violet-100', '#ddd6fe': 'violet-200', '#c4b5fd': 'violet-300', '#a78bfa': 'violet-400', '#8b5cf6': 'violet-500', '#7c3aed': 'violet-600', '#6d28d9': 'violet-700', '#5b21b6': 'violet-800', '#4c1d95': 'violet-900', '#2e1065': 'violet-950',
  '#faf5ff': 'purple-50', '#f3e8ff': 'purple-100', '#e9d5ff': 'purple-200', '#d8b4fe': 'purple-300', '#c084fc': 'purple-400', '#a855f7': 'purple-500', '#9333ea': 'purple-600', '#7e22ce': 'purple-700', '#6b21a8': 'purple-800', '#581c87': 'purple-900', '#3b0764': 'purple-950',
  '#fdf4ff': 'fuchsia-50', '#fae8ff': 'fuchsia-100', '#f5d0fe': 'fuchsia-200', '#f0abfc': 'fuchsia-300', '#e879f9': 'fuchsia-400', '#d946ef': 'fuchsia-500', '#c026d3': 'fuchsia-600', '#a21caf': 'fuchsia-700', '#86198f': 'fuchsia-800', '#701a75': 'fuchsia-900', '#4a044e': 'fuchsia-950',
  '#fdf2f8': 'pink-50', '#fce7f3': 'pink-100', '#fbcfe8': 'pink-200', '#f9a8d4': 'pink-300', '#f472b6': 'pink-400', '#ec4899': 'pink-500', '#db2777': 'pink-600', '#be185d': 'pink-700', '#9d174d': 'pink-800', '#831843': 'pink-900', '#500724': 'pink-950',
  '#fff1f2': 'rose-50', '#ffe4e6': 'rose-100', '#fecdd3': 'rose-200', '#fda4af': 'rose-300', '#fb7185': 'rose-400', '#f43f5e': 'rose-500', '#e11d48': 'rose-600', '#be123c': 'rose-700', '#9f1239': 'rose-800', '#881337': 'rose-900', '#4c0519': 'rose-950',
  '#ffffff': 'white', '#000000': 'black',
}

export const borderRadiusDict = {
  'border-top-right-radius': 'rounded-tr',
  'border-top-left-radius': 'rounded-tl',
  'border-bottom-right-radius': 'rounded-br',
  'border-bottom-left-radius': 'rounded-bl',
  'border-start-start-radius': 'rounded-ss',
  'border-start-end-radius': 'rounded-se',
  'border-end-start-radius': 'rounded-es',
  'border-end-end-radius': 'rounded-ee',
}

export const borderRadiusUnitDict = {
  '0px': 'none',
  '2px': 'sm',
  '4px': '/',
  '6px': 'md',
  '8px': 'lg',
  '12px': 'xl',
  '16px': '2xl',
  '24px': '3xl',
}

export const blurUnitDict = {
  '0px': 'none',
  '4px': 'sm',
  '8px': '/',
  '12px': 'md',
  '16px': 'lg',
  '12px': 'xl',
  '24px': '2xl',
  '64px': '3xl',
}

export const letterSpacingUnitDict = {
  '-0.05em': 'tighter',
  '-0.025em': 'tight',
  '0em': 'normal',
  '0.025em': 'wide',
  '0.05em': 'wider',
  '0.1em': 'widest',
}

export const fontWeightUnitDict = {
  '100': 'thin',
  '200': 'extralight',
  '300': 'light',
  '400': 'normal',
  '500': 'medium',
  '600': 'semibold',
  '700': 'bold',
  '800': 'extrabold',
  '800': 'black',
}

export const lineHeightUnitDict = {
  '12px': '3', '0.75rem': '3',
  '16px': '4', '1rem': '4',
  '20px': '5', '1.25rem': '5',
  '24px': '6', '1.5rem': '6',
  '28px': '7', '1.75rem': '7',
  '32px': '8', '2rem': '8',
  '36px': '9', '2.25rem': '9',
  '40px': '10', '2.5rem': '10',
  '1': 'none', '1.25': 'tight', '1.375': 'snug', '1.5': 'normal', '1.625': 'relaxed', '2': 'loose',
}