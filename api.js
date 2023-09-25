import {getToken} from "./index.js";

const personalKey = "egor-pavlakov";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}
export function allPostsUser({ token, id }) {
  return fetch(baseHost + "/api/v1/akoosta/instapro/user-posts/" + id.userId, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}
// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}
//Загрузка поста на сервер
export function sendPost ({description, imageUrl}) {
  return fetch(postsHost, {
    method: "POST",
    body: JSON.stringify({
      description: description,
      imageUrl: imageUrl
    }),
    headers: {
      Authorization: getToken() ,
    }
  }).then((response) => {
    return response.json();
  }).then(() => {
    console.log("отправлено");
  })
}
export function addLike({ token, id }) {
  return fetch(baseHost + "/api/v1/akoosta/instapro/" + id + "/like", {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
}

export function disLike({ token, id }) {
  return fetch(baseHost + "/api/v1/akoosta/instapro/" + id + "/dislike", {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
}
