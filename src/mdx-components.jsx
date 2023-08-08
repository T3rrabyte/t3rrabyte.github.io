import DynamicLink from "#DynamicLink";

export const useMDXComponents = (components) => ({
	a: (props) => <DynamicLink {...props} />,
	...components
});
