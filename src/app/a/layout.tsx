import type { LayoutProps } from "#Props";
import type { Metadata } from "next";
import style from "./layout.module.scss";

export default function Layout({ children }: LayoutProps) {
	return <article className={style["content"]}>{children}</article>;
}

export const metadata: Metadata = {
	title: {
		default: "Article",
		template: "%s | Blog | Lakuna"
	}
};
