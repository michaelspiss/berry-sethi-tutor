import {Edge, getOutgoers, Node} from "reactflow";

/**
 * Positions nodes so that they can be read
 * @param nodes
 * @param edges
 */
export default function layOutSyntaxTree(nodes: Node[], edges: Edge[]) {
    // root node is added last, at least one node exists
    const rootNode = nodes.slice(-1)[0]!
    const nodeHeight = 40;
    const nodeWidth = 40;
    const gapHeight = 40;
    const gapWidth = 40;

    layoutYRecursive(nodes, edges, rootNode, nodeHeight, gapHeight, 0);
    layoutXRecursive(nodes, edges, rootNode, nodeWidth, gapWidth, 0);
}

/**
 * Adjusts the y coordinate of all nodes
 * @param nodes
 * @param edges
 * @param activeNode
 * @param nodeHeight
 * @param gapHeight
 * @param height the last item's height
 */
function layoutYRecursive(nodes: Node[], edges: Edge[], activeNode: Node, nodeHeight: number, gapHeight: number, height: number) {
    const newHeight = height + nodeHeight + gapHeight;
    const children = getOutgoers(activeNode, nodes, edges);
    children.forEach((child) => {
        child.position.y = newHeight;
        layoutYRecursive(nodes, edges, child, nodeHeight, gapHeight, newHeight);
    })
}

/**
 * Adjusts the x coordinate of all nodes
 * @param nodes
 * @param edges
 * @param activeNode
 * @param nodeWidth
 * @param gapWidth
 * @param x this item's x coordinate
 */
function layoutXRecursive(nodes: Node[], edges: Edge[], activeNode: Node, nodeWidth: number, gapWidth: number, x: number) {
    activeNode.position.x = x;
    const children = getOutgoers(activeNode, nodes, edges);
    const childCount = children.length;
    const childrenWidthSum = childCount * nodeWidth + (childCount - 1) * gapWidth;
    const childrenXStart = childrenWidthSum/2 - nodeWidth/2;

    if(childCount === 1) {
        layoutXRecursive(nodes, edges, children[0], nodeWidth, gapWidth, x);
        return;
    }

    for(let i = 0; i < children.length; i++) {
        let childX = x - childrenXStart + (nodeWidth + gapWidth) * i;
        layoutXRecursive(nodes, edges, children[i], nodeWidth, gapWidth, childX);
    }
}
