import DynamicLink from "./DynamicLink";
import style from "./button-link.module.scss";

export default function ButtonLink({ className = "", ...props }) {
	return <DynamicLink className={`${style["base"]} ${className}`} {...props} />;
}
