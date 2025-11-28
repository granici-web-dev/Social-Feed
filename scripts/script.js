const BASE_URL = 'https://jsonplaceholder.typicode.com';
const postContainer = document.querySelector('.postContainer');

let postList = [];

const getPosts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/posts`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    const data = await response.json();  
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getComments = async () => {
  try {
    const response = await fetch(`${BASE_URL}/comments`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

Promise.all([getPosts(), getUsers(), getComments()])
.then(([posts, users, comments]) => {
  postList = mergeTodosWithUsersWithComments(posts, users, comments);
  renderPosts(postList);
})

const mergeTodosWithUsersWithComments = (posts, users, comments) => {
  return posts.map((post) => {
    const user = users.find((u) => u.id === post.userId);
    const comment = comments.filter((c) => c.postId === post.id);
    return {
      postId: post.id,
      title: post.title,
      postBody: post.body,

      userId: user.id,
      email: user.email,
      name: user.name,

      comments: comment,
      commentsCount: comment.length,
    };
  })
};

const createPostElement = (post) => {
  const container = document.createElement('div');
  container.classList.add('postCard');
  const commentBox = document.createElement('div');
  commentBox.classList.add('commentBox');
  commentBox.style.display = 'none';

  const spanTitle = document.createElement('h3');
  const spanBody = document.createElement('span');
  const spanName = document.createElement('h5');
  const spanComments = document.createElement('span');
  const commentsBtn = document.createElement('button');

  spanTitle.textContent = post.title;
  spanBody.textContent = post.postBody;
  spanName.textContent = post.name;
  spanComments.innerHTML = `Comments: ${post.commentsCount}`;
  commentsBtn.textContent = 'Show comments';

  post.comments.forEach((comment) => {
    const p = document.createElement('p');
    p.innerHTML = `<h4>${comment.name}:</h4> <p>${comment.body}</p>`;
    commentBox.appendChild(p);
  });

  commentsBtn.addEventListener('click', () => {
    const isHidden = commentBox.style.display === 'none';
    commentBox.style.display = isHidden ? 'block' : 'none';
    commentsBtn.textContent = isHidden ? 'Hide comments' : 'Show comments';
  })

  container.append(spanTitle, spanBody, spanName, spanComments, commentsBtn, commentBox);
  return container;
};

const renderPosts = (posts) => {
  postContainer.innerHTML = '';

  posts.forEach((post) => {
    const childPost = createPostElement(post);
    postContainer.appendChild(childPost);
  })
}

