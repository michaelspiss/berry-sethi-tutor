import {Edge, getIncomers, getOutgoers, Node} from "reactflow";

/**
 * Returns a set of node data keys to overwrite the current with
 */
type SetDataCallback = (node: Node, children: Node[]) => { [key: string]: any };

/**
 * Applies callback to every node after it has been applied to its children
 * @param nodes
 * @param edges
 * @param callback
 */
export default function setDataDfs(nodes: Node[], edges: Edge[], callback: SetDataCallback) {
    const syntaxTreeEdges = edges.filter(edge => edge.data.step === 0);
    const rootNode = nodes.find(node => getIncomers(node, nodes, syntaxTreeEdges).length === 0)!;
    setDataDfsRec(rootNode, nodes, syntaxTreeEdges, callback);
}

function setDataDfsRec(node: Node, nodes: Node[], edges: Edge[], callback: SetDataCallback) {
    const children = getOutgoers(node, nodes, edges);
    children.forEach(child => setDataDfsRec(child, nodes, edges, callback));
    node.data = {
        ...node.data,
        ...callback(node, children)
    };
}
