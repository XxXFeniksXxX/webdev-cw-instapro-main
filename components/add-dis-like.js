import { checkLike } from "./posts-page-component.js";
import { addLike, disLike, getPosts } from "../api.js";
import { posts, getToken, user, newGetPosts } from "../index.js";


function addAndDisLike({ index, id, element }) {
    if (!user) {
        alert("Лайки могут ставить только авторизованные пользователи.");
        return;
    }

    document.querySelectorAll(".like-button")[index].classList.add("-loading-like");
    document.querySelectorAll(".like-button")[index].disabled = true;

    if (!posts[index].isLiked) {
        addLike({ token: getToken(), id })
            .then(() => {
                return getPosts({ token: getToken() })
            })
            .then((newPosts) => {
                element.innerHTML = `
                    <button data-index="${index}" data-post-id="${newPosts[index].id}" class="like-button">
                        <img src="./assets/images/like-active.svg">
                    </button>
                    ${newPosts[index].likes.length === 0
                        ? ` <p class="post-likes-text">
                              Нравится: <strong>${newPosts[index].likes.length}</strong>
                            </p>`
                        : ` <p class="post-likes-text">
                              Нравится: <strong>${newPosts[index].likes[newPosts[index].likes.length - 1].name}</strong>
                            ${newPosts[index].likes.length === 1
                            ? ""
                            : `и <strong>еще ${newPosts[index].likes.length - 1}</strong>`}
                            </p>`}
                    `
                return newPosts;
            })
            .then((newPosts) => {
                checkLike({ index, id, element });
                return newGetPosts(newPosts);
            })
    }

    if (posts[index].isLiked) {
        disLike({ token: getToken(), id })
            .then(() => {
                return getPosts({ token: getToken() })
            })
            .then((newPosts) => {
                element.innerHTML = `
                    <button data-index="${index}" data-post-id="${newPosts[index].id}" class="like-button">
                        <img src="./assets/images/like-not-active.svg">
                    </button>
                    ${newPosts[index].likes.length === 0
                        ? ` <p class="post-likes-text">
                              Нравится: <strong>${newPosts[index].likes.length}</strong>
                            </p>`
                        : ` <p class="post-likes-text">
                              Нравится: <strong>${newPosts[index].likes[newPosts[index].likes.length - 1].name}</strong>
                            ${newPosts[index].likes.length === 1
                            ? ""
                            : `и <strong>еще ${newPosts[index].likes.length - 1}</strong>`}
                            </p>`}
                    `
                return newPosts;
            })
            .then((newPosts) => {
                checkLike({ index, id, element });
                return newGetPosts(newPosts);
            })
    }
}

export { addAndDisLike }