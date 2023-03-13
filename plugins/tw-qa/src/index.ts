import { Plugin, Context } from 'zhin';
export const name = 'tw-qa';

const WIKI_HOST = 'localhost';
const WIKI_PORT = 1222;
export function install(this: Plugin, ctx: Context) {
  // 在这儿实现你的插件逻辑
  // 功能样例：
  //1.定义指令

  ctx
    .command('cn <keyword:text>')
    .shortcut('中文教程')
    .action(({ session, options }, keyword) => {
      // DEBUG: console session
      console.log(`session`, session);
      console.log('options', options);
      // DEBUG: console keyword
      console.log(`keyword`, keyword);
      return keyword;
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
