import { createPubSub, createSchema } from 'graphql-yoga';
import { pollStore, QuestionWithComputed } from './store.ts';

export type PubSubChannels = {
  'question:added': [QuestionWithComputed];
  'question:updated': [QuestionWithComputed];
};

export const pubSub = createPubSub<PubSubChannels>();

export const typeDefs = /* GraphQL */ `
  type Option {
    id: ID!
    text: String!
    votes_count: Int!
    percentage: Float!
  }

  type Question {
    id: ID!
    title: String!
    description: String
    category: String!
    creator: String!
    created_at: String!
    total_votes: Int!
    options: [Option!]!
  }

  type AppStats {
    totalQuestions: Int!
    totalVotes: Int!
    activeUsers: Int!
  }

  input CreateOptionInput {
    text: String!
  }

  input CreateQuestionInput {
    title: String!
    description: String
    category: String
    creator: String
    options: [CreateOptionInput!]!
  }

  type Query {
    questions: [Question!]!
    question(id: ID!): Question
    stats: AppStats!
  }

  type Mutation {
    createQuestion(input: CreateQuestionInput!): Question!
    vote(questionId: ID!, optionId: ID!): Question!
    deleteQuestion(id: ID!): Boolean!
    resetToSampleData: Boolean!
  }

  type Subscription {
    questionAdded: Question!
    questionUpdated(id: ID): Question!
  }
`;

export const resolvers = {
  Query: {
    questions: () => {
      return pollStore.getAll();
    },
    question: (_: unknown, args: { id: string }) => {
      return pollStore.getById(args.id);
    },
    stats: () => {
      return pollStore.getStats();
    },
  },

  Mutation: {
    createQuestion: (_: unknown, args: { input: Parameters<typeof pollStore.create>[0] }) => {
      if (!args.input.title || args.input.title.trim().length < 3) {
        throw new Error('Soru başlığı en az 3 karakter olmalıdır.');
      }
      if (!args.input.options || args.input.options.length < 2) {
        throw new Error('Bir soru için en az 2 seçenek eklenmelidir.');
      }
      const validOptions = args.input.options.filter((o) => o.text && o.text.trim().length > 0);
      if (validOptions.length < 2) {
        throw new Error('Lütfen en az 2 geçerli seçenek giriniz.');
      }

      const created = pollStore.create({
        ...args.input,
        options: validOptions,
      });

      // Broadcast to all clients on homepage or anywhere
      pubSub.publish('question:added', created);

      return created;
    },

    vote: (_: unknown, args: { questionId: string; optionId: string }) => {
      const updated = pollStore.vote(args.questionId, args.optionId);

      // Broadcast update to real-time subscribers
      pubSub.publish('question:updated', updated);

      return updated;
    },

    deleteQuestion: (_: unknown, args: { id: string }) => {
      return pollStore.delete(args.id);
    },

    resetToSampleData: () => {
      return pollStore.reset();
    },
  },

  Subscription: {
    questionAdded: {
      subscribe: () => pubSub.subscribe('question:added'),
      resolve: (payload: QuestionWithComputed) => payload,
    },
    questionUpdated: {
      subscribe: async function* (_: unknown, args: { id?: string }) {
        const sub = pubSub.subscribe('question:updated');
        for await (const question of sub) {
          if (!args.id || question.id === args.id) {
            yield question;
          }
        }
      },
      resolve: (payload: QuestionWithComputed) => payload,
    },
  },
};

export const schema = createSchema({
  typeDefs,
  resolvers,
});
