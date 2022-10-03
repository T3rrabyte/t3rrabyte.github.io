import { readFile } from "fs";
import { promisify } from "util";
import glob from "glob";
import grayMatter from "gray-matter";

const readFilePromise = promisify(readFile);
const globPromise = promisify(glob);

export async function getWebPaths(pattern) {
	return (await getBuildPaths(pattern))
		.map((buildPath) => getWebPath(buildPath));
}

export async function getBuildPaths(pattern) {
	return (await globPromise(pattern))
		.filter((path) => path.indexOf(".") >= 0);
}

export function getWebPath(buildPath) {
	let start = 0;
	for (const root of ["pages/", "public/"]) {
		if (buildPath.indexOf(root) >= 0) {
			start = buildPath.indexOf(root) + root.length;
			break;
		}
	}

	return buildPath.slice(start, buildPath.lastIndexOf("."));
}

export function getFileName(path) {
	return path.slice(path.lastIndexOf("/"));
}

export function getSlug(fileName) {
	return fileName.slice(0, fileName.lastIndexOf("."));
}

export async function getFrontMatter(buildPath) {
	const fileContent = await readFilePromise(buildPath);
	const { data } = grayMatter(fileContent);
	return data;
}
