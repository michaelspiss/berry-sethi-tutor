import {Edge, getIncomers, getOutgoers, Node} from "reactflow";
import {VerificationError, VerificationResult} from "@/tree_builder/domain/steps";
import {terminalLengthIsValid} from "@/tree_builder/presentation/TerminalNode";
import {Code} from "@mantine/core";
import useAppStateStore from "@/layout/stores/appStateStore";
import RegexHighlighter from "@/analyze_regex/presentation/RegexHighlighter";
import operatorSymbols from "@/tree_builder/domain/operatorSymbols";
import graphToTreeModel from "@/tree_builder/domain/step1/graphToTreeModel";

/**
 * Checks whether there is only exactly one element without parents, which is then identified as root node and returned
 * @param nodes
 * @param edges
 * @param errors
 */
function hasExactlyOneRoot(nodes: Node[], edges: Edge[], errors: VerificationError[]): Node | null {
    if (nodes.length === 0) {
        errors.push({
            title: "Missing root node",
            message: <>There are no nodes which could define a syntax tree.<br/><br/>Try adding at least one node to the
                canvas by dragging them from the toolbar on the bottom onto the canvas.</>
        });
        return null;
    }

    const nodesWithoutParent = nodes.filter((node) => getIncomers(node, nodes, edges).length === 0);

    if (nodesWithoutParent.length === 0) {
        errors.push({
            title: "Missing root node",
            message: <>All nodes have at least one parent, but one needs to be the entry point without any.<br/><br/>You
                have a circular path, which is not valid for trees. Try removing it.</>
        })
        return null;
    } else if (nodesWithoutParent.length > 1) {
        errors.push({
            title: "Graph is not connected",
            causes: nodesWithoutParent.map(node => node.id),
            message: <>Your graph contains multiple nodes without parents, which makes it disconnected. Trees must
                always be connected.<br/><br/>Try either merging the top level nodes or connecting them.</>
        })
        return null;
    }

    return nodesWithoutParent[0];
}

function allNodesHaveExactlyOneParent(nodes: Node[], edges: Edge[], errors: VerificationError[]) {
    const nodesWithMultipleParents = nodes.filter((node) => getIncomers(node, nodes, edges).length > 1);
    if (nodesWithMultipleParents.length !== 0) {
        errors.push({
            title: "Node has multiple parents",
            causes: nodesWithMultipleParents.map(node => node.id),
            message: <>Your graph contains nodes with multiple parents. This is not allowed for trees.<br/><br/>Try
                reducing edges which lead to a node to one.</>
        });
    }
}

function allNodesHaveValidLabels(nodes: Node[], errors: VerificationError[]) {
    // TODO: check if terminal characters even exist
    const emptyNodes = nodes.filter((node) => !node.data.label || node.data.label === "");
    if (emptyNodes.length !== 0) {
        errors.push({
            title: "Nodes are missing content",
            causes: emptyNodes.map(node => node.id),
            message: <>Your graph contains empty nodes. Please enter values for them.</>
        });
    }

    const terminalWithTooManyCharacters = nodes.filter(node => node.type === "terminal" && !terminalLengthIsValid(node.data.label));
    if (terminalWithTooManyCharacters.length !== 0) {
        errors.push({
            title: "Lecture convention: Each character is its own terminal",
            causes: terminalWithTooManyCharacters.map(node => node.id),
            message: <>As per the lecture convention, each terminal node must only have one character.
                Exceptions are escaped characters, e.g. <Code>\*</Code></>
        })
    }

    const terminalsWithOperatorLabel = nodes.filter(node => node.type === "terminal" && operatorSymbols.includes(node.data.label));
    if (terminalsWithOperatorLabel.length !== 0) {
        errors.push({
            title: "Terminal symbol is an operator",
            causes: terminalsWithOperatorLabel.map(node => node.id),
            message: <>At least one of your terminals contain an operator. If you were going for the character itself,
                try escaping it (e.g. \+ instead of +). Reserved characters are: {operatorSymbols.join(', ')}</>
        })
    }

    if(terminalWithTooManyCharacters.length === 0 && terminalsWithOperatorLabel.length === 0 && emptyNodes.length === 0) {
        const regexTerminals = useAppStateStore.getState().regexModel!.getTerminals();
        const terminalsNotInRegex = nodes.filter(node => node.type === "terminal" && !regexTerminals.includes(node.data.label));

        if(terminalsNotInRegex.length !== 0) {
            errors.push({
                title: "Terminal does not exist in regex",
                message: <>At least one terminal does not exist in the regular expression. Reading a value which is not defined in the regular expression always leads to a faulty state. Try removing it.</>,
                causes: terminalsNotInRegex.map(node => node.id),
            })
        }
    }
}

function getCorrectChildCountForOperator(operator: string) {
    switch (operator) {
        case '+':
        case '?':
        case '*':
            return 1;
        case '|':
        case '·':
            return 2;
    }
}

