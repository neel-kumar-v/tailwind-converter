export default function addMultilineRules(json, multilineRules) {
  Object.keys(multilineRules).forEach(key => {
    const rules = multilineRules[key]
    if (typeof rules[0] === 'object') {
      rules.forEach(rule => handleRule(json, key, rule))
      return
    }
    handleRule(json, key, rules)
  })
  return json
}
function handleRule(json, key, rules) {
    // Check if this multiline rule contains wildcards
    const hasWildcard = key.includes('$') || rules.some(rule => rule.includes('$'))
    // console.log(rules, hasWildcard)
    if (hasWildcard) handleWildcardRule(json, key, rules)
    else handleNormalRule(json, key, rules)
}

// Normalize a rule for comparison (remove ![] wrapper, handle colons)
function normalizeRule(rule) {
  // Remove ! prefix and [] wrapper if present (handles both ![...] and [...])
  let normalized = rule.replace(/^!?\[(.+)\]$/, '$1')
  // Convert colon to hyphen for property:value format
  normalized = normalized.replace(/:/g, '-')
  return normalized
}

function handleNormalRule(json, multilineKey, multilineRules) {
  Object.keys(json).forEach(selector => {
    const selectorRules = json[selector]
    
    // Extract prefixes and rule parts from selector rules
    const selectorRulesWithPrefixes = selectorRules.map(rule => {
      const lastColonIndex = findLastColonOutsideBrackets(rule)
      const prefix = lastColonIndex !== -1 ? rule.substring(0, lastColonIndex) : ''
      const rulePart = lastColonIndex !== -1 ? rule.substring(lastColonIndex + 1) : rule
      return { fullRule: rule, prefix, rulePart }
    })
    
    // Group rules by prefix to check each prefix group separately
    const rulesByPrefix = {}
    selectorRulesWithPrefixes.forEach(({ fullRule, prefix, rulePart }) => {
      rulesByPrefix[prefix] ??= []
      rulesByPrefix[prefix].push({ fullRule, rulePart })
    })
    
    const rulesToRemove = []
    const rulesToAdd = []
    
    // Normalize multiline rules for comparison
    const normalizedMultilineRules = multilineRules.map(rule => normalizeRule(rule))
    
    Object.keys(rulesByPrefix).forEach(prefix => {
      const prefixGroup = rulesByPrefix[prefix]
      const ruleParts = prefixGroup.map(item => item.rulePart)
      // Normalize rule parts for comparison
      const normalizedRuleParts = ruleParts.map(rule => normalizeRule(rule))
      
      // Check if this prefix group matches the multiline rule (without prefixes)
      if (!isSubset(normalizedMultilineRules, normalizedRuleParts) && !isLooseSubset(normalizedMultilineRules, normalizedRuleParts)) return

      prefixGroup.forEach(item => rulesToRemove.push(item.fullRule))
      const prefixedKey = prefix ? `${prefix}:${multilineKey}` : multilineKey
      rulesToAdd.push(prefixedKey)
    })
    
    if (rulesToRemove.length <= 0) return

    // Remove only the matched rules
    let updatedRules = selectorRules.filter(rule => !rulesToRemove.includes(rule))
    
    // Remove rules that match the multiline rule definition (loose match) but ONLY from the same prefixes that matched
    // We need to check each remaining rule against the prefixes that matched
    const matchedPrefixes = new Set()
    Object.keys(rulesByPrefix).forEach(prefix => {
      const prefixGroup = rulesByPrefix[prefix]
      const ruleParts = prefixGroup.map(item => item.rulePart)
      const normalizedRuleParts = ruleParts.map(rule => normalizeRule(rule))
      if (isSubset(normalizedMultilineRules, normalizedRuleParts) || isLooseSubset(normalizedMultilineRules, normalizedRuleParts)) {
        matchedPrefixes.add(prefix)
      }
    })
    
    // Only remove loose matches from rules that have the same prefix as matched groups
    updatedRules = updatedRules.filter(rule => {
      const lastColonIndex = findLastColonOutsideBrackets(rule)
      const rulePrefix = lastColonIndex !== -1 ? rule.substring(0, lastColonIndex) : ''
      const rulePart = lastColonIndex !== -1 ? rule.substring(lastColonIndex + 1) : rule
      
      // Only check loose match if this rule is from a matched prefix
      if (matchedPrefixes.has(rulePrefix)) {
        const normalizedRulePart = normalizeRule(rulePart)
        return !normalizedMultilineRules.some(multilineRule => normalizedRulePart.includes(multilineRule))
      }
      // Keep rules from other prefixes
      return true
    })
    
    // Add the multiline rule(s) with prefix(es)
    updatedRules.push(...rulesToAdd)
    
    json[selector] = updatedRules
  })
}

