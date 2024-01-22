async function convertSky() {
    const inputFile = document.getElementById('archivoEntrada').files[0];
    const selectedVersion = document.getElementById('versionSelector');

    if (inputFile) {
        try {
            const zip = await JSZip.loadAsync(inputFile);

            // Find the "mcpatcher" folder and rename it to "optifine"
            const mcpatcherFolder = zip.folder("assets/minecraft/mcpatcher");
            if (mcpatcherFolder) {
                zip.folder("assets/minecraft/optifine").loadAsync(mcpatcherFolder);
            } else {
                alert('The "mcpatcher" folder was not found in the file.');
                return;
            }

            // Change the "pack_format" variable in "pack.mcmeta"
            const packMetaPath = 'pack.mcmeta';
            const packMetaContent = zip.file(packMetaPath);
            if (packMetaContent) {
                try {
                    // Get the content as text and remove the BOM if present
                    const packMetaText = await packMetaContent.async('text');
                    const packMetaTextWithoutBOM = packMetaText.replace(/^\uFEFF/, '');

                    const packMetaJSON = JSON.parse(packMetaTextWithoutBOM);
                    //console.log(selectedVersion.value)
                    packMetaJSON.pack.pack_format = parseInt(selectedVersion.value);
                    zip.remove(packMetaPath);
                    zip.file(packMetaPath, JSON.stringify(packMetaJSON, null, 4));
                } catch (jsonError) {
                    console.error('Error parsing JSON content:', jsonError);
                    console.log('JSON content:', await packMetaContent.async('string'));
                    alert('An error occurred while parsing JSON content. Check the browser console for more details.');
                    return;
                }
            } else {
                alert('The "pack.mcmeta" file was not found in the main folder.');
                return;
            }

            // Add "credits.txt" file to the zip in the main folder
            zip.file('credits.txt', "Thank you for using my sky converter, if you want to support me monetarily to continue making more useful content for you, support me with a donation at: https://ko-fi.com/misumeh ");
            zip.file('owo.txt', "owo whats this? notices your packy wacky :3 -XCRunnerS");

            // Create a new compressed file
            const newZip = await zip.generateAsync({ type: 'blob' });

            // Create a new name for the file
            const newName = `${inputFile.name.replace('.zip', '')} Converted ${selectedVersion.selectedOptions[0].text}.zip`;

            // Download the new file with the new name
            const url = URL.createObjectURL(newZip);
            const a = document.createElement('a');
            a.href = url;
            a.download = newName;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Check the browser console for more details.');
        }
    } else {
        alert('Please select a compressed file (.zip).');
    }
}
// Add smooth scroll behavior to links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

