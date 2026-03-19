import CheckMyPost from "./CheckMyPost.js";

const token = localStorage.getItem("token");
const postEl = document.getElementById("post");
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");
let isMyPost = false;
const commentsPost = document.getElementById("commentsPost");
const commentsBtn = document.getElementById("commentsBtn");

async function loadPost() {
  if (!postId) {
    postEl.innerHTML = "<p>잘못된 접근입니다.</p>";
    return;
  }

  try {
    if (token != null) {
      isMyPost = CheckMyPost(token, postId);
    }

    const res = await fetch(
      "https://api.fullstackfamily.com/api/edu/ws-1c07e0/posts/" + postId,
    );

    if (!res.ok) {
      throw new Error("HTTP 오류: " + res.status);
    }

    const resJson = await res.json();
    const post = resJson.data;
    const [date, time] = post.createdAt.split("T");

    postEl.innerHTML = `
            <div class="post-box">
              <div class="post-title">${post.title}</div>
              <div class="post-meta">
                <span>👤 ${post.authorNickname}</span>
                <span>👀 조회 ${post.viewCount}</span>
                <span>💬 댓글 ${post.commentCount}</span>
              </div>
              <div class="post-date">🕐 ${date} ${time}</div>
              <div class="post-content">${post.content}</div>
            </div>
          `;

    if (isMyPost) {
      const frag = document.createDocumentFragment();

      const editPost = document.createElement("button");
      editPost.id = "editPost";
      editPost.textContent = "수정하기";
      const deletePost = document.createElement("button");
      deletePost.id = "deletePost";
      deletePost.textContent = "삭제하기";

      editPost.addEventListener("click", function () {
        window.location.replace(`/editPost.html?id=${postId}`);
      });

      deletePost.addEventListener("click", async function () {
        if (!confirm("정말로 삭제하시겠습니까?")) return;

        try {
          const res = await fetch(
            "https://api.fullstackfamily.com/api/edu/ws-1c07e0/posts/" + postId,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!res.ok) {
            throw new Error("삭제 실패: " + res.status);
          }
          alert("삭제가 완료되었습니다.");
          location.replace("index.html");
        } catch (error) {
          postEl.innerHTML = "<p>에러: " + error.message + "</p>";
        }
      });

      frag.appendChild(editPost);
      frag.appendChild(deletePost);

      const postBox = document.querySelector(".post-box");
      postBox.appendChild(frag);
    }
  } catch (error) {
    postEl.innerHTML = "<p>에러: " + error.message + "</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadPost);
commentsBtn.addEventListener("click", async function () {
  if (commentsPost.value.length === 0) {
    alert("댓글 내용을 입력해주세요!");
    return;
  }

  const data = { content: commentsPost.value };

  try {
    const resComment = await fetch(
      "https://api.fullstackfamily.com/api/edu/ws-1c07e0/posts/" +
        postId +
        "/comments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      },
    );
    if (!resComment.ok) {
      throw new Error("에러 : " + resComment.status);
    }
  } catch (error) {
    console.log("에러 메세지" + error.message);
  }
});
