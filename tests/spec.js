const
  test = require("stylelint-test-rule-tape"),
  rule = require(".."),
  ruleName = rule.ruleName;

test(rule.rule, {
  ruleName,
  config: null,
  accept: [
    { code: "@include foo() { color: $white; }" },
    {
      code: `
      @include bar() {
        font-size: 11px;
        margin-top: 12px;
      }
    `},
    {
      code: `
      @include baz() {
        @include another(1234);

        font-size: 11px;
        margin-top: 12px;
      }
    `},
    { code: `@media screen and (max-width: 480px) { color: #fff; }` },
    {
      code: `
      @-webkit-keyframes pacman-balls {
        75% {
          opacity: 0.7;
        }

        100% {
          @include transform(translate(-100px, -6.25px));
        }
      }
    `},
    {
      code: `
      @include baz() {
        font-size: 11px;
        margin-top: 12px;

        @include another(1234) {
          margin-bottom: 2px;
        }
      }
    `},

    // accepted versions of rejected code
    {
      code: ".class { @include foo() { color: $white; } }",
    },
    {
      code: `
        custom {
          @include bar() {
            margin-top: 1px;
          }
        }
    `},
    {
      code: `custom { @media screen and (max-width: 480px) { color: #fff } }`,
    },
    {
      code: `.class {
        @media screen and (max-width: 480px) {
          color: #fff;
        }
      }
    `},
    {
      code: `#id {
        @media screen and (max-width: 480px) {
          color: #fff;
        }
      }
    `},
  ],

  // rejections
  reject: [
    {
      code: `
      @include baz() {
        font-size: 11px;
        margin-top: 12px;

        @include another(1234) {
          margin-bottom: 2px;

          body {
            color: red;
          }
        }
      }`,
      message: `Unexpected rule "body" inside at-rule "include". (${ruleName})`,
    },
    {
      code: "@include foo() { .class { color: $white; } }",
      message: `Unexpected rule ".class" inside at-rule "include". (${ruleName})`,
    },
    {
      code: `
        @include bar() {
          custom {
            margin-top: 1px;
          }
        }
      `,
      message: `Unexpected rule "custom" inside at-rule "include". (${ruleName})`,
    },
    {
      code: `@media screen and (max-width: 480px) { custom { color: #fff } }`,
      message: `Unexpected rule "custom" inside at-rule "media". (${ruleName})`,
    },
    {
      code: `@media screen and (max-width: 480px) {
        .class { color: #fff }
      }`,
      message: `Unexpected rule ".class" inside at-rule "media". (${ruleName})`,
    },
    {
      code: `@media screen and (max-width: 480px) {
        #id { color: #fff }
      }`,
      message: `Unexpected rule "#id" inside at-rule "media". (${ruleName})`,
    },
  ],
});

// test for all at rules
// list from https://developer.mozilla.org/en/docs/Web/CSS/At-rule
test(rule.rule, {
  ruleName,
  config: null,
  accept: [
    { code: `@charset "iso-8859-15";` },
    { code: `
      @keyframes identifier {
        0% { top: 0; left: 0; }
        30% { top: 50px; }
        68%, 72% { left: 50px; }
        100% { top: 100px; left: 100%; }
      }
    `},
    {
      code: `
      @import url("fineprint.css") print;
      @import url("bluish.css") projection, tv;
      @import 'custom.css';
      @import url("chrome://communicator/skin/");
      @import "common.css" screen, projection;
      @import url('landscape.css') screen and (orientation:landscape);
    `},
    {
      code: `
      @namespace prefix url(XML-namespace-URL);
      @namespace prefix "XML-namespace-URL";
    `},
    {
      code: `
      body {
        @supports (--foo: green) {
          color: green;
        }
      }
    `},
    {
      code: `
      body {
        @document url(http://www.w3.org/),
                       url-prefix(http://www.w3.org/Style/),
                       domain(mozilla.org),
                       regexp("https:.*")
        {
          color: purple;
          background: yellow;
        }
      }
    `},
    {
      code: `
      @font-face {
        font-family: MyHelvetica;
        src: local("Helvetica Neue Bold"),
        local("HelveticaNeue-Bold"),
        url(MgOpenModernaBold.ttf);
        font-weight: bold;
      }
    `},
    {
      code: `
      @viewport {
        zoom: 0.75;
        min-zoom: 0.5;
        max-zoom: 0.9;
      }
    `},
    {
      code: `
      @counter-style circled-alpha {
        system: fixed;
        symbols: Ⓐ Ⓑ Ⓒ Ⓓ Ⓔ Ⓕ Ⓖ Ⓗ Ⓘ Ⓙ Ⓚ Ⓛ Ⓜ Ⓝ Ⓞ Ⓟ Ⓠ Ⓡ Ⓢ Ⓣ Ⓤ Ⓥ Ⓦ Ⓧ Ⓨ Ⓩ;
        suffix: " ";
      }
    `},
  ],

  reject: [
    {
      code: `
      @supports (--foo: green) {
        body {
          color: green;
        }
      }
    `},
    {
      code: `
      @document url(http://www.w3.org/),
                     url-prefix(http://www.w3.org/Style/),
                     domain(mozilla.org),
                     regexp("https:.*")
      {
        body {
          color: purple;
          background: yellow;
        }
      }
    `},
  ],
});

test(rule.rule, {
  ruleName,
  config: [{ ignore: ["foo", "baz"] }],
  accept: [
    {
      code: `
      @foo () {
        body {
          display: block;
        }
      }
    `},
    {
      code: `
      @include foo() {
        body {
          display: block;
        }
      }
    `},
  ],
  reject: [
    {
      code: `
      @include bar() {
        body {
          display: block;
        }
      }
    `},
    {
      code: `
      $boolean: true;
      @if ($boolean) {
        body { display: block }
      } else {
        body { display: flex }
      }
    `},
  ],
});

test(rule.rule, {
  ruleName,
  config: [{ ignore: ["if"] }],
  accept: [
    {
      code: `
      $boolean: true;
      @if ($boolean) {
        body { display: block }
      } else {
        body { display: flex }
      }
    `},
  ],
});
