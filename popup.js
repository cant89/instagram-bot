window.onload = () => {
  const likedButton = document.getElementsByClassName("btn-liked");
  const likedStartUser = document.getElementsByClassName("liked-start-user");

  likedButton[0].addEventListener("click", function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(
      activeTabs
    ) {
      chrome.tabs.sendMessage(activeTabs[0].id, {
        action: "initLikeFromLike",
        startUser: likedStartUser[0].value
      });
    });
  });
};

// $(".btn-liked").click(initLiked);
