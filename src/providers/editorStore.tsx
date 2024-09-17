import create from 'zustand';

const useEditorStore = create((set) => ({
  title: '',
  text: '',
  description: '',
  imgSrc: null,
  loading: false,
  setTitle: (title) => set({ title }),
  setText: (text) => set({ text }),
  setDescription: (description) => set({ description }),
  setImgSrc: (imgSrc) => set({ imgSrc }),
  setLoading: (loading) => set({ loading }),
}));

export default useEditorStore;
