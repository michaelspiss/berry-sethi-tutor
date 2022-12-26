import 'reactflow/dist/style.css';
import {
    addEdge,
    applyEdgeChanges,
    Background,
    Connection,
    ConnectionLineType,
    ConnectionMode,
    Controls,
    Edge,
    EdgeChange,
    Panel,
    ReactFlow,
    ReactFlowInstance,
    useNodesState
} from "reactflow";
import React, {DragEventHandler, FunctionComponent, useCallback, useRef, useState} from "react";
import TreeElementsPanel from "@/tree_builder/presentation/TreeElementsPanel";
import OperatorNode from "@/tree_builder/presentation/OperatorNode";
import TerminalNode from "@/tree_builder/presentation/TerminalNode";
import useNodeStyles from "@/tree_builder/presentation/useNodeStyles";
import steps from "@/tree_builder/domain/steps";
import useAppStateStore from "@/layout/stores/appStateStore";
import VerificationErrors from "@/tree_builder/presentation/VerificationErrors";
import {Alert, Group} from "@mantine/core";
import PathEdge from "@/tree_builder/presentation/PathEdge";
import ArrowMarker from "@/tree_builder/presentation/ArrowMarker";

function getId() {
    return `node_${+new Date()}`
}

const nodeTypes = {
    operator: OperatorNode,
    terminal: TerminalNode
}

const edgeTypes = {
    pathEdge: PathEdge,
}

/**
 * Displays a canvas which displays the tree and with which the user is able to alter interactively via drag and drop
 * @constructor
 */
export default function InteractiveTreeBuilder(): React.ReactElement {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const {classes, cx} = useNodeStyles();
    const solveStep = useAppStateStore((state) => state.solveStep);

    const onConnect = useCallback((params: Edge | Connection) => {
            setEdges((edges) => addEdge({
                ...params,
                id: params.source + "-" + params.target + params.sourceHandle + params.targetHandle,
                data: {
                    step: solveStep,
                },
                markerEnd: solveStep !== 1 ? undefined : "arrowMarker",
                type: solveStep !== 1 ? undefined : "pathEdge",
            }, edges))
        }, [edges, solveStep, setEdges],
    );

    const onEdgesChange = useCallback((changes: EdgeChange[]) =>
            // TODO: prevent changes to edges from a previous step
            setEdges((edges) => applyEdgeChanges(changes, edges)),
        [setEdges, solveStep]
    );

    const onDragOver: DragEventHandler = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop: DragEventHandler = useCallback((event) => {
        event.preventDefault();
        const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/berrysethitutor');

        if (!type || !reactFlowBounds || !reactFlowInstance) {
            return
        }

        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left - 20,
            y: event.clientY - reactFlowBounds.top - 20,
        });

        const id = getId();

        setNodes((nodes) => nodes.map((node) => {
            if (node.selected) {
                return {
                    ...node,
                    selected: false,
                }
            }
            return node
        }));

        const newNode = {
            id: id,
            position,
            data: {
                label: "",
                deleteNode: () => setNodes((nodes) => nodes.filter((node) => node.id !== id)),
                setLabel: (newLabel: string) => setNodes((nodes) => nodes.map((node) => {
                    if (node.id === id) {
                        node.data = {
                            ...node.data,
                            label: newLabel,
                        }
                    }
                    return node;
                })),
            },
            type: type,
            selected: true,
            className: cx(classes.node, type === 'operator' && classes.operatorNode)
        }

        setNodes((nodes) => nodes.concat(newNode));
    }, [reactFlowInstance])

    return <div style={{height: "100%", width: "100%", display: "flex", flexDirection: "column"}}>
        <Alert color={"blue"} radius={0} py={6} styles={{message: {overflow: "visible"}}}>
            <Group position={"apart"}>
                {React.createElement(steps[solveStep].helper as unknown as FunctionComponent)}
            </Group>
        </Alert>
        <div style={{flexGrow: 1}} ref={reactFlowWrapper}>
            <ArrowMarker />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDragOver={onDragOver}
                onDrop={onDrop}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                selectNodesOnDrag={false}
                nodesDraggable={steps[solveStep].canMoveNodes}
                nodesConnectable={steps[solveStep].canConnectNodes}
                nodesFocusable={steps[solveStep].canEditNodes}
                connectionMode={steps[solveStep].canSourceConnectToSource ? ConnectionMode.Loose : ConnectionMode.Strict}
                deleteKeyCode={['Backspace', 'Delete']}
                selectionKeyCode={null}
                connectionLineType={solveStep === 0 ? ConnectionLineType.Bezier : ConnectionLineType.Straight}
                multiSelectionKeyCode={null}>
                <Background/>
                <Controls showInteractive={false}/>
                <Panel position={"top-right"} style={{height: "100%", paddingBottom: 0}}>
                    <VerificationErrors/>
                </Panel>
                <Panel position={"bottom-center"}>
                    {steps[solveStep].canEditNodes ? <TreeElementsPanel/> : null}
                </Panel>
            </ReactFlow>
        </div>
    </div>
}
