import verifySyntaxTree from "@/tree_builder/domain/step1/verifySyntaxTree";
import {Edge, Node, ReactFlowInstance} from "reactflow";
import solveSyntaxTree from "@/tree_builder/domain/step1/solveSyntaxTree";
import layOutSyntaxTree from "@/tree_builder/domain/layOutSyntaxTree";
import React, {ReactNode} from "react";
import {NonEmptyArray} from "../../../configuration/helperTypes";
import solvePossiblePaths from "@/tree_builder/domain/step2/solvePossiblePaths";
import verifyPossiblePaths from "@/tree_builder/domain/step2/verifyPossiblePaths";
import solveEnumerateLeaves from "@/tree_builder/domain/step3/solveEnumerateLeaves";
import solveCanBeEmpty from "@/tree_builder/domain/step4/solveCanBeEmpty";
import solveFirstReachedStates from "@/tree_builder/domain/step5/solveFirstReachedStates";
import solveNextReachedStates from "@/tree_builder/domain/step6/solveNextReachedStates";
import solveLastReached from "@/tree_builder/domain/step7/solveLastReached";
import SyntaxTreeHelper from "@/tree_builder/domain/step1/SyntaxTreeHelper";
import PossiblePathsHelper from "@/tree_builder/domain/step2/PossiblePathsHelper";
import EnumerateLeavesHelper from "@/tree_builder/domain/step3/EnumerateLeavesHelper";
import CanBeEmptyHelper from "@/tree_builder/domain/step4/CanBeEmptyHelper";
import FirstReachedStatesHelper from "@/tree_builder/domain/step5/FirstReachedStatesHelper";
import NextReachedStatesHelper from "@/tree_builder/domain/step6/NextReachedStatesHelper";
import LastReachedStatesHelper from "@/tree_builder/domain/step7/LastReachedStatesHelper";
import CreateAutomatonHelper from "@/tree_builder/domain/step8/CreateAutomatonHelper";
import enumerateLeavesOnClickHandler from "@/tree_builder/domain/step3/enumerateLeavesOnClickHandler";
import verifyEnumerateLeaves from "@/tree_builder/domain/step3/verifyEnumerateLeaves";
import useEnumerateLeaves from "@/tree_builder/domain/step3/useEnumerateLeaves";
import canBeEmptyOnClickHandler from "@/tree_builder/domain/step4/canBeEmptyOnClickHandler";
import verifyCanBeEmpty from "@/tree_builder/domain/step4/verifyCanBeEmpty";
import useAppStateStore from "@/layout/stores/appStateStore";
import clickNode from "@/tree_builder/domain/step5/clickNode";
import verifyFirstReached from "@/tree_builder/domain/step5/verifyFirstReached";
import verifyNextReached from "@/tree_builder/domain/step6/verifyNextReached";
import verifyLastReached from "@/tree_builder/domain/step7/verifyLastReached";
import useTree from "@/tree_builder/domain/useTree";
import solveBuildAutomaton from "@/tree_builder/domain/step8/solveBuildAutomaton";
import verifyAutomaton from "@/tree_builder/domain/step8/verifyAutomaton";

interface StepDescription {
    title: string,
    verifier: (nodes: Node[], edges: Edge[]) => VerificationResult,
    solver: (nodes: Node[], edges: Edge[]) => SolverResult,
    /**
     * Content returned in the helper bar
     */
    helper: () => ReactNode,
    onNodeClick?: (node: Node, reactFlow: ReactFlowInstance) => void,
    prepare?: (nodes: Node[], edges: Edge[]) => void,
    /**
     * Called if either validator returns true or solver is run
     * @param nodes
     * @param edges
     */
    cleanup: (nodes: Node[], edges: Edge[]) => void,
    canMoveNodes: boolean,
    canEditNodes: boolean,
    canConnectNodes: boolean,
    canSourceConnectToSource: boolean,
    canSelectElements: boolean,
}

export interface VerificationError {
    title: string,
    message: React.ReactElement,
    /**
     * Node or edge ids which caused the error
     */
    causes?: string[],
}

export interface VerificationResult {
    nodes: Node[],
    edges: Edge[],
    errors?: NonEmptyArray<VerificationError>,
}

export interface SolverResult {
    nodes: Node[],
    edges: Edge[],
}

function makeEdgesStaticCleanUp(edges: Edge[]) {
    edges.map((edge) => {
        edge.focusable = false;
        edge.interactionWidth = 0;
        edge.selected = false;
        edge.style = {pointerEvents: "none"};
        return edge
    });
}

