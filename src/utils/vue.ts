import { ComponentPublicInstance, Fragment, Comment, VNodeChild, createTextVNode, VNode } from 'vue'

function flatten(nodes: VNodeChild[]): VNode[] {
  return nodes.flatMap((node) => {
    if (!node) {
      return [];
    } else if (typeof node === "string" || typeof node === "number") {
      return [createTextVNode(String(node))]
    } else if (Array.isArray(node)) {
      return flatten(node)
    } else if (typeof node === "object") {
      switch (node.type) {
        case Fragment:
          if (Array.isArray(node.children)) {
            return flatten(node.children)
          }
        case Comment:
          return [];
        default:
          return node;
      }
    }
    return [];
  });
}

export function children(component: ComponentPublicInstance, slotName = "default"): VNode[] {
  const slot = component.$slots[slotName];
  return slot ? flatten(slot()) : [];
}
