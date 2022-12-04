import useAppStateStore from "@/layout/stores/appStateStore";
import DefaultError from "@/layout/presentation/DefaultError";

export default function VerificationErrors() {
    const errors = useAppStateStore((state) => state.verificationErrors);

    if(!errors) {
        return null;
    }

    return <>
        {errors.map((error) => {
            return <DefaultError title={error.title} message={<>error.message</>} />
        })}
    </>

}
