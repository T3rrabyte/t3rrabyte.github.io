import Script from "next/script";

type Properties = {
  className: string,
  height: string,
  slugHash: string,
  defaultTab: string,
  props: string[]
};

export default function CodePen({ className, height, slugHash, defaultTab, ...props }: Properties): JSX.Element {
  const dataHeight: number = height ? parseInt(height) : 600;
  const dataDefaultTab: string = defaultTab ?? "js,result";

  return (
    <div className={className} {...props}>
      <p className="codepen" data-height={dataHeight} data-default-tab={dataDefaultTab} data-slug-hash={slugHash} />
      <Script async src="https://cpwebassets.codepen.io/assets/embed/ei.js" />
    </div>
  );
}
