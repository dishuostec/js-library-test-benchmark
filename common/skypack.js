export const load = (pkg, module, pinned) => {
	pkg = pkg_name(pkg);

	return import('https://cdn.skypack.dev/' + (pinned?.[pkg] || pkg))
		.then(m =>
			typeof module === 'function'
				? module(m)
				: module === true
					? m.default
					: module === '*'
						? m
						: m[module || 'default'],
		);
};

export function pkg_name(pkg) {
	return pkg.replace(/:.+/, '');
}