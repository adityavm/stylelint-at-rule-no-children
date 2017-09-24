const stylelint = require("stylelint");

const ruleName = "aditayvm/at-rule-no-children";

const messages = stylelint.utils.ruleMessages(ruleName, ({
  unexpected: (block, rule) => `Unexpected rule "${block}" inside at-rule "${rule}".`,
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

    const params = new RegExp(`(${((options || {}).ignore || []).join("|")})\\\(`);

    root.walkAtRules(function(statement) {
      (statement.nodes || []).forEach(node => {
        if ((options || {}).ignore) { // ignore list
          if (options.ignore.includes(node.parent.name)) return; // @foo
          if (params.test(node.parent.params)) return; // @include foo
        }
        if (node.type !== "rule") return; // allow non-rules
        if (node.selector.match(/^[^.#]?(\d+%|from|to)/)) return; // allow 90% / from / to

        stylelint.utils.report({
          ruleName,
          result,
          node,
          message: messages.unexpected(node.selector, statement.name),
        });
      });
    });
  };
});
