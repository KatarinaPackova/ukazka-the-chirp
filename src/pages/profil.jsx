import { render } from '@czechitas/render';
import '../global.css';

const params = new URLSearchParams(window.location.search);
const id = params.get('user');
/* ta promenna se muze jmenovat jak chceme, tady se jmenuje id ale muze to byt mrkev, palacinka a pod. ale to co je v zavorce musi byt presne to co je za otaznikem v url, takze se podivam na toho uzivatele a tam vidim ze je ?user=0 a dalsi cisla dalsich useru takze to slovo user musim presne pouzit */

const response = await fetch(`http://localhost:4000/api/users/${id}`);
const json = await response.json();
const user = json.data;

console.log(response);
console.log(json);

document.querySelector('#root').innerHTML = render(
  <div>
    <div className="header">
      <h1>{user.name}</h1>
      <img
        src={`http://localhost:4000${user.avatar}`}
        alt="Avatar"
        className="post__avatar"
      />
    </div>
    <p>{user.bio}</p>
  </div>,
);
