import React from 'react';
import { ObjectId } from 'mongodb';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { getMetaData } from '../../../../tool';
import { PopulatedDatabaseQuestion } from '../../../../types/types';

interface QuestionProps {
  question: PopulatedDatabaseQuestion;
}

const QuestionView = ({ question }: QuestionProps) => {
  const navigate = useNavigate();

  const clickTag = (tagName: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('tag', tagName);
    navigate(`/home?${searchParams.toString()}`);
  };

  const handleAnswer = (questionID: ObjectId) => {
    navigate(`/question/${questionID}`);
  };

  return (
    <article
      className='question right_padding'
      onClick={() => {
        if (question._id) {
          handleAnswer(question._id);
        }
      }}
      role='article'
      aria-labelledby={`question-title-${question._id}`}>
      <div className='postStats' aria-label='Question Statistics'>
        <div aria-label='Number of Answers' role='status'>
          {question.answers.length || 0} answers
        </div>
        <div aria-label='Number of Views' role='status'>
          {question.views.length} views
        </div>
      </div>

      <div className='question_mid'>
        <h2 id={`question-title-${question._id}`} className='postTitle'>
          {question.title}
        </h2>

        <div className='question_tags' aria-label='Question Tags'>
          {question.tags.map(tag => (
            <button
              key={String(tag._id)}
              className='question_tag_button'
              onClick={e => {
                e.stopPropagation();
                clickTag(tag.name);
              }}
              aria-label={`Filter questions by tag: ${tag.name}`}>
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <div className='lastActivity' aria-label='Question Activity Details'>
        <div className='question_author' aria-label={`Question asked by ${question.askedBy}`}>
          {question.askedBy}
        </div>
        <div>&nbsp;</div>
        <div
          className='question_meta'
          aria-label={`Asked ${getMetaData(new Date(question.askDateTime))}`}>
          asked {getMetaData(new Date(question.askDateTime))}
        </div>
      </div>
    </article>
  );
};

export default QuestionView;
