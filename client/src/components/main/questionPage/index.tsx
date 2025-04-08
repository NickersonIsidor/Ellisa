import React from 'react';
import './index.css';
import QuestionHeader from './header';
import QuestionView from './question';
import useQuestionPage from '../../../hooks/useQuestionPage';

const QuestionPage = () => {
  const { titleText, qlist, setQuestionOrder } = useQuestionPage();

  return (
    <main className='question-page' role='main' aria-labelledby='questions-heading'>
      <QuestionHeader
        titleText={titleText}
        qcnt={qlist.length}
        setQuestionOrder={setQuestionOrder}
      />

      <section id='question_list' className='question_list' aria-label='List of Questions'>
        {qlist.map((q, index) => (
          <QuestionView
            question={q}
            key={String(q._id)}
            aria-posinset={index + 1}
            aria-setsize={qlist.length}
          />
        ))}
      </section>

      {titleText === 'Search Results' && !qlist.length && (
        <div className='bold_title right_padding no-results' role='alert' aria-live='polite'>
          No Questions Found
        </div>
      )}
    </main>
  );
};

export default QuestionPage;
