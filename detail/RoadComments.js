/**
 * postId에 해당하는 댓글 리스트를 불러옵니다.
 *
 * @param {string} postId 현재 게시글의 id값
 *
 * @example
 * RoadComments(postId);
 *
 */
export default async function RoadComments(postId) {
  const comments = document.getElementById('comments');
  const res = await fetch(
    `https://api.fullstackfamily.com/api/edu/ws-1c07e0/posts/${postId}/comments`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!res.ok) {
    throw new Error('오류: ' + res.status);
  }
  const { data } = await res.json();

  if (!data || data.length === 0) {
    comments.innerHTML = '<p>등록된 댓글이 없습니다.</p>';
    return;
  }

  comments.innerHTML = '';

  data.forEach((post) => {
    const [date, time] = post.createdAt.split('T');
    const item = document.createElement('div');
    item.className = 'comment-item';
    item.innerHTML = `
              <div class="comment-author">${post.authorNickname}</div>
              <div class="comment-date"> ${date} ${time}</div>
              <div class="comment-content"> ${post.content}</div>
            `;
    comments.appendChild(item);
  });
}
