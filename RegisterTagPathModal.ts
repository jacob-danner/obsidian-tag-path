import { App, Modal, Setting } from 'obsidian'

import { AsyncModalCallback } from './main'

export class RegisterTagPathModal extends Modal {
    tagPath: string
    correspondingPath: string

    onSubmitSaveTagPathCallback: AsyncModalCallback

    constructor(app: App, onSubmitSaveTagPathCallback: AsyncModalCallback) {
        super(app)
        this.onSubmitSaveTagPathCallback = onSubmitSaveTagPathCallback
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
                    this.onSubmitSaveTagPathCallback(
                        this.tagPath,
                        this.correspondingPath
                    )
                })
        )
    }

    onClose() {
        let { contentEl } = this
        contentEl.empty()
    }
}
