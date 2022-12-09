import {Edge, getOutgoers, MarkerType, Node} from "reactflow";
import {SolverResult} from "@/tree_builder/domain/steps";

function addEdge(edges: Edge[], sourceId: string, sourceHandle: string, targetId: string, targetHandle: string) {
    const edgeId = sourceId + "-" + targetId + sourceHandle + "-" + targetHandle;
    if(edges.map(edge => edge.id).includes(edgeId)) {
        return;
    }

    edges.push({
        id: edgeId,
        source: sourceId,
        sourceHandle: sourceHandle,
        target: targetId,
        targetHandle: targetHandle,
        markerStart: MarkerType.Arrow,
        markerEnd: MarkerType.ArrowClosed,
        data: {
            step: 1,
        }
    })
}

export default function solvePossiblePaths(nodes: Node[], edges: Edge[]): SolverResult {
    // reset user input
    edges = edges.filter(edge => edge.data.step !== 1);
    nodes.forEach(node => {
        const children = getOutgoers(node, nodes, edges);
        switch(node.data.label) {
            case "*":
                addEdge(edges, node.id, "step2l", node.id, "step2r");
                addEdge(edges, node.id, "step2l", children[0].id, "step2l");
                addEdge(edges, children[0].id, "step2r", node.id, "step2r");
                addEdge(edges, children[0].id, "step2r", children[0].id, "step2l");
                break;
            case "+":
                addEdge(edges, node.id, "step2l", children[0].id, "step2l");
                addEdge(edges, children[0].id, "step2r", node.id, "step2r");
                addEdge(edges, children[0].id, "step2r", children[0].id, "step2l");
                break;
            case "?":
                addEdge(edges, node.id, "step2l", node.id, "step2r");
                addEdge(edges, node.id, "step2l", children[0].id, "step2l");
                addEdge(edges, children[0].id, "step2r", node.id, "step2r");
                break;
            case "·":
                addEdge(edges, node.id, "step2l", children[0].id, "step2l");
                addEdge(edges, children[0].id, "step2r", children[1].id, "step2l");
                addEdge(edges, children[1].id, "step2r", node.id, "step2r");
                break;
            case "|":
                addEdge(edges, node.id, "step2l", children[0].id, "step2l");
                addEdge(edges, children[0].id, "step2r", node.id, "step2r");
                addEdge(edges, node.id, "step2l", children[0].id, "step2l");
                addEdge(edges, children[1].id, "step2r", node.id, "step2r");
                break;
            default:
                // TODO: color code?
                addEdge(edges, node.id, "step2l", node.id, "step2r");
        }
    })

    return {nodes, edges};
}
