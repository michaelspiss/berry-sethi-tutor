import 'reactflow/dist/style.css';
import {
    addEdge,
    Background,
    Connection,
    Controls,
    Edge,
    Panel,
    ReactFlow, ReactFlowInstance,
    useEdgesState,
    useNodesState
} from "reactflow";
import React, {DragEventHandler, useCallback, useRef, useState} from "react";

import 'reactflow/dist/style.css'
import TreeElementsPanel from "@/tree_builder/presentation/TreeElementsPanel";
import OperatorNode from "@/tree_builder/presentation/OperatorNode";
import TerminalNode from "@/tree_builder/presentation/TerminalNode";
import useNodeStyles from "@/tree_builder/presentation/useNodeStyles";

function getId() {
    return `node_${+new Date()}`
}

const nodeTypes = {
    operator: OperatorNode,
    terminal: TerminalNode
}

/**
 * Displays a canvas which displays the tree and with which the user is able to alter interactively via drag and drop
 * @constructor
 */
export default function InteractiveTreeBuilder(): React.ReactElement {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance|null>(null);
    const {classes, cx} = useNodeStyles();

    const onConnect = useCallback((params: Edge | Connection) =>
            setEdges((edges) => addEdge(params, edges)),
        [],
    );

    const onDragOver : DragEventHandler = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop : DragEventHandler = useCallback((event) => {
        event.preventDefault();
        const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/berrysethitutor');

        if (!type || !reactFlowBounds || !reactFlowInstance) {
            return
        }

        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left - 40,
            y: event.clientY - reactFlowBounds.top - 40,
        });

        const id = getId();

        const newNode = {
            id: id,
            position,
            data: {label: id},
            type: type,
            className: cx(classes.node, type === 'operator' ? classes.operatorNode : classes.terminalNode)
        }

        setNodes((nodes) => nodes.concat(newNode));
    }, [reactFlowInstance])

    return <div style={{height: "100%", width: "100%"}} ref={reactFlowWrapper}><ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView>
        <Background/>
        <Controls/>
        <Panel position={"bottom-center"}>
            <TreeElementsPanel/>
        </Panel>
    </ReactFlow></div>
}
