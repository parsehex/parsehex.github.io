import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const CONFIG_PATH = path.resolve(process.cwd(), 'config.json');
const USER_CONFIG_PATH = path.resolve(process.cwd(), 'config.user.json');

export function loadConfig() {
  let config = {};

  if (fs.existsSync(CONFIG_PATH)) {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  }

  if (fs.existsSync(USER_CONFIG_PATH)) {
    const userConfig = JSON.parse(fs.readFileSync(USER_CONFIG_PATH, 'utf-8'));
    config = { ...config, ...userConfig };
  }

  return config;
}

export function getSiteTitle() {
  const config = loadConfig();
  const ghUsername = process.env.VITE_GITHUB_ACTOR || 'gh_username';

  let siteTitle = (config as any).siteTitle;
  if (siteTitle === undefined) {
    siteTitle = "{username}'s Sites";
  }

  return siteTitle.replace(/\{username\}/g, ghUsername);
}

export function getUsername() {
  return process.env.VITE_GITHUB_ACTOR || 'gh_username';
}
