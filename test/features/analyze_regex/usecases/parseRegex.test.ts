import {describe, expect, test} from "vitest";
import parseRegex from "@/analyze_regex/domain/usecases/parseRegex";
import {
    RegexTreeAlteration,
    RegexTreeConcatenation,
    RegexTreeQuantifier,
    RegexTreeTerminal
} from "@/analyze_regex/domain/models/regexTree";

describe('single regex items', () => {
    test('terminal only', () => {
        const tree = parseRegex("a");
        expect(tree).instanceof(RegexTreeTerminal);
        expect((tree as RegexTreeTerminal).index).toBe(0);
    })

    test('quantifier ? only', () => {
        const tree = parseRegex("a?");
        expect(tree).toBeInstanceOf(RegexTreeQuantifier);
        expect((tree as RegexTreeQuantifier).symbol).toBe("?");
        expect((tree as RegexTreeQuantifier).child).toBeInstanceOf(RegexTreeTerminal)
        expect(((tree as RegexTreeQuantifier).child as RegexTreeTerminal).symbol).toBe("a")
    })

    test('quantifier * only', () => {
        const tree = parseRegex("a*");
        expect(tree).toBeInstanceOf(RegexTreeQuantifier);
        expect((tree as RegexTreeQuantifier).symbol).toBe("*");
        expect((tree as RegexTreeQuantifier).child).toBeInstanceOf(RegexTreeTerminal)
        expect(((tree as RegexTreeQuantifier).child as RegexTreeTerminal).symbol).toBe("a")
    })

    test('quantifier + only', () => {
        const tree = parseRegex("a+");
        expect(tree).toBeInstanceOf(RegexTreeQuantifier);
        expect((tree as RegexTreeQuantifier).symbol).toBe("+");
        expect((tree as RegexTreeQuantifier).child).toBeInstanceOf(RegexTreeTerminal)
        expect(((tree as RegexTreeQuantifier).child as RegexTreeTerminal).symbol).toBe("a")
    })

    test('alteration only', () => {
        const tree = parseRegex("a|b");
        expect(tree).toBeInstanceOf(RegexTreeAlteration);
        expect((tree as RegexTreeAlteration).children.length).toBe(2);
        expect((tree as RegexTreeAlteration).children[0]).toBeInstanceOf(RegexTreeTerminal);
        expect((tree as RegexTreeAlteration).children[1]).toBeInstanceOf(RegexTreeTerminal);
        expect(((tree as RegexTreeAlteration).children[0] as RegexTreeTerminal).symbol).toBe("a");
        expect(((tree as RegexTreeAlteration).children[0] as RegexTreeTerminal).index).toBe(0);
        expect(((tree as RegexTreeAlteration).children[1] as RegexTreeTerminal).symbol).toBe("b");
        expect(((tree as RegexTreeAlteration).children[1] as RegexTreeTerminal).index).toBe(1);
    })

    test('concatenation only', () => {
        const tree = parseRegex("ab");
        expect(tree).toBeInstanceOf(RegexTreeConcatenation);
        expect((tree as RegexTreeConcatenation).children.length).toBe(2);
        expect((tree as RegexTreeConcatenation).children[0]).toBeInstanceOf(RegexTreeTerminal);
        expect((tree as RegexTreeConcatenation).children[1]).toBeInstanceOf(RegexTreeTerminal);
        expect(((tree as RegexTreeConcatenation).children[0] as RegexTreeTerminal).symbol).toBe("a");
        expect(((tree as RegexTreeConcatenation).children[0] as RegexTreeTerminal).index).toBe(0);
        expect(((tree as RegexTreeConcatenation).children[1] as RegexTreeTerminal).symbol).toBe("b");
        expect(((tree as RegexTreeConcatenation).children[1] as RegexTreeTerminal).index).toBe(1);
    })
})

