interface BenchmarkStats {
	ops: number;
	rme: number;
	run: number;
}

interface SpecItem {
	passed?: boolean;
	error?: any;

	stats?: BenchmarkStats;

	score?: number,
	level?: number,
}

interface SpecGroup {

	passed?: number;
	failed?: number;

	score?: number,

	list: SpecItem[];
}

interface Package {
	name: string;

	passed?: number;
	failed?: number;

	score?: number,

	specs: SpecGroup[];
}

interface SpecDefine {
	description: string,
	tests: {
		description: string
		[k: string]: unknown
	}[]
}


interface ReporterState {
	current_pkg_index?: number;
	current_group_index?: number;
	current_item_index?: number;

	specs: { name: string, list: string[] }[];
	packages: Package[];
}