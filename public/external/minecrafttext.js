function generateMinecraftText(minecraftText, blackShadow = false) {
  // Generates HTML from Minecraft text

  if (minecraftText === null || minecraftText === undefined) {
    return "";
  }

  const escapeHtml = (text) => {
    return text
      .replace(/&/g, '&#38;')
      .replace(/</g, '&#60;')
      .replace(/>/g, '&#62;')
      .replace(/"/g, '&#34;')
      .replace(/'/g, '&#39;');
  };

  const regex = /[^§&]*[^§&]|[§&][0-9a-z#][^§&]*/g;
  console.log(escapeHtml(minecraftText));
  const brokenUpStrings = escapeHtml(minecraftText).match(regex) || [];
  let returnString = "";

  brokenUpStrings.forEach((individual) => {
    let ending = "";
    const code = individual.split(/[&§][0-9a-z#]/);
    const prefixMatch = individual.match(/[&§][0-9a-z#]/);
    const prefix = prefixMatch ? prefixMatch[0] : null;

    if (prefix) {
      const actualCode = prefix[1];
      const validColors = [`0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `a`, `b`, `c`, `d`, `e`, `f`];

      if (validColors.includes(actualCode)) {
        if (blackShadow && (actualCode == "0" || actualCode == "1")) {
          // Adds a white shadow to dark text
          returnString += `<span class="m${actualCode} shadowf">`;
        } else {
          returnString += `<span class="m${actualCode}">`;
        }
        ending += "</span>";
      } else {
        switch (actualCode) {
          case "l":
            if (individual.length > 2) {
              returnString += '<span style="font-weight:bold;">';
              ending = "</span>" + ending;
            }
            break;
          case "m":
            if (individual.length > 2) {
              returnString += "<strike>";
              ending = "</strike>" + ending;
            }
            break;
          case "n":
            if (individual.length > 2) {
              returnString += '<span style="text-decoration: underline;">';
              ending = "</span>" + ending;
            }
            break;
          case "o":
            if (individual.length > 2) {
              returnString += "<i>";
              ending = "</i>" + ending;
            }
            break;
          case "k":
            if (individual.length > 2) {
              returnString += '<span class="mk">';
              ending = "</span>" + ending;
            }
            break;
          case "r":
            returnString += ending;
            ending = "";
            break;
          case "#":
            // do nothing
            returnString += prefixMatch;
            break;
        }
      }

      if (code[1]) {
        returnString += code[1];
        if (ending && individual.length > 2) {
          returnString += ending;
          ending = "";
        }
      }
    } else {
      returnString += individual;
    }
  });

  return DOMPurify.sanitize(returnString);
}
