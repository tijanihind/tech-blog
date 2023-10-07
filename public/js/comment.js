const commentFormHandler = async function (event) {
  event.preventDefault();

  const post_id = document.querySelector('input[name="post-id"]').value;
  const body = document.querySelector('input[name="comment-body"]').value;

  console.log(post_id, body);

  if (body) {
    await fetch("/api/comment", {
      method: "POST",
      body: JSON.stringify({
        post_id,
        body,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    document.location.reload();
  }
};

document
  .querySelector("#new-comment-form")
  .addEventListener("submit", commentFormHandler);
