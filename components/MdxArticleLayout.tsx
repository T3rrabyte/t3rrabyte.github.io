import "prism-themes/themes/prism-atom-dark.min.css";
import styles from "../styles/mdx-article.module.scss";

interface MdxArticleLayoutParameters {
  children: JSX.Element[]
}

export default function MdxArticleLayout({ children }: MdxArticleLayoutParameters): JSX.Element {
  return <article className={styles["mdx-article"]}>{children}</article>;
}
