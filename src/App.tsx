import React, { useMemo } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from "react-bootstrap";
import { NewNote } from "./components/NewNote";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { v4 as uuidV4 } from 'uuid';
import { NoteList } from "./components/NoteList";
import { NoteLayout } from "./layout/NoteLayout";
import { Note } from "./components/Note";
import { EditNote } from "./components/EditNote";

export type Note = {
  id: string;
} & NoteData

export type RawNote = {
  id: string;
} & RowNoteData

export type RowNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
}

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
}

export type Tag = {
  id: string;
  label: string;
}


const App: React.FC = () => {
  const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', []);
  const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', []);

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
    })
  }, [notes, tags])


  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes(prevNotes => [...prevNotes,
    {
      ...data,
      id: uuidV4(),
      tagIds: tags.map(tag => tag.id)
    }])
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return { ...note, ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) }
        } else return note;
      })
    })
  }


  function onDelete(id: string) {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id))
  }

  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }

  function updateTag(id: string, label: string) {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.id === id) {
          return { ...tag, label }
        } else return tag;
      })
    })
  }

  function deleteTag(id: string) {
    setTags(prevTags => prevTags.filter(tag => tag.id !== id))
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<NoteList
          notes={notesWithTags}
          availableTags={tags}
          onUpdateTag={updateTag}
          onDeleteTag={deleteTag}
        />} />
        <Route path="/new" element={<NewNote
          onSubmit={onCreateNote}
          onAddTag={addTag}
          availableTags={tags} />} />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDelete} />} />
          <Route path="edit" element={<EditNote
            onSubmit={onUpdateNote}
            onAddTag={addTag}
            availableTags={tags}
          />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;