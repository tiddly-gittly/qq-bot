const os = require('os');
const path = require('path');
const userHomeDir = os.homedir();

const wikiNames = ['TiddlyWiki-Chinese-Tutorial'];
const wikiDirs = wikiNames.map((name) => ({ name, wikiDir: path.resolve(userHomeDir, name) }));

// pm2 cron and watch are not working at all, so use crontab instead
// crontab -e
// to open the crontab config file, and add following line
// */60 * * * * https_proxy="192.168.x.x:xxxx" pm2 restart git
// */60 * * * * pm2 restart tw
// That will restart git pull every hour! https://github.com/Unitech/pm2/issues/1076#issuecomment-441085488

module.exports = {
  apps: [
    {
      name: 'qq-bot',
      script: 'cd ~/qq-bot && pnpm start',
    },
    ...wikiDirs.flatMap(({ name, wikiDir }, index) => [
      {
        name,
        script: `tiddlywiki ${wikiDir} --listen host=0.0.0.0 port=${8081 + index} root-tiddler=$:/core/save/lazy-images`,
      },
      {
        name: `git-${name}`,
        script: `cd ${wikiDir} && git pull`,
      },
    ]),
  ],
};