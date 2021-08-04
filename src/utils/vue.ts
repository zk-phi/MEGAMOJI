import { ComponentPublicInstance, Fragment, Comment, VNodeChild, createTextVNode, VNode } from "vue";

function flatten(nodes: VNodeChild[]): VNode[] {
  return nodes.reduce((arr: VNode[], node: VNodeChild) => {
    if (node) {
      if (typeof node === "string" || typeof node === "number") {
        arr.push(createTextVNode(String(node)));
      } else if (Array.isArray(node)) {
        arr.push(...flatten(node));
      } else if (typeof node === "object") {
        if (node.type === Fragment) {
          if (Array.isArray(node.children)) {
            arr.push(...flatten(node.children));
          }
        } else if (node.type !== Comment) {
          arr.push(node);
        }
      }
    }
    return arr;
  }, []);
}

export function children(component: ComponentPublicInstance, slotName = "default"): VNode[] {
  const slot = component.$slots[slotName];
  return slot ? flatten(slot()) : [];
}
