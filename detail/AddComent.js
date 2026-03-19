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
