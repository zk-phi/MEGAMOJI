import FileBlock from "./FileBlock.vue";

export default {
  title: "formblocks/molecules/FileBlock",
  component: FileBlock,
};

export const Base = (args) => ({
  components: { FileBlock },
  data: () => args,
  template: "<FileBlock :label='label' />",
});
Base.args = { label: "アップロード" };