describe('group', () => {
    test('concatenation with quantifier', () => {
        const tree = parseRegex("(ab)?");
        expect(tree).toBeInstanceOf(RegexTreeQuantifier);
        const quantifier = tree as RegexTreeQuantifier;
        expect(quantifier.symbol).toBe("?");
        expect(quantifier.child).toBeInstanceOf(RegexTreeConcatenation);
        const concatenation = quantifier.child as RegexTreeConcatenation;
        expect(concatenation.children.length).toBe(2);
        expect(concatenation.children[0]).toBeInstanceOf(RegexTreeTerminal);
        expect(concatenation.children[1]).toBeInstanceOf(RegexTreeTerminal);
        expect((concatenation.children[0] as RegexTreeTerminal).symbol).toBe("a");
        expect((concatenation.children[0] as RegexTreeTerminal).index).toBe(0);
        expect((concatenation.children[1] as RegexTreeTerminal).symbol).toBe("b");
        expect((concatenation.children[1] as RegexTreeTerminal).index).toBe(1);
    })

    test('alteration with quantifier', () => {
        const tree = parseRegex("(a|b)?");
        expect(tree).toBeInstanceOf(RegexTreeQuantifier);
        const quantifier = tree as RegexTreeQuantifier;
        expect(quantifier.symbol).toBe("?");
        expect(quantifier.child).toBeInstanceOf(RegexTreeAlteration);
        const alteration = quantifier.child as RegexTreeAlteration;
        expect(alteration.children.length).toBe(2);
        expect(alteration.children[0]).toBeInstanceOf(RegexTreeTerminal);
        expect(alteration.children[1]).toBeInstanceOf(RegexTreeTerminal);
        expect((alteration.children[0] as RegexTreeTerminal).symbol).toBe("a");
        expect((alteration.children[0] as RegexTreeTerminal).index).toBe(0);
        expect((alteration.children[1] as RegexTreeTerminal).symbol).toBe("b");
        expect((alteration.children[1] as RegexTreeTerminal).index).toBe(1);
    })

    test('alteration with quantified subgroup', () => {
        const tree = parseRegex("a|(a|b)?");
        expect(tree).toBeInstanceOf(RegexTreeAlteration);
        const alteration = tree as RegexTreeAlteration;
        expect(alteration.children.length).toBe(2);
        expect(alteration.children[0]).toBeInstanceOf(RegexTreeTerminal);
        expect((alteration.children[0] as RegexTreeTerminal).symbol).toBe("a");
        expect((alteration.children[0] as RegexTreeTerminal).index).toBe(0);
        expect(alteration.children[1]).toBeInstanceOf(RegexTreeQuantifier);
        const quantifier = alteration.children[1] as RegexTreeQuantifier;
        expect(quantifier.symbol).toBe("?");
        expect(quantifier.child).toBeInstanceOf(RegexTreeAlteration);
        const alteration2 = quantifier.child as RegexTreeAlteration;
        expect(alteration2.children.length).toBe(2);
        expect(alteration2.children[0]).toBeInstanceOf(RegexTreeTerminal);
        expect(alteration2.children[1]).toBeInstanceOf(RegexTreeTerminal);
        expect((alteration2.children[0] as RegexTreeTerminal).symbol).toBe("a");
        expect((alteration2.children[0] as RegexTreeTerminal).index).toBe(1);
        expect((alteration2.children[1] as RegexTreeTerminal).symbol).toBe("b");
        expect((alteration2.children[1] as RegexTreeTerminal).index).toBe(2);
    })
})

describe('escaping', () => {
    test('can escape terminal without altering it', () => {
        const tree = parseRegex("\\a");
        expect(tree).toBeInstanceOf(RegexTreeTerminal);
        const terminal = tree as RegexTreeTerminal;
        expect(terminal.symbol).toBe("\\a");
        expect(terminal.index).toBe(0);
    })

    test('can escape operator', () => {
        const tree = parseRegex("\\|");
        expect(tree).toBeInstanceOf(RegexTreeTerminal);
        const terminal = tree as RegexTreeTerminal;
        expect(terminal.symbol).toBe("\\|");
        expect(terminal.index).toBe(0);
    })

    test('ignores backslash if last character in string', () => {
        const tree = parseRegex("\\a\\");
        expect(tree).toBeInstanceOf(RegexTreeTerminal);
        const terminal = tree as RegexTreeTerminal;
        expect(terminal.symbol).toBe("\\a");
        expect(terminal.index).toBe(0);
    })
})

