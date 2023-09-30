import { getPosts, allPostsUser } from "./api.js";
import { renderAllPostsUser } from "./components/all-posts-user.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];
const appEl = document.getElementById("app");
goToPage(POSTS_PAGE);

export function goToPage(newPage, data) {
  if ([POSTS_PAGE, AUTH_PAGE, ADD_POSTS_PAGE, USER_POSTS_PAGE, LOADING_PAGE].includes(newPage)) {
    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          goToPage(POSTS_PAGE);
          return console.error(error);
        });
    }

    if (newPage === ADD_POSTS_PAGE) {
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === USER_POSTS_PAGE) {
      page = USER_POSTS_PAGE;
      return renderApp(data);
    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};

export function renderApp(data) {
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({ appEl });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({ appEl });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick() {
        goToPage(POSTS_PAGE);
      },
    });
  }

  if (page === USER_POSTS_PAGE) {
    page = LOADING_PAGE;
    renderLoadingPageComponent({ appEl });
    return allPostsUser({ token: getToken(), id: data })
      .then((allPostsUser) => {
        posts = allPostsUser;
        renderAllPostsUser({ appEl });
      })
      .catch((error) => {
        alert("Произошла не предвиденная ошибка. Мы вернем вас на стартовую страницу");
        goToPage(POSTS_PAGE);
        return console.error(error);
      });
  }
};

export function getToken() {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export function logout() {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

export function newGetPosts(newPosts) {
  posts = newPosts;
}