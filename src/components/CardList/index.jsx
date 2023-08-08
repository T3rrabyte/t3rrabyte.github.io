import style from "./style.module.scss";

export default ({ className = "", ...props }) => <div className={`${style["base"]} ${className}`} {...props} />;
