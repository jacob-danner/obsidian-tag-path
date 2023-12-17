import { App, FuzzySuggestModal } from 'obsidian'

import { AsyncModalCallback, TagPath } from './main'

export class MoveFileViaTagPathModal extends FuzzySuggestModal<TagPath> {
    tagPaths: TagPath[]

    onSubmitMoveFileViaTagPathCallback: AsyncModalCallback

    constructor(
        app: App,
        tagPaths: TagPath[],
        onSubmitMoveFileViaTagPathCallback: AsyncModalCallback
    ) {
        super(app)
        this.tagPaths = tagPaths
        this.onSubmitMoveFileViaTagPathCallback =
            onSubmitMoveFileViaTagPathCallback
    }

    getItems(): TagPath[] {
        return this.tagPaths
    }

    getItemText(tagPath: TagPath): string {
        return tagPath.tagName
    }

    async onChooseItem(tagPath: TagPath, evt: MouseEvent | KeyboardEvent) {
        await this.onSubmitMoveFileViaTagPathCallback(tagPath.correspondingPath)
    }
}
