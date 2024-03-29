import { buildWikiFilter } from './filter';
import { getShortLink, saveShortLinkCache } from './shortLink';
import { ITiddlerFields } from 'tw5-typed';
import { zhCN } from 'sensitive-words-js';
import Mint from 'mint-filter'
const sensitiveWordsFilter = new Mint(zhCN, { customCharacter: '█' })

export async function buildAnswerLineFromSearchResultItem(item: ITiddlerFields, website: string, params: { hashPrefix: boolean },): Promise<string> {
  const caption = (item.caption as string ?? item.title ?? item['original-title'] as string ?? '').replace(/[\r\n\s]/g, '');
  const title = item.title;
  const creator = item.creator ? ` @${item.creator}` : '';
  const modifier = item.modifier && item.modifier !== item.creator ? ` @${item.modifier}` : '';
  const tags = Array.isArray(item.tags) ? item.tags : ((item.tags as string) ?? '').split(' ');
  const tagsString = tags
    .filter((item) => item)
    .filter((item) => !item.startsWith('$:/'))
    .map((tag) => ` #${tag}`)
    .join(' ');
  let link = `${website}${params.hashPrefix ? '#' : ''}${encodeURIComponent(title)}`;
  try {
    link = await getShortLink(link);
  } catch (error) {
    console.error(`获取短连接失败 ${error.message}`);
  }
  return `# ${sensitiveWordsFilter.filter(`${caption}${tagsString}${creator}${modifier}`).text}\n${link}`;
}

export async function answerQuestionSearchWiki(
  params: { WIKI_URL: string; query: string; command: string; name: string; website: string, hashPrefix: boolean },
  options?: { count?: number; pagination?: number },
) {
  const { count = 6, pagination = 1 } = options ?? {};
  const { WIKI_URL, query, command, name, website } = params ?? {};
  const filter = buildWikiFilter(query, count, pagination);
  const urlEncodedQuery = encodeURIComponent(filter);
  const url = `http://${WIKI_URL}/recipes/default/tiddlers.json?filter=${urlEncodedQuery}`;
  try {
    console.log(`请求地址：${url}  filter: ${filter}`);
    const searchResult: ITiddlerFields[] = await fetch(url).then((res) => res.json());
    if (searchResult.length === 0) {
      console.log(`搜索结果为空 ${url}`);
    }
    const answerResult = await Promise.all<string>(searchResult.map((item) => buildAnswerLineFromSearchResultItem(item, website, params)));

    let paginationTutorial = '';
    if (answerResult.length === count) {
      // means maybe we have more results, teach user how to do pagination
      paginationTutorial = `> 通过 ${command} ${query} -p ${pagination + 1} 查看更多结果，或 -c ${count * 2} 来增加返回量`;
    }
    void saveShortLinkCache();
    return `${answerResult.join('\n')}
${paginationTutorial}
${name} 搜索完毕，欢迎下次光临`;
  } catch (error) {
    const errorMessage = `! ${name}搜索失败

报错：
\`\`\`log
${error.message}
\`\`\`
请求地址：${url}
请检查wiki是否可用，或者联系管理员`;
    console.error(errorMessage);
    return errorMessage;
  }
}
