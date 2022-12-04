import React from "react";
import {IconAlertCircle} from "@tabler/icons";
import {Alert} from "@mantine/core";

export default function DefaultError(props: {title: string, message: React.ReactElement}) {
    return <Alert title={props.title} icon={<IconAlertCircle size={16}/>} color={"red"} mb={"md"}>
        {props.message}
    </Alert>;
}
