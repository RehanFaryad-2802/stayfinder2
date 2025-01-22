// let title = document.querySelector(".title");
// let description = document.querySelector(".description");
// let location1 = document.querySelector(".location");
// let country = document.querySelector(".country");
// let price = document.querySelector(".price");
// let image = document.querySelector(".image");

// trigger the event when the form is empty directly with not using form

let data = () => {
  let inputs = document.querySelectorAll(".form-control");
  let allFieldsValid = true; //

  for (let element of inputs) {
    if (element.value === "") {
      let nextElement = element.nextElementSibling;

      if (nextElement) {
        nextElement.style.display = "block";
      }
      allFieldsValid = false;
    }
  }

  return allFieldsValid;
};
let form = document.querySelector("#NewForm");
form.addEventListener("submit", (e) => {
  if (!data()) {
    e.preventDefault();
    console.log("Working, All is Done");
  }
});
document.querySelectorAll("input").forEach((element) => {
  element.addEventListener("keyup", (e) => {
    let f = e.target.value;
    if (f == "") {
      e.target.classList.add("invalid");
    } else {
      e.target.classList.remove("invalid");
      element.nextElementSibling.style.display = "none";
    }
  });
});
document.querySelectorAll("textarea").forEach((element) => {
  element.addEventListener("keyup", (e) => {
    let f = e.target.value;
    if (f == "") {
      e.target.classList.add("invalid");
    } else {
      e.target.classList.remove("invalid");
      element.nextElementSibling.style.display = "none";
    }
  });
});
