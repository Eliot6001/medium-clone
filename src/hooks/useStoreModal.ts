import {create} from 'zustand';

//Ill need to add more later...

export type ModalType = "signInModal";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
  data: ModalData;  
}

interface ModalData {
  apiUrl?: string;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({isOpen: true, type, data }),
  onClose: () => set({type: null, isOpen: false})
}))