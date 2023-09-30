import { ru } from "date-fns/locale";
import { formatDistance } from "date-fns";
import { posts, user, getToken, goToPage } from "../index.js";
import { addAndDisLike } from "./add-dis-like.js";
import { renderHeaderComponent } from "./header-component.js";

export function renderAllPostsUser({ appEl }) {
  appEl.innerHTML = `
    <div class="page-container">
        <div class="header-container"></div>
        <div class="posts-user-header">
            <img src="${posts[0].user.imageUrl}" class="posts-user-header__user-image">
            <p class="posts-user-header__user-name">${posts[0].user.name}</p>
        </div>
        <ul id="post" class="posts"></ul>
    </div>
    `;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  document.getElementById("post").innerHTML = posts
    .map(
      (post, index) => `
    <li class="post">
        <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
            <button data-index="${index}" data-post-id="${
        post.id
      }" class="like-button">
            <img src="${
              post.isLiked
                ? "./assets/images/like-active.svg"
                : "./assets/images/like-not-active.svg"
            }">
            </button>
            ${
              post.likes.length === 0
                ? ` <p class="post-likes-text">
                    Нравится: <strong>${post.likes.length}</strong>
                </p>`
                : ` <p class="post-likes-text">
                    Нравится: <strong>${
                      post.likes[post.likes.length - 1].name
                    }</strong>
            ${
              post.likes.length === 1
                ? ""
                : `и <strong>еще ${post.likes.length - 1}</strong>`
            }
            </p>`
            }
        </div>
        <p class="post-text">
            <span class="user-name">${post.user.name}</span>
            ${post.description}
        </p>
        <p class="post-date">
        ${formatDistance(new Date(post.createdAt), new Date(), {
          locale: ru,
        })} Назад
        </p>
        ${
          user
            ? `${
                post.user.login === user.login
                  ? `<button data-id="${post.id}" class="post-delete">Удалить ваш пост</button>`
                  : ""
              }`
            : ""
        }
    </li>
    `
    )
    .join("");

  for (const likeEl of document.querySelectorAll(".like-button")) {
    likeEl.addEventListener("click", () => {
      addAndDisLike({
        index: likeEl.dataset.index,
        id: likeEl.dataset.postId,
        element: document.querySelectorAll(".post-likes")[likeEl.dataset.index],
      });
    });
  }
}
