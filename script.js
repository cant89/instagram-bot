const POST_IN_LIST = "article ._bz0w a";
const USER_LINK_IN_LIKES_LIST = "a[title][href]";
const POST_LIKES_BUTTON = ".Nm9Fw button";
const RENDERED_LIKES_LIST = ".ZUqME";
const LIKE_BUTTON = ".fr66n > button";

const initLikeFromFollowers = () => {
  const initFollowers = async () => {
    const $followerButton = $(`main header a[href="/${user}/followers/"]`)[0];
    $followerButton.click();
    await delay(3000);
    const $scrollableEl = $(".isgrP");
    console.log($scrollableEl);
    await scroller($scrollableEl);
    console.log("done");
  };
};

const getLinkOfNextUser = (listSelector, prevUser) => {
  var found = false;
  var link = $(listSelector)
    .find(USER_LINK_IN_LIKES_LIST)
    .toArray()
    .reduce((prev, curr) => {
      var res = found ? prev : curr;
      if (prev.title === prevUser && !found) {
        found = true;
      }
      return res;
    });
  return link;
};

const delay = time => new Promise(res => setTimeout(res, time));

const isUserVisibleInList = (user, $list) =>
  $list.find(USER_LINK_IN_LIKES_LIST).filter(`[title='${user}']`).length > 0;

const scroller = ($el, amount) => {
  return new Promise(res => {
    let scroll = 0;

    let scrolling = setInterval(() => {
      $el.scrollTop(amount);
      const realScroll = $el.scrollTop();
      console.log(realScroll, scroll, amount);

      if (realScroll === amount) {
        clearInterval(scrolling);
        setTimeout(res, 2000);
      } else {
        scroll = realScroll;
      }
    }, 1000);
  });
};

const scrollEl = ($el, amount) => {
  $el.scrollTop($el.scrollTop() + amount);
};

const historyBack = () =>
  new Promise(async res => {
    history.back();
    console.log("back to previous page");
    await delay(2000);
    res();
  });

const scrollToUser = ($el, user, listSelector) => {
  return new Promise(res => {
    let scrolling = setInterval(() => {
      if (isUserVisibleInList(user, $(listSelector))) {
        clearInterval(scrolling);
        scrollEl($el, 50);
        setTimeout(res, 2000);
        console.log("Scrolled to user");
      } else {
        scrollEl($el, 300);
      }
    }, 1000);
  });
};

const openLikesDialog = buttonSelector =>
  new Promise(async res => {
    const $likedButton = $(buttonSelector);
    $likedButton.click();
    console.log("Likes dialog opened");
    await delay(2000);
    res();
  });

initLikeFromLike = async startUser => {
  if (!startUser) {
    console.log("error: choose a user from the list to start from");
  }

  const initLiked = async startUser => {
    const prevUser = startUser;

    await openLikesDialog(POST_LIKES_BUTTON);

    const $scroller = $(RENDERED_LIKES_LIST)
      .first()
      .parent()
      .parent();

    await scrollToUser($scroller, prevUser, RENDERED_LIKES_LIST);

    const userLink = getLinkOfNextUser(RENDERED_LIKES_LIST, prevUser);

    $(userLink).css("background", "#ffcdcd");
    await delay(2000);

    userLink.click();
    await delay(2000);
    console.log("profile page reached");

    const $posts = $(POST_IN_LIST);

    if ($posts.length) {
      getRandomPost($posts).click();
      console.log("post opened");
      await delay(2000);

      $(LIKE_BUTTON).click();
      console.log("liked!");
      await delay(3000);

      await historyBack();
    }

    await historyBack();
    initLiked(userLink.title);
  };

  initLiked(startUser);
};

const randomIntFromInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const getRandomPost = $posts =>
  $posts[randomIntFromInterval(0, $posts.length - 1)];

console.log("content script loaded");

chrome.runtime.onMessage.addListener(function(request) {
  if (request.action === "initLikeFromLike") {
    initLikeFromLike(request.startUser);
  }
});
