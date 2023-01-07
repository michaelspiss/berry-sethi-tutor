import {Alert, Group} from "@mantine/core";
import React, {FunctionComponent} from "react";
import steps from "@/tree_builder/domain/steps";
import useAppStateStore from "@/layout/stores/appStateStore";

export default function HintBar() {
    const solveStep = useAppStateStore(state => state.solveStep)

    return <Alert color={"blue"} radius={0} py={6} styles={{message: {overflow: "visible"}}}>
        <Group position={"apart"}>
            {React.createElement(steps[solveStep].helper as unknown as FunctionComponent)}
        </Group>
    </Alert>
}
