import Media from "./Media.vue";
import image from "../../samples/image.png";

export default {
  title: "atoms/global/Media",
  component: Media,
};

export const Base = (args) => ({
  components: { Media },
  data: () => args,
  template: `
    <Media :title="title" :icon="icon">
      ほげほげほげほげ<br />
      ほげほげほげほげ
    </Media>
  `,
});
Base.args = {
  icon: image,
  title: "hogehoge",
};
