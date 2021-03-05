async function lockedProfile() {
    const data=await getUrl();
    getProfile(data);
}

function togleVisibility(profile, hidden) {
 
    const unlockedRadio = Array.from(profile.querySelectorAll('input'))[1];
    const showBtn = profile.querySelector("button");

    if (unlockedRadio.checked == true) {

        if (showBtn.textContent == "Show more") {
            hidden.style.display = "block";
            showBtn.textContent = "Hide it"
        } else {
            hidden.style.display = "none";
            showBtn.textContent = "Show more"
        }
    }
}

 function getProfile(data)
{
    const main = document.getElementById("main");
    main.innerHTML = "";
    const arr = Array.from(Object.entries(data));


    arr.forEach(p => {
        const profile = document.createElement("div");
        profile.className = "profile";

        const img = document.createElement("img");
        img.setAttribute("src", "./iconProfile2.png");
        img.className = "userIcon";
        const lockLabel = document.createElement("label");
        lockLabel.textContent = "Lock";
        const radioLock = document.createElement("input");
        radioLock.type = "radio";
        radioLock.checked = true;
        radioLock.name = `${p[1].username}Locked`
        const unlockLabel = document.createElement("label");
        unlockLabel.textContent = "Unlock";
        const radioUnlock = document.createElement("input");
        radioUnlock.type = "radio";
        radioUnlock.name = `${p[1].username}Locked`
        const hr = document.createElement("hr");
        const usernameLabel = document.createElement("label");
        usernameLabel.textContent = "Username";
        const usernameInput = document.createElement("input");
        usernameInput.disabled = true;
        usernameInput.value = p[1].username;

        const hidden = document.createElement("div");
        hidden.id = `${p[1].username}HiddenFields`;
        hidden.style.display = "none";
        const hiddenHr = document.createElement("ht");
        const emailLabel = document.createElement("label");
        emailLabel.textContent = "Email:";
        const emailInput = document.createElement("input");
        emailInput.disabled = true;
        emailInput.value = p[1].email;
        const ageLabel = document.createElement("label");
        ageLabel.textContent = "Age:"
        const ageInput = document.createElement("input");
        ageInput.disabled = true;
        ageInput.value = p[1].age;

        const buttonShow = document.createElement("button");
        buttonShow.textContent = "Show more";
        buttonShow.addEventListener("click", () => (togleVisibility(profile, hidden)));

        hidden.appendChild(hiddenHr);
        hidden.appendChild(emailLabel);
        hidden.appendChild(emailInput);
        hidden.appendChild(ageLabel);
        hidden.appendChild(ageInput);
        
        profile.appendChild(img);
        profile.appendChild(lockLabel)
        profile.appendChild(radioLock);
        profile.appendChild(unlockLabel)
        profile.appendChild(radioUnlock);
        profile.appendChild(hr);
        profile.appendChild(usernameLabel);
        profile.appendChild(usernameInput);
        profile.appendChild(hidden);
        profile.appendChild(buttonShow)
        main.appendChild(profile)
})
}
async function getUrl()
{
    const url=`http://localhost:3030/jsonstore/advanced/profiles`;
    const response=await fetch(url);
    const data=await response.json();
   
   return data;
}
