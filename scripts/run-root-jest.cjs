#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
// The repo currently has separate backend/frontend Jest installs on different majors,
// so the root runner delegates to each package's local CLI instead of sharing one config.
const projects = [
  { name: "backend", dir: "harmony-backend" },
  { name: "frontend", dir: "harmony-frontend" },
];
const rawArgs = process.argv.slice(2);

function matchProjectPath(arg) {
  if (arg.startsWith("-")) {
    return null;
  }

  const absolutePath = path.isAbsolute(arg)
    ? path.normalize(arg)
    : path.resolve(repoRoot, arg);

  if (!fs.existsSync(absolutePath)) {
    return null;
  }

  for (const project of projects) {
    const projectRoot = path.resolve(repoRoot, project.dir);

    if (
      absolutePath === projectRoot ||
      absolutePath.startsWith(`${projectRoot}${path.sep}`)
    ) {
      return {
        projectName: project.name,
        relativePath: path.relative(projectRoot, absolutePath) || ".",
      };
    }
  }

  return null;
}

const matchedProjectNames = new Set();

for (const arg of rawArgs) {
  const match = matchProjectPath(arg);
  if (match) {
    matchedProjectNames.add(match.projectName);
  }
}

const selectedProjects =
  matchedProjectNames.size > 0
    ? projects.filter((project) => matchedProjectNames.has(project.name))
    : projects;

const projectArgs = new Map(
  selectedProjects.map((project) => [project.name, []]),
);

for (const arg of rawArgs) {
  const match = matchProjectPath(arg);

  if (match && projectArgs.has(match.projectName)) {
    projectArgs.get(match.projectName).push(match.relativePath);
    continue;
  }

  for (const project of selectedProjects) {
    projectArgs.get(project.name).push(arg);
  }
}

let exitCode = 0;

for (const project of selectedProjects) {
  const projectRoot = path.resolve(repoRoot, project.dir);
  const args = projectArgs.get(project.name);

  if (selectedProjects.length > 1) {
    console.log(`\n[${project.name}] running jest in ${project.dir}`);
  }

  const result = spawnSync("npm", ["test", "--", ...args], {
    cwd: projectRoot,
    stdio: "inherit",
    env: process.env,
  });

  if (result.status !== 0) {
    exitCode = result.status ?? 1;
  }
}

process.exit(exitCode);
