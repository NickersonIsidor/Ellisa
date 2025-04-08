import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../../app';
import * as questionUtil from '../../services/question.service';
import * as tagUtil from '../../services/tag.service';
import * as databaseUtil from '../../utils/database.util';
import {
  Answer,
  DatabaseQuestion,
  DatabaseTag,
  PopulatedDatabaseAnswer,
  PopulatedDatabaseQuestion,
  Question,
  Tag,
  VoteResponse,
} from '../../types/types';

const addVoteToQuestionSpy = jest.spyOn(questionUtil, 'addVoteToQuestion');
const getQuestionsByOrderSpy: jest.SpyInstance = jest.spyOn(questionUtil, 'getQuestionsByOrder');
const filterQuestionsBySearchSpy: jest.SpyInstance = jest.spyOn(
  questionUtil,
  'filterQuestionsBySearch',
);

const tag1: Tag = {
  name: 'tag1',
  description: 'tag1 description',
};

const dbTag1: DatabaseTag = {
  _id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
  ...tag1,
};

const tag2: Tag = {
  name: 'tag2',
  description: 'tag2 description',
};

const dbTag2: DatabaseTag = {
  _id: new mongoose.Types.ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  ...tag2,
};

const mockQuestion: Question = {
  title: 'New Question Title',
  text: 'New Question Text',
  tags: [tag1, tag2],
  answers: [],
  askedBy: 'question3_user',
  askDateTime: new Date('2024-06-06'),
  views: [],
  upVotes: [],
  downVotes: [],
  comments: [],
};

const mockDatabaseQuestion: DatabaseQuestion = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6fe'),
  title: 'New Question Title',
  text: 'New Question Text',
  tags: [dbTag1._id, dbTag2._id],
  answers: [],
  askedBy: 'question3_user',
  askDateTime: new Date('2024-06-06'),
  views: [],
  upVotes: [],
  downVotes: [],
  comments: [],
};

const mockPopulatedQuestion: PopulatedDatabaseQuestion = {
  ...mockDatabaseQuestion,
  tags: [dbTag1, dbTag2],
  answers: [],
  comments: [],
};

const ans1: PopulatedDatabaseAnswer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dc'),
  text: 'Answer 1 Text',
  ansBy: 'answer1_user',
  ansDateTime: new Date('2024-06-09'), // The mock date is string type but in the actual implementation it is a Date type
  comments: [],
};

const ans2: PopulatedDatabaseAnswer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dd'),
  text: 'Answer 2 Text',
  ansBy: 'answer2_user',
  ansDateTime: new Date('2024-06-10'),
  comments: [],
};

const ans3: PopulatedDatabaseAnswer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6df'),
  text: 'Answer 3 Text',
  ansBy: 'answer3_user',
  ansDateTime: new Date('2024-06-11'),
  comments: [],
};

const ans4: PopulatedDatabaseAnswer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'Answer 4 Text',
  ansBy: 'answer4_user',
  ansDateTime: new Date('2024-06-14'),
  comments: [],
};

