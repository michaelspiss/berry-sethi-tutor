import {VerificationError, VerificationResult} from "@/tree_builder/domain/steps";
import {Edge, getIncomers, Node} from "reactflow";

function getChildrenIdsOrderedByPosition(node: Node, nodes: Node[], edges: Edge[]) {
    return edges.filter(edge => edge.data.step === 0 && edge.source === node.id)
        .sort((edgeA, edgeB) => {
            const nodeA = nodes.find(node => node.id === edgeA.target);
            const nodeB = nodes.find(node => node.id === edgeB.target);

            if (nodeA === undefined || nodeB === undefined) {
                return 0;
            }

            return nodeA.position.x - nodeB.position.x;
        }).map(edge => edge.target);
}

function findEdges(node: Node, nodes: Node[], edges: Edge[]) {
    const childrenIds = getChildrenIdsOrderedByPosition(node, nodes, edges);
    return {
        leftToRight: edges.find(
            edge => edge.source === node.id
                && edge.target === node.id
                && edge.sourceHandle === "step2l"
                && edge.targetHandle === "step2r"
        ),
        toFirstChild: childrenIds[0] === undefined ? undefined : edges.find(
            edge => edge.source === node.id
                && edge.target === childrenIds[0]
                && edge.sourceHandle === "step2l"
                && edge.targetHandle === "step2l"
        ),
        toSecondChild: childrenIds[1] === undefined ? undefined : edges.find(
            edge => edge.source === node.id
                && edge.target === childrenIds[1]
                && edge.sourceHandle === "step2l"
                && edge.targetHandle === "step2l"
        ),
        fromFirstChild: childrenIds[0] === undefined ? undefined : edges.find(
            edge => edge.source === childrenIds[0]
                && edge.target === node.id
                && edge.sourceHandle === "step2r"
                && edge.targetHandle === "step2r"
        ),
        fromSecondChild: childrenIds[1] === undefined ? undefined : edges.find(
            edge => edge.source === childrenIds[1]
                && edge.target === node.id
                && edge.sourceHandle === "step2r"
                && edge.targetHandle === "step2r"
        ),
        childRightToLeft: childrenIds[0] === undefined ? undefined : edges.find(
            edge => edge.source === childrenIds[0]
                && edge.target === childrenIds[0]
                && edge.sourceHandle === "step2r"
                && edge.targetHandle === "step2l"
        ),
        childToChild: childrenIds[0] === undefined || childrenIds[1] === undefined ? undefined : edges.find(
            edge => edge.source === childrenIds[0]
                && edge.target === childrenIds[1]
                && edge.sourceHandle === "step2r"
                && edge.targetHandle === "step2l"
        ),
    }
}

