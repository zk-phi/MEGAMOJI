import Grid from "./Grid.vue";
import GridItem from "./GridItem.vue";

export default {
  title: "utils/Grid",
  component: Grid,
  subcomponents: { GridItem },
};

export const Base = (args) => ({
  components: { Grid, GridItem },
  data: () => args,
  template: `
    <Grid :columns="columns">
      <GridItem style="background: red" :span="1">ほげほげ</GridItem>
      <GridItem style="background: green" :span="1">ほげほげ</GridItem>
      <GridItem style="background: blue" :span="2">ほげほげ</GridItem>
    </Grid>
  `,
});
Base.args = {
  columns: [
    [600, 1],
    [800, 2],
    [Infinity, 4],
  ],
};
