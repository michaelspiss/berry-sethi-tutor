import 'reactflow/dist/style.css';
import {Background, Controls, ReactFlow} from "reactflow";
import React from "react";

import 'reactflow/dist/style.css'

export default function InteractiveTreeBuilder(): React.ReactElement {
    return <ReactFlow>
        <Background />
        <Controls />
    </ReactFlow>
}
