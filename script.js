document.addEventListener('DOMContentLoaded', () => {
    const pdfList = document.getElementById('pdfList');
    const pdfEmbed = document.getElementById('pdfEmbed');

    // GitHub repository details
    const user = 'your-username';
    const repo = 'your-repository';
    const branch = 'main';  // or the branch you are using

    // Fetch the list of PDF files from the GitHub API
    fetch(`https://api.github.com/repos/${user}/${repo}/branches/${branch}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);  // Debugging log
            const treeUrl = data.commit.commit.tree.url;
            return fetch(treeUrl + '?recursive=1');
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);  // Debugging log
            if (!data.tree) {
                throw new Error('No tree data found');
            }
            const pdfFiles = data.tree
                .filter(file => file.path.endsWith('.pdf'))
                .map(file => file.path);

            // Create buttons for each PDF file
            pdfFiles.forEach(file => {
                const button = document.createElement('button');
                button.classList.add('pdf-button');
                button.textContent = file.split('/').pop(); // Display only the file name
                button.onclick = () => {
                    pdfEmbed.src = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${file}`;
                    pdfEmbed.style.display = 'block';
                };

                const downloadBtn = document.createElement('button');
                downloadBtn.classList.add('pdf-button');
                downloadBtn.textContent = `Download ${file.split('/').pop()}`;
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.href = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${file}`;
                    link.download = file.split('/').pop(); // Download only the file name
                    link.click();
                };

                const container = document.createElement('div');
                container.appendChild(button);
                container.appendChild(downloadBtn);
                pdfList.appendChild(container);
            });
        })
        .catch(error => {
            console.error('Error fetching PDF files:', error);
        });
});
