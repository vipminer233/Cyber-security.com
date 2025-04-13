document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show'); // Toggle the 'show' class for visibility
            const expanded = navLinks.classList.contains('show');
            menuToggle.setAttribute('aria-expanded', expanded);
        });

        document.addEventListener('click', (event) => {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            if (navLinks.classList.contains('show') && !isClickInsideNav && !isClickOnToggle) {
                navLinks.classList.remove('show');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- ADVANCED Chatbot Functionality ---
    const chatDisplay = document.getElementById('chat-display');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');

    // Check if chatbot elements exist on the current page before proceeding
    if (chatDisplay && userInput && sendButton && typingIndicator) {

        // --- Enhanced Q&A Data Structure ---
        const knowledgeBase = [
             {
                id: 'greeting',
                keywords: ['hello', 'hi', 'hey', 'greetings', 'hola', 'howdy'],
                answer: `<p>Hi there! I'm the Cyber Safety Hub bot. How can I help you with cybersecurity today? Ask about topics like phishing, passwords, malware, etc.</p>`,
            },
            {
                id: 'farewell',
                keywords: ['bye', 'goodbye', 'see ya', 'later', 'cya', 'quit'],
                answer: `<p>Goodbye! Stay secure and vigilant!</p>`,
            },
            {
                id: 'thanks',
                keywords: ['thanks', 'thank you', 'appreciate it', 'thx', 'ty'],
                answer: `<p>You're welcome! Glad I could help. Stay safe online!</p>`,
            },
             {
                id: 'about_bot',
                keywords: ['who are you', 'what are you', 'about you', 'your purpose'],
                answer: `<p>I'm a simple Q&A bot designed to provide basic information about common cybersecurity topics based on the content of this website. I have predefined answers and don't learn or browse the internet.</p>`,
            },
            {
                id: 'phishing',
                keywords: ['phishing', 'phish', 'scam email', 'fake email', 'suspicious message', 'spear phishing'],
                questionPatterns: [/what is phishing/i, /define phishing/i, /how does phishing work/i, /about phishing/i],
                answer: `<p><strong>Phishing</strong> is a cyberattack where scammers try to trick you into revealing sensitive information (like passwords or credit cards).</p>
                         <p>They often do this by:</p>
                         <ul>
                            <li>Sending emails, texts, or messages pretending to be from legitimate companies or people you know.</li>
                            <li>Creating fake websites that look like real login pages.</li>
                            <li>Using urgent language or threats to pressure you into acting quickly.</li>
                         </ul>
                         <p><strong>Spear phishing</strong> is a more targeted version where the attacker researches the victim to make the message more personal and convincing.</p>`,
                followUpSuggestion: "how to spot a scam email?"
            },
            {
                id: 'spot_scam_email',
                keywords: ['spot scam', 'recognize phishing', 'identify fake email', 'scam signs', 'red flags', 'detect phishing'],
                questionPatterns: [/spot a scam/i, /how to identify phishing/i, /recognize phishing attempt/i],
                answer: `<p>To spot scam emails (phishing), look for these red flags:</p>
                        <ul>
                            <li><strong>Generic Greetings:</strong> Like "Dear Valued Customer" instead of your name.</li>
                            <li><strong>Urgency/Threats:</strong> Pressure to act immediately ("Your account will be closed!", "Suspicious activity detected!").</li>
                            <li><strong>Poor Grammar/Spelling:</strong> Professional companies usually proofread carefully.</li>
                            <li><strong>Suspicious Sender Address:</strong> Hover over the sender's name to see the actual email address. It might be slightly misspelled (e.g., paypaI instead of paypal) or use a public domain (@gmail.com instead of @company.com).</li>
                            <li><strong>Suspicious Links:</strong> Hover over links (don't click!) to see the real URL destination in the bottom corner of your browser. Does it look legitimate? Be wary of link shorteners in unexpected contexts.</li>
                            <li><strong>Unexpected Attachments:</strong> Especially .zip, .exe, .scr, or documents asking you to enable macros.</li>
                            <li><strong>Requests for Sensitive Info:</strong> Legitimate companies rarely ask for passwords, full credit card numbers, or social security numbers via email.</li>
                            <li><strong>Mismatched Tone/Style:</strong> If the email supposedly comes from someone you know, does it sound like them?</li>
                        </ul>`
            },
            {
                id: 'strong_password',
                keywords: ['password', 'passwords', 'passcode', 'pass phrase', 'credential', 'login secret'],
                questionPatterns: [/strong password/i, /create password/i, /password tips/i, /secure password/i, /password requirements/i],
                answer: `<p>Here's how to create <strong>strong passwords</strong>:</p>
                         <ul>
                            <li><strong>Length is Key:</strong> Aim for at least 12-15 characters, longer is significantly better (e.g., 16+).</li>
                            <li><strong>Mix It Up:</strong> Use a combination of uppercase letters (A-Z), lowercase letters (a-z), numbers (0-9), and symbols (like !@#$%^&*).</li>
                            <li><strong>Avoid the Obvious:</strong> Don't use personal info (birthdays, names, addresses), common words ("password", "123456"), dictionary words, or keyboard patterns (qwerty).</li>
                            <li><strong>Unique Per Account:</strong> Never reuse passwords across different websites or services! A breach on one site could compromise others if you reuse passwords.</li>
                            <li><strong>Consider Passphrases:</strong> A longer phrase made of several random words (e.g., "Correct-Horse-Battery-Staple") can be strong and easier to remember than complex strings for some people.</li>
                            <li><strong>Use a Password Manager:</strong> They generate and store strong, unique passwords for you. Highly recommended!</li>
                         </ul>`,
                 followUpSuggestion: "about password managers?"
            },
             {
                id: 'password_manager',
                keywords: ['password manager', 'password vault', 'password keeper', 'credential manager'],
                questionPatterns: [/password manager/i, /use a password manager/i, /recommend password manager/i],
                answer: `<p>A <strong>Password Manager</strong> is a secure application that helps you create, store, and manage your passwords.</p>
                         <p>Benefits include:</p>
                         <ul>
                           <li>Generating very strong, random passwords that are hard to crack.</li>
                           <li>Storing them securely in an encrypted database (vault).</li>
                           <li>Auto-filling login forms on websites and apps, reducing phishing risk.</li>
                           <li>Needing to remember only one strong master password (or use biometrics) to access the vault.</li>
                           <li>Often syncing securely across multiple devices (computer, phone, tablet).</li>
                           <li>Some can also store secure notes, credit card info, or identity documents.</li>
                         </ul>
                         <p>Using a reputable password manager (like Bitwarden, 1Password, Dashlane, KeePassXC, etc.) significantly improves your online security and convenience.</p>`
            },
            {
                id: 'malware',
                keywords: ['malware', 'virus', 'worm', 'trojan', 'spyware', 'adware', 'rootkit', 'keylogger', 'malicious software'],
                questionPatterns: [/what is malware/i, /define malware/i, /types of malware/i, /malware examples/i],
                answer: `<p><strong>Malware</strong> (short for malicious software) is any software intentionally designed to cause damage to a computer, server, client, or network, or to steal information.</p>
                         <p>Common types include:</p>
                         <ul>
                            <li><strong>Viruses:</strong> Attach to clean files and spread when the file is opened or executed.</li>
                            <li><strong>Worms:</strong> Self-replicating programs that spread across networks, often exploiting vulnerabilities, without needing user interaction.</li>
                            <li><strong>Trojans (Trojan Horses):</strong> Disguise themselves as legitimate software to trick users into installing them, then perform malicious actions.</li>
                            <li><strong>Ransomware:</strong> Encrypts files and demands payment for decryption.</li>
                            <li><strong>Spyware:</strong> Secretly monitors user activity (keystrokes via keyloggers, Browse habits) and steals information.</li>
                            <li><strong>Adware:</strong> Displays unwanted advertisements, sometimes bundled with spyware.</li>
                            <li><strong>Rootkits:</strong> Designed to gain administrative-level control over a system while hiding their presence.</li>
                         </ul>
                         <p>Protect yourself with security software, regular updates, safe Browse habits, and caution with downloads/attachments.</p>`,
                followUpSuggestion: "about ransomware?"
            },
            {
                id: 'ransomware',
                keywords: ['ransomware', 'encrypt', 'ransom', 'decrypt', 'file locker'],
                questionPatterns: [/what is ransomware/i, /define ransomware/i, /how ransomware works/i],
                answer: `<p><strong>Ransomware</strong> is a type of malware that encrypts (locks) your important files or your entire computer system, making them inaccessible.</p><p>Attackers then display a message demanding a ransom payment (usually in untraceable cryptocurrency like Bitcoin) in exchange for the decryption key needed to unlock your data. </p><p>Paying the ransom is risky: there's no guarantee attackers will provide the key, and it encourages further attacks. </p><p><strong>Prevention is crucial:</strong> Keep robust, offline backups of your data; keep software updated; use strong security software; be extremely vigilant about phishing emails and suspicious links/attachments.</p>`,
                followUpSuggestion: "about data backups?"
             },
              {
                id: 'data_backup',
                keywords: ['backup', 'backups', 'backing up', 'data recovery', 'restore files'],
                questionPatterns: [/data backup/i, /how to backup/i, /backup strategy/i],
                answer: `<p><strong>Data backups</strong> are copies of your important files stored separately from the originals. They are essential for recovering data lost due to hardware failure, software issues, ransomware, theft, or accidental deletion.</p>
                        <p>A good strategy is the <strong>3-2-1 Rule</strong>:</p>
                        <ul>
                            <li>Keep at least <strong>3</strong> total copies of your data.</li>
                            <li>Store the copies on <strong>2</strong> different types of media (e.g., computer hard drive + external hard drive).</li>
                            <li>Keep <strong>1</strong> copy off-site (e.g., external drive stored at a different location, secure cloud backup service).</li>
                        </ul>
                        <p>Regularly schedule backups and test them periodically to ensure they work!</p>`
            },
            {
                id: 'mfa',
                keywords: ['mfa', '2fa', 'multi factor', 'two factor', 'authentication', 'verification code', 'authenticator app'],
                questionPatterns: [/what is mfa/i, /what is 2fa/i, /multi factor/i, /two factor/i, /enable mfa/i, /use mfa/i],
                answer: `<p><strong>MFA (Multi-Factor Authentication)</strong>, often called <strong>2FA (Two-Factor Authentication)</strong>, adds a critical extra layer of security to your online accounts.</p>
                         <p>Instead of just using a password (something you know), MFA requires you to provide <strong>two or more</strong> different verification factors. Common factors include:</p>
                         <ul>
                            <li><strong>Something you know:</strong> Your password or PIN.</li>
                            <li><strong>Something you have:</strong> A code from an authenticator app (like Google Authenticator, Authy), an SMS code sent to your phone, or a physical security key (like a YubiKey).</li>
                            <li><strong>Something you are:</strong> Biometrics like your fingerprint or face scan.</li>
                         </ul>
                         <p>It significantly increases account security because even if someone steals your password, they likely won't have access to your second factor.</p><p><strong>You should enable MFA/2FA on all important accounts that offer it (email, banking, social media)!</strong></p>`
            },
            {
                id: 'vpn',
                keywords: ['vpn', 'virtual private network', 'proxy', 'encryption tunnel'],
                questionPatterns: [/what is a vpn/i, /define vpn/i, /use a vpn/i, /why use vpn/i, /how vpn works/i],
                answer: `<p>A <strong>VPN (Virtual Private Network)</strong> creates a secure, encrypted connection (often called a "tunnel") between your device and the internet, usually routed through a server run by the VPN provider.</p>
                         <p>Key benefits include:</p>
                         <ul>
                            <li><strong>Encryption:</strong> Scrambles your internet traffic, making it unreadable to eavesdroppers on the network (especially important on public Wi-Fi).</li>
                            <li><strong>IP Address Masking:</strong> Hides your real IP address and shows the IP address of the VPN server instead, enhancing your privacy and masking your location.</li>
                            <li><strong>Bypassing Geo-restrictions:</strong> Can allow access to websites or streaming content that might be blocked in your geographic region (ensure you comply with terms of service).</li>
                         </ul>
                         <p>Using a reputable, trustworthy VPN service (avoid free ones with questionable logging policies) enhances your privacy and security, particularly when using untrusted networks.</p>`,
                 followUpSuggestion: "about public Wi-Fi safety?"
            },
             {
                id: 'public_wifi',
                keywords: ['public wifi', 'free wifi', 'cafe wifi', 'airport wifi', 'hotel wifi', 'unsecured network'],
                questionPatterns: [/public wifi safe/i, /using public wifi/i, /risks of public wifi/i],
                answer: `<p>Public Wi-Fi networks (like those in cafes, airports, hotels) are generally <strong>less secure</strong> than your home network and should be used with caution.</p>
                         <p>Potential risks include:</p>
                         <ul>
                            <li><strong>Eavesdropping (Packet Sniffing):</strong> Hackers on the same network might capture unencrypted data you send or receive.</li>
                            <li><strong>Man-in-the-Middle (MitM) Attacks:</strong> Attackers can position themselves between your device and the legitimate Wi-Fi hotspot to intercept or alter communication.</li>
                            <li><strong>Fake Hotspots (Evil Twins):</strong> Malicious hotspots set up with names similar to legitimate ones to trick users into connecting.</li>
                            <li><strong>Malware Distribution:</strong> Some compromised or fake hotspots might attempt to infect connecting devices.</li>
                         </ul>
                         <p><strong>Best practices on public Wi-Fi:</strong></p>
                         <ul>
                            <li>Avoid logging into sensitive accounts (banking, email) if possible.</li>
                            <li>Ensure websites use HTTPS (look for the padlock).</li>
                            <li>Use a reputable VPN to encrypt all your traffic.</li>
                            <li>Keep your device's firewall enabled and software updated.</li>
                            <li>Disable automatic Wi-Fi connection and file sharing.</li>
                            <li>"Forget" the network after use.</li>
                         </ul>`
            },
             {
                id: 'social_engineering',
                keywords: ['social engineering', 'human hacking', 'pretexting', 'baiting', 'tailgating'],
                questionPatterns: [/what is social engineering/i, /define social engineering/i, /social engineering examples/i],
                answer: `<p><strong>Social Engineering</strong> is the psychological manipulation of people into performing actions or divulging confidential information. It relies on exploiting human trust, curiosity, fear, or helpfulness, rather than technical hacking.</p>
                         <p>Common techniques include:</p>
                         <ul>
                            <li><strong>Phishing/Spear Phishing:</strong> As discussed before, using deceptive emails/messages.</li>
                            <li><strong>Pretexting:</strong> Creating a fabricated scenario (pretext) to gain trust and information (e.g., pretending to be IT support).</li>
                            <li><strong>Baiting:</strong> Luring victims with something enticing (e.g., leaving a malware-infected USB drive labeled "Salaries").</li>
                            <li><strong>Quid Pro Quo:</strong> Offering a small service or gift in exchange for information or access.</li>
                            <li><strong>Tailgating/Piggybacking:</strong> Following an authorized person into a secure area without proper credentials.</li>
                         </ul>
                         <p>Defenses involve skepticism, verifying identities independently, security awareness training, and strong security policies.</p>`
            },
             {
                id: 'deepfake',
                keywords: ['deepfake', 'fake video', 'fake audio', 'ai generated media'],
                questionPatterns: [/what is a deepfake/i, /define deepfake/i, /how deepfakes work/i],
                answer: `<p>A <strong>Deepfake</strong> refers to synthetic media (video or audio) generated using artificial intelligence (specifically deep learning techniques) where a person's likeness or voice is replaced with someone else's.</p>
                         <p>They are created by training AI models on large amounts of real video/audio data of the target individuals.</p>
                         <p>Risks include:</p>
                         <ul>
                            <li>Spreading misinformation and propaganda.</li>
                            <li>Creating non-consensual fake pornography.</li>
                            <li>Impersonation for scams (e.g., faking a CEO's voice).</li>
                            <li>Political manipulation or discrediting individuals.</li>
                         </ul>
                         <p>Detecting deepfakes can be difficult, but look for unnatural movements, lighting inconsistencies, odd blinking, or artifacts around the face. Critical thinking and source verification are key.</p>`
            },
             {
                id: 'firewall',
                keywords: ['firewall', 'network security', 'packet filtering'],
                questionPatterns: [/what is a firewall/i, /define firewall/i, /how firewall works/i],
                answer: `<p>A <strong>Firewall</strong> acts as a security barrier between a trusted internal network (like your home network or computer) and untrusted external networks (like the internet).</p>
                        <p>It monitors incoming and outgoing network traffic and decides whether to allow or block specific traffic based on a defined set of security rules.</p>
                        <p>Think of it like a digital gatekeeper or security guard for your network connection. Most operating systems (Windows, macOS) have a built-in software firewall, and home routers also act as hardware firewalls.</p>`
            },
            // Add more knowledge base entries here...
        ];

        // --- Helper Functions ---

        // Basic tokenizer (splits input and cleans it)
        function tokenize(text) {
            if (!text) return [];
            // Convert to lowercase, remove basic punctuation, split by spaces, filter empty/short tokens
            return text.toLowerCase()
                       .replace(/[?.,!]/g, '')
                       .split(/\s+/)
                       .filter(token => token && token.length > 1);
        }

        // Function to add a message to the chat display (Handles HTML)
        function addChatMessage(message, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('chat-message', sender); // 'user' or 'bot'

            if (sender === 'user') {
                // ALWAYS use textContent for user input to prevent XSS
                messageDiv.textContent = message;
            } else {
                // Allow basic HTML for bot responses (ensure knowledgeBase answers are safe!)
                // In a real-world app, you'd use a sanitization library here!
                messageDiv.innerHTML = message;
            }

            // Insert message *before* the typing indicator
            chatDisplay.insertBefore(messageDiv, typingIndicator);
            // Scroll to the bottom
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
        }

        // Function to show/hide typing indicator
        function showTypingIndicator(show) {
            typingIndicator.style.display = show ? 'flex' : 'none'; // Use flex to align with messages
            if (show) {
                 chatDisplay.scrollTop = chatDisplay.scrollHeight; // Scroll down when indicator appears
            }
        }

        // --- Core Bot Logic ---
        function getBotResponse(userMessage) {
            const userTokens = tokenize(userMessage);
            if (userTokens.length === 0) {
                return `<p>Please type a question related to cybersecurity.</p>`; // Handle empty input
            }

            let bestMatch = null;
            let highestScore = 0;
            let potentialSuggestions = []; // Store {id, suggestion} pairs

            // Iterate through the knowledge base to find the best match
            knowledgeBase.forEach(entry => {
                let currentScore = 0;
                let matchedKeywordsCount = 0;

                // Check keywords
                entry.keywords.forEach((keyword, index) => {
                    if (userTokens.includes(keyword)) {
                        // Score based on keyword match (higher weight for earlier keywords)
                        currentScore += (entry.keywords.length - index) * 2;
                        matchedKeywordsCount++;
                    }
                });

                // Boost score slightly if multiple keywords match
                if (matchedKeywordsCount > 1) {
                    currentScore += matchedKeywordsCount * 2;
                }

                // Optional: Check regex patterns for higher confidence matches
                if (entry.questionPatterns) {
                    entry.questionPatterns.forEach(pattern => {
                        if (pattern.test(userMessage)) {
                            currentScore += 25; // Big boost for specific pattern match
                        }
                    });
                }

                // Simple scoring logic (adjust thresholds as needed)
                if (currentScore > 0) {
                     // Track potential suggestions even for partial matches
                     if (entry.followUpSuggestion && currentScore > 3) { // Threshold for suggesting
                        // Avoid adding suggestion if it's the same topic ID
                         if (!bestMatch || entry.id !== bestMatch.id) {
                           potentialSuggestions.push({ id: entry.id, suggestion: entry.followUpSuggestion });
                         }
                     }
                     // Update best match if score is higher
                     if (currentScore > highestScore) {
                        highestScore = currentScore;
                        bestMatch = entry;
                    }
                }
            });

            // Determine the response based on the score
            const MIN_CONFIDENCE_SCORE = 8; // Adjust this threshold for better accuracy
            if (bestMatch && highestScore >= MIN_CONFIDENCE_SCORE) {
                let response = bestMatch.answer;
                // Suggest a related topic if available and not directly implied by the answer
                if (bestMatch.followUpSuggestion) {
                    response += ` <p><small><em>Related topic you might ask about: ${bestMatch.followUpSuggestion}</em></small></p>`;
                }
                return response;

            } else if (potentialSuggestions.length > 0) {
                // Offer suggestions if only low-confidence matches were found
                // Remove duplicates based on the suggestion text
                const uniqueSuggestions = potentialSuggestions.filter((v,i,a)=>a.findIndex(t=>(t.suggestion === v.suggestion))===i);
                const suggestion = uniqueSuggestions[Math.floor(Math.random() * uniqueSuggestions.length)].suggestion;
                 return `<p>I'm not sure I have an exact answer for that. Were you perhaps asking about: <strong>${suggestion}</strong>?</p>`;
            }
             else {
                // Default response if no meaningful match or keywords found
                return `<p>Sorry, I don't have specific information on that exact topic. My knowledge is limited to common cybersecurity concepts like phishing, malware, strong passwords, MFA, VPNs, etc. Please try rephrasing your question.</p>`;
            }
        }

        // --- Handle Sending Messages ---
        function sendMessage() {
            const userMessage = userInput.value.trim();
            if (userMessage === "") return; // Don't send empty messages

            addChatMessage(userMessage, 'user'); // Display user's message
            userInput.value = ""; // Clear input field
            userInput.focus(); // Keep focus on input
            showTypingIndicator(true); // Show typing indicator

            // Simulate bot thinking delay
            setTimeout(() => {
                const botMessage = getBotResponse(userMessage);
                showTypingIndicator(false); // Hide typing indicator
                addChatMessage(botMessage, 'bot'); // Display bot's response
            }, 800 + Math.random() * 600); // Simulate 0.8-1.4 seconds delay
        }

        // --- Event Listeners for Chatbot ---
        sendButton.addEventListener('click', sendMessage);

        userInput.addEventListener('keypress', (event) => {
            // Send message with Enter key, unless Shift+Enter is pressed (for potential multi-line input)
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        });

         // Remove the initial default HTML message if JS is running
          const defaultMsg = chatDisplay.querySelector('.chat-message.bot');
          if (defaultMsg && defaultMsg.textContent.includes("Hello! Ask me")) {
               defaultMsg.remove();
          }
         // Add initial greeting from bot via JS
         setTimeout(() => {
             const greetingEntry = knowledgeBase.find(entry => entry.id === 'greeting');
             if (greetingEntry && chatDisplay.children.length <= 1) { // Only add if chat is empty (only indicator might be there)
                 addChatMessage(greetingEntry.answer, 'bot');
             }
         }, 300);


    } // End check for chatbot elements existence

}); // End DOMContentLoaded