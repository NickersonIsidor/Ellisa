import React from 'react';
import { getMetaData } from '../../../tool';
import AnswerView from './answer';
import AnswerHeader from './header';
import { Comment } from '../../../types/types';
import './index.css';
import QuestionBody from './questionBody';
import VoteComponent from '../voteComponent';
import CommentSection from '../commentSection';
import useAnswerPage from '../../../hooks/useAnswerPage';

const AnswerPage = () => {
  const { questionID, question, handleNewComment, handleNewAnswer } = useAnswerPage();

  if (!question) {
    return (
      <main role='main' aria-label='Loading Question' className='loading-state'>
        Loading question...
      </main>
    );
  }

  return (
    <main className='answer-page' role='main' aria-labelledby='question-title'>
      <VoteComponent question={question} aria-label='Vote on this question' />

      <AnswerHeader ansCount={question.answers.length} title={question.title} />

      <article className='question-details' aria-labelledby='question-body-heading'>
        <QuestionBody
          views={question.views.length}
          text={question.text}
          askby={question.askedBy}
          meta={getMetaData(new Date(question.askDateTime))}
        />

        <CommentSection
          comments={question.comments}
          handleAddComment={(comment: Comment) => handleNewComment(comment, 'question', questionID)}
          aria-label='Comments on the question'
        />
      </article>

      <section className='answers-section' aria-labelledby='answers-heading'>
        <h2 id='answers-heading' className='sr-only'>
          Answers to this Question
        </h2>

        {question.answers.map((a, index) => (
          <AnswerView
            key={String(a._id)}
            text={a.text}
            ansBy={a.ansBy}
            meta={getMetaData(new Date(a.ansDateTime))}
            comments={a.comments}
            handleAddComment={(comment: Comment) =>
              handleNewComment(comment, 'answer', String(a._id))
            }
            aria-posinset={index + 1}
            aria-setsize={question.answers.length}
          />
        ))}
      </section>

      <button
        className='bluebtn ansButton'
        onClick={handleNewAnswer}
        aria-label='Add a New Answer to this Question'>
        Answer Question
      </button>
    </main>
  );
};

export default AnswerPage;
