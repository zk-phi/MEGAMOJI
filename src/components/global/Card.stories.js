import Card from "./Card.vue";

export default {
  title: "molecules/global/Card",
  component: Card,
};

export const Base = () => ({
  components: { Card },
  template: `
    <Card title="ほげほげ">
      hogehogehogehoge
    </Card>
  `,
});
