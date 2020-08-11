import { setFailed, info, addPath, getInput } from "@actions/core";
import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";
import * as http from "@actions/http-client";
import * as os from "os";
import * as fs from "fs";

const TOOL = "aws-copilot";

export async function install(version: string, osPlat: string) {
  const toolPath = tc.find(TOOL, version) || (await download(version, osPlat));

  addPath(toolPath);
}

export function downloadUrl(version: string, osPlat: string): string {
  return `https://github.com/aws/copilot-cli/releases/download/${version}/${fileName(
    version,
    osPlat
  )}`;
}

async function download(version: string, osPlat: string): Promise<string> {
  const url = downloadUrl(version, osPlat);
  info(`Downloading  ${url}`);
  const downloadPath = await tc.downloadTool(url);
  fs.chmodSync(downloadPath, "777");
  return await tc.cacheFile(downloadPath, "copilot", TOOL, version);
}

export function fileName(version: string, osPlat: string): string {
  const platform = osPlat === "win32" ? "windows" : osPlat;
  const ext = osPlat === "win32" ? ".exe" : "";

  return `copilot-${platform}-${version}${ext}`;
}

async function run() {
  try {
    const version = getInput("version") || (await latestVersion());
    if (!version) {
      throw new Error("Failed to resolve latest version");
    }

    await install(version, os.platform());
  } catch (error) {
    setFailed(error.message);
  }
}

async function latestVersion(): Promise<string | undefined> {
  const url = `https://api.github.com/repos/aws/copilot-cli/releases/latest`;
  const client = new http.HttpClient("setup-aws-copilot");
  const resp = (await client.getJson<{ tag_name: string }>(url)).result;
  return resp?.tag_name;
}

if (require.main === module) {
  run();
}
