const stylelint = require("stylelint");

const ruleName = "aditayvm/at-rule-no-children";

const messages = stylelint.utils.ruleMessages(ruleName, ({
  unexpected: (block, rule) => `Unexpected block "${block}" inside rule "${rule}".`,
}));

module.exports = stylelint.createPlugin(ruleName, function(options = "") {
  return function(root, result) {
    var validOptions = stylelint.utils.validateOptions({
      ruleName: ruleName,
      result: result,
      actual: options,
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules(/[^(?:keyframes)]/, function(statement) {
      let block = statement.toString().match(/{([^}]*)/);
      if (!block) return; // blockless rule

      let matches = block[1].match(/\s*([.#\S]+)\s?{/);
      if (matches) {
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: statement,
          message: messages.unexpected(matches[1], statement.name),
        });
      }
    });
  };
});
