import {create} from 'zustand';

//Ill need to add more later...

export type ModalType = "interestsModal";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
  data: ModalData;  
}

interface ModalData {
  preferred_fields?: string[];
  session?: {
    access_token: string;
  }
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({isOpen: true, type, data }),
  onClose: () => set({type: null, isOpen: false})
}))