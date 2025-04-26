import { InterestsPickingModal } from "@/components/modals/signinModal";
import { useEffect, useState} from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* <Modal /> */}
      {/* <ModalContainer /> */}
      <InterestsPickingModal />
    </>
)

}

export default  ModalProvider;

