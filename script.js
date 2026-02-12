const SECRET_PASSWORD = "love123";

// ---------------- LOCK ----------------
function unlock() {
  const input = document.getElementById("passwordInput").value;
  if (input === SECRET_PASSWORD) {
    document.getElementById("lock-screen").style.display = "none";
    document.getElementById("content").classList.remove("hidden");
    loadDiaryEntries();
    loadPhotos();
    loadVideos();
    showSlideshow();
  } else {
    document.getElementById("error").innerText = "Wrong password 💔";
  }
}

function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  if (id === "vault") loadDiaryEntries();
}

// ---------------- DIARY ----------------
async function saveDiary() {
  const textArea = document.getElementById("diaryText");
  const text = textArea.value.trim();
  if (!text) return alert("Write something first 💌");

  await window.firebaseAddDoc(
    window.firebaseCollection(window.db, "diaryEntries"),
    { text, date: new Date() }
  );

  textArea.value = "";
  loadDiaryEntries();
}

async function loadDiaryEntries() {
  const vault = document.getElementById("vaultDiary");
  vault.innerHTML = "<h3>📓 Mihle’s Diary Entries</h3>";

  const snapshot = await window.firebaseGetDocs(
    window.firebaseCollection(window.db, "diaryEntries")
  );

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${new Date(data.date.seconds * 1000).toLocaleString()}</strong></p>
      <p>${data.text}</p>
      <hr>
    `;
    vault.appendChild(div);
  });
}

// ---------------- PHOTOS ----------------
async function addPhotos() {
  const input = document.getElementById("photoInput");
  if (!input.files.length) return;

  for (let file of input.files) {
    const storageRef = window.firebaseRef(window.storage, "photos/" + file.name);
    await window.firebaseUploadBytes(storageRef, file);
  }

  input.value = "";
  loadPhotos();
}

async function loadPhotos() {
  const gallery = document.getElementById("galleryDiv");
  const vaultGallery = document.getElementById("vaultGallery");
  gallery.innerHTML = "";
  vaultGallery.innerHTML = "";

  const listRef = window.firebaseRef(window.storage, "photos/");
  const result = await window.firebaseListAll(listRef);

  for (let item of result.items) {
    const url = await window.firebaseGetDownloadURL(item);

    const img1 = document.createElement("img");
    img1.src = url;
    gallery.appendChild(img1);

    const img2 = document.createElement("img");
    img2.src = url;
    vaultGallery.appendChild(img2);
  }
}

// ---------------- VIDEOS ----------------
async function addVideos() {
  const input = document.getElementById("videoInput");
  if (!input.files.length) return;

  for (let file of input.files) {
    const storageRef = window.firebaseRef(window.storage, "videos/" + file.name);
    await window.firebaseUploadBytes(storageRef, file);
  }

  input.value = "";
  loadVideos();
}

async function loadVideos() {
  const gallery = document.getElementById("videoGallery");
  const vaultGallery = document.getElementById("vaultVideoGallery");
  gallery.innerHTML = "";
  vaultGallery.innerHTML = "";

  const listRef = window.firebaseRef(window.storage, "videos/");
  const result = await window.firebaseListAll(listRef);

  for (let item of result.items) {
    const url = await window.firebaseGetDownloadURL(item);

    const vid1 = document.createElement("video");
    vid1.src = url;
    vid1.controls = true;
    vid1.width = 200;
    gallery.appendChild(vid1);

    const vid2 = document.createElement("video");
    vid2.src = url;
    vid2.controls = true;
    vid2.width = 200;
    vaultGallery.appendChild(vid2);
  }
}

// ---------------- SLIDESHOW ----------------
let slideIndex = 0;

async function showSlideshow() {
  const slideshow = document.getElementById("slideshow");
  slideshow.innerHTML = "";

  const photoRef = window.firebaseRef(window.storage, "photos/");
  const videoRef = window.firebaseRef(window.storage, "videos/");

  const photoList = await window.firebaseListAll(photoRef);
  const videoList = await window.firebaseListAll(videoRef);

  const urls = [];

  for (let item of photoList.items) {
    urls.push(await window.firebaseGetDownloadURL(item));
  }
  for (let item of videoList.items) {
    urls.push(await window.firebaseGetDownloadURL(item));
  }

  urls.forEach(url => {
    let element;
    if (url.includes(".mp4")) {
      element = document.createElement("video");
      element.src = url;
      element.muted = true;
      element.loop = true;
    } else {
      element = document.createElement("img");
      element.src = url;
    }
    slideshow.appendChild(element);
  });

  if (urls.length) startSlideshow();
}

function startSlideshow() {
  const slides = document.querySelectorAll("#slideshow img, #slideshow video");
  slides.forEach(s => s.style.display = "none");

  slideIndex++;
  if (slideIndex > slides.length) slideIndex = 1;

  const current = slides[slideIndex - 1];
  current.style.display = "block";
  if (current.tagName === "VIDEO") current.play();

  setTimeout(startSlideshow, 5000);
}
