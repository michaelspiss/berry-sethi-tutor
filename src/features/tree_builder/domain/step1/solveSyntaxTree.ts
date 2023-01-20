import {Edge, Node} from "reactflow";
import {SolverResult} from "@/tree_builder/domain/steps";
import useAppStateStore from "@/layout/stores/appStateStore";
import {RegexTreeGroup, RegexTreeItem, RegexTreeQuantifier} from "@/analyze_regex/domain/models/regexTree";
import operatorSymbols from "@/tree_builder/domain/operatorSymbols";

let index = 0;

export default function solveSyntaxTree(nodes: Node[], edges: Edge[]): SolverResult {
    index = 0;
    const model = useAppStateStore.getState().regexModel;
    return buildTreeFromModel(model!);
}

/**
 * Adds a new node to the nodes array
 * @param nodes
 * @param id
 * @param symbol
 * @param type
 */
function addNode(nodes: Node[], id: string, symbol: string, type: string) {
    nodes.push({
        id: id,
        position: {x: index++, y: 0},
        data: {
            label: symbol,
        },
        type: type,
    })
}

/**
 * Adds a new edge to the edges array
 * @param edges
 * @param parentId
 * @param childId
 */
function addEdge(edges: Edge[], parentId: string, childId: string) {
    edges.push({
        id: parentId + "-" + childId + "step1b_step1t",
        source: parentId,
        target: childId,
        sourceHandle: "step1b",
        targetHandle: "step1t",
        data: {
            step: 0,
        }
    })
}

/**
 * Splits an n-ary operator group into binary representation.
 * @param group
 * @param id
 */
function getGroupAsBinaryTree(group: RegexTreeGroup, id: string): SolverResult {
    const groupSymbol = group.getItemAsSymbol();
    const treeData : SolverResult = {nodes: [], edges: []};

    const length = Math.max(group.children.length - 2, 0);
    const groupNodeIds = [id].concat([...Array(length).keys()].map(i => id + "." + i))

    for (let i = 0; i < groupNodeIds.length - 1; i++) {
        addEdge(treeData.edges, groupNodeIds[i], groupNodeIds[i + 1]);
    }

    for (let i = 0; i < group.children.length; i++) {
        const childTree = buildTreeFromModel(group.children[i], groupNodeIds[i] ?? groupNodeIds.pop());
        treeData.nodes = treeData.nodes.concat(childTree.nodes);
        treeData.edges = treeData.edges.concat(childTree.edges);
    }

    for (let i = 0; i < group.children.length - 2; i++) {
        addNode(treeData.nodes, id + "." + i, groupSymbol, "operator");
    }

    return treeData;
}

/**
 * Returns the graph which can be built from the model.
 * @param model
 * @param parent
 */
function buildTreeFromModel(model: RegexTreeItem, parent?: string): SolverResult {
    const id = `node_${Math.random()}`;
    const symbol = model.getItemAsSymbol();

    let syntaxTreeData: { nodes: Node[], edges: Edge[] } = {nodes: [], edges: []};

    if (model instanceof RegexTreeQuantifier) {
        syntaxTreeData = buildTreeFromModel(model.child, id);
    } else if (model instanceof RegexTreeGroup) {
        syntaxTreeData = getGroupAsBinaryTree(model, id);
    }

    const type = operatorSymbols.includes(symbol) ? 'operator' : 'terminal';

    addNode(syntaxTreeData.nodes, id, symbol, type);

    if (parent !== undefined) {
        addEdge(syntaxTreeData.edges, parent, id);
    }

    return syntaxTreeData;
}
