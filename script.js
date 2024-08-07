document.addEventListener('DOMContentLoaded', () => {
    const pdfSelector = document.getElementById('pdfSelector');
    const pdfEmbed = document.getElementById('pdfEmbed');
    const viewBtn = document.getElementById('viewBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // GitHub repository details
    const user = 'your-username';
    const repo = 'your-repository';
    const branch = 'main';  // or the branch you are using

    // Fetch the list of PDF files from the GitHub API
    fetch(`https://api.github.com/repos/${user}/${repo}/git/trees/${branch}?recursive=1`)
        .then(response => response.json())
        .then(data => {
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
