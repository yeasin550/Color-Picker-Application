// global section - work in all element after use this property
let toastMessageDiv = null;

// set the default value for app
const defaultValueForApp = {
  red: 167,
  green: 167,
  blue: 167,
};

// create a array for the preset colors
const presetColors = [
  "#B88DF4",
  "#5EF769",
  "#FD8171",
  "#6BA197",
  "#7631BF",
  "#48BCE2",
  "#F9C937",
  "#676DBA",
  "#35EEA0",
  "#24A264",
  "#71A957",
  "#981C56",
  "#B5C168",
  "#175030",
  "#64A0F0",
];

// Given the empty array for the store all custom color
let customColors = new Array(15);

// onload section - loading work
window.onload = () => {
  main();
  updateColorCodeToDom(defaultValueForApp);
  generateColorBoxes(document.getElementById("preset-colors"), presetColors);

  // get the data on local storage
  const getColorFromLocalStorage = localStorage.getItem("Custom-Colors");
  if (getColorFromLocalStorage) {
    customColors = JSON.parse(getColorFromLocalStorage);
    generateColorBoxes(document.getElementById("custom-colors"), customColors);
  }
};

// main section - all element in this application
function main() {
  // reference html elements
  const RandomColorBtn = document.getElementById("random-color");
  const hexColorInp = document.getElementById("input-hex");
  const colorSliderRed = document.getElementById("color-slider-red");
  const colorSliderGreen = document.getElementById("color-slider-green");
  const colorSliderBlue = document.getElementById("color-slider-blue");
  const copyToClipboardBtn = document.getElementById("copy-to-clipboard");
  const presetColorParent = document.getElementById("preset-colors");
  const customColorParent = document.getElementById("custom-colors");
  const saveCustomColorBtn = document.getElementById("save-btn");
  const uploadFileInp = document.getElementById("upload-file-input");
  const uploadImageBtn = document.getElementById("upload-file-button");
  const bgPreview = document.getElementById("bg-preview");
  const imageDeleteBtn = document.getElementById("delete-btn");
  imageDeleteBtn.style.display = "none";
  const bgController = document.getElementById("bg-controller");
  bgController.style.display = "none";

  //   adding event listeners

  // random color generator btn click event listener
  RandomColorBtn.addEventListener("click", RandomColorBtnHandler);

  // hex color input keyup event listener
  hexColorInp.addEventListener("keyup", hexColorInpHandler);

  // color slider red change event listener
  colorSliderRed.addEventListener(
    "change",
    colorSlidersHandler(colorSliderRed, colorSliderGreen, colorSliderBlue)
  );

  // color slider green change event listener
  colorSliderGreen.addEventListener(
    "change",
    colorSlidersHandler(colorSliderRed, colorSliderGreen, colorSliderBlue)
  );

  // color slider blue change event listener
  colorSliderBlue.addEventListener(
    "change",
    colorSlidersHandler(colorSliderRed, colorSliderGreen, colorSliderBlue)
  );

  // copy to clipboard button change event listener
  copyToClipboardBtn.addEventListener("click", copyToClipboardBtnHandler);

  // preset color parent click event
  presetColorParent.addEventListener("click", presetColorParentHandler);

  // save to custom color event listener
  saveCustomColorBtn.addEventListener(
    "click",
    saveCustomColorBtnHandler(customColorParent, hexColorInp)
  );

  // custom color click event
  customColorParent.addEventListener("click", customColorParentHandler);

  // upload image button click event
  uploadImageBtn.addEventListener(
    "click",
    uploadImageBtnHandler(uploadFileInp)
  );

  // upload file input change event
  uploadFileInp.addEventListener(
    "change",
    uploadFileInpHandler(bgPreview, imageDeleteBtn, bgController)
  );

  // delete button for deleting image click event
  imageDeleteBtn.addEventListener(
    "click",
    imageDeleteBtnHandler(
      bgPreview,
      imageDeleteBtn,
      uploadFileInp,
      bgController
    )
  );

  // background image control all event listener
  document
    .getElementById("bg-size")
    .addEventListener("change", changeBackgroundPreference);
  document
    .getElementById("bg-repeat")
    .addEventListener("change", changeBackgroundPreference);
  document
    .getElementById("bg-position")
    .addEventListener("change", changeBackgroundPreference);
  document
    .getElementById("bg-attachment")
    .addEventListener("change", changeBackgroundPreference);
}

// event handler - all event listener here

