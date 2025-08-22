export function saveBuildToLocal(buildData) {
    try {
        const existing = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
        existing.push(buildData);
        localStorage.setItem('savedBuilds', JSON.stringify(existing));
    } catch (e) {
        // Optionally handle error
        console.error('Failed to save build to localStorage', e);
    }
}

export function editBuildInLocal(index, updatedBuild) {
    try {
        const builds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
        if (index >= 0 && index < builds.length) {
            builds[index] = updatedBuild;
            localStorage.setItem('savedBuilds', JSON.stringify(builds));
        }
    } catch (e) {
        console.error('Failed to edit build in localStorage', e);
    }
}

export function removeBuildFromLocal(index) {
    try {
        const builds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
        if (index >= 0 && index < builds.length) {
            builds.splice(index, 1);
            localStorage.setItem('savedBuilds', JSON.stringify(builds));
        }
    } catch (e) {
        console.error('Failed to remove build from localStorage', e);
    }
}
