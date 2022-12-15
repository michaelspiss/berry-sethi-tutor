import useAppStateStore from "@/layout/stores/appStateStore";
import DefaultError from "@/layout/presentation/DefaultError";
import {ScrollArea} from "@mantine/core";

export default function VerificationErrors() {
    const errors = useAppStateStore((state) => state.verificationErrors);

    if(!errors) {
        return null;
    }

    return <ScrollArea maw={"25vw"} h={"100%"}>
        {errors.map((error) => {
            return <DefaultError title={error.title} message={error.message} causes={error.causes}/>
        })}
    </ScrollArea>

}
