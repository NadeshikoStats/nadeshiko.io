  const img = new Image();

  console.log("Begin AVIF testing " + performance.now());
  img.onload = function() {
    if (img.naturalWidth > 0 || img.naturalHeight > 0) {
      imageFileType = "avif";
    } else {
      imageFileType = "png";
    }
    console.log(imageFileType + " " + performance.now());
    document.getElementById("supports-avif").innerText = "Supports AVIF: " + (imageFileType === "avif");
    beginGeneration();
  };
  
  img.src = "data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAAAOptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAAImlsb2MAAAAAREAAAQABAAAAAAEOAAEAAAAAAAAAIgAAACNpaW5mAAAAAAABAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAamlwcnAAAABLaXBjbwAAABNjb2xybmNseAABAA0AAIAAAAAMYXYxQ4EgAgAAAAAUaXNwZQAAAAAAAAAQAAAAEAAAABBwaXhpAAAAAAMICAgAAAAXaXBtYQAAAAAAAAABAAEEgYIDhAAAACptZGF0EgAKCDgM/9lAQ0AIMhQQAAAAFLm4wN/TRReKCcSo648oag==";