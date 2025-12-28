export default function addMultilineRules(json, multilineRules) {
  Object.keys(multilineRules).forEach(key => {
    const rules = multilineRules[key]
    
    // Check if this multiline rule contains wildcards
    const hasWildcard = key.includes('$') || rules.some(rule => rule.includes('$'))
    
    if (hasWildcard) handleWildcardRule(json, key, rules)
    else {
      Object.keys(json).forEach(selector => {
        // console.log(selector, rules, json[selector])
        // console.log(isSubset(rules, json[selector]), isLooseSubset(rules, json[selector]))
        
        if (!isSubset(rules, json[selector]) && !isLooseSubset(rules, json[selector])) return

        json[selector] = looseIntersectComplement(rules, json[selector])
        json[selector].push(key)
      })
    }
  })
  return json
}

function handleWildcardRule(json, multilineKey, multilineRules) {
  const wildcardMatch = multilineKey.match(/\$(\w+)/)
  if (!wildcardMatch) return
  
  const wildcardName = wildcardMatch[1]
  
  const patterns = multilineRules.map(rule => {
    const match = rule.match(/(\w+)-?\$(\w+)/)
    if (match) {
      return {
        prefix: match[1], // e.g., 'w' or 'h'
        fullPattern: rule // e.g., 'w-$size'
      }
    }
    return null
  }).filter(Boolean)
  
  if (patterns.length === 0) return
  
  Object.keys(json).forEach(selector => {
    const selectorRules = json[selector]
    console.log(selectorRules)
    
    const matches = {}
    let extractedValue = null
    let allPatternsMatched = true
    
    for (const pattern of patterns) {
      const matchingRule = selectorRules.find(rule => {
        const regex = new RegExp(`^${pattern.prefix}-(.+)$`)
        rule = rule.split(':').at(-1)
        console.log(rule, regex.test(rule))
        return regex.test(rule)
      }).split(':').at(-1)

      console.log(matchingRule)

      if (!matchingRule) {
        allPatternsMatched = false
        break
      }
      
      // Extract the value (e.g., '4' from 'w-4', '[100px]' from 'w-[100px]')
      const valueMatch = matchingRule.match(new RegExp(`^${pattern.prefix}-(.+)$`))
      console.log(valueMatch)
      if (!valueMatch) {
        allPatternsMatched = false
        break
      }

      const value = valueMatch[1]
      matches[pattern.prefix] = matchingRule
      // Check if all patterns have the same value
      if (extractedValue !== null && extractedValue !== value) {
        allPatternsMatched = false
        break
      }
      extractedValue ??= value
    }
    
    console.log(allPatternsMatched, Object.keys(matches).length === patterns.length, extractedValue !== null)
    // If we found all matches with the same value, replace them
    if (allPatternsMatched && Object.keys(matches).length === patterns.length && extractedValue !== null) {
      // Remove the matched rules
      const matchedRuleValues = Object.values(matches)
      json[selector] = json[selector].filter(rule => !matchedRuleValues.includes(rule.split(':').at(-1)))
      
      // Add the multiline rule with the extracted value
      const replacementKey = multilineKey.replace(`$${wildcardName}`, extractedValue)
      json[selector].push(replacementKey)
    }
  })
}

function isSubset(array1, array2) {
  return array1.every(item => array2.includes(item))
}

function isLooseSubset(array1, array2) {
  return array1.every(item => array2.some(element => element.includes(item)))
}

// function that removes all rules from array2 that are in array1
function intersectComplement(array1, array2) {
  return array2.filter(item => !array1.includes(item))
}

// function that removes all rules from array2 that include any element from array1
function looseIntersectComplement(array1, array2) {
  return array2.filter(item => !array1.some(element => item.includes(element)))
}