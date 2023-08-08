import DynamicLink from "#DynamicLink";
import style from "./style.module.scss";

export default ({ className = "", ...props }) => <DynamicLink className={`${style["base"]} ${className}`} {...props} />;
