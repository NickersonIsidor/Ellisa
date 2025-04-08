import React from 'react';
import useNewQuestion from '../../../hooks/useNewQuestion';
import Form from '../baseComponents/form';
import Input from '../baseComponents/input';
import TextArea from '../baseComponents/textarea';
import './index.css';

const NewQuestionPage = () => {
  const {
    title,
    setTitle,
    text,
    setText,
    tagNames,
    setTagNames,
    titleErr,
    textErr,
    tagErr,
    postQuestion,
  } = useNewQuestion();

  return (
    <main role='main' aria-labelledby='new-question-heading' className='new-question-page'>
      <Form>
        <h1 id='new-question-heading' className='sr-only'>
          Ask a New Question
        </h1>

        <Input
          title={'Question Title'}
          hint={'Limit title to 100 characters or less'}
          id={'formTitleInput'}
          val={title}
          setState={setTitle}
          err={titleErr}
          aria-describedby='title-requirements'
        />
        <p id='title-requirements' className='sr-only'>
          Title must be 100 characters or less and describe your question clearly
        </p>

        <TextArea
          title={'Question Text'}
          hint={'Add details'}
          id={'formTextInput'}
          val={text}
          setState={setText}
          err={textErr}
          aria-describedby='text-requirements'
        />
        <p id='text-requirements' className='sr-only'>
          Provide detailed information about your question. Hyperlinks are allowed.
        </p>

        <Input
          title={'Tags'}
          hint={'Add keywords separated by whitespace'}
          id={'formTagInput'}
          val={tagNames}
          setState={setTagNames}
          err={tagErr}
          aria-describedby='tag-requirements'
        />
        <p id='tag-requirements' className='sr-only'>
          Add 1-5 tags, each tag up to 20 characters long
        </p>

        <div className='btn_indicator_container'>
          <button className='form_postBtn' onClick={postQuestion} aria-label='Submit New Question'>
            Post Question
          </button>
          <div className='mandatory_indicator' aria-live='polite'>
            * indicates mandatory fields
          </div>
        </div>
      </Form>
    </main>
  );
};

export default NewQuestionPage;
