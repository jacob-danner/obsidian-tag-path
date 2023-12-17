import { App, FuzzySuggestModal } from 'obsidian'

import { TagPath, AsyncModalCallback } from './main'

export class UnregisterTagPathModal extends FuzzySuggestModal<TagPath> {
    tagPaths: TagPath[]

    onSubmitDeleteTagPathCallback: AsyncModalCallback

    constructor(
        app: App,
        tagPaths: TagPath[],
        onSubmitDeleteTagPathCallback: AsyncModalCallback
    ) {
        super(app)
        this.tagPaths = tagPaths
        this.onSubmitDeleteTagPathCallback = onSubmitDeleteTagPathCallback
    }

    getItems(): TagPath[] {
        return this.tagPaths
    }

    getItemText(tagPath: TagPath): string {
        return tagPath.tagName
    }

    async onChooseItem(tagPath: TagPath, evt: MouseEvent | KeyboardEvent) {
        await this.onSubmitDeleteTagPathCallback(
            tagPath.tagName,
            tagPath.correspondingPath
        )
    }
}
