import {
    RegexQuantifier,
    RegexTreeAlteration, RegexTreeConcatenation, RegexTreeGroup,
    RegexTreeItem,
    RegexTreeQuantifier,
    RegexTreeTerminal
} from "../models/regexTree";
import RegexError from "@/analyze_regex/domain/models/regexError";

interface ParserState {
    /**
     * The read position in string regex
     */
    position: number;

    /**
     * Gets set to true after | operator until terminal
     */
    isAlterationParameter: boolean;

    /**
     * Gets set to true whenever isAlterationParameter gets set to false.
     * This helps with implicit group handling
     */
    lastInsertWasInAlteration: boolean;
}

interface RegexRecBuilderReturn {
    tree: RegexTreeItem,
    position: number,
}


export default function parseRegex(regex: string): RegexTreeItem {
    return buildRegexTreeRec(regex, 0, 0).tree;
}

/**
 *
 * @param regex
 * @param startAt
 * @param recLevel
 * @throws {RegexError}
 */
function buildRegexTreeRec(regex: string, startAt: number = 0, recLevel: number = 0): RegexRecBuilderReturn {
    const treeRoot = new RegexTreeConcatenation();
    let state: ParserState = {
        position: startAt,
        isAlterationParameter: false,
        lastInsertWasInAlteration: false,
    }

    outerWhile: while (state.position < regex.length) {
        const symbol = regex.at(state.position)!;

        switch (symbol) {
            case '?':
            case '+':
            case '*':
                setQuantifier(symbol, state, treeRoot);
                break;
            case '(':
                addGroup(regex, state, treeRoot, recLevel);
                break;
            case ')':
                closeGroup(state, recLevel);
                break outerWhile;
            case '|':
                addAlteration(state, treeRoot);
                break;
            case '\\':
                if(++state.position < regex.length) {
                    addTerminal(regex.at(state.position)!, state, treeRoot);
                }
                break;
            default:
                addTerminal(symbol, state, treeRoot);
        }

        state.position++;
    }

    if(state.isAlterationParameter) {
        // TODO: write error message
        throw new RegexError(
            "Alteration is missing its second parameter",
            "",
            state.position - 1,
        )
    }

    if (state.position >= regex.length && recLevel !== 0) {
        // TODO: write error message
        throw new RegexError(
            "Missing closing parenthesis for",
            "",
            state.position - 1,
        );
    }

    // remove top-level concatenation if it only has one child
    if (treeRoot.children.length === 1) {
        return {tree: treeRoot.children[0], position: state.position};
    }

    return {tree: treeRoot, position: state.position};
}

function getActiveNode(state: ParserState, treeRoot: RegexTreeConcatenation) {
    return state.isAlterationParameter ? treeRoot.getLastChild() as RegexTreeAlteration : treeRoot;
}

function addTerminal(symbol: string, state: ParserState, treeRoot: RegexTreeConcatenation) {
    const activeNode = getActiveNode(state, treeRoot);
    activeNode.pushChild(new RegexTreeTerminal(symbol));
    state.lastInsertWasInAlteration = state.isAlterationParameter;
    state.isAlterationParameter = false;
}

function setQuantifier(symbol: RegexQuantifier, state: ParserState, treeRoot: RegexTreeConcatenation) {
    if (state.isAlterationParameter) {
        // TODO: write error message
        throw new RegexError(
            "Quantifier cannot be applied to alteration operator",
            "message with hint",
            state.position,
        );
    }

    let activeGroup: RegexTreeGroup = treeRoot;
    if (state.lastInsertWasInAlteration) {
        activeGroup = treeRoot.getLastChild() as RegexTreeAlteration;
    }
    const nodeToQuantify = activeGroup.popChild();

    if (nodeToQuantify === undefined) {
        // TODO: write error message
        throw new RegexError(
            "Quantifier requires node to quantify",
            "message with hint",
            state.position,
        );
    }

    if (nodeToQuantify instanceof RegexTreeQuantifier) {
        // TODO: write error message
        throw new RegexError(
            "Cannot quantify quantifier",
            "mesage with hint",
            state.position,
        );
    }

    activeGroup.pushChild(new RegexTreeQuantifier(symbol, nodeToQuantify));
}

function addAlteration(state: ParserState, treeRoot: RegexTreeConcatenation) {
    if (state.isAlterationParameter) {
        // TODO: write error message
        throw new RegexError(
            "Missing terminal between this and previous alteration operator",
            "message with hint",
            state.position,
        )
    }

    if (!state.lastInsertWasInAlteration) {
        let latestNode = treeRoot.popChild();

        if (latestNode === undefined) {
            // TODO: write error message
            throw new RegexError(
                "Alteration is missing its first parameter",
                "helpful hint here",
                state.position,
            );
        }

        const alteration = new RegexTreeAlteration();
        alteration.pushChild(latestNode);

        treeRoot.pushChild(alteration);
    }

    state.isAlterationParameter = true;
    state.lastInsertWasInAlteration = false;
}

function addGroup(regex: string, state: ParserState, treeRoot: RegexTreeConcatenation, recLevel: number) {
    const group = buildRegexTreeRec(regex, state.position + 1, recLevel + 1);
    const activeNode = getActiveNode(state, treeRoot);
    activeNode.pushChild(group.tree);

    state.position = group.position;
    state.lastInsertWasInAlteration = state.isAlterationParameter;
    state.isAlterationParameter = false;
}

function closeGroup(state: ParserState, recLevel: number) {
    if (recLevel === 0) {
        // TODO: write error message
        throw new RegexError(
            "Closing group that has never been opened",
            "",
            state.position,
        );
    }
}
