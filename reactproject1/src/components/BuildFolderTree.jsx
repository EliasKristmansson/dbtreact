export default function BuildFolderTree(projects, folders) {
  const root = [];

  // Helper function to find or create a folder
  const findOrCreateFolder = (path, title, currentLevel) => {
    let existingFolder = currentLevel.find((f) => f.title === title && f.path === path);
    if (!existingFolder) {
      // Hitta folder ID från folders array
      const folderData = folders.find((f) => f.name === path);
      existingFolder = {
        id: folderData ? folderData.id : undefined, // Lägg till ID
        title: title,
        path: path,
        projects: [],
        subFolders: [],
      };
      currentLevel.push(existingFolder);
    }
    return existingFolder;
  };

  // Add folders from folders state
  folders.forEach((folder) => {
    const path = folder.name.split("/").filter((name) => name.trim());
    let currentLevel = root;
    let currentPath = "";

    path.forEach((folderName, index) => {
      currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;
      const folder = findOrCreateFolder(currentPath, folderName, currentLevel);
      currentLevel = folder.subFolders;
    });
  });

  // Add projects and their folder paths
  projects.forEach((project) => {
    const path = project.folder.split("/").filter((name) => name.trim());
    let currentLevel = root;
    let currentPath = "";

    path.forEach((folderName, index) => {
      currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;
      const folder = findOrCreateFolder(currentPath, folderName, currentLevel);
      if (index === path.length - 1) {
        folder.projects.push(project);
      }
      currentLevel = folder.subFolders;
    });
  });

  return root;
}