export default function verifyPossiblePaths(nodes: Node[], edges: Edge[]): VerificationResult {
    const errors: VerificationError[] = [];
    const step2Edges = edges.filter(edge => edge.data.step === 1);

    const edgesRightToLeftNotInNode = step2Edges.filter(edge => {
            const sourceParent = edges.find(
                e => e.target === edge.source
                    && e.sourceHandle === "step1b"
                    && e.targetHandle === "step1t"
            )?.source;
            const targetParent = edges.find(
                e => e.target === edge.target
                    && e.sourceHandle === "step1b"
                    && e.targetHandle === "step1t"
            )?.source

            return edge.sourceHandle === "step2r"
                && edge.targetHandle === "step2l"
                && edge.source !== edge.target
                && sourceParent !== undefined
                && targetParent !== undefined
                && sourceParent !== targetParent
        }
    ).map(edge => edge.id);

    if (edgesRightToLeftNotInNode.length !== 0) {
        errors.push({
            title: "Edge goes from exit to entry not within the same node or to a sibling",
            message: <>Nodes have an entry point on their left and an exit point on their right side.
                An edge from exit to entry is only allowed within the same node, which indicates a repetition or from
                one sibling to another, which indicates concatenation.</>,
            causes: edgesRightToLeftNotInNode,
        })
    }

    const edgesLeftToRightNotInNode = step2Edges.filter(
        edge => edge.sourceHandle === "step2l"
            && edge.targetHandle === "step2r"
            && edge.source !== edge.target
    ).map(edge => edge.id);

    if (edgesLeftToRightNotInNode.length !== 0) {
        errors.push({
            title: "Edge goes from entry to exit not within the same node",
            message: <>Nodes have an entry point on their left and an exit point on their right side.
                An edge from entry to exit is only allowed within the same node, which indicates skipping the
                subtree.</>,
            causes: edgesLeftToRightNotInNode,
        })
    }

    const nodesWithoutMinimumEdges: string[] = [];
    nodes.forEach(node => {
        const numOutgoingEdges = step2Edges.filter(edge => edge.source === node.id).length;
        const numIncomingEdges = step2Edges.filter(edge => edge.target === node.id).length;

        if (numOutgoingEdges === 0 || numIncomingEdges === 0) {
            nodesWithoutMinimumEdges.push(node.id);
        }
    });
    if (nodesWithoutMinimumEdges.length !== 0) {
        errors.push({
            title: "Node is missing edges",
            message: <>Each node except for the root must have at least one incoming and one outgoing edge. Try adding the missing ones.</>,
            causes: nodesWithoutMinimumEdges,
        })
    }

    if (errors.length !== 0) {
        // @ts-ignore
        return {nodes, edges, errors}
    }

    let edgesNotToChildrenOrParentOrSibling: string[] = [];

    nodes.forEach(node => {
        const allowedTargetIds = [node.id].concat(getChildrenIdsOrderedByPosition(node, nodes, edges));
        const parentId = edges.find(edge => edge.data.step === 0 && edge.target === node.id)?.source;
        if (parentId !== undefined) {
            allowedTargetIds.push(parentId)
        }
        // get siblings. only allow siblings AFTER the current node
        let siblingIds = parentId === undefined ? []
            : getChildrenIdsOrderedByPosition(nodes.find(node => parentId === node.id)!, nodes, edges);
        if (siblingIds[0] !== node.id) {
            siblingIds = [];
        }
        allowedTargetIds.push(...siblingIds);

        edgesNotToChildrenOrParentOrSibling = edgesNotToChildrenOrParentOrSibling.concat(step2Edges.filter(
            edge => edge.source === node.id && !allowedTargetIds.includes(edge.target)
        ).map(edge => edge.id));
    });

    if (edgesNotToChildrenOrParentOrSibling.length !== 0) {
        errors.push({
            title: "Edges must only go to children, the parent, the following sibling, or the node itself",
            message: <>You have edges which violate this requirement. Try removing edges which skip nodes.</>,
            causes: edgesNotToChildrenOrParentOrSibling,
        });

        // @ts-ignore
        return {nodes, edges, errors}
    }

    const nodeToVerifyValue: { [key: string]: verifyEdgesReturn } = {};
    nodes.forEach(node => {
        const nodeEdges = findEdges(node, nodes, edges);
        switch (node.data.label) {
            case "*":
                nodeToVerifyValue[node.id] = verifyZeroOrMore(nodeEdges);
                break;
            case "?":
                nodeToVerifyValue[node.id] = verifyZeroOrOne(nodeEdges);
                break;
            case "+":
                nodeToVerifyValue[node.id] = verifyOneOrMore(nodeEdges);
                break;
            case "|":
                nodeToVerifyValue[node.id] = verifyAlteration(nodeEdges);
                break;
            case "·":
                nodeToVerifyValue[node.id] = verifyConcatenation(nodeEdges);
                break;
            default:
                nodeToVerifyValue[node.id] = verifyTerminal(nodeEdges);
        }
    })

    const missing = Object.keys(nodeToVerifyValue).filter(nodeId => nodeToVerifyValue[nodeId] === "missing");
    const tooMany = Object.keys(nodeToVerifyValue).filter(nodeId => nodeToVerifyValue[nodeId] === "tooMany");

    if (missing.length !== 0) {
        errors.push({
            title: "Nodes are missing edges",
            message: <>Nodes are missing paths to be correct. You alternatively also may have mixed up operator paths.
                To see the edges defined for each type of operator, open help.</>,
            causes: missing,
        })
    }

    if (tooMany.length !== 0) {
        errors.push({
            title: "Nodes have too many edges",
            message: <>Nodes have incorrect paths. You alternatively also may have mixed up operator paths. To see the
                edges defined for each type of operator, open help.</>,
            causes: tooMany
        })
    }

    const step1Edges = edges.filter(edge => edge.data.step === 0);
    const rootNode = nodes.find(node => getIncomers(node, nodes, step1Edges).length === 0)!;
    const rootNodeRightToLeft = edges.find(
        edge => edge.source === rootNode.id
            && edge.target === rootNode.id
            && edge.sourceHandle === "step2r"
            && edge.targetHandle === "step2l"
    )
    if (rootNodeRightToLeft !== undefined) {
        errors.push({
            title: "Root node has edge from exit to entry",
            message: <>Exit to entry edges are only set for children of + and * operators. The root node has no parent,
                so they cannot repeat. Try removing this edge.</>,
            causes: [rootNode.id]
        })
    }

    // @ts-ignore
    return {nodes, edges, errors: errors.length === 0 ? undefined : errors}
}

