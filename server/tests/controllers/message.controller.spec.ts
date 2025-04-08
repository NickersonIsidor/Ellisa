import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../../app';
import * as util from '../../services/message.service';
import { DatabaseMessage, Message } from '../../types/types';

const saveMessageSpy = jest.spyOn(util, 'saveMessage');
const getMessagesSpy = jest.spyOn(util, 'getMessages');

describe('POST /addMessage', () => {
  it('should add a new message', async () => {
    const validId = new mongoose.Types.ObjectId();

    const requestMessage: Message = {
      msg: 'Hello',
      msgFrom: 'User1',
      msgDateTime: new Date('2024-06-04'),
      type: 'global',
    };

    const message: DatabaseMessage = {
      ...requestMessage,
      _id: validId,
    };

    saveMessageSpy.mockResolvedValue(message);

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: requestMessage });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: message._id.toString(),
      msg: message.msg,
      msgFrom: message.msgFrom,
      msgDateTime: message.msgDateTime.toISOString(),
      type: 'global',
    });
  });

  it('should return bad request error if messageToAdd is missing', async () => {
    const response = await supertest(app).post('/messaging/addMessage').send({});

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad message body error if msg is empty', async () => {
    const badMessage = {
      msg: '',
      msgFrom: 'User1',
      msgDateTime: new Date('2024-06-04'),
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: badMessage });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message body');
  });

  it('should return bad message body error if msg is missing', async () => {
    const badMessage = {
      msgFrom: 'User1',
      msgDateTime: new Date('2024-06-04'),
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: badMessage });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message body');
  });

  it('should return bad message body error if msgFrom is empty', async () => {
    const badMessage = {
      msg: 'Hello',
      msgFrom: '',
      msgDateTime: new Date('2024-06-04'),
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: badMessage });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message body');
  });

  it('should return bad message body error if msgFrom is missing', async () => {
    const badMessage = {
      msg: 'Hello',
      msgDateTime: new Date('2024-06-04'),
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: badMessage });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message body');
  });

  it('should return bad message body error if msgDateTime is missing', async () => {
    const badMessage = {
      msg: 'Hello',
      msgFrom: 'User1',
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: badMessage });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message body');
  });

  it('should return bad message body error if msgDateTime is null', async () => {
    const badMessage = {
      msg: 'Hello',
      msgFrom: 'User1',
      msgDateTime: null,
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: badMessage });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message body');
  });

  it('should return internal server error if saveMessage fails', async () => {
    const validId = new mongoose.Types.ObjectId();
    const message = {
      _id: validId,
      msg: 'Hello',
      msgFrom: 'User1',
      msgDateTime: new Date('2024-06-04'),
    };

    saveMessageSpy.mockResolvedValue({ error: 'Error saving document' });

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: message });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding a message: Error saving document');
  });
});

describe('GET /getMessages', () => {
  it('should return all messages', async () => {
    const message1: Message = {
      msg: 'Hello',
      msgFrom: 'User1',
      msgDateTime: new Date('2024-06-04'),
      type: 'global',
    };

    const message2: Message = {
      msg: 'Hi',
      msgFrom: 'User2',
      msgDateTime: new Date('2024-06-05'),
      type: 'global',
    };

    const dbMessage1: DatabaseMessage = {
      ...message1,
      _id: new mongoose.Types.ObjectId(),
    };

    const dbMessage2: DatabaseMessage = {
      ...message2,
      _id: new mongoose.Types.ObjectId(),
    };

    getMessagesSpy.mockResolvedValue([dbMessage1, dbMessage2]);

    const response = await supertest(app).get('/messaging/getMessages');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        ...dbMessage1,
        _id: dbMessage1._id.toString(),
        msgDateTime: dbMessage1.msgDateTime.toISOString(),
      },
      {
        ...dbMessage2,
        _id: dbMessage2._id.toString(),
        msgDateTime: dbMessage2.msgDateTime.toISOString(),
      },
    ]);
  });
});
