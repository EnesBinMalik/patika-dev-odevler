/**
 * GraphQL Queries, Mutations, and Subscriptions
 * Developer: Enes Öztürk
 */

export interface Option {
  id: string;
  text: string;
  votes_count: number;
  percentage: number;
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  category: string;
  creator: string;
  created_at: string;
  total_votes: number;
  options: Option[];
}

export interface AppStats {
  totalQuestions: number;
  totalVotes: number;
  activeUsers: number;
}

export const GET_QUESTIONS_QUERY = /* GraphQL */ `
  query GetQuestions {
    questions {
      id
      title
      description
      category
      creator
      created_at
      total_votes
      options {
        id
        text
        votes_count
        percentage
      }
    }
    stats {
      totalQuestions
      totalVotes
      activeUsers
    }
  }
`;

export const GET_QUESTION_QUERY = /* GraphQL */ `
  query GetQuestion($id: ID!) {
    question(id: $id) {
      id
      title
      description
      category
      creator
      created_at
      total_votes
      options {
        id
        text
        votes_count
        percentage
      }
    }
  }
`;

export const CREATE_QUESTION_MUTATION = /* GraphQL */ `
  mutation CreateQuestion($input: CreateQuestionInput!) {
    createQuestion(input: $input) {
      id
      title
      description
      category
      creator
      created_at
      total_votes
      options {
        id
        text
        votes_count
        percentage
      }
    }
  }
`;

export const VOTE_MUTATION = /* GraphQL */ `
  mutation Vote($questionId: ID!, $optionId: ID!) {
    vote(questionId: $questionId, optionId: $optionId) {
      id
      title
      description
      category
      creator
      created_at
      total_votes
      options {
        id
        text
        votes_count
        percentage
      }
    }
  }
`;

export const RESET_DATA_MUTATION = /* GraphQL */ `
  mutation ResetData {
    resetToSampleData
  }
`;

export const QUESTION_ADDED_SUBSCRIPTION = /* GraphQL */ `
  subscription OnQuestionAdded {
    questionAdded {
      id
      title
      description
      category
      creator
      created_at
      total_votes
      options {
        id
        text
        votes_count
        percentage
      }
    }
  }
`;

export const QUESTION_UPDATED_SUBSCRIPTION = /* GraphQL */ `
  subscription OnQuestionUpdated($id: ID) {
    questionUpdated(id: $id) {
      id
      title
      description
      category
      creator
      created_at
      total_votes
      options {
        id
        text
        votes_count
        percentage
      }
    }
  }
`;
