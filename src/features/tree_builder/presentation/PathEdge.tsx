import React from 'react';
import {EdgeProps} from 'reactflow';
import {useMantineTheme} from "@mantine/core";
import * as path from "path";

export default function PathEdge({
                                     id,
                                     sourceX,
                                     sourceY,
                                     targetX,
                                     targetY,
                                     source,
                                     target,
                                     selected,
                                     sourcePosition,
                                     targetPosition,
                                     sourceHandleId,
                                     targetHandleId,
                                     style = {},
                                     markerEnd,
                                 }: EdgeProps) {

    const theme = useMantineTheme();

    if (sourceY === targetY) {
        if (sourceX < targetX && source === target) {
            sourceX += 5;
            targetX -= 5;
            sourceY += 5;
            targetY += 5;
        } else {
            sourceX -= 5;
            targetX += 5;
            sourceY -= 5;
            targetY -= 5;
        }
        const curveDistance = sourceX < targetX && source === target ? 38 : -38;

        return <>
            <path id={id}
                  style={{stroke: selected ? theme.colors.gray[9] : theme.colors.orange[5], ...style}}
                  className="react-flow__edge-path"
                  markerEnd={markerEnd}
                  d={`M ${sourceX} ${sourceY} C ${sourceX} ${sourceY + curveDistance}, ${targetX} ${targetY + curveDistance}, ${targetX} ${targetY}`}
            />
        </>
    }

    if (sourceHandleId === "step2l" && targetHandleId === "step2l" && sourceX === targetX) {
        sourceX += 5;
        targetX += 5;
        sourceY -= 5;
        targetY -= 5;
    }
    if (sourceHandleId === "step2r" && targetHandleId === "step2r" && sourceX === targetX) {
        sourceX -= 5;
        targetX -= 5;
        sourceY -= 5;
        targetY += 5;
    }

    const path = sourceX === targetX
        ? `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`
        : sourceY < targetY
            ? `M ${sourceX} ${sourceY + 2} C ${sourceX - 20} ${sourceY + 20}, ${targetX - 20} ${targetY - 20}, ${targetX} ${targetY - 2}`
            : `M ${sourceX} ${sourceY - 2} C ${sourceX + 20} ${sourceY - 20}, ${targetX + 20} ${targetY + 20}, ${targetX} ${targetY + 2}`

    return (
        <>
            <path
                id={id}
                style={{stroke: selected  ? theme.colors.gray[9] : theme.colors.orange[5], ...style}}
                className="react-flow__edge-path"
                d={path}
                markerEnd={markerEnd}
            />
        </>
    );
}
