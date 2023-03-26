import {Center, Text} from "@mantine/core";

export default function Attribution() {
    return <Center sx={{flexWrap: "nowrap", flexDirection: "column"}}>
        <svg width="120" height="63" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 73 38">
            <path d="M28 0v31h8V0h37v38h-7V7h-8v31h-7V7h-8v31H21V7h-7v31H7V7H0V0h28z" fill="rgb(48, 112, 179)"></path>
        </svg>
        <Text size={14} align={"center"}>
            Technical University of Munich<br/>
            <br/>
            Bachelor's Thesis in Informatics for the course Compiler Construction at the chair I2<br/>
            <br/>
            By Michael Spiss, advised by Dr. Michael Petter
        </Text>
    </Center>
}