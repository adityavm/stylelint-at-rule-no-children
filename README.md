# stylelint-at-rule-no-children

Stylelint rule to disallow block declarations inside at rules.

[![Build Status](https://img.shields.io/travis/adityavm/stylelint-at-rule-no-children/master.svg?style=flat-square)](https://travis-ci.org/adityavm/stylelint-at-rule-no-children)

[Usage](#usage)  
[Configuration](#configuration)  
[Why?](#why)  
[TL;DR](#tldr)  

## Usage

Install the package:

`npm i stylelint-at-rule-no-children`

Add the plugin and rule to your `.stylelintrc`, like so:
```
{
  ...
  plugins: [
    ...
    "stylelint-at-rule-no-children",
  ],
  rules: {
    ...
    "adityavm/at-rule-no-children": [{ <options> }],
  }
}
```

## Configuration

The rule accepts an `ignore` list of strings to allow when checking rules or their parameters. Consider the following:
```css
@include foo() {
  body { color: #ff0000; }
}

@foo() {
  body { color: #ff0000; }
}
```

Normally, both the above blocks would be rejected. However, setting the following config will allow them both:

```javascript
{
  "adityavm/stylelint-at-rule-no-children": [{ ignore: ["foo"] }],
}
```

_Note:_ This is not recommended, as it goes against the ideology behind the plugin. But if you need to define exceptions, now you can.

## Why?

Conceptually, this is similar to why we don't declare functions inside conditional blocks in general programming.

CSS is inherently difficult to understand after a certain point. When we introduce branches in the CSS, it becomes more difficult. To top off the complexity, CSS allows defining whole blocks inside a conditional block, which _can_ result in multiple declarations of the same selectors in different parts of the file (especially if more than one developer touches a file).

By disallowing block declarations inside at rules, we force developers to have only one declaration for a selector per file. Any and all conditions are included in that selector. This ensures that a developer searching through a file for a selector can be sure that their first hit is the _only_ declaration they need to consider.

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
