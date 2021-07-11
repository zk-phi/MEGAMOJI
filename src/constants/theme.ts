import { GlobalThemeOverrides } from "naive-ui";

const bg = "#fff";
const border = "#aaa";
const darkText = "#000";

const theme: GlobalThemeOverrides = {
  common: {
    dividerColor: border,
    borderColor: border,
    textColor3: darkText,
    tabColor: bg,
  },
  Button: {
    color: "#fff",
  },
  Card: {
    color: "#fafafa",
  },
  Layout: {
    footerColor: bg,
  },
};

export default theme;
