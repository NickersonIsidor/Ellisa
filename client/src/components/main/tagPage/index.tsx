import React from 'react';
import './index.css';
import TagView from './tag';
import useTagPage from '../../../hooks/useTagPage';
import AskQuestionButton from '../askQuestionButton';

const TagPage = () => {
  const { tlist, clickTag } = useTagPage();

  return (
    <main className='tag-page' role='main' aria-labelledby='tags-heading'>
      <div className='space_between right_padding'>
        <h1 id='tags-heading' className='bold_title'>
          {tlist.length} Tags
        </h1>
        <h2 className='bold_title'>All Tags</h2>
        <AskQuestionButton />
      </div>

      <section className='tag_list right_padding' aria-label='List of Tags' aria-live='polite'>
        {tlist.map((t, index) => (
          <TagView
            key={t.name}
            t={t}
            clickTag={clickTag}
            aria-posinset={index + 1}
            aria-setsize={tlist.length}
          />
        ))}
      </section>

      {(!tlist.length || tlist.length === 0) && (
        <div className='bold_title right_padding no-results' role='alert' aria-live='assertive'>
          No Tags Found
        </div>
      )}
    </main>
  );
};

export default TagPage;
