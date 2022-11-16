import {describe, expect, test} from "vitest";
import {
   RegexTreeAlteration,
   RegexTreeConcatenation, RegexTreeQuantifier,
   RegexTreeTerminal
} from "../../../../src/features/analyze_regex/domain/models/regexTree";

describe('single item getPossibleStrings', () => {
   test('Terminal returns itself', () => {
      const tree = new RegexTreeTerminal("a");

      const possibleStrings = tree.getPossibleStrings();
      expect(possibleStrings.size).toBe(1)
      expect(possibleStrings.has("a")).toBeTruthy();
   });

   test('concatenation concatenates two terminals', () => {
      const tree = new RegexTreeConcatenation();
      tree.pushChild(new RegexTreeTerminal("a"))
      tree.pushChild(new RegexTreeTerminal("b"))

      const possibleStrings = tree.getPossibleStrings();
      expect(possibleStrings.size).toBe(1)
      expect(possibleStrings.has("ab")).toBeTruthy();
   });

   test('alteration can be any of two values', () => {
      const tree = new RegexTreeAlteration();
      tree.pushChild(new RegexTreeTerminal("a"));
      tree.pushChild(new RegexTreeTerminal("b"));

      const possibleStrings = tree.getPossibleStrings();
      expect(possibleStrings.size).toBe(2);
      expect(possibleStrings.has("a")).toBeTruthy();
      expect(possibleStrings.has("b")).toBeTruthy();
   });

   test('quantifier + contains one or more', () => {
      const tree = new RegexTreeQuantifier("+", new RegexTreeTerminal("a"));

      const possibleStrings = tree.getPossibleStrings();
      expect(possibleStrings.size).toBe(2);
      expect(possibleStrings.has("a")).toBeTruthy();
      expect(possibleStrings.has("aa")).toBeTruthy();
   });

   test('quantifier * contains zero or more', () => {
      const tree = new RegexTreeQuantifier("*", new RegexTreeTerminal("a"));

      const possibleStrings = tree.getPossibleStrings();
      expect(possibleStrings.size).toBe(3);
      expect(possibleStrings.has("")).toBeTruthy();
      expect(possibleStrings.has("a")).toBeTruthy();
      expect(possibleStrings.has("aa")).toBeTruthy();
   });

   test('quantifier ? contains zero or one', () => {
      const tree = new RegexTreeQuantifier("?", new RegexTreeTerminal("a"));

      const possibleStrings = tree.getPossibleStrings();
      expect(possibleStrings.size).toBe(2);
      expect(possibleStrings.has("")).toBeTruthy();
      expect(possibleStrings.has("a")).toBeTruthy();
   });

})
