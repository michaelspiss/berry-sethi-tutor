import {Edge, getOutgoers, Node} from "reactflow";
import {SolverResult} from "@/tree_builder/domain/steps";
import useAppStateStore from "@/layout/stores/appStateStore";
import {
    RegexTreeGroup,
    RegexTreeItem,
    RegexTreeQuantifier
} from "@/analyze_regex/domain/models/regexTree";

export default function solveSyntaxTree(nodes: Node[], edges: Edge[]): SolverResult {
    const model = useAppStateStore.getState().regexModel;
    const tree = buildTreeFromModel(model!);
    doLayout(tree);
    return tree;
}

function buildTreeFromModel(model: RegexTreeItem, parent?: string): SolverResult {
    const id = `node_${Math.random()}`;
    const symbol = model.getItemAsSymbol();

    let syntaxTreeData: { nodes: Node[], edges: Edge[] } = {nodes: [], edges: []};

    if (model instanceof RegexTreeQuantifier) {
        syntaxTreeData = buildTreeFromModel(model.child, id);
    } else if (model instanceof RegexTreeGroup) {
        model.children.forEach((child) => {
            const childData = buildTreeFromModel(child, id);
            syntaxTreeData.nodes = syntaxTreeData.nodes.concat(childData.nodes);
            syntaxTreeData.edges = syntaxTreeData.edges.concat(childData.edges);
        });
    }

    const type = ['*', '?', '|', '+', '.'].includes(symbol) ? 'operator' : 'terminal';

    syntaxTreeData.nodes.push({
        id: id,
        position: {x: 0, y: 0},
        data: {
            label: symbol,
        },
        type: type,
    });

    if (parent !== undefined) {
        syntaxTreeData.edges.push({
            id: parent + "-" + id,
            source: parent,
            target: id,
        })
    }

    return syntaxTreeData;
}

/**
 * Positions nodes so that they can be read
 * @param result
 */
function doLayout(result: SolverResult) {
    // root node is added last, at least one node exists
    const rootNode = result.nodes.slice(-1)[0]!
    const nodeHeight = 40;
    const nodeWidth = 40;
    const gapHeight = 40;
    const gapWidth = 40;

    layoutYRecursive(result, rootNode, nodeHeight, gapHeight, 0);
    layoutXRecursive(result, rootNode, nodeWidth, gapWidth, 0);
}

/**
 * Adjusts the y coordinate of all nodes
 * @param result
 * @param activeNode
 * @param nodeHeight
 * @param gapHeight
 * @param height the last item's height
 */
function layoutYRecursive(result: SolverResult, activeNode: Node, nodeHeight: number, gapHeight: number, height: number) {
    const newHeight = height + nodeHeight + gapHeight;
    const children = getOutgoers(activeNode, result.nodes, result.edges);
    children.forEach((child) => {
        child.position.y = newHeight;
        layoutYRecursive(result, child, nodeHeight, gapHeight, newHeight);
    })
}

/**
 * Adjusts the x coordinate of all nodes
 * @param result
 * @param activeNode
 * @param nodeWidth
 * @param gapWidth
 * @param x this item's x coordinate
 */
function layoutXRecursive(result: SolverResult, activeNode: Node, nodeWidth: number, gapWidth: number, x: number) {
    activeNode.position.x = x;
    const children = getOutgoers(activeNode, result.nodes, result.edges);
    const childCount = children.length;
    const childrenWidthSum = childCount * nodeWidth + (childCount - 1) * gapWidth;
    const childrenXStart = childrenWidthSum/2 - nodeWidth/2;

    if(childCount === 1) {
        layoutXRecursive(result, children[0], nodeWidth, gapWidth, x);
        return;
    }

    for(let i = 0; i < children.length; i++) {
        let childX = x - childrenXStart + (nodeWidth + gapWidth) * i;
        layoutXRecursive(result, children[i], nodeWidth, gapWidth, childX);
    }
}
