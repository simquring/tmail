let login = "";
let domain = "";
let refreshInterval;

// Generate email
async function generateEmail() {
    try {
        const res = await fetch("https://api.1secmail.com/v1/?action=genRandomMailbox&count=1");
        const data = await res.json();

        const email = data[0];
        document.getElementById("email").value = email;

        [login, domain] = email.split("@");

        loadInbox();

        // Auto refresh tiap 5 detik
        clearInterval(refreshInterval);
        refreshInterval = setInterval(loadInbox, 5000);

    } catch (err) {
        alert("Gagal generate email (API error)");
        console.error(err);
    }
}

// Load inbox
async function loadInbox() {
    if (!login || !domain) return;

    try {
        const res = await fetch(`https://api.1secmail.com/v1/?action=getMessages&login=${login}&domain=${domain}`);
        const data = await res.json();

        const inbox = document.getElementById("inbox");
        inbox.innerHTML = "";

        if (!data.length) {
            inbox.innerHTML = "<p>No messages yet...</p>";
            return;
        }

        data.forEach(mail => {
            const div = document.createElement("div");
            div.className = "mail";
            div.innerHTML = `<b>${mail.from}</b><br>${mail.subject}`;
            div.onclick = () => readMail(mail.id);
            inbox.appendChild(div);
        });

    } catch (err) {
        console.error("Inbox error:", err);
    }
}

// Read email
async function readMail(id) {
    try {
        const res = await fetch(`https://api.1secmail.com/v1/?action=readMessage&login=${login}&domain=${domain}&id=${id}`);
        const data = await res.json();

        alert(
`FROM: ${data.from}
SUBJECT: ${data.subject}

${data.textBody || data.htmlBody}`
        );

    } catch (err) {
        alert("Gagal baca email");
    }
}

// Copy email
function copyEmail() {
    const email = document.getElementById("email").value;
    navigator.clipboard.writeText(email);
    alert("Email copied!");
}

// Auto start
generateEmail();
