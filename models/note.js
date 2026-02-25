let notes = [
  {
    id: 121,
    title: "Hanoman",
    content: "Legendary monkey god in Hindu mythology",
  },
];

export const list = () => {
  return notes.map(({ id, title, content }) => ({
    id,
    title,
    content,
  }));
};

export const get = (id) => {
  const note = notes.find((note) => note.id === id);

  if (!note) {
    throw new Error("Note not found");
  }

  return note;
};

export const create = (title, content) => {
  const { id: lastId } = notes[notes.length - 1];

  const newNote = {
    id: lastId + 1,
    title,
    content,
  };

  notes.push(newNote);
  return newNote;
};

export const update = (id, title, content) => {
  const index = notes.findIndex((note) => note.id === id);

  if (index < 0) {
    throw new Error("Note not found for update");
  }

  const note = notes[index];
  note.title = title;
  note.content = content;
  notes[index] = note;

  return note;
};

export const remove = (id) => {
  if (!notes.some((note) => note.id === id)) {
    throw new Error("Note not found for delete");
  }

  notes = notes.filter((note) => note.id !== id);
};