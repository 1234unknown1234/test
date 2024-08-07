document.addEventListener('DOMContentLoaded', () => {
    const pdfSelector = document.getElementById('pdfSelector');
    const pdfEmbed = document.getElementById('pdfEmbed');
    const viewBtn = document.getElementById('viewBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // GitHub repository details
    const user = '1234unknown1234';
    const repo = 'test';
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

            // Populate the dropdown with PDF files
            pdfFiles.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.textContent = file.split('/').pop(); // Display only the file name
                pdfSelector.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching PDF files:', error);
        });

    // Handle the view button click
    viewBtn.addEventListener('click', () => {
        const selectedPDF = pdfSelector.value;
        if (selectedPDF) {
            pdfEmbed.src = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${selectedPDF}`;
            pdfEmbed.style.display = 'block';
        } else {
            pdfEmbed.style.display = 'none';
        }
    });

    // Handle the download button click
    downloadBtn.addEventListener('click', () => {
        const selectedPDF = pdfSelector.value;
        if (selectedPDF) {
            const link = document.createElement('a');
            link.href = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${selectedPDF}`;
            link.download = selectedPDF.split('/').pop(); // Download only the file name
            link.click();
        }
    });
});
