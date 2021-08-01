import FileSelect from "./FileSelect.vue";

export default {
  title: "molecules/inputs/FileSelect",
  component: FileSelect,
};

export const Base = () => ({
  components: { FileSelect },
  template: `
    <FileSelect>
      ボタン
    </FileSelect>
  `,
});
