let login = "";
let domain = "";

function generateEmail() {
    fetch("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1")
        .then(res => res.json())
        .then(data => {
            const email = data[0];
            document.getElementById("email").value = email;

            const parts = email.split("@");
            login = parts[0];
            domain = parts[1];

            loadInbox();
        });
}

function loadInbox() {
    if (!login || !domain) return;

    fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`)
        .then(res => res.json())
        .then(data => {
            const inbox = document.getElementById("inbox");
            inbox.innerHTML = "";

            if (data.length === 0) {
                inbox.innerHTML = "<p>No messages</p>";
                return;
            }

            data.forEach(mail => {
                const div = document.createElement("div");
                div.className = "mail";
                div.innerHTML = `<b>${mail.from}</b><br>${mail.subject}`;
                div.onclick = () => readMail(mail.id);
                inbox.appendChild(div);
            });
        });
}

function readMail(id) {
    fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${id}`)
        .then(res => res.json())
        .then(data => {
            alert(`FROM: ${data.from}\nSUBJECT: ${data.subject}\n\n${data.textBody}`);
        });
}

// Auto generate first email
generateEmail();
