import ReactFlow, {Background, Controls, ReactFlowProvider} from "reactflow";

const Flow = () => {
    return <ReactFlow >
        <Background/>
        <Controls showInteractive={false}/>
    </ReactFlow>
}

export default function AutomatonPreview() {
    return <div style={{flexGrow: 1}}>
        <ReactFlowProvider>
            <Flow/>
        </ReactFlowProvider>
    </div>
}
