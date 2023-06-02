import { Plugin, Context } from 'zhin';
import { answerQuestionSearchWiki } from './buildAnswer';

export const name = 'tw-qa';

const wikis = [
  {
    command: 'cn',
    name: '中文教程',
    WIKI_HOST: 'localhost',
    WIKI_PORT: 5213,
    website: 'https://tw-cn.cpolar.top/',
    // nodejs wiki, can use single tiddler view
    hashPrefix: false,
  },
  {
    command: 'doc',
    name: '官方文档',
    WIKI_HOST: 'localhost',
    WIKI_PORT: 5215,
    website: 'https://tw-cn-doc.cpolar.top/',
    hashPrefix: false,
  },
  {
    command: 'tidgi',
    name: '太记官网',
    WIKI_HOST: 'localhost',
    WIKI_PORT: 5216,
    website: 'https://tidgi.fun/',
    hashPrefix: true,
  },
  {
    command: 'onetwo',
    name: '林一二的博客',
    WIKI_HOST: 'localhost',
    WIKI_PORT: 5217,
    website: 'https://wiki.onetwo.ren/',
    hashPrefix: false,
  },
];
const padNameLength = [...wikis].sort((a, b) => b.name.length - a.name.length)[0].name.length;

export function install(this: Plugin, ctx: Context) {
  // 在这儿实现你的插件逻辑
  // 功能样例：
  //1.定义指令

  wikis.forEach((wiki) => {
    const { command, name, WIKI_HOST, WIKI_PORT } = wiki;
    ctx
      .command(`${command} <keyword:text>`)
      .option('count', '-c <count:number>')
      .option('pagination', '-p <pagination:number>')
      .shortcut(name)
      .action(async ({ session, options }, query) => {
        const queryString = query[0].attrs.text;

        const WIKI_URL = `${WIKI_HOST}:${WIKI_PORT}`;

        const result = answerQuestionSearchWiki({ WIKI_URL, query: queryString, command, name, ...wiki }, options);
        return result;
      });
  });

  ctx
    .command(`usage`)
    .shortcut('机器人用法')
    .action(async ({ session, options }, query) => {
      const result = `可用的知识库：

| ${'名称'.padEnd(padNameLength, '　')} | ${'指令'}
${wikis.map((wiki) => `| ${wiki.name.padEnd(padNameLength, '　')} | ${wiki.command}`).join('\n')}

使用方法例如在聊天框发送 \`${wikis[0].command} 同步\` 就可以在${wikis[0].name}知识库搜索同步相关的内容
`;
      return result;
    });

  // 2.定义中间件
  /*
    ctx.middleware(async (event,next)=>{
        if(true){ //需要判断的条件
        //逻辑执行代码
        }else{
            next() // 不next，则不会流入下一个中间件
        }
    });
    */
  // 3. 监听事件
  /*
    ctx.on(eventName,callback);
    ctx.once(eventName,callback);
    ctx.on(eventName,callback);
    */
  // 4. 定义服务
  /*
    ctx.service('serviceName'，{}) // 往bot上添加可全局访问的属性
    */
  // 5. 添加自定插件副作用(在插件卸载时需要执行的代码)
  // 如果不需要，可以不return
  /*
    return ()=>{
        // 如果你使用过react的useEffect 那你应该知道这是在干嘛
        // 函数内容将会在插件卸载时自动卸载
    }
    */
}
