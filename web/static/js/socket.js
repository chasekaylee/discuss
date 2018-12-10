import { Socket } from "phoenix";

let socket = new Socket("/socket", { params: { token: window.userToken } });

socket.connect();


const createSocket = (topicID) => {
  // Now that you are connected, you can join channels with a topic:
  let channel = socket.channel(`comments:${topicID}`, {});
  channel.join()
    .receive("ok", (resp) => {
      console.log(resp)
      renderComments(resp.comments);
    })
    .receive("error", resp => { console.log("Unable to join", resp) })


  channel.on(`comments:${topicID}:new`, renderComment);


  document.querySelector('button').addEventListener('click', () => {
    const content = document.querySelector('textarea').value;

    channel.push('comment:add', { content });
  });
};

function commentTemplate(comment) {
  let email = 'Anonymous';
  if (comment.user) {
    email = comment.user.email;
  }
  return `
      <li class="collection-item">
        ${comment.content}
        <div class="secondary-content">
        ${email}
        </div>
      </li>
    `;
}

const renderComments = (comments) => {
  const renderedComments = comments.map(comment => (
    commentTemplate(comment)
  ))

  document.querySelector('.collection').innerHTML = renderedComments.join('');
};

const renderComment = (event) => {
  const renderedComment = commentTemplate(event.comment);

  document.querySelector('.collection').innerHTML += renderedComment;
};

window.createSocket = createSocket;
