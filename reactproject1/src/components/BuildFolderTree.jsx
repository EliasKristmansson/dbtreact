
export default function buildFolderTree(projects){
	const root = []

	projects.forEach((project) => {
		const path = project.folder.split("/");
		let currentLevel = root;

		path.forEach((folderName, index) => {
			let existingFolder = currentLevel.find((f) => f.title === folderName);
			if(!existingFolder){
				existingFolder = {
					title: folderName,
					path: project.folder,
					projects: [],
					subFolders: [],
				};
				currentLevel.push(existingFolder);
			}
			if (index === path.length - 1){
				existingFolder.projects.push(project);
			} else {
				currentLevel = existingFolder.subFolders;
			}
		});
	});
	return root;
	
}
