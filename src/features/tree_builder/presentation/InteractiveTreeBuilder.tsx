import 'reactflow/dist/style.css';
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Connection,
    ConnectionLineType,
    ConnectionMode,
    Controls,
    Edge,
    EdgeChange,
    NodeChange,
    Panel,
    ReactFlow,
    ReactFlowInstance,
    ReactFlowProvider
} from "reactflow";
import React, {DragEventHandler, useCallback, useRef, useState} from "react";
import TreeElementsPanel from "@/tree_builder/presentation/TreeElementsPanel";
import OperatorNode from "@/tree_builder/presentation/OperatorNode";
import TerminalNode from "@/tree_builder/presentation/TerminalNode";
import useNodeStyles from "@/tree_builder/presentation/useNodeStyles";
import steps from "@/tree_builder/domain/steps";
import useAppStateStore from "@/layout/stores/appStateStore";
import VerificationErrors from "@/tree_builder/presentation/VerificationErrors";
import PathEdge from "@/tree_builder/presentation/PathEdge";
import ArrowMarker from "@/tree_builder/presentation/ArrowMarker";
import useTree from "@/tree_builder/domain/useTree";

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

const Flow = (props: { reactFlowWrapper: React.RefObject<HTMLDivElement> }) => {
    const {nodes, edges, setNodes, setEdges} = useTree();
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const {classes, cx} = useNodeStyles();
    const solveStep = useAppStateStore((state) => state.solveStep);
    const disableSelect = useAppStateStore(state => state.disableSelect);

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

    const onNodesChange = useCallback((changes: NodeChange[]) =>
        setNodes(nodes => applyNodeChanges(changes, nodes)),
        [setNodes])

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
        const reactFlowBounds = props.reactFlowWrapper.current?.getBoundingClientRect();
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

    return <ReactFlow
        id={"syntax-tree"}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={(instance) => {
            setReactFlowInstance(instance);
            useTree.setState({reactFlow: instance});
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={(_, node) => steps[solveStep].onNodeClick?.call(null, node, reactFlowInstance!)}
        selectNodesOnDrag={false}
        elementsSelectable={steps[solveStep]?.canSelectElements && !disableSelect}
        onPaneClick={() => disableSelect && useAppStateStore.setState({disableSelect: false})}
        nodesDraggable={steps[solveStep]?.canMoveNodes}
        nodesConnectable={steps[solveStep]?.canConnectNodes}
        nodesFocusable={steps[solveStep]?.canEditNodes}
        connectionMode={steps[solveStep]?.canSourceConnectToSource ? ConnectionMode.Loose : ConnectionMode.Strict}
        deleteKeyCode={steps[solveStep]?.canEditNodes || steps[solveStep]?.canConnectNodes ? ['Backspace', 'Delete'] : null}
        selectionKeyCode={null}
        zoomOnDoubleClick={false}
        connectionLineType={solveStep === 0 ? ConnectionLineType.Bezier : ConnectionLineType.Straight}
        multiSelectionKeyCode={null}>
        <Background/>
        <Controls showInteractive={false}/>
        <Panel position={"top-right"} style={{maxHeight: "100%", paddingBottom: 0}}>
            {solveStep !== 7 && <VerificationErrors/>}
        </Panel>
        <Panel position={"bottom-center"}>
            {steps[solveStep]?.canEditNodes ? <TreeElementsPanel/> : null}
        </Panel>
    </ReactFlow>
}

/**
 * Displays a canvas which displays the tree and with which the user is able to alter interactively via drag and drop
 * @constructor
 */
export default function InteractiveTreeBuilder(): React.ReactElement {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    return <div style={{flexGrow: 1}} ref={reactFlowWrapper}>
        <ArrowMarker/>
        <ReactFlowProvider>
            <Flow reactFlowWrapper={reactFlowWrapper}/>
        </ReactFlowProvider>
    </div>
}
