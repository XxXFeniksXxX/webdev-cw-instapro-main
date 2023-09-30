import { ru } from 'date-fns/locale';
import { formatDistance } from "date-fns";
import { addAndDisLike } from "./add-dis-like.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, user, getToken, goToPage, } from "../index.js";
import { USER_POSTS_PAGE, POSTS_PAGE, } from "../routes.js";

export const renderPostsPageComponent = ({ appEl }) => {
  appEl.innerHTML = posts.map((post, index) => `
  <div class="page-container">
    <div class="header-container"></div>
    <ul class="posts">
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
          <img src="${post.user.imageUrl}" class="post-header__user-image">
          <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
            <button data-index="${index}" data-post-id="${post.id}" class="like-button">
              <img src="${post.isLiked ? "./assets/images/like-active.svg" : "./assets/images/like-not-active.svg"}">
            </button>
            <div id="textLikes">
            ${post.likes.length === 0
      ? ` <p class="post-likes-text">
              Нравится: <strong>${post.likes.length}</strong>
            </p>`
      : ` <p class="post-likes-text">
              Нравится: <strong>${post.likes[post.likes.length - 1].name}</strong>
            ${post.likes.length === 1
        ? ""
        : `и <strong>еще ${post.likes.length - 1}</strong>`}
            </p>`}
            </div>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
        ${formatDistance(new Date(post.createdAt), new Date, { locale: ru })} Назад
        </p>
         </li><br>
    </ul>
  </div>
  `).join("");

  renderHeaderComponent({ element: document.querySelector(".header-container") });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, { userId: userEl.dataset.userId, });
    });
  }

  for (const likeEl of document.querySelectorAll(".like-button")) {
    checkLike({ index: likeEl.dataset.index, id: likeEl.dataset.postId, element: document.querySelectorAll(".post-likes")[likeEl.dataset.index] })
  }
}

export function checkLike({ index, id, element }) {
  document.querySelectorAll(".like-button")[index].addEventListener("click", () => {
    addAndDisLike({ index, id, element })
  })
}