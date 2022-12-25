import React from "react";
import {IconAlertCircle} from "@tabler/icons";
import {Alert, useMantineTheme} from "@mantine/core";
import {useReactFlow} from "reactflow";

export default function DefaultError(props: { title: string, message: React.ReactElement, causes?: string[] }) {
    const reactFlow = useReactFlow();
    const theme = useMantineTheme();

    const showCauses = () => {
        reactFlow.setNodes(nodes => nodes.map(node => {
            if (!props.causes?.includes(node.id)) {
                return node;
            }
            return {
                ...node,
                style: {
                    background: theme.colors.red[6],
                }
            }
        }));
        reactFlow.setEdges(edges => edges.map(edge => {
            if (!props.causes?.includes(edge.id)) {
                return edge;
            }
            return {
                ...edge,
                style: {
                    stroke: theme.colors.red[6],
                }
            }
        }))
    }
    const hideCauses = () => {
        reactFlow.setNodes(nodes => nodes.map(node => {
            if (!props.causes?.includes(node.id)) {
                return node;
            }
            return {
                ...node,
                style: undefined,
            }
        }));
        reactFlow.setEdges(edges => edges.map(edge => {
            if (!props.causes?.includes(edge.id)) {
                return edge;
            }
            return {
                ...edge,
                style: undefined,
            }
        }))
    }

    return <Alert title={props.title}
                  icon={<IconAlertCircle size={16}/>}
                  color={"red"}
                  mt={"md"}
                  onMouseEnter={!!props.causes ? showCauses : undefined}
                  onMouseLeave={!!props.causes ? hideCauses : undefined}
    >
        {props.message}
    </Alert>;
}
