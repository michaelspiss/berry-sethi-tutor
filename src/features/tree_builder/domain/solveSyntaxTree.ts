import {Edge, Node} from "reactflow";
import {SolverResult} from "@/tree_builder/domain/steps";
import useAppStateStore from "@/layout/stores/appStateStore";
import {
    RegexTreeGroup,
    RegexTreeItem,
    RegexTreeQuantifier
} from "@/analyze_regex/domain/models/regexTree";

export default function solveSyntaxTree(nodes: Node[], edges: Edge[]): SolverResult {
    const model = useAppStateStore.getState().regexModel;
    return buildTreeFromModel(model!);
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
            id: parent + "-" + id + "step1b_step1t",
            source: parent,
            target: id,
            sourceHandle: "step1b",
            targetHandle: "step1t",
            data: {
                step: 0,
            }
        })
    }

    return syntaxTreeData;
}

