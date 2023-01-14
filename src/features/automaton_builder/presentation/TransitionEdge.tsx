import {useCallback} from "react";
import {BaseEdge, EdgeLabelRenderer, EdgeProps, Position, useStore} from "reactflow";

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(intersectionNode, targetNode) {
    // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
    const {
        width: intersectionNodeWidth,
        height: intersectionNodeHeight,
        positionAbsolute: intersectionNodePosition,
    } = intersectionNode;
    const targetPosition = targetNode.positionAbsolute;

    const w = intersectionNodeWidth / 2;
    const h = intersectionNodeHeight / 2;

    const x2 = intersectionNodePosition.x + w;
    const y2 = intersectionNodePosition.y + h;
    const x1 = targetPosition.x + w;
    const y1 = targetPosition.y + h;

    const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
    const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
    const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
    const xx3 = a * xx1;
    const yy3 = a * yy1;
    const x = w * (xx3 + yy3) + x2;
    const y = h * (-xx3 + yy3) + y2;

    return { x, y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node, intersectionPoint) {
    const n = { ...node.positionAbsolute, ...node };
    const nx = Math.round(n.x);
    const ny = Math.round(n.y);
    const px = Math.round(intersectionPoint.x);
    const py = Math.round(intersectionPoint.y);

    if (px <= nx + 1) {
        return Position.Left;
    }
    if (px >= nx + n.width - 1) {
        return Position.Right;
    }
    if (py <= ny + 1) {
        return Position.Top;
    }
    if (py >= n.y + n.height - 1) {
        return Position.Bottom;
    }

    return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source, target) {
    const sourceIntersectionPoint = getNodeIntersection(source, target);
    const targetIntersectionPoint = getNodeIntersection(target, source);

    const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
    const targetPos = getEdgePosition(target, targetIntersectionPoint);

    return {
        sx: sourceIntersectionPoint.x,
        sy: sourceIntersectionPoint.y,
        tx: targetIntersectionPoint.x,
        ty: targetIntersectionPoint.y,
        sourcePos,
        targetPos,
    };
}

export default function TransitionEdge(props: EdgeProps) {
    const {sourceX, sourceY} = props;

    let path : string;
    let labelX: number;
    let labelY: number;

    if(props.source === props.target) {
        path = `M ${sourceX-5} ${sourceY+21} C ${sourceX-10} ${sourceY + 60}, ${sourceX - 40} ${sourceY + 50}, ${sourceX - 16} ${sourceY+16}`;
        labelX = sourceX - 25;
        labelY = sourceY + 45;
    } else {
        const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(props.source), [props.source]));
        const targetNode = useStore(useCallback((store) => store.nodeInternals.get(props.target), [props.target]));

        const {sx, sy, tx, ty} = getEdgeParams(sourceNode, targetNode);

        const xDelta = Math.max(sx,tx) - Math.min(sx,tx);
        const yDelta = Math.max(sy,ty) - Math.min(sy,ty);


        const sign = sx > tx ? -1 : 1;

        const perpendicularX = yDelta;
        const perpendicularY = -xDelta;

        const middleX = sx + sign * (xDelta/2 + perpendicularX/2);
        labelX = sx + sign * (xDelta/2 + perpendicularX/4);
        const middleY = sy + sign * (yDelta/2 + perpendicularY/2);
        labelY = sy + sign * (yDelta/2 + perpendicularY/4);

        path = `M ${sx} ${sy} Q ${middleX} ${middleY}, ${tx} ${ty}`;
    }


    // TODO: move labels more towards edge
    return <>
        <BaseEdge path={path} {...props} />
        <EdgeLabelRenderer>
            <div style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                background: 'rgba(255,255,255,1)',
                color: "#000",
                border: "1px solid #aaa",
                padding: 5,
                borderRadius: 5,
                fontSize: 10,
                lineHeight: .8,
            }}>
                {props.label}
            </div>
        </EdgeLabelRenderer>
    </>
}
