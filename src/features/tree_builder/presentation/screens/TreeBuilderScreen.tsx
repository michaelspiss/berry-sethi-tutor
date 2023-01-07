import HintBar from "@/layout/presentation/HintBar";
import InteractiveTreeBuilder from "@/tree_builder/presentation/InteractiveTreeBuilder";

export default function TreeBuilderScreen() {
    return <div style={{height: "100%", width: "100%", display: "flex", flexDirection: "column"}}>
        <HintBar/>
        <InteractiveTreeBuilder/>
    </div>
}
