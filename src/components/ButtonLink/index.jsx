import DynamicLink from "site/components/DynamicLink";
import style from "./style.module.scss";

export default function ButtonLink({ className = "", ...props }) {
	return <DynamicLink className={`${style["base"]} ${className}`} {...props} />;
}
