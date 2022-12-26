import {ActionIcon, AppShell, Center, Group, Header, MantineProvider, Navbar, ScrollArea, Tooltip} from '@mantine/core';
import mantineThemeOther from "./configuration/mantineThemeOther";
import useAppStateStore from "@/layout/stores/appStateStore";
import StepsProgress from "@/layout/presentation/StepsProgress";
import RegexInputScreen from "@/analyze_regex/presentation/screens/RegexInputScreen";
import InteractiveTreeBuilder from "@/tree_builder/presentation/InteractiveTreeBuilder";
import {IconAlertTriangle, IconArrowBack} from "@tabler/icons";
import RegexHighlighter from "@/analyze_regex/presentation/RegexHighlighter";
import {ReactFlowProvider} from "reactflow";
import SolveButton from "@/tree_builder/presentation/SolveButton";
import VerifyTreeButton from "@/tree_builder/presentation/VerifyTreeButton";

export default function App() {
    const solveStep = useAppStateStore((state) => state.solveStep);
    const regexValue = useAppStateStore((state) => state.regex);
    const isSimplified = useAppStateStore(state => state.isSimplified);

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{
            other: mantineThemeOther,
        }}>
            <ReactFlowProvider>
                <AppShell padding={0}
                          header={
                              <Header height={mantineThemeOther.headerHeight} px={"xs"}>
                                  <Group position={"apart"}>
                                      <Center style={{height: mantineThemeOther.headerHeight}} inline>
                                          {solveStep === -1 ? null :
                                              <ActionIcon onClick={() => useAppStateStore.setState({
                                                  solveStep: -1,
                                                  isSimplified: false,
                                                  verificationErrors: undefined
                                              })}>
                                                  <IconArrowBack size={16}/>
                                              </ActionIcon>
                                          }
                                          <span>Berry Sethi Tutor</span>
                                      </Center>
                                      {solveStep === -1 ? null : <>
                                          <Center style={{height: mantineThemeOther.headerHeight}}>{
                                              <Group>
                                                  <RegexHighlighter regex={regexValue}/>
                                                  {
                                                      isSimplified ? <Tooltip
                                                          withArrow
                                                          label={"Redundant groups have been removed"}>
                                                          <Center pt={2}>
                                                              <IconAlertTriangle size={16} color={"orange"} />
                                                          </Center>
                                                      </Tooltip> : null
                                                  }
                                              </Group>
                                          }</Center>
                                          <Center style={{height: mantineThemeOther.headerHeight}}>
                                              <Group>
                                                  <VerifyTreeButton />
                                                  <SolveButton />
                                              </Group>
                                          </Center>
                                      </>
                                      }
                                  </Group>

                              </Header>
                          }
                          navbar={
                              solveStep === -1 ? undefined : <Navbar width={{base: 240}} p={"xs"}>
                                  <ScrollArea>
                                      <StepsProgress activeStep={solveStep}/>
                                  </ScrollArea>
                              </Navbar>
                          }>
                    {solveStep === -1 ? <RegexInputScreen/> : <InteractiveTreeBuilder/>}
                </AppShell>
            </ReactFlowProvider>
        </MantineProvider>
    );
}
