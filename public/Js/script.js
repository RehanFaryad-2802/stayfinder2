let data = () => {
  let inputs = document.querySelectorAll(".form-control");
  let allFieldsValid = true;
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

try {
  let form = document.querySelector("#NewForm");
  form.addEventListener("submit", (e) => {
    data();
    if (!data()) {
      e.preventDefault();
    }
  });
} catch (error) {}

try {
  document.querySelectorAll(".form-control").forEach((element) => {
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
} catch (error) {}

try {
  document.querySelector("#rating").addEventListener("input", (e) => {
    document.querySelector(".rating").textContent = e.target.value;
  });
} catch (error) {}

setTimeout(() => {
  if (document.querySelector(".msg_box")) {
    document.querySelector(".msg_box").remove();
    console.log("removed");
  }
}, 5000);
