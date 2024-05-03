  const img = new Image();

  console.log("Begin AVIF testing " + performance.now());
  img.onload = function() {
    imageFileType = "avif";
    console.log(imageFileType + " " + performance.now());
    document.getElementById("supports-avif").innerText = "Supports AVIF ";
    beginGeneration();
  };

  img.onerror = function() {
    imageFileType = "png";
    console.log(imageFileType + " " + performance.now());
    document.getElementById("supports-avif").innerText = "Outdated browser ";
    beginGeneration();
  };
  
  img.src = "data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAAAOptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAAImlsb2MAAAAAREAAAQABAAAAAAEOAAEAAAAAAAAAIgAAACNpaW5mAAAAAAABAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAamlwcnAAAABLaXBjbwAAABNjb2xybmNseAABAA0AAIAAAAAMYXYxQ4EgAgAAAAAUaXNwZQAAAAAAAAAQAAAAEAAAABBwaXhpAAAAAAMICAgAAAAXaXBtYQAAAAAAAAABAAEEgYIDhAAAACptZGF0EgAKCDgM/9lAQ0AIMhQQAAAAFLm4wN/TRReKCcSo648oag==";