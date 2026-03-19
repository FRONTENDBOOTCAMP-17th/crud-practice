# 댓글달기

댓글달기 기능을 위해 필요한 함수를 정의한다.

## 댓글달기 로직

1. 댓글 입력 폼에 댓글의 내용을 입력한다.
2. 댓글 등록 버튼을 누른다.
3. 서버로 댓글 내용으로 POST 요청을 구성해서 보낸다.
4. 응답이 ok인 것을 확인하고 페이지를 새로고침한다.
5. ok가 아니라면 댓글 등록에 실패한 것 이므로 에러를 발생하고 처리한다.(try-catch이용)
6. 사용자가 댓글 내용을 입력하지 않고 등록버튼을 눌렀다
7. 내용을 입력하라고 alert를 보여준다.
8. 댓글 등록 로직은 수행하지않는다.

## 댓글달기 api 명세 작성

```js
/**
 * 현재 게시글에 댓글을 추가한다.
 *
 * @param {string} token localStorage에 저장된 인증토큰
 * @param {string} postId 현재 게시글의 id값
 * @param {string} content 댓글 내용
 *
 * @returns {boolean} 댓글 추가 성공 여부를 true/false로 반환
 *
 * @example
 * const result = AddComent(token, postId, content);
 */
```

## api 명세서대로 함수 구현

```js
export default async function AddComent(token, postId, content) {
  try {
    const res = await fetch(
      "https://api.fullstackfamily.com/api/edu/ws-1c07e0/posts/" +
        postId +
        "/comments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      },
    );

    if (!res.ok) {
      throw new Error("에러 : " + res.status);
    }

    return true;
  } catch (error) {
    console.log("에러 메세지" + error.message);
    return false;
  }
}
```

# 댓글 목록 불러오기

현재 게시글에 달린 댓글 목록을 불러온다.

## 댓글 목록 불러오기 로직

1. 사용자가 상세 게시글 페이지에 들어온다.
2. DOMContentLoaded 이벤트리스너를 등록해서 페이지 접속과 동시에 가져올 수 있도록 한다.
3. 현재 게시글 id를 url 파라미터에 포함하여 GET 요청을 보낸다.
4. 응답으로 ok를 받는다.
5. 응답은 댓글데이터를 배열로 구성해서 보내주기 때문에, 반복문을 이용해서 댓글 아이템을 구성한다.
6. 데이터가 비어있다면, 댓글 컨테이너에 등록된 댓글이 없다고 알린다.'

## 댓글 목록 불러오기 api 명세서 작성

```js
/**
 * postId에 해당하는 댓글 리스트를 불러옵니다.
 *
 * @param {string} postId 현재 게시글의 id값
 *
 * @example
 * RoadComments(postId);
 *
 */
```

## api명세서대로 댓글 목록 불러오기 함수 구현

```js
export default async function RoadComments(postId) {
  const comments = document.getElementById("comments");
  const res = await fetch(
    `https://api.fullstackfamily.com/api/edu/ws-1c07e0/posts/${postId}/comments`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error("오류: " + res.status);
  }
  const { data } = await res.json();

  if (!data || data.length === 0) {
    comments.innerHTML = "<p>등록된 댓글이 없습니다.</p>";
    return;
  }

  comments.innerHTML = "";

  data.forEach((post) => {
    const [date, time] = post.createdAt.split("T");
    const item = document.createElement("div");
    item.className = "comment-item";
    item.innerHTML = `
              <div class="comment-author">${post.authorNickname}</div>
              <div class="comment-date"> ${date} ${time}</div>
              <div class="comment-content"> ${post.content}</div>
            `;
    comments.appendChild(item);
  });
}
```

# 내 게시글인지 확인하기

수정, 삭제 버튼이 보여질지 아닐지를 확인하기 위해 내 게시글인지 확인한다.

## 내 게시글인지 확인하기 로직

1. localStorage에 저장된 token으로 /post/my 요청을 보낸다.
2. 응답이 ok라면 게시글 목록으로 해당 게시글이 내 게시글인지 확인한다.
3. 응답이 게시글 목록을 배열로 구성하여 주기 때문에 반복문을 이용하여 현재 게시글의 id와 일치하는 게시글이 있는지 확인한다.
4. 일치하는 게시글이 있다면 true를 반환한다.
5. 없으면 false를 반환한다.

## 내 게시글인지 확인하기 api 명세서 작성

```js
/**
 * localStorage의 인증토큰의 유무로 해당 게시글의 나의 게시글인지 확인합니다.
 *
 * @param {string} token localStorage에 저장된 인증토큰
 * @param {string} postId 현재 게시글의 id값
 *
 * @returns {boolean} 해당 게시글이 나의 게시글인지 아닌지 여부를 true/false로 반환
 *
 * @example
 * CheckMyPost(token, "12"); //true (id 12가 내 게시글인 경우)
 * CheckMyPost(token, "98"); //false (id 98이 내 게시글이 아닌 경우 )
 */
```

## api먕세서대로 내 게시글인지 확인하기 함수 구현

```js
export default async function CheckMyPost(token, postId) {
  const res = await fetch(
    "https://api.fullstackfamily.com/api/edu/ws-1c07e0/posts/my",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("HTTP 오류: " + res.status);
  }
  const { data } = await res.json();

  for (let i = 0; i < data.length; i++) {
    if (data[i].id === Number.parseInt(postId)) {
      return true;
    }
  }

  return false;
}
```
