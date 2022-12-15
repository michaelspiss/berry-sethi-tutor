import React from "react";
import {IconAlertCircle} from "@tabler/icons";
import {Alert} from "@mantine/core";
import {useReactFlow} from "reactflow";

export default function DefaultError(props: { title: string, message: React.ReactElement, causes?: string[] }) {
    const reactFlow = useReactFlow();

    const showCauses = () => {
        reactFlow.setNodes(nodes => nodes.map(node => {
            if (!props.causes?.includes(node.id)) {
                return node;
            }
            return {
                ...node,
                style: {
                    background: "#f00"
                }
            }
        }));
        reactFlow.setEdges(edges => edges.map(edge => {
            if(!props.causes?.includes(edge.id)) {
                return edge;
            }
            return {
                ...edge,
                style: {
                    stroke: "#f00"
                }
            }
        }))
    }
    const hideCauses = () => {
        reactFlow.setNodes(nodes => nodes.map(node => {
            if(!props.causes?.includes(node.id)) {
                return node;
            }
            return {
                ...node,
                style: undefined,
            }
        }));
        reactFlow.setEdges(edges => edges.map(edge => {
            if(!props.causes?.includes(edge.id)) {
                return edge;
            }
            return {
                ...edge,
                style: undefined,
            }
        }))
    }

    return <div onMouseEnter={!!props.causes ? showCauses : undefined}
                onMouseLeave={!!props.causes ? hideCauses : undefined}>
        <Alert title={props.title}
               icon={<IconAlertCircle size={16}/>}
               color={"red"}
               mb={"md"}>
            {props.message}
        </Alert>
    </div>;
}
