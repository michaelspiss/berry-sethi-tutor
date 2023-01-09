import React from 'react';
import {EdgeProps, Position} from 'reactflow';
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
                                     style = {},
                                     markerEnd,
                                 }: EdgeProps) {

    const theme = useMantineTheme();

    if (sourcePosition === Position.Left) {
        sourceX += 5;
    } else if (sourcePosition === Position.Right) {
        sourceX -= 5;
    }

    if (targetPosition === Position.Left) {
        targetX += 5;
    } else if (targetPosition === Position.Right) {
        targetX -= 5;
    }

    let path;
    if (sourceY === targetY) {
        const sign = sourceX < targetX && source === target ? 1 : -1;
        const curveDistance = sign * 40;
        path = `M ${sourceX} ${sourceY + sign * 2} C ${sourceX} ${sourceY + curveDistance}, ${targetX} ${targetY + curveDistance}, ${targetX} ${targetY + sign * 2}`
    } else if (sourceX === targetX) {
        const adjustment = sourceY > targetY ? 2 : -2;
        path = `M ${sourceX} ${sourceY} L ${targetX} ${targetY + adjustment}`
    } else {
        const isRightToLeft = sourceX > targetX;
        const isTopToBottom = sourceY < targetY;

        if (targetPosition === "right") {
            targetX += 2;
        }
        if (targetPosition === "left") {
            targetX -= 2;
        }

        if (isTopToBottom) {
            const reach = isRightToLeft ? 40 : 20;
            path = `M ${sourceX} ${sourceY} C ${targetX - reach} ${targetY}, ${targetX - 20} ${targetY - 5}, ${targetX} ${targetY}`
        } else {
            const reach = isRightToLeft ? 20 : 40;
            path = `M ${sourceX} ${sourceY} C ${targetX + reach} ${targetY}, ${targetX + 20} ${targetY + 5}, ${targetX} ${targetY}`
        }
    }

    return (
        <>
            <path
                id={id}
                style={{stroke: selected ? theme.colors.gray[9] : theme.colors.orange[5], ...style}}
                className="react-flow__edge-path"
                d={path}
                markerEnd={markerEnd}
            />
            <path d={path} strokeWidth={10} stroke={"transparent"} fill={"none"}/>
        </>
    );
}
