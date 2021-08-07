import Card from "./Card.vue";

export default {
  title: "atoms/global/Card",
  component: Card,
};

export const Template = () => ({
  components: { Card },
  template: `
    <Card title="ほげほげ">
      hogehogehogehoge
    </Card>
  `,
});
