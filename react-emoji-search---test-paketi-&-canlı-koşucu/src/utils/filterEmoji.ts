import emojiList from '../data/emojiList.json';

export interface EmojiItem {
  title: string;
  symbol: string;
  keywords: string;
}

/**
 * Filter emoji list by search text matching title or keywords
 * Default limit is 20 items to match React Emoji Search specification
 */
export function filterEmoji(searchText: string, maxResults: number = 20): EmojiItem[] {
  const query = searchText.trim().toLowerCase();

  return (emojiList as EmojiItem[])
    .filter((emoji) => {
      if (emoji.title.toLowerCase().includes(query)) {
        return true;
      }
      if (emoji.keywords.toLowerCase().includes(query)) {
        return true;
      }
      return false;
    })
    .slice(0, maxResults);
}