// random color generator button event listener
function RandomColorBtnHandler() {
  const color = generateColorDecimal();
  updateColorCodeToDom(color);
}

// hex color input handler event listener
function hexColorInpHandler(event) {
  const hexColor = event.target.value;

  if (hexColor) {
    hexColor.value = hexColor.toUpperCase();
    if (isValidHex(hexColor)) {
      const color = convertToDecimalColor(hexColor);
      updateColorCodeToDom(color);
    } else {
      if (toastMessageDiv !== null) {
        toastMessageDiv.remove();
        toastMessageDiv = null;
      }
      generateToastMessage(`Invalid Color Code`);
    }
  }
}

// color slider handler event listener
function colorSlidersHandler(
  colorSliderRed,
  colorSliderGreen,
  colorSliderBlue
) {
  return function () {
    const color = {
      red: parseInt(colorSliderRed.value),
      green: parseInt(colorSliderGreen.value),
      blue: parseInt(colorSliderBlue.value),
    };
    updateColorCodeToDom(color);
  };
}

// copy to clipboard handler event listener
function copyToClipboardBtnHandler() {
  const colorModeRadio = document.getElementsByName("color-mode");
  const modeValue = getValueFromRadioBtn(colorModeRadio);

  if (modeValue === null) {
    throw new Error("Invalid Color Code");
  }

  if (toastMessageDiv !== null) {
    toastMessageDiv.remove();
    toastMessageDiv = null;
  }

  if (modeValue === "hex") {
    const hexColor = document.getElementById("input-hex").value;

    if (hexColor && isValidHex(hexColor)) {
      navigator.clipboard.writeText(`#${hexColor}`);
      generateToastMessage(`#${hexColor} Copied`);
    } else {
      alert("Invalid HEX code");
    }
  } else {
    const rgbColor = document.getElementById("input-rgb").value;
    if (rgbColor) {
      navigator.clipboard.writeText(rgbColor);
      generateToastMessage(`${rgbColor} Copied`);
    } else {
      alert("Invalid HEX code");
    }
  }
}

function presetColorParentHandler(event) {
  const presetClass = event.target;
  if (presetClass.className === "preset") {
    navigator.clipboard.writeText(presetClass.getAttribute("color-data"));
    if (toastMessageDiv !== null) {
      toastMessageDiv.remove();
      toastMessageDiv = null;
    }
    generateToastMessage(`${presetClass.getAttribute("color-data")} Copied`);
  }
}

// saveCustomColorBtnHandler event listener
function saveCustomColorBtnHandler(ColorParent, colorHex) {
  return function () {
    let color = `#${colorHex.value}`;
    if (customColors.includes(color)) {
      alert("Already Included");
      return;
    }
    customColors.unshift(color);
    generateToastMessage("Color Added");
    if (customColors.length > 15) {
      customColors = customColors.slice(0, 15);
    }

    localStorage.setItem("Custom-Colors", JSON.stringify(customColors));

    removeChildFormParent(ColorParent);

    generateColorBoxes(ColorParent, customColors);
  };
}

// added custom color click for copy in this event listener
function customColorParentHandler(event) {
  const customChild = event.target;
  if (customChild.className === "preset") {
    navigator.clipboard.writeText(customChild.getAttribute("color-data"));
    if (toastMessageDiv !== null) {
      toastMessageDiv.remove();
      toastMessageDiv = null;
    }
    generateToastMessage(`${customChild.getAttribute("color-data")} Copied`);
  }
}

// upload image button event handler
function uploadImageBtnHandler(uploadFileInp) {
  return function () {
    uploadFileInp.click();
  };
}

// upload image input event handler
function uploadFileInpHandler(bgPreview, imageDeleteBtn, bgController) {
  return function (event) {
    const file = event.target.files[0];
    const imgUrl = URL.createObjectURL(file);

    bgPreview.style.backgroundImage = `url(${imgUrl})`;

    document.body.style.background = `url(${imgUrl})`;

    imageDeleteBtn.style.display = "inline";

    bgController.style.display = "block";
  };
}

// image delete button handler
function imageDeleteBtnHandler(
  bgPreview,
  imageDeleteBtn,
  uploadFileInp,
  bgController
) {
  return function () {
    bgPreview.style.backgroundImage = "";

    document.body.style.background = "";

    imageDeleteBtn.style.display = "none";

    uploadFileInp.value = null;

    bgController.style.display = "none";
  };
}

