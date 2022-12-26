import {Edge, Node} from "reactflow"
import {VerificationResult} from "@/tree_builder/domain/steps";
import graphToTreeModel from "@/tree_builder/domain/step1/graphToTreeModel";
import compareTreeModels from "@/tree_builder/domain/compareTreeModels";
import useAppStateStore from "@/layout/stores/appStateStore";
import {RegexTreeTerminal} from "@/analyze_regex/domain/models/regexTree";
import {Kbd} from "@mantine/core";

export default function verifyEnumerateLeaves(nodes: Node[], edges: Edge[]) : VerificationResult {
    const terminals = nodes.filter(node => node.type === "terminal");

    const not_defined = terminals.filter(node => typeof node.data.terminalIndex !== "number");
    if(not_defined.length !== 0) {
        return {
            nodes,
            edges,
            errors: [{
                title: "Some terminals do not have an index yet",
                message: <>At the end of this step, all terminals must have a unique id. Try finding the missing ones.</>,
                causes: not_defined.map(node => node.id),
            }]
        }
    }

    const rootNode = nodes.find(node => edges.filter(edge => edge.data.step === 0 && edge.target === node.id).length === 0)!;
    const treeModel = graphToTreeModel(rootNode, nodes, edges);

    const wrongIndex = compareTreeModels(useAppStateStore.getState().regexModel!, treeModel, (t, u) => {
        if(!(t instanceof RegexTreeTerminal)) {
            return true;
        }
        return t.index === (u as RegexTreeTerminal).index;
    });

    if(wrongIndex.length !== 0) {
        const wrongIndices = wrongIndex.map(i => (i as RegexTreeTerminal).index);
        return {
            nodes, edges, errors: [{
                title: "Incorrect order",
                message: <>Some of your terminal identifiers are in incorrect order. They should be ascending, in the order they appear in the regex. Press <Kbd>Esc</Kbd> to restart</>,
                causes: nodes.filter(node => wrongIndices.includes(node.data?.terminalIndex)).map(node => node.id),
            }]
        }
    }

    return {nodes, edges};
}
