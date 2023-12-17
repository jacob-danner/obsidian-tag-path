import { MoveFileViaTagPathModal } from 'MoveFileViaTagPathModal'
import { RegisterTagPathModal } from 'RegisterTagPathModal'
import { UnregisterTagPathModal } from 'UnregisterTagPathModal'
import { Notice, Plugin } from 'obsidian'

export interface DataJson {
    tagPaths: TagPath[]
}

export interface TagPath {
    tagName: string
    correspondingPath: string
}

export type AsyncModalCallback = (...args: string[]) => Promise<void>

export default class MyPlugin extends Plugin {
    dataJson: DataJson

    async onload() {
        this.dataJson = await this.loadData()

        // Register Tag Path
        this.addCommand({
            id: 'register-tag-path',
            name: 'Register Tag Path',
            callback: () => {
                const onSubmitSaveTagPathCallback: AsyncModalCallback = async (
                    tagName,
                    correspondingPath
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

                new RegisterTagPathModal(
                    this.app,
                    onSubmitSaveTagPathCallback
                ).open()
            },
        })

        // Unregister Tag Path
        this.addCommand({
            id: 'unregister-tag-path',
            name: 'Unregister Tag Path',
            callback: () => {
                const onSubmitDeleteTagPathCallback: AsyncModalCallback =
                    async (tagName, correspondingPath) => {
                        const oldDataJson = { ...this.dataJson }

                        const tagPathIndexToDelete =
                            oldDataJson.tagPaths.findIndex(
                                (el) => el.tagName === tagName
                            )
                        const updatedTagPaths = oldDataJson.tagPaths.filter(
                            (_, index) => {
                                return index !== tagPathIndexToDelete
                            }
                        )
                        const newDataJson: DataJson = {
                            tagPaths: updatedTagPaths,
                        }

                        await this.saveData(newDataJson)
                        this.dataJson = newDataJson

                        new Notice(
                            `Tag Path unregistered.\nTag Name: ${tagName}\nCorresponding Path: ${correspondingPath}`
                        )
                    }

                new UnregisterTagPathModal(
                    this.app,
                    this.dataJson.tagPaths,
                    onSubmitDeleteTagPathCallback
                ).open()
            },
        })

        // Move File via Tag Path
        this.addCommand({
            id: 'move-file-via-tag-path',
            name: 'Move File via Tag Path',
            callback: () => {
                const onSubmitMoveFileViaTagPathCallback: AsyncModalCallback =
                    async (correspondingPath) => {
                        const currentFile = this.app.workspace.getActiveFile()
                        if (!currentFile) {
                            new Notice(`Can't move when no file is selected.`)
                            throw new Error(
                                `Can't move when no file is selected.`
                            )
                        }

                        const newPath = `${correspondingPath}/${currentFile.name}`
                        console.log(newPath)
                        await this.app.fileManager.renameFile(
                            currentFile,
                            newPath
                        )

                        new Notice(
                            `Moved file: ${currentFile.basename} -> ${newPath}`
                        )
                    }

                new MoveFileViaTagPathModal(
                    this.app,
                    this.dataJson.tagPaths,
                    onSubmitMoveFileViaTagPathCallback
                ).open()
            },
        })
    }

    async onunload() {}
}