function allOperatorsHaveTheCorrectAmountOfChildren(nodes: Node[], edges: Edge[], errors: VerificationError[]) {
    const nodesWithIncorrectAmountOfChildren = nodes.filter((node) => node.type === 'operator'
        && getCorrectChildCountForOperator(node.data.label) !== getOutgoers(node, nodes, edges).length
    );

    if (nodesWithIncorrectAmountOfChildren.length !== 0) {
        errors.push({
            title: "Graph contains nodes with incorrect amounts of children",
            causes: nodesWithIncorrectAmountOfChildren.map(node => node.id),
            message: <>Quantifiers must have exactly one child, whereas alteration and concatenation operators must have
                exactly two, as per the lecture conventions.</>
        });
    }
}

/**
 * The nodes array is ordered by node creation time. By going through all nodes and checking their x coordinates, we can
 *
 * @param rootNode
 * @param nodes
 * @param edges
 * @param errors
 */
function orderNodesByHorizontalPosition(rootNode: Node, nodes: Node[], edges: Edge[], errors: VerificationError[]) {
    const newNodes: Node[] = [rootNode];
    const nodesWithEqualX = new Set<string>();
    orderNodesByHorizontalPositionRec(rootNode, nodes, edges, newNodes, nodesWithEqualX);
    if (nodesWithEqualX.size !== 0) {
        errors.push({
            title: "Graph has ambiguous interpretation",
            causes: Array.from(nodesWithEqualX),
            message: <>Some nodes in the graph with the same parent do not differ in their horizontal position. Try
                moving them, so they have a clear order.</>
        })
    }
    return newNodes;
}

function orderNodesByHorizontalPositionRec(rootNode: Node, nodes: Node[], edges: Edge[], newNodes: Node[], nodesWithEqualX: Set<string>) {
    const children = getOutgoers(rootNode, nodes, edges);
    children.sort((nodeA, nodeB) => nodeA.position.x - nodeB.position.x);

    // find children with exactly the same horizontal position, except self
    children.forEach((nodeA) => {
        if (children.filter((nodeB) => nodeA.position.x === nodeB.position.x).length > 1) {
            nodesWithEqualX.add(nodeA.id);
        }
    })

    newNodes.push(...children);
    children.forEach((child) => {
        orderNodesByHorizontalPositionRec(child, nodes, edges, newNodes, nodesWithEqualX);
    })
}

function allTerminalsExistAndAreInCorrectOrder(rootNode: Node, nodes: Node[], edges: Edge[], errors: VerificationError[]) {
    const model = useAppStateStore.getState().regexModel;
    // FIXME: terminals are sorted by creation date, rather than appearance
    const graphTerminals = nodes.filter((node) => getOutgoers(node, nodes, edges).length === 0).map(node => node.data.label);
    const modelTerminals = model!.getTerminals();

    const allTerminalsExist = [...graphTerminals].sort().toString() === [...modelTerminals].sort().toString();
    const terminalsInCorrectOrder = graphTerminals.toString() === modelTerminals.toString();

    if (!allTerminalsExist) {
        const graphRegex = graphToTreeModel(rootNode, nodes, edges).getRegex();
        errors.push({
            title: "Graph is missing terminals",
            message: <>The regex requires the terminals {modelTerminals.join(", ")}. Your graph only
                provides {graphTerminals.join(", ")}. Try adjusting the terminals. Your graph currently evaluates
                to <RegexHighlighter regex={graphRegex} inline/></>,
        });
    } else if (!terminalsInCorrectOrder) {
        const graphRegex = graphToTreeModel(rootNode, nodes, edges).getRegex();
        errors.push({
            title: "Graph's terminals are in incorrect order",
            message: <>The regex requires the terminals to be in the following order: {modelTerminals.join(", ")}. Your
                graph's regex provides them like this: {graphTerminals.join(", ")}. Your graph currently evaluates
                to <RegexHighlighter regex={graphRegex} inline/></>
        })
    }
}

export default function verifySyntaxTree(nodes: Node[], edges: Edge[]): VerificationResult {
    const errors: VerificationError[] = []

    const rootNode = hasExactlyOneRoot(nodes, edges, errors);
    allNodesHaveValidLabels(nodes, errors);

    if (rootNode === null) {
        // @ts-ignore: "must have one item" is implicit
        return {nodes, edges, errors}
    }

    if (errors.length === 0) {
        allNodesHaveExactlyOneParent(nodes, edges, errors);
        allOperatorsHaveTheCorrectAmountOfChildren(nodes, edges, errors);
    }

    if (errors.length === 0) {
        nodes = orderNodesByHorizontalPosition(rootNode, nodes, edges, errors);
    }

    if (errors.length === 0) {
        allTerminalsExistAndAreInCorrectOrder(rootNode, nodes, edges, errors);
    }

    if (errors.length === 0) {
        const modelRegex = useAppStateStore.getState().regexModel!.getRegex();
        const graphRegex = graphToTreeModel(rootNode, nodes, edges).getRegex();
        if (modelRegex !== graphRegex) {
            errors.push({
                title: "Graph does not match target regex",
                message: <>The graph evaluates to regular expression <RegexHighlighter regex={graphRegex}
                                                                                       inline/>, which does not match
                    the target <RegexHighlighter regex={modelRegex} inline/></>
            })
        }
    }

    // @ts-ignore: typescript does not detect this as "at least ine element exists in array", but case is handled
    return {nodes, edges, errors: errors.length === 0 ? undefined : errors}
}
