import {Alert, Group} from "@mantine/core";
import React, {FunctionComponent, useEffect} from "react";
import steps from "@/tree_builder/domain/steps";
import useAppStateStore from "@/layout/stores/appStateStore";
import {useElementSize} from "@mantine/hooks";

export default function HintBar() {
    const solveStep = useAppStateStore(state => state.solveStep);
    const {ref, height} = useElementSize();

    useEffect(() => {
        document.documentElement.style.setProperty("--hint-bar-height", (height + 14).toString() + "px");
    }, [height])

    return <Alert color={"blue"} radius={0} ref={ref} py={6} styles={{message: {overflow: "visible"}, root: {flexShrink: 0}}}>
        <Group position={"apart"}>
            {React.createElement(steps[solveStep].helper as unknown as FunctionComponent)}
        </Group>
    </Alert>
}
