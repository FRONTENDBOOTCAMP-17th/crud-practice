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
