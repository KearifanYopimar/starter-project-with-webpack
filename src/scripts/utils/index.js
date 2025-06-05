const createStoryItemTemplate = (story) => `
  <article role="article">
    <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name}" loading="lazy">
    <h3>${story.name}</h3>
    <p>${story.description}</p>
    <p>Dibuat pada: ${new Date(story.createdAt).toLocaleDateString('id-ID')}</p>
  </article>
`;

export { createStoryItemTemplate };