import { render } from '@czechitas/render';
import { Post } from '../components/Post';
import '../global.css';
import './index.css';

const loggedInUserId = 2;
const response = await fetch(
  `http://localhost:4000/api/users/${loggedInUserId}`,
);
const json = await response.json();
const loggedInUser = json.data;
console.log(loggedInUser);

let editedPost = null;

const fetchPosts = async () => {
  const response = await fetch(`http://localhost:4000/api/posts`);
  const json = await response.json();
  return json.data;
};

const posts = await fetchPosts();

document.querySelector('#root').innerHTML = render(
  <div className="container">
    <h1>The Chirp</h1>
    <p>Prihlasen jako: {loggedInUser.name}</p>
    <form className="post-form">
      <p>Co máte na srdci?</p>
      <textarea placeholder="Napište něco..." className="post-input"></textarea>
      <button type="submit">Odeslat</button>
    </form>

    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  </div>,
);

const form = document.querySelector('.post-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = document.querySelector('.post-input');
  const text = input.value;

  if (editedPost !== null) {
    await fetch(`http://localhost:4000/api/posts/${editedPost.id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({
        userName: editedPost.userName,
        userId: editedPost.userId,
        userHandle: editedPost.userHandleandle,
        userAvatar: editedPost.userAvatar,
        text: input.value,
        likes: editedPost.likes,
      }),
    });
    //console.log('Editovany text: dnes je krasny den');
  } else {
    await fetch('http://localhost:4000/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        userName: loggedInUser.name,
        userId: loggedInUser.id,
        userHandle: loggedInUser.handle,
        userAvatar: loggedInUser.avatar,
        text: input.value,
        likes: 0,
      }),
    });
  }
  window.location.reload();
});

const deleteButtons = document.querySelectorAll('.delete-btn');
deleteButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const postId = button.dataset.id;
    const response = await fetch(`http://localhost:4000/api/posts/${postId}`, {
      method: 'DELETE',
    });
    window.location.reload();
    console.log('postId', postId);
  });
});

const editButtons = document.querySelectorAll('.edit-btn');
editButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const postId = button.dataset.id;
    const post = posts.find((post) => post.id === Number(postId));
    //console.log('post', post);
    const text = (document.querySelector('.post-input').value = post.text);
    //console.log('text', text);
    editedPost = post;
  });
});
