const run_btn = document.getElementById("run_btn")
const a = document.querySelector("#a")
const b = document.querySelector("#b")
const response = document.querySelector("#response")
const errlist = document.querySelector("#errlist")
const shpitz = document.querySelector("#shpitz")
const sausage = document.querySelector("#sausage")
const minBox = document.querySelector("#min")
const maxBox = document.querySelector("#max")
const sausageSpeed = document.querySelector("#sausageSpeed")
let min = minBox.valueAsNumber
let max = maxBox.valueAsNumber
let fl = 0
let shpitzInitialLeft = shpitz.offsetLeft
let shpitzLeft = shpitz.offsetLeft
let shpitzStep = 80
let sausageInitialLeft = sausage.offsetLeft
let sausageLeft = sausage.offsetLeft
let sausageStep = 10
let sausageDelay = 2050
let sausageInterval = () => {}

minBox.addEventListener("change", () => {
  min = minBox.valueAsNumber
})

maxBox.addEventListener("change", () => {
  max = maxBox.valueAsNumber
})

run_btn.addEventListener("click", () => {
  console.dir(document.querySelector("#min"))
  genNewTask(min, max)
  response.disabled = false
  shpitz.style.left = shpitzInitialLeft + "px"
  sausage.style.left = sausageInitialLeft + "px"
  shpitzLeft = shpitz.offsetLeft
  sausageLeft = sausage.offsetLeft
  response.focus()
  run_btn.disabled = true
  minBox.disabled = true
  maxBox.disabled = true
  sausageSpeed.disabled = true
  while (errlist.firstChild) errlist.removeChild(errlist.lastChild)
  moveSausage(sausageDelay)
})

function getRandomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function genNewTask(min, max) {
  a.textContent = getRandomBetween(min, max)
  b.textContent = getRandomBetween(min, max)
}

response.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    let result = Number.parseInt(a.textContent) * Number.parseInt(b.textContent)
    if (result === Number.parseInt(response.value)) {
      //---правильно
      response.value = ""
      shpitzLeft += shpitzStep
      shpitz.style.left = shpitzLeft + "px"
      genNewTask(min, max)
      //--догнал
      if (shpitz.offsetLeft + shpitz.width - 75 >= sausage.offsetLeft) {
        clearTimeout(sausageInterval)
        a.textContent = 0
        b.textContent = 0
        //-----ВСТАВИТЬ СЮДА ОЧИСТКУ СПИСКА
        response.disabled = true
        run_btn.disabled = false
        minBox.disabled = false
        maxBox.disabled = false
        sausageSpeed.disabled = false
      }
    } else {
      //---неправильно
      response.value = ""
      let errlis = document.getElementById("errlist").getElementsByTagName("li")
      for (let i of errlis) {
        if (i.textContent === a.textContent + "X" + b.textContent) {
          fl = 1
          break
        }
      }
      if (fl === 0) {
        let li = document.createElement("li")
        li.textContent = a.textContent + "X" + b.textContent
        errlist.appendChild(li)
        fl = 0
      } else fl = 0
    }
    response.style.color = "rgb(102, 0, 255)"
  }
})

response.addEventListener("input", () => {
  let result = Number.parseInt(a.textContent) * Number.parseInt(b.textContent)
  if (result === Number.parseInt(response.value)) {
    response.style.color = "green"
  } else {
    response.style.color = "red"
  }
})

function moveSausage(delay) {
  /*Рекурсивный TimeOut применяется как Interval, только с возможность изменения задержки в процессе */
  sausageInterval = setTimeout(function run() {
    sausageLeft += sausageStep
    sausage.style.left = sausageLeft + "px"
    sausageInterval = setTimeout(
      run,
      delay - document.querySelector("#sausageSpeed").value
    )
    if (sausage.offsetLeft >= 1150) {
      response.disabled = true
      run_btn.disabled = false
      minBox.disabled = false
      maxBox.disabled = false
      sausageSpeed.disabled = false
      clearTimeout(sausageInterval)
    }
  }, delay - sausageSpeed.value)
}

//--------Запрет на ZOOM через CTRL + колесо мыши-------
document.addEventListener(
  "wheel",
  (event) => {
    if (event.ctrlKey) {
      event.preventDefault()
    }
  },
  { passive: false }
)
