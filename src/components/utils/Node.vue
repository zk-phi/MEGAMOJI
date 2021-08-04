<script lang="ts">
import { PropType, VNodeChild } from "vue";

const Node = (props) => props.node;
Node.props = {
  node: { type: Object as PropType<VNodeChild>, required: true },
};

export default Node;
</script>
