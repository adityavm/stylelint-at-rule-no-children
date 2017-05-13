# stylelint-at-rule-no-children

Stylelint rule to disallow block declarations inside at rules.

## Why?

Conceptually, this is similar to why we don't declare functions inside conditional blocks in general programming.

CSS is inherently difficult to understand after a certain point. When we introduce branches in the CSS, it becomes more difficult. To top off the complexity, CSS allows defining whole blocks inside a conditional block, which _can_ result in multiple declarations of the same selectors in different parts of the file (especially if more than one developer touches a file).

By disallowing block declarations inside at rules, we force developers to have only one declaration for a selector per file. All conditions are included in that selector, so that if a developer is searching through a file for a selector to modify, they can be sure that their first hit is the _only_ declaration they need to worry about.

## TL;DR

```css

/* good css */

.foo {
  color: red;

  @media screen and (max-width: 480px) {
    color: blue;
  }
}

/* bad css */

.foo {
  color: red;
}

@media screen and (max-width: 480px) {
  .foo {
    color: blue;
  }
}

```
