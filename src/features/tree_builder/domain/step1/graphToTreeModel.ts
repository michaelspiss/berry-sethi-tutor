import {Edge, getOutgoers, Node} from "reactflow";
import {
    RegexTreeAlteration,
    RegexTreeConcatenation,
    RegexTreeItem,
    RegexTreeQuantifier,
    RegexTreeTerminal
} from "@/analyze_regex/domain/models/regexTree";

export default function graphToTreeModel(node: Node, nodes: Node[], edges: Edge[]): RegexTreeItem {
    const children = getOutgoers(node, nodes, edges);
    const treeChildren = children.map((child) => graphToTreeModel(child, nodes, edges));
    switch(node.data.label) {
        case "*":
        case "+":
        case "?":
            return new RegexTreeQuantifier(node.data.label, treeChildren[0]!);
        case "|":
            return new RegexTreeAlteration(treeChildren);
        case "·":
            return new RegexTreeConcatenation(treeChildren);
        default:
            // terminal index is not important for regex model comparison
            return new RegexTreeTerminal(node.data.label, 0);
    }
}
