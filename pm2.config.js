const os = require('os');
const path = require('path');
const userHomeDir = os.homedir();
const wikiDir = path.resolve(userHomeDir, 'wiki');

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
  ],
};
