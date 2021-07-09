const data = (): Record<string, unknown> => ({
  MODES: [
    { value: "text", label: "テキストから作る" },
    { value: "file", label: "画像から作る" },
    { value: "fukumoji", label: "パーツを選んで作る" },
  ],
  baseImage: null,
  resultImages: [["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAB0UlEQVR4Xu3UAQ0AAAyDsM+/6QspcwAh2zXawGj64K8A8AgKoABwAzh+D1AAuAEcvwcoANwAjt8DFABuAMfvAQoAN4Dj9wAFgBvA8XuAAsAN4Pg9QAHgBnD8HqAAcAM4fg9QALgBHL8HKADcAI7fAxQAbgDH7wEKADeA4/cABYAbwPF7gALADeD4PUAB4AZw/B6gAHADOH4PUAC4ARy/BygA3ACO3wMUAG4Ax+8BCgA3gOP3AAWAG8Dxe4ACwA3g+D1AAeAGcPweoABwAzh+D1AAuAEcvwcoANwAjt8DFABuAMfvAQoAN4Dj9wAFgBvA8XuAAsAN4Pg9QAHgBnD8HqAAcAM4fg9QALgBHL8HKADcAI7fAxQAbgDH7wEKADeA4/cABYAbwPF7gALADeD4PUAB4AZw/B6gAHADOH4PUAC4ARy/BygA3ACO3wMUAG4Ax+8BCgA3gOP3AAWAG8Dxe4ACwA3g+D1AAeAGcPweoABwAzh+D1AAuAEcvwcoANwAjt8DFABuAMfvAQoAN4Dj9wAFgBvA8XuAAsAN4Pg9QAHgBnD8HqAAcAM4fg9QALgBHL8HKADcAI7fAxQAbgDH7wEKADeA4/cABYAbwPF7ADyAB6SPAIFm19U7AAAAAElFTkSuQmCC"]],
  previewMode: false,
  /* ui */
  ui: {
    mode: "text",
    showTargetPanel: false,
    fukumojiTab: "base",
    showTargetDetails: false,
  },
});

function mounted(): void {
  const match = /\?([^=]+)(=(.*))?$/.exec(window.location.href);
  if (match) {
    if (match[1] === "test") {
      this.ui.mode = "text";
      this.ui.showTargetPanel = true;
      this.source.text.content = "あ";
    } else if (match[1] === "mode") {
      this.ui.mode = match[3];
    }
  }
}

const methods = {
  onSetShowTarget(value: boolean): void {
    this.ui.showTargetPanel = value;
    ga("send", "pageview", value ? "/target" : (`/${this.ui.mode}`));
  },
  onSelectMode(value: string): void {
    this.ui.mode = value;
    this.ui.showTargetPanel = false;
    ga("send", "pageview", `/${value}`);
  },
  onRenderTarget(imgs): void {
    this.resultImages = imgs;
    ga("send", "event", this.ui.mode, "render");
  },
  onRender(img): void {
    this.baseImage = img;
  },
};

export default {
  data, methods, mounted,
};