type verifyEdgesReturn = "missing" | "tooMany" | "ok";

function verifyTerminal(edges: ReturnType<typeof findEdges>): verifyEdgesReturn {
    if (!edges.leftToRight) {
        return "missing"
    }
    if (!!edges.childToChild || !!edges.toSecondChild || !!edges.fromSecondChild || !!edges.toFirstChild || !!edges.fromFirstChild || !!edges.childRightToLeft) {
        return "tooMany"
    }
    return "ok"
}

function verifyConcatenation(edges: ReturnType<typeof findEdges>): verifyEdgesReturn {
    if (!edges.toFirstChild || !edges.childToChild || !edges.fromSecondChild) {
        return "missing"
    }
    if (!!edges.fromFirstChild || !!edges.toSecondChild || !!edges.childRightToLeft || !!edges.leftToRight) {
        return "tooMany"
    }
    return "ok"
}

function verifyAlteration(edges: ReturnType<typeof findEdges>): verifyEdgesReturn {
    if (!edges.toFirstChild || !edges.toSecondChild || !edges.fromFirstChild || !edges.fromSecondChild) {
        return "missing"
    }
    if (!!edges.childToChild || !!edges.leftToRight || !!edges.childRightToLeft) {
        return "tooMany"
    }
    return "ok"
}

function verifyOneOrMore(edges: ReturnType<typeof findEdges>): verifyEdgesReturn {
    if (!edges.toFirstChild || !edges.fromFirstChild || !edges.childRightToLeft) {
        return "missing"
    }
    if (!!edges.childToChild || !!edges.toSecondChild || !!edges.fromSecondChild || !!edges.leftToRight) {
        return "tooMany"
    }
    return "ok"
}

function verifyZeroOrOne(edges: ReturnType<typeof findEdges>): verifyEdgesReturn {
    if (!edges.leftToRight || !edges.toFirstChild || !edges.fromFirstChild) {
        return "missing";
    }
    if (!!edges.toSecondChild || !!edges.fromSecondChild || !!edges.childToChild || !!edges.childRightToLeft) {
        return "tooMany"
    }
    return "ok"
}

function verifyZeroOrMore(edges: ReturnType<typeof findEdges>): verifyEdgesReturn {
    if (!edges.leftToRight || !edges.toFirstChild || !edges.fromFirstChild || !edges.childRightToLeft) {
        return "missing"
    }
    if (!!edges.toSecondChild || !!edges.fromSecondChild || !!edges.childToChild) {
        return "tooMany"
    }
    return "ok"
}