function findLastColonOutsideBrackets(str) {
  let bracketDepth = 0
  for (let i = str.length - 1; i >= 0; i--) {
    const char = str[i]
    if (char === ']') {
      bracketDepth++
    } else if (char === '[') {
      bracketDepth--
      if (bracketDepth < 0) bracketDepth = 0 // Safety check
    } else if (char === ':' && bracketDepth === 0) {
      return i
    }
  }
  return -1
}

function handleWildcardRule(json, multilineKey, multilineRules) {
  // Extract all wildcard names from the multiline key (e.g., 'text-$size/$line' -> ['size', 'line'])
  const wildcardMatches = [...multilineKey.matchAll(/\$(\w+)/g)]
  if (wildcardMatches.length === 0) return
  
  const wildcardNames = wildcardMatches.map(match => match[1])
  // console.debug('MultilineKey:', multilineKey)
  // console.debug('WildcardNames:', wildcardNames)
  // console.debug('MultilineRules:', multilineRules)
  
  // Separate wildcard patterns from static rules
  const wildcardPatterns = []
  const staticRules = []
  
  multilineRules.forEach(rule => {
    // Check if this rule has a wildcard
    if (rule.includes('$')) {
      // Handle rules with ![] wrapper like '![-webkit-line-clamp:$lines]'
      const bracketMatch = rule.match(/^!?\[(.+)\]$/)
      if (bracketMatch) {
        const innerRule = bracketMatch[1]
        // Match pattern like '-webkit-line-clamp:$lines' - capture prefix and separator separately
        // The separator can be either : or - before the $
        // Use a more explicit pattern: match everything up to but not including the separator before $
        const wildcardMatch = innerRule.match(/^(.+?)([:-])\$(\w+)$/)
        if (wildcardMatch) {
          // console.debug(`  Extracting pattern from "${innerRule}":`, wildcardMatch)
          const prefix = wildcardMatch[1]
          const separator = wildcardMatch[2]
          // console.debug(`    Prefix: "${prefix}", Separator: "${separator}"`)
          wildcardPatterns.push({
            prefix: prefix, // e.g., '-webkit-line-clamp' (without separator)
            fullPattern: rule, // e.g., '![-webkit-line-clamp:$lines]'
            hasBrackets: true,
            separator: separator, // ':' or '-'
            wildcardName: wildcardMatch[3] // e.g., 'lines'
          })
          return
        }
      }
      // Handle regular rules like 'w-$size' or 'text-$size' or 'rounded-tr-$radius'
      // Match everything up to (but not including) the $ wildcard
      const match = rule.match(/^(.+?)-?\$(\w+)$/)
      if (match) {
        wildcardPatterns.push({
          prefix: match[1], // e.g., 'w', 'text', or 'rounded-tr'
          fullPattern: rule, // e.g., 'w-$size', 'text-$size', or 'rounded-tr-$radius'
          hasBrackets: false,
          wildcardName: match[2] // e.g., 'size', 'line', or 'radius'
        })
        return
      }
    }
    // Static rule (no wildcard)
    staticRules.push(rule)
  })
  
  // console.debug('WildcardPatterns:', wildcardPatterns)
  // console.debug('StaticRules:', staticRules)
  
  if (wildcardPatterns.length === 0) return
  
  Object.keys(json).forEach(selector => {
    const selectorRules = json[selector]
    
    // Group rules by prefix to check each prefix group separately
    const selectorRulesWithPrefixes = selectorRules.map(rule => {
      const lastColonIndex = findLastColonOutsideBrackets(rule)
      const prefix = lastColonIndex !== -1 ? rule.substring(0, lastColonIndex) : ''
      const rulePart = lastColonIndex !== -1 ? rule.substring(lastColonIndex + 1) : rule
      return { fullRule: rule, prefix, rulePart }
    })
    
    const rulesByPrefix = {}
    selectorRulesWithPrefixes.forEach(({ fullRule, prefix, rulePart }) => {
      rulesByPrefix[prefix] ??= []
      rulesByPrefix[prefix].push({ fullRule, rulePart })
    })
    
    // Process each prefix group independently
    Object.keys(rulesByPrefix).forEach(prefix => {
      // console.debug(`\n--- Processing prefix: "${prefix}" ---`)
      const prefixGroup = rulesByPrefix[prefix]
      const ruleParts = prefixGroup.map(item => item.rulePart)
      // console.debug('RuleParts:', ruleParts)
      const normalizedRuleParts = ruleParts.map(rule => normalizeRule(rule))
      // console.debug('NormalizedRuleParts:', normalizedRuleParts)
      
      const normalizedStaticRules = staticRules.map(rule => normalizeRule(rule))
      // console.debug('NormalizedStaticRules:', normalizedStaticRules)
      if (normalizedStaticRules.length > 0) {
        const isSubsetMatch = isSubset(normalizedStaticRules, normalizedRuleParts)
        const isLooseSubsetMatch = isLooseSubset(normalizedStaticRules, normalizedRuleParts)
        // console.debug('Static rules - isSubset:', isSubsetMatch, 'isLooseSubset:', isLooseSubsetMatch)
        if (!isSubsetMatch && !isLooseSubsetMatch) {
          // console.debug('Static rules don\'t match, skipping prefix group')
          return
        }
        // console.debug('Static rules match!')
      }
      
      const matches = {}
      const extractedValues = {}
      let allPatternsMatched = true
      
      // console.debug('Matching wildcard patterns...')
      for (const pattern of wildcardPatterns) {
        // console.debug(`\n  Pattern:`, pattern)
        // Find a rule that matches the pattern
        const matchedItem = prefixGroup.find(({ fullRule: rule, rulePart }) => {
          if (pattern.hasBrackets) {
            // Handle rules with ![] wrapper like '![-webkit-line-clamp:3]'
            const bracketMatch = rulePart.match(/^!?\[(.+)\]$/)
            if (bracketMatch) {
              const innerRule = bracketMatch[1]
              // Match pattern like '-webkit-line-clamp:3' or '-webkit-line-clamp:var(--line-clamp)'
              // Escape special regex characters in the prefix
              const escapedPrefix = pattern.prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
              // Use the separator (colon or hyphen) that was in the original pattern
              const separator = pattern.separator || ':'
              const regex = new RegExp(`^${escapedPrefix}${separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(.+)$`)
              const matches = regex.test(innerRule)
              // console.debug(`    Checking rulePart "${rulePart}" -> innerRule "${innerRule}" against regex "${regex}" -> ${matches}`)
              return matches
            }
            return false
          } else {
            // Handle regular rules like 'w-4'
            const escapedPrefix = pattern.prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            const regex = new RegExp(`^${escapedPrefix}-(.+)$`)
            const matches = regex.test(rulePart)
            // console.debug(`    Checking rulePart "${rulePart}" against regex "${regex}" -> ${matches}`)
            return matches
          }
        })
        
        // console.debug(`  MatchedItem:`, matchedItem)
        if (!matchedItem) {
          // console.debug(`  No match found for pattern ${pattern.fullPattern}`)
          allPatternsMatched = false
          break
        }
        
        const { fullRule: matchedFullRule, rulePart: matchedRulePart } = matchedItem
        
        // Extract the value
        let valueMatch = null
        if (pattern.hasBrackets) {
          // Handle rules with ![] wrapper
          const bracketMatch = matchedRulePart.match(/^!?\[(.+)\]$/)
          if (bracketMatch) {
            const innerRule = bracketMatch[1]
            const escapedPrefix = pattern.prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            // Use the separator (colon or hyphen) that was in the original pattern
            const separator = pattern.separator || ':'
            const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            valueMatch = innerRule.match(new RegExp(`^${escapedPrefix}${escapedSeparator}(.+)$`))
            // console.debug(`    Extracting value from "${matchedRulePart}" -> innerRule "${innerRule}" -> valueMatch:`, valueMatch)
          }
        } else {
          const escapedPrefix = pattern.prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          valueMatch = matchedRulePart.match(new RegExp(`^${escapedPrefix}-(.+)$`))
          // console.debug(`    Extracting value from "${matchedRulePart}" -> valueMatch:`, valueMatch)
        }
        
        if (!valueMatch) {
          // console.debug(`  Failed to extract value from matched rule`)
          allPatternsMatched = false
          break
        }

        const value = valueMatch[1]
        const patternWildcardName = pattern.wildcardName
        // console.debug(`  Extracted value: "${value}" for wildcard "${patternWildcardName}"`)
        
        matches[pattern.prefix] = matchedFullRule
        
        // Check consistency within the same wildcard name
        if (extractedValues[patternWildcardName] !== undefined && extractedValues[patternWildcardName] !== value) {
          // console.debug(`  Value mismatch for wildcard "${patternWildcardName}": expected "${extractedValues[patternWildcardName]}", got "${value}"`)
          allPatternsMatched = false
          break
        }
        extractedValues[patternWildcardName] = value
      }
      
      // console.debug(`\n  AllPatternsMatched: ${allPatternsMatched}, ExtractedValues:`, extractedValues, `Matches count: ${Object.keys(matches).length}, Patterns count: ${wildcardPatterns.length}`)
    
      // Check if we have values for all required wildcards
      const allWildcardsHaveValues = wildcardNames.every(name => extractedValues[name] !== undefined)
      if (allPatternsMatched && Object.keys(matches).length === wildcardPatterns.length && allWildcardsHaveValues) {
        // console.debug('  ✓ All conditions met, replacing rules...')
        // Collect all rules to remove: wildcard matches + static rules from this prefix group
        const rulesToRemove = Object.values(matches)
        
        // Also add static rules from this prefix group
        if (staticRules.length > 0) {
          const normalizedStaticRules = staticRules.map(rule => normalizeRule(rule))
          prefixGroup.forEach(({ fullRule, rulePart }) => {
            const normalizedRulePart = normalizeRule(rulePart)
            if (normalizedStaticRules.some(staticRule => normalizedRulePart.includes(staticRule))) {
              if (!rulesToRemove.includes(fullRule)) {
                rulesToRemove.push(fullRule)
              }
            }
          })
        }
        
        // Remove the matched rules
        let updatedRules = json[selector].filter(rule => !rulesToRemove.includes(rule))
        
        // Format values for all wildcards and build replacement key
        let replacementKey = multilineKey
        for (const wildcardName of wildcardNames) {
          const value = extractedValues[wildcardName]
          let formattedValue = value
          // If it's a CSS variable like var(--name), simplify to just (name)
          if (value.startsWith('var(--') && value.endsWith(')')) {
            const varName = value.slice(4, -1) // Remove 'var( ' and ')'
            formattedValue = `(${varName})`
          } else if (value.startsWith('(') && value.endsWith(')')) {
            // Already in parentheses, don't wrap in brackets
            formattedValue = value
          } else if (value.includes('(') || value.includes(')') || value.includes('/') || 
              value.includes('calc(') || value.includes(' ')) {
            formattedValue = `[${value}]`
          }
          // Replace all occurrences of this wildcard in the key
          replacementKey = replacementKey.replace(new RegExp(`\\$${wildcardName}`, 'g'), formattedValue)
        }
        // console.debug(`  ReplacementKey: "${replacementKey}"`)
        
        const prefixedKey = prefix ? `${prefix}:${replacementKey}` : replacementKey
        // console.debug(`  PrefixedKey: "${prefixedKey}"`)
        updatedRules.push(prefixedKey)
        
        json[selector] = updatedRules
        // console.debug(`  ✓ Updated rules for selector "${selector}":`, updatedRules)
        // } else {
        // console.debug('  ✗ Conditions not met, skipping replacement')
      }
    })
  })
  // console.debug('=== END WILDCARD RULE HANDLER ===\n')
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