// DOM function section - dom related all work here
function generateToastMessage(msg) {
  toastMessageDiv = document.createElement("div");
  toastMessageDiv.innerText = msg;
  toastMessageDiv.className = `toastMesssage animation-in`;

  // set the time out function for toast message
  setTimeout(() => {
    if (toastMessageDiv !== null) {
      toastMessageDiv.remove();
      toastMessageDiv = null;
    }
  }, 2000);

  // toastMessageDiv.addEventListener("click", function () {
  //   // adding another event listener for the click event when animation end and we know this
  //   toastMessageDiv.addEventListener("animationend", function () {
  //     toastMessageDiv.remove();
  //     toastMessageDiv = null;
  //   });
  // });

  document.body.appendChild(toastMessageDiv);
}

/**
 * This function will be return a object from the created html element in js
 * @param {string} color
 * @returns {object}
 */
function generateColorBox(color) {
  const div = document.createElement("div");
  div.className = "preset";
  div.style.backgroundColor = color;
  div.setAttribute("color-data", color);

  return div;
}

/**
 * This function will be create and append child on it's parent
 * @param {object} parent
 * @param {Array} colors
 */
function generateColorBoxes(parent, colors) {
  colors.forEach((color) => {
    if (isValidHex(color.slice(1))) {
      const colorBox = generateColorBox(color);
      parent.appendChild(colorBox);
    }
  });
}

/**
 * find to selected element from list of radio buttons
 * @param {Array} nodes
 */

function getValueFromRadioBtn(nodes) {
  let checkedValue = null;
  const length = nodes.length;

  for (let i = 0; i < length; i++) {
    if (nodes[i].checked) {
      checkedValue = nodes[i].value;
    }
  }
  return checkedValue;
}

function removeChildFormParent(parent) {
  let child = parent.lastElementChild;
  while (child) {
    parent.removeChild(child);
    child = parent.lastElementChild;
  }
}

/**
 * update all on application in this function
 *
 */
function updateColorCodeToDom(color) {
  const hexColor = generateHexColor(color);
  const rgbColor = generateRgbColor(color);

  document.getElementById(
    "display-color"
  ).style.backgroundColor = `#${hexColor}`;
  document.getElementById("input-hex").value = hexColor;
  document.getElementById("input-rgb").value = rgbColor;
  document.getElementById("color-slider-red-label").innerText = color.red;
  document.getElementById("color-slider-red").value = color.red;
  document.getElementById("color-slider-green-label").innerText = color.green;
  document.getElementById("color-slider-green").value = color.green;
  document.getElementById("color-slider-blue-label").innerText = color.blue;
  document.getElementById("color-slider-blue").value = color.blue;
}

function changeBackgroundPreference() {
  document.body.style.backgroundSize = document.getElementById("bg-size").value;
  document.body.style.backgroundRepeat =
    document.getElementById("bg-repeat").value;
  document.body.style.backgroundPosition =
    document.getElementById("bg-position").value;
  document.body.style.backgroundAttachment =
    document.getElementById("bg-attachment").value;
}

// utils function section - use all others functionality project in here

/**
 * generate and return an object of three decimal values
 * @returns {object}
 */
function generateColorDecimal() {
  const red = Math.floor(Math.random() * 255);
  const green = Math.floor(Math.random() * 255);
  const blue = Math.floor(Math.random() * 255);

  return {
    red,
    green,
    blue,
  };
}

/**
 * take a color object of three decimal values and return a hexadecimal color code
 * @param {object} color
 * @returns {string}
 */
function generateHexColor({ red, green, blue }) {
  const getTwoCode = (value) => {
    const hex = value.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `${getTwoCode(red)}${getTwoCode(green)}${getTwoCode(
    blue
  )}`.toUpperCase();
}

/**
 * take a color object of three decimal values and return a rgb color code
 * @param {object} color
 * @returns {string}
 */
function generateRgbColor({ red, green, blue }) {
  return `rgb(${red}, ${green}, ${blue})`;
}

/**
 * convert color code
 * @param {string} hex
 * @returns {object}
 */
function convertToDecimalColor(hex) {
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4), 16);

  return {
    red,
    green,
    blue,
  };
}

/**
 * validate hex color code
 * @param {string} color
 * @returns {boolean}
 */
function isValidHex(color) {
  if (color.length !== 6) return false;
  return /^[0-9A-Fa-f]{6}$/i.test(color);
}
