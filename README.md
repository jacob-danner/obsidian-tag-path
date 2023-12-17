# Obsidian Plugin Template

## Summary

This plugin exists to enable me to test out a new Obsidian vault organization strategy.

This plugin centers around the idea of a `Tag Path`, which is a linking relationship between an obsidian tag, and a file structure path. This provides a way to reflect obsidian tags in the file structure of a vault.

By giving a tag a corresponding folder path, it makes it easy to reason about where a note should live, and super simple to relocate the note to its destination. This plugin implements such functionality.

---

## Usage Notes

### Plugin Commands

-   `Register Tag Path`
-   `Unregister Tag Path`
-   `Move File via Tag Path`

### Installation Instructions
-   `cd <my_vault>/.obsidian/plugins` 
-   `git clone https://github.com/jacob-danner/obsidian-tag-path.git`
-   `cd obsidian-tag-path`
-   `npm i`
-   `npm run build`

### Be Aware Of

-   Paths _do not get validated for existence_. Creating a valid path is the responsibility of the user.
-   Corresponding paths should be registered in terms of the root of the vault.
-   When registering a tag path, don't manually escape the spaces. In the register tag path modal, type out the path exactly as it looks. Paths with spaces in them are automatically character escaped.

---

## Useful Development Links

-   FileManager.renameFile: https://docs.obsidian.md/Reference/TypeScript+API/FileManager/renameFile
-   FuzzySugestModal guide: https://docs.obsidian.md/Plugins/User+interface/Modals#Select+from+list+of+suggestions
-   Plugin.saveData : https://docs.obsidian.md/Reference/TypeScript+API/Plugin/saveData
