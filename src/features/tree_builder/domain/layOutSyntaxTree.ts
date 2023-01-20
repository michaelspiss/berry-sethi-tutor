import {Edge, getIncomers, getOutgoers, Node} from "reactflow";
import setDataDfs from "@/tree_builder/domain/setDataDfs";

/**
 * Positions nodes so that they can be read
 * @param nodes
 * @param edges
 */
export default function layOutSyntaxTree(nodes: Node[], edges: Edge[]) {
    const rootNode = nodes.filter((node) => getIncomers(node, nodes, edges).length === 0)[0];
    const nodeHeight = 40;
    const nodeWidth = 40;
    const gapHeight = 40;
    const gapWidth = 40;

    rootNode.position = {x: 0, y: 0};

    let index = 0;
    setDataDfs(nodes, edges, (node) => {
        return node.type === "terminal" ? {index: index++} : {}
    })

    layoutYRecursive(rootNode, nodes, edges, nodeHeight, gapHeight, 0);

    const terminals = nodes
        .sort((nodeA, nodeB) => (nodeA.data.index ?? 0) - (nodeB.data.index ?? 0))
        .filter((node) => node.type === "terminal");
    for(let i = 0; i < terminals.length; i++) {
        delete terminals[i].data.index;
        layoutXRecursive(terminals[i], nodes, edges, nodeWidth, gapWidth, i * (nodeWidth + gapWidth));
    }
}

/**
 * Adjusts the y coordinate of all nodes
 * @param activeNode
 * @param nodes
 * @param edges
 * @param nodeHeight
 * @param gapHeight
 * @param height the last item's height
 */
function layoutYRecursive(activeNode: Node, nodes: Node[], edges: Edge[], nodeHeight: number, gapHeight: number, height: number) {
    const newHeight = height + nodeHeight + gapHeight;
    const children = getOutgoers(activeNode, nodes, edges);
    children.forEach((child) => {
        child.position = {x: child.position.x, y: newHeight};
        layoutYRecursive(child, nodes, edges, nodeHeight, gapHeight, newHeight);
    })
}

/**
 * Adjusts the x coordinate of all nodes based on their children. Terminals need to be laid out first.
 * @param activeNode
 * @param nodes
 * @param edges
 * @param nodeWidth
 * @param gapWidth
 * @param offset
 */
function layoutXRecursive(activeNode: Node, nodes: Node[], edges: Edge[], nodeWidth: number, gapWidth: number, offset: number) {
    const children = getOutgoers(activeNode, nodes, edges);
    let x = offset;
    if(children.length !== 0) {
        const smallestX = Math.min(...children.map((node) => node.position.x));
        const largestX = Math.max(...children.map((node) => node.position.x));
        const childBoxSpan = largestX - smallestX;
        x = smallestX + Math.abs(childBoxSpan / 2);
    }
    activeNode.position = {y: activeNode.position.y, x: x};
    const parents = getIncomers(activeNode, nodes, edges);
    if(parents.length === 0) {
        return;
    }
    layoutXRecursive(parents[0], nodes, edges, nodeWidth, gapWidth, x);
}
