function validateOptions({ ruleName, result, actual }) {
  const noErrors = true;

  if (actual === null || actual === undefined) {
    return noErrors;
  }

  if (typeof actual !== 'object') {
    result.warn(`${ruleName}: Invalid options — expected object or undefined`, { node: undefined });
    return false;
  }

  for (const optionName of Object.keys(actual)) {
    if (optionName !== 'ignore') {
      result.warn(`${ruleName}: Invalid option name "${optionName}"`, { node: undefined });
      return false;
    }
  }

  if (actual.ignore !== undefined && !Array.isArray(actual.ignore)) {
    result.warn(`${ruleName}: "ignore" option must be an array`, { node: undefined });
    return false;
  }

  return noErrors;
}

module.exports = validateOptions;
