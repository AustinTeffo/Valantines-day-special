// ------------------ CONFIG ------------------
const SECRET_PASSWORD = "love123"; // Change to your private word

// ------------------ LOCK SCREEN ------------------
function unlock() {
  const input = document.getElementById("passwordInput").value;
  if(input === SECRET_PASSWORD) {
    document.getElementById("lock-screen").style.display = "none";
    document.getElementById("content").classList.remove("hidden");
    loadDiary();
    loadPhotos();
    loadVideos();
    showLoveNote();
    showSlideshow();
  } else {
    document.getElementById("error").innerText = "Wrong password 💔";
  }
}

// ------------------ NAVIGATION ------------------
function showSection(id) {
  document.querySelectorAll("section").forEach(sec => {
    sec.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");

  if(id === "vault") {
    showVault();
  }
}

// ------------------ DIARY ------------------

// Load diary (clear textarea and remove edit mode)
function loadDiary() {
  document.getElementById("diaryText").value = "";
  delete document.getElementById("diaryText").dataset.editId;
}

// Save diary entry (new or edit)
function saveDiary() {
  const text = document.getElementById("diaryText").value.trim();
  if (!text) {
    alert("Write something before saving 💌");
    return;
  }

  let diaryEntries = JSON.parse(localStorage.getItem("diaryEntries") || "[]");

  // Check if editing existing entry
  const editId = document.getElementById("diaryText").dataset.editId;
  if(editId !== undefined) {
    diaryEntries[editId].text = text;
    diaryEntries[editId].date = new Date().toLocaleString();
    delete document.getElementById("diaryText").dataset.editId;
  } else {
    diaryEntries.push({
      text: text,
      date: new Date().toLocaleString()
    });
  }

  localStorage.setItem("diaryEntries", JSON.stringify(diaryEntries));
  alert("Saved 💖");
  document.getElementById("diaryText").value = "";
  showVault();
}

// Edit a diary entry
function editDiary(index) {
  const diaryEntries = JSON.parse(localStorage.getItem("diaryEntries") || "[]");
  const entry = diaryEntries[index];
  document.getElementById("diaryText").value = entry.text;
  document.getElementById("diaryText").dataset.editId = index;
  showSection("diary");
}

// ------------------ LOVE NOTES ------------------
function showLoveNote() {
  const notes = [
    "I love the way you smile ❤️",
    "Every moment with you is magic ✨",
    "You make my heart so full 💕",
    "Thinking of you always 💌",
    "You are my favorite everything 🌹"
  ];
  const randomNote = notes[Math.floor(Math.random() * notes.length)];
  document.getElementById("love-note").innerText = randomNote;
}

// ------------------ PHOTO GALLERY ------------------
function addPhotos() {
  const input = document.getElementById("photoInput");
  const galleryDiv = document.getElementById("galleryDiv");
  if(!input.files.length) return;

  let savedPhotos = JSON.parse(localStorage.getItem("photos") || "[]");

  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imgSrc = e.target.result;
      savedPhotos.push(imgSrc);

      const img = document.createElement("img");
      img.src = imgSrc;
      galleryDiv.appendChild(img);

      localStorage.setItem("photos", JSON.stringify(savedPhotos));
    }
    reader.readAsDataURL(file);
  });

  input.value = "";
}

function loadPhotos() {
  const galleryDiv = document.getElementById("galleryDiv");
  const savedPhotos = JSON.parse(localStorage.getItem("photos") || "[]");
  savedPhotos.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    galleryDiv.appendChild(img);
  });
}

// ------------------ VIDEO GALLERY ------------------
function addVideos() {
  const input = document.getElementById("videoInput");
  const galleryDiv = document.getElementById("videoGallery");
  if(!input.files.length) return;

  let savedVideos = JSON.parse(localStorage.getItem("videos") || "[]");

  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const videoSrc = e.target.result;
      savedVideos.push(videoSrc);

      const video = document.createElement("video");
      video.src = videoSrc;
      video.controls = true;
      video.width = 200;
      video.style.borderRadius = "15px";
      galleryDiv.appendChild(video);

      localStorage.setItem("videos", JSON.stringify(savedVideos));
    }
    reader.readAsDataURL(file);
  });

  input.value = "";
}

function loadVideos() {
  const galleryDiv = document.getElementById("videoGallery");
  const savedVideos = JSON.parse(localStorage.getItem("videos") || "[]");
  savedVideos.forEach(src => {
    const video = document.createElement("video");
    video.src = src;
    video.controls = true;
    video.width = 200;
    video.style.borderRadius = "15px";
    galleryDiv.appendChild(video);
  });
}

// ------------------ MEMORY VAULT ------------------
function showVault() {
  // Diary entries
  const vaultDiary = document.getElementById("vaultDiary");
  let diaryEntries = JSON.parse(localStorage.getItem("diaryEntries") || "[]");

  if(diaryEntries.length > 0) {
    vaultDiary.innerHTML = `<h3>📓 Diary Entries</h3>`;
    diaryEntries.forEach((entry, index) => {
      const entryDiv = document.createElement("div");
      entryDiv.className = "vault-entry";
      entryDiv.innerHTML = `
        <p><strong>${entry.date}</strong></p>
        <p>${entry.text.replace(/\n/g,'<br>')}</p>
        <button onclick="editDiary(${index})">Edit ✏️</button>
        <hr>
      `;
      vaultDiary.appendChild(entryDiv);
    });
  } else {
    vaultDiary.innerHTML = `<h3>📓 Diary Entries</h3><p>No entries yet 💌</p>`;
  }

  // Photos
  const vaultGallery = document.getElementById("vaultGallery");
  vaultGallery.innerHTML = "";
  const savedPhotos = JSON.parse(localStorage.getItem("photos") || "[]");
  savedPhotos.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    vaultGallery.appendChild(img);
  });

  // Videos
  const vaultVideoGallery = document.getElementById("vaultVideoGallery");
  vaultVideoGallery.innerHTML = "";
  const savedVideos = JSON.parse(localStorage.getItem("videos") || "[]");
  savedVideos.forEach(src => {
    const video = document.createElement("video");
    video.src = src;
    video.controls = true;
    video.width = 200;
    video.style.borderRadius = "15px";
    vaultVideoGallery.appendChild(video);
  });
}

// ------------------ HOME SLIDESHOW ------------------
let slideIndex = 0;

function showSlideshow() {
  const slideshowDiv = document.getElementById("slideshow");
  slideshowDiv.innerHTML = "";

  const photos = JSON.parse(localStorage.getItem("photos") || "[]");
  const videos = JSON.parse(localStorage.getItem("videos") || "[]");
  const slides = [...photos, ...videos];

  slides.forEach(src => {
    let element;
    if(src.endsWith(".mp4") || src.startsWith("data:video")) {
      element = document.createElement("video");
      element.src = src;
      element.controls = false;
      element.muted = true;
      element.loop = true;
    } else {
      element = document.createElement("img");
      element.src = src;
    }
    slideshowDiv.appendChild(element);
  });

  if(slides.length > 0) startSlideshow();
}

function startSlideshow() {
  const slides = document.querySelectorAll("#slideshow img, #slideshow video");
  slides.forEach(slide => slide.style.display = "none");

  slideIndex++;
  if(slideIndex > slides.length) slideIndex = 1;

  const currentSlide = slides[slideIndex - 1];
  currentSlide.style.display = "block";

  if(currentSlide.tagName === "VIDEO") currentSlide.play();

  setTimeout(startSlideshow, 5000);
}
