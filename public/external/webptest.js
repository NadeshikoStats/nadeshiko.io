function checkWebPSupport(feature) {
  return new Promise((resolve, reject) => {
    var kTestImages = {
      alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
    };

    var img = new Image();
    img.onload = function () {
      var result = img.width > 0 && img.height > 0;
      resolve(result);
    };
    img.onerror = function () {
      resolve(false);
    };
    img.src = "data:image/webp;base64," + kTestImages[feature];
  });
}

checkWebPSupport("alpha").then((isSupported) => {
  if (isSupported) {
    imageFileType = "webp";
    if (document.getElementById("supports-webp")) {
      document.getElementById("supports-webp").innerText = "Supports WEBP ";
    }
  } else {
    imageFileType = "png";
    if (document.getElementById("supports-webp")) {
      document.getElementById("supports-webp").innerText = "Outdated browser ";
    }
  }
  beginGeneration("checkWebPSupport");
});
