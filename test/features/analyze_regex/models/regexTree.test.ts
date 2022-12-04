import {describe, expect, test} from "vitest";
import {
   RegexTreeAlteration,
   RegexTreeConcatenation,
   RegexTreeQuantifier,
   RegexTreeTerminal
} from "../../../../src/features/analyze_regex/domain/models/regexTree";

describe('single item getPossibleStrings', () => {
   test('Terminal returns itself', () => {
      const tree = new RegexTreeTerminal("a", 0);

      const possibleStrings = tree.getPossibleStrings();
      expect(possibleStrings.size).toBe(1)
      expect(possibleStrings.has("a")).toBeTruthy();
   });

   test('concatenation concatenates two terminals', () => {
      const tree = new RegexTreeConcatenation();
      tree.pushChild(new RegexTreeTerminal("a", 0))
      tree.pushChild(new RegexTreeTerminal("b", 0))

      const possibleStrings = tree.getPossibleStrings();
      expect(possibleStrings.size).toBe(1)
      expect(possibleStrings.has("ab")).toBeTruthy();
   });

   test('alteration can be any of two values', () => {
      const tree = new RegexTreeAlteration();
      tree.pushChild(new RegexTreeTerminal("a", 0));
      tree.pushChild(new RegexTreeTerminal("b", 0));

      const possibleStrings = tree.getPossibleStrings();
      expect(possibleStrings.size).toBe(2);
      expect(possibleStrings.has("a")).toBeTruthy();
      expect(possibleStrings.has("b")).toBeTruthy();
   });

   test('quantifier + contains one or more', () => {
      const tree = new RegexTreeQuantifier("+", new RegexTreeTerminal("a", 0));

      const possibleStrings = tree.getPossibleStrings();
      expect(possibleStrings.size).toBe(2);
      expect(possibleStrings.has("a")).toBeTruthy();
      expect(possibleStrings.has("aa")).toBeTruthy();
   });

   test('quantifier * contains zero or more', () => {
      const tree = new RegexTreeQuantifier("*", new RegexTreeTerminal("a", 0));

      const possibleStrings = tree.getPossibleStrings();
      expect(possibleStrings.size).toBe(3);
      expect(possibleStrings.has("")).toBeTruthy();
      expect(possibleStrings.has("a")).toBeTruthy();
      expect(possibleStrings.has("aa")).toBeTruthy();
   });

   test('quantifier ? contains zero or one', () => {
      const tree = new RegexTreeQuantifier("?", new RegexTreeTerminal("a", 0));

      const possibleStrings = tree.getPossibleStrings();
      expect(possibleStrings.size).toBe(2);
      expect(possibleStrings.has("")).toBeTruthy();
      expect(possibleStrings.has("a")).toBeTruthy();
   });
})

describe("getRegex", () => {
   test('terminal', () => {
      const tree = new RegexTreeTerminal("a", 0);
      expect(tree.getRegex()).toBe("a");
   })

   test('quantifier', () => {
      const tree = new RegexTreeQuantifier("*", new RegexTreeTerminal("a", 0));
      expect(tree.getRegex()).toBe("a*");
   })

   test("alteration", () => {
      const tree = new RegexTreeAlteration([
          new RegexTreeTerminal("a", 0),
          new RegexTreeTerminal("b", 0),
          new RegexTreeTerminal("c", 0),
      ])
      expect(tree.getRegex()).toBe("a|b|c");
   })

   test('concatenation', () => {
      const tree = new RegexTreeConcatenation([
         new RegexTreeTerminal("a", 0),
         new RegexTreeTerminal("b", 0),
         new RegexTreeTerminal("c", 0),
      ])
      expect(tree.getRegex()).toBe("abc");
   })

   test('grouping in alteration', () => {
      const tree = new RegexTreeAlteration([
          new RegexTreeQuantifier("?",
          new RegexTreeConcatenation([
              new RegexTreeTerminal("a", 0),
              new RegexTreeTerminal("b", 0),
          ]),),
          new RegexTreeTerminal("c", 0),
      ])
      expect(tree.getRegex()).toBe("(ab)?|c")
   })
})