function defaultNodeCleanUp(nodes: Node[]) {
    nodes.forEach(node => {
        node.selected = false;
        node.style = undefined;
    })
    useAppStateStore.setState({disableSelect: false});
}

const steps: StepDescription[] = [
    {
        // Step 1
        title: "Create syntax tree",
        verifier: verifySyntaxTree,
        solver: solveSyntaxTree,
        helper: SyntaxTreeHelper,
        cleanup: (nodes, edges) => {
            layOutSyntaxTree(nodes, edges);
            makeEdgesStaticCleanUp(edges);
            defaultNodeCleanUp(nodes);
        },
        canMoveNodes: true,
        canEditNodes: true,
        canConnectNodes: true,
        canSourceConnectToSource: false,
        canSelectElements: true,
    }, {
        // Step 2
        title: "Draw possible paths",
        cleanup: (nodes, edges) => {
            makeEdgesStaticCleanUp(edges);
            defaultNodeCleanUp(nodes);
        },
        solver: solvePossiblePaths,
        helper: PossiblePathsHelper,
        verifier: verifyPossiblePaths,
        onNodeClick: (node, rf) => rf.setNodes(nodes => nodes.map(n => n.id !== node.id ? n : {...n, selected: false})),
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: true,
        canSourceConnectToSource: true,
        canSelectElements: true,
    }, {
        // Step 3
        title: "Enumerate leaves",
        solver: solveEnumerateLeaves,
        helper: EnumerateLeavesHelper,
        onNodeClick: enumerateLeavesOnClickHandler,
        verifier: verifyEnumerateLeaves,
        prepare: () => useEnumerateLeaves.setState({nextIndex: 0}),
        cleanup: (nodes) => {
            defaultNodeCleanUp(nodes);
        },
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: false,
        canSourceConnectToSource: true,
        canSelectElements: false,
    }, {
        // Step 4
        title: "Set empty attributes",
        solver: solveCanBeEmpty,
        verifier: verifyCanBeEmpty,
        helper: CanBeEmptyHelper,
        prepare: (nodes) => nodes.forEach(node => node.data.canBeEmpty = true),
        onNodeClick: canBeEmptyOnClickHandler,
        cleanup: (nodes) => defaultNodeCleanUp(nodes),
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: false,
        canSourceConnectToSource: true,
        canSelectElements: false,
    }, {
        // Step 5
        title: "Collect may-set of first reached read states",
        solver: solveFirstReachedStates,
        helper: FirstReachedStatesHelper,
        verifier: verifyFirstReached,
        onNodeClick: (node, reactFlow) => clickNode(node, reactFlow, "firstReached"),
        prepare: (nodes) => nodes.forEach(node => node.data.firstReached = []),
        cleanup: (nodes) => defaultNodeCleanUp(nodes),
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: false,
        canSourceConnectToSource: true,
        canSelectElements: true,
    }, {
        // Step 6
        title: "Collect may-set of next reached read states",
        solver: solveNextReachedStates,
        helper: NextReachedStatesHelper,
        verifier: verifyNextReached,
        onNodeClick: (node, reactFlow) => clickNode(node, reactFlow, "nextReached"),
        prepare: (nodes) => nodes.forEach(node => node.data.nextReached = []),
        cleanup: (nodes) => defaultNodeCleanUp(nodes),
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: false,
        canSourceConnectToSource: true,
        canSelectElements: true,
    }, {
        // Step 7
        title: "Collect may-set of last reached read states",
        solver: solveLastReached,
        helper: LastReachedStatesHelper,
        verifier: verifyLastReached,
        onNodeClick: (node, reactFlow) => clickNode(node, reactFlow, "lastReached"),
        prepare: (nodes) => nodes.forEach(node => node.data.lastReached = []),
        cleanup: (nodes) => defaultNodeCleanUp(nodes),
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: false,
        canSourceConnectToSource: true,
        canSelectElements: true,
    }, {
        // Step 8
        title: "Create automaton",
        helper: CreateAutomatonHelper,
        prepare: () => {
            const center = setTimeout(() => {
                const treeReactFlow = useTree.getState().reactFlow;
                treeReactFlow?.fitView();
                treeReactFlow?.zoomOut();
            }, 200);
            return () => clearTimeout(center);
        },
        verifier: verifyAutomaton,
        solver: solveBuildAutomaton,
        cleanup: () => {},
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: false,
        canSourceConnectToSource: true,
        canSelectElements: false,
    }
]


export default steps
