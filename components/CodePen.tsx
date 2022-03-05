import Script from "next/script";

export default function CodePen({ className, height, slugHash, ...props }: any): JSX.Element {
  return (
    <div className={className} {...props}>
      <p className="codepen" data-height={height ? parseInt(height) : 600} data-default-tab="js,result" data-slug-hash={slugHash} />
      <Script async src="https://cpwebassets.codepen.io/assets/embed/ei.js" />
    </div>
  );
}
