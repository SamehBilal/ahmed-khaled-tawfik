/* «حكايات القرّاء» (reader-stories.html): readers' own stories of him and his books, sent in by email or on GitHub and
   published only with their sender's leave — never written here for them. Newest first. Each:
   {
     name: { ar, en },        // as the reader wants to be named: a full name, a first name, or initials
     city: { ar, en },        // optional
     first: 1998,             // optional: the year they first read him
     book: 'mwt-1',           // optional: the book or issue they started with (a work id, a series issue id like mwt-1, or a title)
     text: { ar, en },        // the story, in the reader's own words (lightly edited for length, with their agreement)
     date: '2026-11-04',      // when it was published here
     photo: 'assets/img/readers/…'   // optional, the reader's own photo with him or of their copy, sent with leave to show it
   }
*/
window.AKT = window.AKT || {};
window.AKT.readerStories = [];
