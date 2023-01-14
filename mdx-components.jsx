import Link from "next/link";

export function useMDXComponents(components) {
	return {
		a: (props) => <Link {...props} />,
		...components
	};
}
