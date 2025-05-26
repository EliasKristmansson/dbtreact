export default function buildFolderTree(projects) {
  const root = [];

  projects.forEach((project) => {
    const path = project.folder.split("/").filter((name) => name.trim()); // Remove empty segments
    let currentLevel = root;
    let currentPath = "";

    path.forEach((folderName, index) => {
      // Update the current path
      currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;

      // Look for an existing folder at the current level
      let existingFolder = currentLevel.find((f) => f.title === folderName && f.path === currentPath);

      if (!existingFolder) {
        // Create a new folder if it doesn't exist
        existingFolder = {
          title: folderName,
          path: currentPath,
          projects: [],
          subFolders: [],
        };
        currentLevel.push(existingFolder);
      }

      if (index === path.length - 1) {
        // If this is the last segment, add the project to the folder
        existingFolder.projects.push(project);
      } else {
        // Move to the next level (subfolder)
        currentLevel = existingFolder.subFolders;
      }
    });
  });

  return root;
}