const MOCK_POPULATED_QUESTIONS: PopulatedDatabaseQuestion[] = [
  {
    _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dc'),
    title: 'Question 1 Title',
    text: 'Question 1 Text',
    tags: [dbTag1],
    answers: [ans1],
    askedBy: 'question1_user',
    askDateTime: new Date('2024-06-03'),
    views: ['question1_user', 'question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: new mongoose.Types.ObjectId('65e9b5a995b6c7045a30d823'),
    title: 'Question 2 Title',
    text: 'Question 2 Text',
    tags: [dbTag2],
    answers: [ans2, ans3],
    askedBy: 'question2_user',
    askDateTime: new Date('2024-06-04'),
    views: ['question1_user', 'question2_user', 'question3_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: new mongoose.Types.ObjectId('34e9b58910afe6e94fc6e99f'),
    title: 'Question 3 Title',
    text: 'Question 3 Text',
    tags: [dbTag1, dbTag2],
    answers: [ans4],
    askedBy: 'question3_user',
    askDateTime: new Date('2024-06-03'),
    views: ['question3_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
];

const simplifyQuestion = (question: PopulatedDatabaseQuestion) => ({
  ...question,
  _id: question._id.toString(), // Converting ObjectId to string
  tags: question.tags.map(tag => ({ ...tag, _id: tag._id.toString() })), // Converting tag ObjectId
  answers: question.answers.map(answer => ({
    ...answer,
    _id: answer._id.toString(),
    ansDateTime: (answer as Answer).ansDateTime.toISOString(),
  })), // Converting answer ObjectId
  askDateTime: question.askDateTime.toISOString(),
});

const EXPECTED_QUESTIONS = MOCK_POPULATED_QUESTIONS.map(question => simplifyQuestion(question));

describe('Test questionController', () => {
  describe('POST /addQuestion', () => {
    it('should add a new question', async () => {
      jest.spyOn(tagUtil, 'processTags').mockResolvedValue([dbTag1, dbTag2]);
      jest.spyOn(questionUtil, 'saveQuestion').mockResolvedValueOnce(mockDatabaseQuestion);
      jest.spyOn(databaseUtil, 'populateDocument').mockResolvedValueOnce(mockPopulatedQuestion);

      // Making the request
      const response = await supertest(app).post('/question/addQuestion').send(mockQuestion);

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(simplifyQuestion(mockPopulatedQuestion));
    });

    it('should return 500 if error occurs in `saveQuestion` while adding a new question', async () => {
      jest.spyOn(tagUtil, 'processTags').mockResolvedValue([dbTag1, dbTag2]);
      jest
        .spyOn(questionUtil, 'saveQuestion')
        .mockResolvedValueOnce({ error: 'Error while saving question' });

      // Making the request
      const response = await supertest(app).post('/question/addQuestion').send(mockQuestion);

      // Asserting the response
      expect(response.status).toBe(500);
    });

    it('should return 500 if error occurs in `saveQuestion` while adding a new question', async () => {
      jest.spyOn(tagUtil, 'processTags').mockResolvedValue([dbTag1, dbTag2]);
      jest.spyOn(questionUtil, 'saveQuestion').mockResolvedValueOnce(mockDatabaseQuestion);
      jest
        .spyOn(databaseUtil, 'populateDocument')
        .mockResolvedValueOnce({ error: 'Error while populating' });

      // Making the request
      const response = await supertest(app).post('/question/addQuestion').send(mockQuestion);

      // Asserting the response
      expect(response.status).toBe(500);
    });

    it('should return 500 if tag ids could not be retrieved', async () => {
      jest.spyOn(tagUtil, 'processTags').mockResolvedValue([]);

      // Making the request
      const response = await supertest(app).post('/question/addQuestion').send(mockQuestion);

      // Asserting the response
      expect(response.status).toBe(500);
    });

    it('should return bad request if question title is empty string', async () => {
      // Making the request
      const response = await supertest(app)
        .post('/question/addQuestion')
        .send({ ...mockQuestion, title: '' });

      // Asserting the response
      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid question body');
    });

    it('should return bad request if question text is empty string', async () => {
      // Making the request
      const response = await supertest(app)
        .post('/question/addQuestion')
        .send({ ...mockQuestion, text: '' });

      // Asserting the response
      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid question body');
    });

    it('should return bad request if tags are empty', async () => {
      // Making the request
      const response = await supertest(app)
        .post('/question/addQuestion')
        .send({ ...mockQuestion, tags: [] });

      // Asserting the response
      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid question body');
    });

    it('should return bad request if askedBy is empty string', async () => {
      // Making the request
      const response = await supertest(app)
        .post('/question/addQuestion')
        .send({ ...mockQuestion, askedBy: '' });

      // Asserting the response
      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid question body');
    });

    it('should ensure only unique tags are added', async () => {
      // Mock request body with duplicate tags
      const mockQuestionDuplicates: Question = {
        // _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6fe'),
        title: 'New Question Title',
        text: 'New Question Text',
        tags: [dbTag1, dbTag1, dbTag2, dbTag2], // Duplicate tags
        answers: [],
        askedBy: 'question3_user',
        askDateTime: new Date('2024-06-06'),
        views: [],
        upVotes: [],
        downVotes: [],
        comments: [],
      };

      const result: PopulatedDatabaseQuestion = {
        ...mockQuestionDuplicates,
        _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6fe'),
        tags: [dbTag1, dbTag2], // Duplicate tags
        answers: [],
        comments: [],
      };

      // Set up the mock to resolve with unique tags
      jest.spyOn(tagUtil, 'processTags').mockResolvedValue([dbTag1, dbTag2]);
      jest.spyOn(questionUtil, 'saveQuestion').mockResolvedValueOnce({
        ...result,
        tags: [dbTag1._id, dbTag2._id], // Ensure only unique tags are saved,
        answers: [],
        comments: [],
      });

      jest.spyOn(databaseUtil, 'populateDocument').mockResolvedValueOnce(result);

      // Making the request
      const response = await supertest(app)
        .post('/question/addQuestion')
        .send(mockQuestionDuplicates);

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(simplifyQuestion(result)); // Expect only unique tags
    });
  });

  describe('POST /upvoteQuestion', () => {
    it('should upvote a question successfully', async () => {
      const mockReqBody = {
        qid: '65e9b5a995b6c7045a30d823',
        username: 'new-user',
      };

      const mockResponse = {
        msg: 'Question upvoted successfully',
        upVotes: ['new-user'],
        downVotes: [],
      };

      addVoteToQuestionSpy.mockResolvedValueOnce(mockResponse);

      const response = await supertest(app).post('/question/upvoteQuestion').send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });

    it('should cancel the upvote successfully', async () => {
      const mockReqBody = {
        qid: '65e9b5a995b6c7045a30d823',
        username: 'some-user',
      };

      const mockFirstResponse = {
        msg: 'Question upvoted successfully',
        upVotes: ['some-user'],
        downVotes: [],
      };

      const mockSecondResponse = {
        msg: 'Upvote cancelled successfully',
        upVotes: [],
        downVotes: [],
      };

      addVoteToQuestionSpy.mockResolvedValueOnce(mockFirstResponse);

      const firstResponse = await supertest(app).post('/question/upvoteQuestion').send(mockReqBody);
      expect(firstResponse.status).toBe(200);
      expect(firstResponse.body).toEqual(mockFirstResponse);

      addVoteToQuestionSpy.mockResolvedValueOnce(mockSecondResponse);

      const secondResponse = await supertest(app)
        .post('/question/upvoteQuestion')
        .send(mockReqBody);

      expect(secondResponse.status).toBe(200);
      expect(secondResponse.body).toEqual(mockSecondResponse);
    });

    it('should handle upvote and then downvote by the same user', async () => {
      const mockReqBody = {
        qid: '65e9b5a995b6c7045a30d823',
        username: 'new-user',
      };

      // First upvote the question
      let mockResponseWithBothVotes: VoteResponse = {
        msg: 'Question upvoted successfully',
        upVotes: ['new-user'],
        downVotes: [],
      };

      addVoteToQuestionSpy.mockResolvedValueOnce(mockResponseWithBothVotes);

      let response = await supertest(app).post('/question/upvoteQuestion').send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponseWithBothVotes);

      // Now downvote the question
      mockResponseWithBothVotes = {
        msg: 'Question downvoted successfully',
        downVotes: ['new-user'],
        upVotes: [],
      };

      addVoteToQuestionSpy.mockResolvedValueOnce(mockResponseWithBothVotes);

      response = await supertest(app).post('/question/downvoteQuestion').send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponseWithBothVotes);
    });

    it('should return bad request error if the request had qid missing', async () => {
      const mockReqBody = {
        username: 'some-user',
      };

      const response = await supertest(app).post(`/question/upvoteQuestion`).send(mockReqBody);

      expect(response.status).toBe(400);
    });

    it('should return bad request error if the request had username missing', async () => {
      const mockReqBody = {
        qid: '65e9b5a995b6c7045a30d823',
      };

      const response = await supertest(app).post(`/question/upvoteQuestion`).send(mockReqBody);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /downvoteQuestion', () => {
    it('should downvote a question successfully', async () => {
      const mockReqBody = {
        qid: '65e9b5a995b6c7045a30d823',
        username: 'new-user',
      };

      const mockResponse = {
        msg: 'Question upvoted successfully',
        downVotes: ['new-user'],
        upVotes: [],
      };

      addVoteToQuestionSpy.mockResolvedValueOnce(mockResponse);

      const response = await supertest(app).post('/question/downvoteQuestion').send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });

    it('should cancel the downvote successfully', async () => {
      const mockReqBody = {
        qid: '65e9b5a995b6c7045a30d823',
        username: 'some-user',
      };

      const mockFirstResponse = {
        msg: 'Question downvoted successfully',
        upVotes: [],
        downVotes: ['some-user'],
      };

      const mockSecondResponse = {
        msg: 'Dwonvote cancelled successfully',
        upVotes: [],
        downVotes: [],
      };

      addVoteToQuestionSpy.mockResolvedValueOnce(mockFirstResponse);

      const firstResponse = await supertest(app)
        .post('/question/downvoteQuestion')
        .send(mockReqBody);
      expect(firstResponse.status).toBe(200);
      expect(firstResponse.body).toEqual(mockFirstResponse);

      addVoteToQuestionSpy.mockResolvedValueOnce(mockSecondResponse);

      const secondResponse = await supertest(app)
        .post('/question/downvoteQuestion')
        .send(mockReqBody);

      expect(secondResponse.status).toBe(200);
      expect(secondResponse.body).toEqual(mockSecondResponse);
    });

    it('should handle downvote and then upvote by the same user', async () => {
      const mockReqBody = {
        qid: '65e9b5a995b6c7045a30d823',
        username: 'new-user',
      };

      // First downvote the question
      let mockResponse: VoteResponse = {
        msg: 'Question downvoted successfully',
        downVotes: ['new-user'],
        upVotes: [],
      };

      addVoteToQuestionSpy.mockResolvedValueOnce(mockResponse);

      let response = await supertest(app).post('/question/downvoteQuestion').send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);

      // Then upvote the question
      mockResponse = {
        msg: 'Question upvoted successfully',
        downVotes: [],
        upVotes: ['new-user'],
      };

      addVoteToQuestionSpy.mockResolvedValueOnce(mockResponse);

      response = await supertest(app).post('/question/upvoteQuestion').send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });

    it('should return bad request error if the request had qid missing', async () => {
      const mockReqBody = {
        username: 'some-user',
      };

      const response = await supertest(app).post(`/question/downvoteQuestion`).send(mockReqBody);

      expect(response.status).toBe(400);
    });

    it('should return bad request error if the request had username missing', async () => {
      const mockReqBody = {
        qid: '65e9b5a995b6c7045a30d823',
      };

      const response = await supertest(app).post(`/question/downvoteQuestion`).send(mockReqBody);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /getQuestionById/:qid', () => {
    it('should return a question object in the response when the question id is passed as request parameter', async () => {
      // Mock request parameters
      const mockReqParams = {
        qid: '65e9b5a995b6c7045a30d823',
      };
      const mockReqQuery = {
        username: 'question3_user',
      };

      const populatedFindQuestion = MOCK_POPULATED_QUESTIONS.filter(
        q => q._id.toString() === mockReqParams.qid,
      )[0];

      // Provide mock question data
      jest
        .spyOn(questionUtil, 'fetchAndIncrementQuestionViewsById')
        .mockResolvedValueOnce(populatedFindQuestion);

      // Making the request
      const response = await supertest(app).get(
        `/question/getQuestionById/${mockReqParams.qid}?username=${mockReqQuery.username}`,
      );

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(simplifyQuestion(populatedFindQuestion));
    });

    it('should not return a question object with a duplicated user in the views if the user is viewing the same question again', async () => {
      // Mock request parameters
      const mockReqParams = {
        qid: '65e9b5a995b6c7045a30d823',
      };
      const mockReqQuery = {
        username: 'question2_user',
      };

      const populatedFindQuestion = MOCK_POPULATED_QUESTIONS.filter(
        q => q._id.toString() === mockReqParams.qid,
      )[0];

      // Provide mock question data
      jest
        .spyOn(questionUtil, 'fetchAndIncrementQuestionViewsById')
        .mockResolvedValueOnce(populatedFindQuestion);

      // Making the request
      const response = await supertest(app).get(
        `/question/getQuestionById/${mockReqParams.qid}?username=${mockReqQuery.username}`,
      );

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(simplifyQuestion(populatedFindQuestion));
    });

    it('should return bad request error if the question id is not in the correct format', async () => {
      // Mock request parameters
      const mockReqParams = {
        qid: 'invalid id',
      };
      const mockReqQuery = {
        username: 'question2_user',
      };

      // Making the request
      const response = await supertest(app).get(
        `/question/getQuestionById/${mockReqParams.qid}?username=${mockReqQuery.username}`,
      );

      // Asserting the response
      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid ID format');
    });

    it('should return bad request error if the username is not provided', async () => {
      // Mock request parameters
      const mockReqParams = {
        qid: '65e9b5a995b6c7045a30d823',
      };

      // Making the request
      const response = await supertest(app).get(`/question/getQuestionById/${mockReqParams.qid}`);

      // Asserting the response
      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid username requesting question.');
    });

    it('should return database error if the question id is not found in the database', async () => {
      // Mock request parameters
      const mockReqParams = {
        qid: '65e9b5a995b6c7045a30d823',
      };
      const mockReqQuery = {
        username: 'question2_user',
      };

      jest
        .spyOn(questionUtil, 'fetchAndIncrementQuestionViewsById')
        .mockResolvedValueOnce({ error: 'Failed to get question.' });

      // Making the request
      const response = await supertest(app).get(
        `/question/getQuestionById/${mockReqParams.qid}?username=${mockReqQuery.username}`,
      );

      // Asserting the response
      expect(response.status).toBe(500);
      expect(response.text).toBe(
        'Error when fetching question by id: Error while fetching question by id',
      );
    });

    it('should return bad request error if an error occurs when fetching and updating the question', async () => {
      // Mock request parameters
      const mockReqParams = {
        qid: '65e9b5a995b6c7045a30d823',
      };
      const mockReqQuery = {
        username: 'question2_user',
      };

      jest
        .spyOn(questionUtil, 'fetchAndIncrementQuestionViewsById')
        .mockResolvedValueOnce({ error: 'Error when fetching and updating a question' });

      // Making the request
      const response = await supertest(app).get(
        `/question/getQuestionById/${mockReqParams.qid}?username=${mockReqQuery.username}`,
      );

      // Asserting the response
      expect(response.status).toBe(500);
      expect(response.text).toBe(
        'Error when fetching question by id: Error while fetching question by id',
      );
    });
  });

  describe('GET /getQuestion', () => {
    it('should return the result of filterQuestionsBySearch as response even if request parameters of order and search are absent', async () => {
      getQuestionsByOrderSpy.mockResolvedValueOnce(MOCK_POPULATED_QUESTIONS);
      filterQuestionsBySearchSpy.mockReturnValueOnce(MOCK_POPULATED_QUESTIONS);
      // Making the request
      const response = await supertest(app).get('/question/getQuestion');

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(EXPECTED_QUESTIONS);
    });

    it('should return the result of filterQuestionsBySearch as response for an order and search criteria in the request parameters', async () => {
      // Mock request query parameters
      const mockReqQuery = {
        order: 'dummyOrder',
        search: 'dummySearch',
      };

      getQuestionsByOrderSpy.mockResolvedValueOnce(MOCK_POPULATED_QUESTIONS);
      filterQuestionsBySearchSpy.mockReturnValueOnce(MOCK_POPULATED_QUESTIONS);

      // Making the request
      const response = await supertest(app).get('/question/getQuestion').query(mockReqQuery);

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(EXPECTED_QUESTIONS);
    });

    it('should return error if getQuestionsByOrder throws an error', async () => {
      // Mock request query parameters
      const mockReqQuery = {
        order: 'dummyOrder',
        search: 'dummySearch',
      };
      getQuestionsByOrderSpy.mockRejectedValueOnce(new Error('Error fetching questions'));
      // Making the request
      const response = await supertest(app).get('/question/getQuestion').query(mockReqQuery);

      // Asserting the response
      expect(response.status).toBe(500);
    });

    it('should return error if filterQuestionsBySearch throws an error', async () => {
      // Mock request query parameters
      const mockReqQuery = {
        order: 'dummyOrder',
        search: 'dummySearch',
      };
      getQuestionsByOrderSpy.mockResolvedValueOnce(MOCK_POPULATED_QUESTIONS);
      filterQuestionsBySearchSpy.mockImplementationOnce(() => {
        throw new Error('Error filtering questions');
      });
      // Making the request
      const response = await supertest(app).get('/question/getQuestion').query(mockReqQuery);

      // Asserting the response
      expect(response.status).toBe(500);
    });
  });
});