describe('error messages', () => {
    test('regex cannot start with quantifier', () => {
        expect(() => parseRegex("?")).toThrowError()
    })

    test('regex cannot start with alteration', () => {
        expect(() => parseRegex("|")).toThrowError()
    })

    test('regex cannot end with open alteration', () => {
        expect(() => parseRegex("a|")).toThrowError()
    })

    test('regex cannot quantify quantifier', () => {
        expect(() => parseRegex("a??")).toThrowError()
    })

    test('regex groups must all be closed', () => {
        expect(() => parseRegex("((a)")).toThrowError()
    })

    test('non-existing regex groups cannot be closed', () => {
        expect(() => parseRegex("(a))")).toThrowError()
    })

    test('alteration operator cannot be quantifier', () => {
        expect(() => parseRegex("a|?")).toThrowError()
    })

    test('alteration operators cannot directly follow each other', () => {
        expect(() => parseRegex("a||b")).toThrowError()
    })
})

describe('more irregular regexes', () => {
    test('alterations can hold many items', () => {
        const tree = parseRegex("a|b|c|d|e|f|g");
        expect(tree).toBeInstanceOf(RegexTreeAlteration);
        const alteration = tree as RegexTreeAlteration;
        expect(alteration.children.length).toBe(7);
        alteration.children.forEach((child) => {
            expect(child).toBeInstanceOf(RegexTreeTerminal);
        })
    })

    test('Quantifier in alteration', () => {
        const tree = parseRegex("ab|c?d");
        expect(tree).toBeInstanceOf(RegexTreeConcatenation);
        const concatenation = tree as RegexTreeConcatenation;
        expect(concatenation.children.length).toBe(3);
        expect(concatenation.children[0]).toBeInstanceOf(RegexTreeTerminal);
        expect(concatenation.children[1]).toBeInstanceOf(RegexTreeAlteration);
        expect(concatenation.children[2]).toBeInstanceOf(RegexTreeTerminal);
        const alteration = concatenation.children[1] as RegexTreeAlteration;
        expect(alteration.children.length).toBe(2);
        expect(alteration.children[0]).toBeInstanceOf(RegexTreeTerminal);
        expect(alteration.children[1]).toBeInstanceOf(RegexTreeQuantifier);
        const quantifier = alteration.children[1] as RegexTreeQuantifier;
        expect(quantifier.symbol).toBe("?");
        expect(quantifier.child).toBeInstanceOf(RegexTreeTerminal);
    })

    test('Quantifier in group in alteration', () => {
        const tree = parseRegex("a((bc)?|(de)?)*f");
        expect(tree).toBeInstanceOf(RegexTreeConcatenation);
        const concatenation = tree as RegexTreeConcatenation;
        expect(concatenation.children.length).toBe(3);
        expect(concatenation.children[0]).toBeInstanceOf(RegexTreeTerminal)
        expect(concatenation.children[1]).toBeInstanceOf(RegexTreeQuantifier)
        expect(concatenation.children[2]).toBeInstanceOf(RegexTreeTerminal)
        const quantifier = concatenation.children[1] as RegexTreeQuantifier;
        expect(quantifier.symbol).toBe("*");
        expect(quantifier.child).toBeInstanceOf(RegexTreeAlteration);
        const alteration2 = quantifier.child as RegexTreeAlteration;
        expect(alteration2.children.length).toBe(2);
        expect(alteration2.children[0]).toBeInstanceOf(RegexTreeQuantifier);
        const quantifier2 = alteration2.children[0] as RegexTreeQuantifier;
        expect(quantifier2.symbol).toBe("?");
        expect(quantifier2.child).toBeInstanceOf(RegexTreeConcatenation);
        const concatenation2 = quantifier2.child as RegexTreeConcatenation;
        expect(concatenation2.children.length).toBe(2);
        expect(alteration2.children[1]).toBeInstanceOf(RegexTreeQuantifier);
        const quantifier3 = alteration2.children[1] as RegexTreeQuantifier;
        expect(quantifier3.symbol).toBe("?");
        expect(quantifier3.child).toBeInstanceOf(RegexTreeConcatenation);
        const concatenation3 = quantifier3.child as RegexTreeConcatenation;
        expect(concatenation3.children.length).toBe(2);
    })
})
