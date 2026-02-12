const supabase = window.supabase.createClient(
  "https://ojtchlhxfxppfhtxiltn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qdGNobGh4ZnhwcGZodHhpbHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MDU2MjAsImV4cCI6MjA4NjM4MTYyMH0.BEtEVRsfiagJtT-Eti9ucwm7Av0jTC--MHkPWzdafv0"
);

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");

async function checkCode() {
  if (!code) return;

  const { data } = await supabase
    .from("qrcodes")
    .select("*")
    .eq("id", code)
    .single();

  if (!data) {
    document.getElementById("message").innerText = "QR topilmadi";
    return;
  }

  if (window.location.pathname.includes("register")) {

    if (data.claimed) {
      window.location.href = "profile.html?code=" + code;
    } else {
      document.getElementById("formBox").style.display = "block";
    }

  }

  if (window.location.pathname.includes("profile")) {

    if (!data.claimed) {
      window.location.href = "register.html?code=" + code;
    } else {
      document.getElementById("profileBox").innerHTML = `
        <h2>${data.name}</h2>
        <img src="${data.image}" width="200"><br><br>
        <a href="tel:${data.phone}">Qo'ng'iroq</a><br><br>
        <a href="https://t.me/${data.telegram}">Telegram</a>
      `;
    }

  }
}

async function register() {

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const telegram = document.getElementById("telegram").value;
  const image = document.getElementById("image").value;

  await supabase
    .from("qrcodes")
    .update({
      name,
      phone,
      telegram,
      image,
      claimed: true
    })
    .eq("id", code);

  window.location.href = "profile.html?code=" + code;
}

checkCode();
