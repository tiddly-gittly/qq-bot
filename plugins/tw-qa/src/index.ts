import { Plugin, Context } from 'zhin';
export const name = 'tw-qa';

const WIKI_HOST = 'localhost';
const WIKI_PORT = 8081;

const WIKI_URL = `${WIKI_HOST}:${WIKI_PORT}`;
// http://192.168.3.17:8081/recipes/default/tiddlers.json?filter=[!is[shadow]!is[system]field:type[text/vnd.tiddlywiki]susearch-sort:title,caption,text:raw-strip[git]first[10]]
const searchFilter = '[!is[shadow]!is[system]field:type[text/vnd.tiddlywiki]susearch-sort:title,caption,text:raw-strip[${query}]first[5]]';
const buildWikiFilter = function (query) {
  const parts = searchFilter.split('${query}');
  return `${parts[0]}${query}${parts[1]}`;
};

async function getShortLink(link: string): Promise<string> {
  const resultJSON = await fetch(`https://api.uomg.com/api/long2dwz?dwzapi=urlcn&url=${encodeURIComponent(link)}`).then((res) => res.json());
  const { ae_url: result } = resultJSON;
  return result;
}

async function buildAnswerLineFromSearchResultItem(item): Promise<string> {
  const title = item.title;
  const creator = item.creator ? ` @${item.creator}` : '';
  const modifier = item.modifier && item.modifier !== item.creator ? ` @${item.modifier}` : '';
  const tags = (item.tags ?? '')
    .split(' ')
    .filter(item => item)
    .filter(item => !item.startsWith('$:/'))
    .map((tag) => ` #${tag}`)
    .join(' ');
  let link = `https://tw-cn.netlify.app/#${encodeURIComponent(title)}`;
  try {
    link = await getShortLink(link);
  } catch (error) {
    console.error(`获取短连接失败 ${error.message}`);
  }
  return `${title}${tags}${creator}${modifier}\n${link}`;
}

export function install(this: Plugin, ctx: Context) {
  // 在这儿实现你的插件逻辑
  // 功能样例：
  //1.定义指令

  ctx
    .command('cn <keyword:text>')
    .shortcut('中文教程')
    .action(async ({ session, options }, query) => {
      const urlEncodedQuery = encodeURIComponent(buildWikiFilter(query));
      const url = `http://${WIKI_URL}/recipes/default/tiddlers.json?filter=${urlEncodedQuery}`;
      const searchResult = await fetch(url).then((res) => res.json());
      const answerResult = await Promise.all<string>(searchResult.map((item) => buildAnswerLineFromSearchResultItem(item)));
      return answerResult.join('\n');
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
