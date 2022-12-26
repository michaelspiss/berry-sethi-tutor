import {Edge, getOutgoers, Node} from "reactflow";
import {
    RegexTreeAlteration,
    RegexTreeConcatenation,
    RegexTreeItem,
    RegexTreeQuantifier,
    RegexTreeTerminal
} from "@/analyze_regex/domain/models/regexTree";

export default function graphToTreeModel(node: Node, nodes: Node[], edges: Edge[]): RegexTreeItem {
    const children = getOutgoers(node, nodes, edges.filter(edge => edge.data.step === 0)).sort((nodeA, nodeB) => nodeA.position.x - nodeB.position.x);
    const treeChildren = children.map((child) => graphToTreeModel(child, nodes, edges));
    switch(node.data.label) {
        case "*":
        case "+":
        case "?":
            return new RegexTreeQuantifier(node.data.label, treeChildren[0]!);
        case "|":
            return new RegexTreeAlteration(treeChildren.flatMap(child => child instanceof RegexTreeAlteration ? child.children : child));
        case "·":
            return new RegexTreeConcatenation(treeChildren.flatMap(child => child instanceof RegexTreeConcatenation ? child.children : child));
        default:
            return new RegexTreeTerminal(node.data.label, node.data.terminalIndex ?? NaN);
    }
}
