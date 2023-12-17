import {
    App,
    Notice,
    Plugin,
    FuzzySuggestModal,
    Modal,
    Setting,
} from 'obsidian'

// FuzzySugestModal guide: https://docs.obsidian.md/Plugins/User+interface/Modals#Select+from+list+of+suggestions
// FileManager.renameFile: https://docs.obsidian.md/Reference/TypeScript+API/FileManager/renameFile
// Plugin.saveData       : https://docs.obsidian.md/Reference/TypeScript+API/Plugin/saveData

interface DataJson {
    tagPaths: TagPath[]
}

interface TagPath {
    tagName: string
    correspondingPath: string
}

type asyncModalCallback = (...args: string[]) => Promise<void>

export default class MyPlugin extends Plugin {
    dataJson: DataJson

    async onload() {
        this.dataJson = await this.loadData()

        this.addCommand({
            id: 'move-file-via-tag-path',
            name: 'Move File via TagPath',
            callback: () => {
                new MoveFileModal(this.app, this.dataJson.tagPaths).open()
            },
        })

        // add a command to experiment with the saveData functionality
        this.addCommand({
            id: 'register-tag-path',
            name: 'Register Tag Path',
            callback: () => {
                const onSubmitSaveTagPathCallback: asyncModalCallback = async (
                    tagName: string,
                    correspondingPath: string
                ) => {
                    const oldDataJson = { ...this.dataJson }

                    const newTagPath: TagPath = {
                        tagName,
                        correspondingPath,
                    }

                    const newDataJson: DataJson = {
                        tagPaths: [...oldDataJson.tagPaths, newTagPath],
                    }

                    await this.saveData(newDataJson)
                    this.dataJson = newDataJson

                    new Notice(
                        `Tag Path registered.\nTag Name: ${tagName}\nCorresponding Path: ${correspondingPath}`
                    )
                }

                new RegisterTagModal(
                    this.app,
                    onSubmitSaveTagPathCallback
                ).open()
            },
        })
    }

    async onunload() {}
}

export class MoveFileModal extends FuzzySuggestModal<TagPath> {
    tagPaths: TagPath[]

    constructor(app: App, tagPaths: TagPath[]) {
        super(app)
        this.tagPaths = tagPaths
        console.log(
            `ExampleModal: this.tagPaths = ${JSON.stringify(this.tagPaths)}`
        )
    }

    getItems(): TagPath[] {
        return this.tagPaths
    }

    getItemText(tagPath: TagPath): string {
        return tagPath.tagName
    }

    async onChooseItem(tagPath: TagPath, evt: MouseEvent | KeyboardEvent) {
        // move the current file to tagPath.correspondingPath

        const currentFile = this.app.workspace.getActiveFile()
        if (!currentFile) {
            throw new Error(`Can't move when no file is selected.`)
        }

        const newPath = `${tagPath.correspondingPath}/${currentFile.name}`
        console.log(`newPath: ${newPath}`)

        await this.app.fileManager.renameFile(currentFile, newPath)

        new Notice(`Moved file: ${currentFile.basename} -> ${newPath}`)
    }
}

export class RegisterTagModal extends Modal {
    tagPath: string
    correspondingPath: string

    onSubmit: asyncModalCallback

    constructor(app: App, onSubmit: asyncModalCallback) {
        super(app)
        this.onSubmit = onSubmit
    }

    onOpen() {
        const { contentEl } = this

        contentEl.createEl('h1', {
            text: 'Register a tag with a name and a path',
        })

        new Setting(contentEl).setName('Tag Name').addText((text) =>
            text.onChange((value) => {
                this.tagPath = value
            })
        )

        new Setting(contentEl).setName('Corresponding Path').addText((text) =>
            text.onChange((value) => {
                this.correspondingPath = value
            })
        )

        new Setting(contentEl).addButton((btn) =>
            btn
                .setButtonText('Submit')
                .setCta()
                .onClick(() => {
                    this.close()
                    this.onSubmit(this.tagPath, this.correspondingPath)
                })
        )
    }

    onClose() {
        let { contentEl } = this
        contentEl.empty()
    }
}
