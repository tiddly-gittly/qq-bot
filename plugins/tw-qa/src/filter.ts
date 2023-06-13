// http://192.168.3.17:8081/recipes/default/tiddlers.json?filter=[!is[shadow]!is[system]field:type[text/vnd.tiddlywiki]susearch-sort:title,caption,text:raw-strip[git]first[10]]
// from $:/plugins/EvidentlyCube/ExtraOperators
const searchFilter = '[!is[shadow]!is[system]field:type[text/vnd.tiddlywiki]susearch-sort:title,text,caption,keywords:raw-strip[${query}]${filter}]';
export const buildWikiFilter = function (query, count = 5, pagination = 1) {
  // starts at page 1
  const paginationTimesCount = Math.max((pagination - 1) * count, 0);
  return searchFilter
    .replace('${query}', query)
    .replace('${filter}', 'rest[${paginationTimesCount}]first[${count}]')
    .replace('${paginationTimesCount}', String(paginationTimesCount))
    .replace('${count}', String(count));
};
