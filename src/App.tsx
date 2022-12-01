import {AppShell, Center, Header, MantineProvider} from '@mantine/core';
import {useState} from "react";
import RegexInputScreen from "@/layout/presentation/screens/RegexInputScreen";
import mantineThemeOther from "./configuration/mantineThemeOther";


export default function App() {
    const [activeStep, setActiveStep] = useState(4);

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{
            other: mantineThemeOther,
        }}>
            <AppShell header={
                <Header height={mantineThemeOther.headerHeight} px={"xs"}>
                    <Center style={{height: mantineThemeOther.headerHeight}} inline>Berry Sethi Tutor</Center>
                </Header>
            }>
                <RegexInputScreen />
            </AppShell>
        </MantineProvider>
    );
}
