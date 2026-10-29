export interface IPost {
  _id: string;
  title: string;
  detail: string;
  author: string;
  dateCreated: string | Date;
}

export interface HomeworkCheckItem {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
  codeSnippet: string;
  explanation: string;
}
