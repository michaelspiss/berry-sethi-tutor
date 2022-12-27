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
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: true,
        canSourceConnectToSource: true,
    }, {
        // Step 3
        title: "Enumerate leaves",
        solver: solveEnumerateLeaves,
        helper: EnumerateLeavesHelper,
        onNodeClick: enumerateLeavesOnClickHandler,
        verifier: verifyEnumerateLeaves,
        prepare: () => useEnumerateLeaves.setState({nextIndex: 0}),
        cleanup: (nodes) => {
            useEnumerateLeaves.destroy();
            defaultNodeCleanUp(nodes);
        },
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: false,
        canSourceConnectToSource: true,
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
    }, {
        // Step 5
        title: "Collect may-set of first reached states",
        solver: solveFirstReachedStates,
        helper: FirstReachedStatesHelper,
        cleanup: (nodes) => defaultNodeCleanUp(nodes),
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: false,
        canSourceConnectToSource: true,
    }, {
        // Step 6
        title: "Collect may-set of next reached read states per subtree",
        solver: solveNextReachedStates,
        helper: NextReachedStatesHelper,
        cleanup: (nodes) => defaultNodeCleanUp(nodes),
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: false,
        canSourceConnectToSource: true,
    }, {
        // Step 7
        title: "Collect may-set of last reached read states per subtree",
        solver: solveLastReached,
        helper: LastReachedStatesHelper,
        cleanup: (nodes) => defaultNodeCleanUp(nodes),
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: false,
        canSourceConnectToSource: true,
    }, {
        // Step 8
        title: "Create automaton",
        helper: CreateAutomatonHelper,
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: false,
        canSourceConnectToSource: true,
    }
]


export default steps
