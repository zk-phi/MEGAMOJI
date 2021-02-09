module.exports = {
    env: {
        browser: true,
    },
    globals: {
        Vue: true,
        GIFEncoder: true,
        encode64: true,
        ga: true,
    },
    extends: [
        "airbnb-base",
        "plugin:compat/recommended",
    ],
    rules: {

        // basic style modifications
        indent: ["error", 4],
        quotes: ["error", "double"],

        // redundant "else" can help readablity
        "no-else-return": "off",

        // ternary ops aren't that unreadable IMO
        "no-nested-ternary": "off",

        // bitwise ops are sometimes useful
        "no-bitwise": "off",

        // "continue" can help readablity as like "early-return"
        "no-continue": "off",

        // fns and classes can be referred before defined
        "no-use-before-define": ["error", {
            // functions: true,
            // classes: true,
            functions: false,
            classes: false,
            variables: true,
        }],

        // do not enforce destructuring for arrays (since they can be rather unreadable sometime)
        "prefer-destructuring": ["error", {
            VariableDeclarator: {
                array: false,
                object: true,
            },
            AssignmentExpression: {
                // array: true,
                array: false,
                object: false,
            },
        }, {
            enforceForRenamedProperties: false,
        }],

        // arithmetic ops (eccept for "%" and "**") can be mixed without parens
        "no-mixed-operators": ["error", {
            groups: [
                ["%", "**"],
                // ['%', '+'],
                // ['%', '-'],
                ["%", "*"],
                ["%", "/"],
                // ['/', '*'],
                ["&", "|", "<<", ">>", ">>>"],
                ["==", "!=", "===", "!=="],
                ["&&", "||"],
            ],
            allowSamePrecedence: false,
        }],

        // labels are allowed to break nested loops
        "no-restricted-syntax": [
            "error",
            "ForInStatement",
            "ForOfStatement",
            // 'LabeledStatement',
            "WithStatement",
        ],
        "no-labels": ["error", {
            // allowLoop: false,
            allowLoop: true,
            allowSwitch: false,
        }],

    },
};
