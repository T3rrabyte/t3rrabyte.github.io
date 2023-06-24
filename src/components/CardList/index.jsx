import style from "./style.module.scss";

export default function CardList({ className = "", ...props }) {
	return <div className={`${style["base"]} ${className}`} {...props} />;
}
