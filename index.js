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
      (statement.nodes || []).forEach(node => {
        if (node.type === "rule") {
          if (node.selector.match(/^[^.#]/)) {
            if (node.selector.match(/^(\d+%|from|to)/)) return;
            stylelint.utils.report({
              ruleName: ruleName,
              result: result,
              node: statement,
              message: messages.unexpected(node.selector, statement.name),
            });
          } else {
            stylelint.utils.report({
              ruleName: ruleName,
              result: result,
              node: statement,
              message: messages.unexpected(node.selector, statement.name),
            });
          }
        }
      });
    });
  };
});
