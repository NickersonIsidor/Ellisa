import './index.css';
import React from 'react';
import Form from '../baseComponents/form';
import TextArea from '../baseComponents/textarea';
import useAnswerForm from '../../../hooks/useAnswerForm';

const NewAnswerPage = () => {
  const { text, textErr, setText, postAnswer } = useAnswerForm();

  return (
    <main role='main' aria-labelledby='new-answer-heading' className='new-answer-page'>
      <Form>
        <h1 id='new-answer-heading' className='sr-only'>
          Provide a New Answer
        </h1>

        <TextArea
          title={'Answer Text'}
          id={'answerTextInput'}
          val={text}
          setState={setText}
          err={textErr}
          aria-describedby='answer-requirements'
        />
        <p id='answer-requirements' className='sr-only'>
          Provide a comprehensive and helpful answer to the question. Hyperlinks are allowed.
        </p>

        <div className='btn_indicator_container'>
          <button className='form_postBtn' onClick={postAnswer} aria-label='Submit New Answer'>
            Post Answer
          </button>
          <div className='mandatory_indicator' aria-live='polite'>
            * indicates mandatory fields
          </div>
        </div>
      </Form>
    </main>
  );
};

export default NewAnswerPage;
